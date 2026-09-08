const { GoogleGenAI } = require('@google/genai');

const MODEL = 'gemini-3.6-flash';

let ai = null;

function getClient() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY is not configured in .env');
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { timeout: 110000 } });
  }
  return ai;
}

/**
 * Extract text from a Gemini response — works with SDK v1.x across versions.
 */
function extractText(response) {
  // SDK >= 1.x: response.text is a getter in some versions, direct string in others
  if (typeof response.text === 'string') return response.text;
  if (typeof response.text === 'function') return response.text();

  // Fallback: dig into candidates manually
  const part = response?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (part) return part;

  throw new Error('Could not extract text from Gemini response.');
}

function cleanJson(text) {
  return text.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

/**
 * Generate a travel itinerary using Gemini.
 * Returns parsed JSON { days: [...] } or throws.
 */
async function generateItinerary({ destination, days, budget, travellerType, foodPreference, interests, roamingTimes }) {
  const client = getClient();

  const prompt = `You are an expert Indian travel planner. Generate a detailed day-by-day travel itinerary in valid JSON format only.

Traveller details:
- Destination: ${destination}, India
- Duration: ${days} day(s)
- Total budget: ₹${budget}
- Traveller type: ${travellerType}
- Food preference: ${foodPreference}
- Interests: ${Array.isArray(interests) ? interests.join(', ') : interests}
- Preferred roaming times: ${Array.isArray(roamingTimes) ? roamingTimes.join(', ') : roamingTimes}

Rules:
1. Only recommend real, well-known places in ${destination}, India.
2. Respect the budget – include estimated costs in INR.
3. Consider food preference for restaurant/food suggestions.
4. Tailor activities to traveller type.
5. Return ONLY valid JSON – no markdown, no explanation, no code fences.

Required JSON structure:
{
  "destination": "${destination}",
  "duration": ${days},
  "totalEstimatedCost": "₹XXXX",
  "summary": "Brief trip summary",
  "days": [
    {
      "day": 1,
      "theme": "Theme for the day",
      "estimatedDayCost": "₹XXX",
      "activities": [
        {
          "period": "Morning",
          "time": "9:00 AM",
          "place": "Place name",
          "description": "What to do here",
          "category": "Heritage/Food/Nature/Shopping/etc",
          "estimatedCost": "₹XX",
          "travelNote": "How to get there / tip"
        }
      ],
      "notes": "General tips for the day"
    }
  ],
  "generalTips": ["tip1", "tip2"],
  "bestTimeToVisit": "Season info",
  "emergencyNumber": "112"
}`;

  const response = await client.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const raw = extractText(response);
  const jsonText = cleanJson(raw);

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    throw new Error('Gemini returned non-JSON response. Please try again.');
  }

  if (!parsed.days || !Array.isArray(parsed.days)) {
    throw new Error('Gemini response missing days array.');
  }

  return parsed;
}

/**
 * Generate hotel preference criteria from user input.
 */
async function getHotelPreferences({ destination, budget, travellerType, interests }) {
  const client = getClient();

  const prompt = `You are a hotel recommendation assistant for Indian tourism.
Given these traveller details, return ONLY valid JSON (no markdown, no explanation):
- Destination: ${destination}
- Budget per night: ₹${budget}
- Traveller type: ${travellerType}
- Interests: ${Array.isArray(interests) ? interests.join(', ') : interests || 'general'}

Return JSON:
{
  "preferredTypes": ["Budget","Mid-Range"],
  "mustHaveAmenities": ["WiFi"],
  "niceToHaveAmenities": ["Parking"],
  "maxPricePerNight": ${budget},
  "reasoning": "Brief explanation"
}`;

  const response = await client.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const text = cleanJson(extractText(response));

  try {
    return JSON.parse(text);
  } catch {
    return { preferredTypes: ['Budget', 'Mid-Range'], mustHaveAmenities: [], maxPricePerNight: budget, reasoning: '' };
  }
}

/**
 * Multilingual AI assistant — answer tourism questions in a given language.
 */
async function askAssistant({ question, language = 'English', destination = '' }) {
  const client = getClient();

  const prompt = `You are a friendly Indian tourism assistant. Answer in ${language}.
${destination ? `Context: The user is asking about ${destination}, India.` : ''}
Question: ${question}
Keep the answer concise, helpful, and relevant to Indian tourism. Max 200 words.`;

  const response = await client.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  return extractText(response).trim();
}

module.exports = { generateItinerary, getHotelPreferences, askAssistant };
