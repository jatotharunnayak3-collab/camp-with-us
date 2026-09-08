require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');
const Hotel = require('./models/Hotel');
const LocalBusiness = require('./models/LocalBusiness');

const MONGO_URI = process.env.MONGO_URI;

// ─── DESTINATIONS DATA ────────────────────────────────────────────────────────
const destinations = [
  {
    name: 'Warangal', city: 'Warangal', state: 'Telangana', category: 'Heritage',
    description: 'Warangal, the ancient capital of the Kakatiya dynasty, is renowned for its stunning 12th–13th century monuments. The Warangal Fort, Thousand Pillar Temple, and Ramappa Temple (UNESCO World Heritage Site) make it a treasure trove of Indian architectural history.',
    shortDescription: 'Ancient Kakatiya capital with UNESCO World Heritage temples.',
    bestTimeToVisit: 'October to February', climate: 'Tropical semi-arid', language: 'Telugu',
    coordinates: { lat: 17.9784, lng: 79.5941 }, averageBudgetPerDay: 1000,
    rating: 4.4, tags: ['heritage', 'temples', 'history', 'telangana', 'kakatiya'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Warangal_Fort_gates.jpg/1280px-Warangal_Fort_gates.jpg',
    attractions: [
      { name: 'Warangal Fort', description: 'Medieval fort with iconic arch gates', category: 'Heritage', entryFee: '₹25', timings: '9 AM – 5 PM' },
      { name: 'Ramappa Temple', description: 'UNESCO World Heritage Shiva temple', category: 'Heritage', entryFee: '₹30', timings: '6 AM – 6 PM' },
      { name: 'Thousand Pillar Temple', description: '12th century Kakatiya temple complex', category: 'Heritage', entryFee: '₹25', timings: '9 AM – 5 PM' },
      { name: 'Pakhal Lake', description: 'Serene artificial lake perfect for picnics', category: 'Nature', entryFee: 'Free', timings: 'Open all day' }
    ],
    popularFor: ['Kakatiya architecture', 'UNESCO heritage', 'Temples', 'Historical forts'],
    travelTips: ['Best explored by auto-rickshaw', 'Hire a local guide at Ramappa for richer experience']
  },
  {
    name: 'Nirmal', city: 'Nirmal', state: 'Telangana', category: 'Cultural',
    description: 'Nirmal is famous for its distinctive lacquerware toys and paintings — a centuries-old craft tradition. The beautiful Nirmal Fort and Pocharam Wildlife Sanctuary add to its appeal as an off-the-beaten-path destination in Telangana.',
    shortDescription: 'Famous for traditional Nirmal lacquerware and forest getaways.',
    bestTimeToVisit: 'October to March', climate: 'Tropical', language: 'Telugu',
    coordinates: { lat: 19.0989, lng: 78.3389 }, averageBudgetPerDay: 800,
    rating: 4.0, tags: ['crafts', 'lacquerware', 'fort', 'telangana', 'wildlife'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Nirmal_Fort.jpg/1280px-Nirmal_Fort.jpg',
    attractions: [
      { name: 'Nirmal Fort', description: 'Historic fort with panoramic views', category: 'Heritage', entryFee: 'Free', timings: '9 AM – 5 PM' },
      { name: 'Pocharam Wildlife Sanctuary', description: 'Forest sanctuary with diverse wildlife', category: 'Wildlife', entryFee: '₹20', timings: '6 AM – 6 PM' },
      { name: 'Nirmal Paintings Gallery', description: 'Showcase of traditional Nirmal art', category: 'Culture', entryFee: 'Free', timings: '10 AM – 5 PM' }
    ],
    popularFor: ['Nirmal lacquerware', 'Traditional handicrafts', 'Wildlife'],
    travelTips: ['Buy authentic lacquerware from government emporium', 'Visit artisan villages for live craft demonstrations']
  },
  {
    name: 'Hyderabad', city: 'Hyderabad', state: 'Telangana', category: 'City',
    description: 'Hyderabad, the City of Pearls and Nizams, blends a royal Mughal heritage with a thriving IT industry. From the magnificent Charminar and Golconda Fort to world-famous Hyderabadi biryani and pearl markets — the city offers an extraordinary mix of old and new India.',
    shortDescription: 'City of Pearls blending Mughal grandeur with modern innovation.',
    bestTimeToVisit: 'October to February', climate: 'Semi-arid', language: 'Telugu, Urdu',
    coordinates: { lat: 17.3850, lng: 78.4867 }, averageBudgetPerDay: 2500,
    rating: 4.6, tags: ['city', 'biryani', 'charminar', 'golconda', 'pearls', 'nizams'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Charminar_at_Hyderabad.jpg/1280px-Charminar_at_Hyderabad.jpg',
    attractions: [
      { name: 'Charminar', description: 'Iconic 16th century monument and mosque', category: 'Heritage', entryFee: '₹25', timings: '9:30 AM – 5:30 PM' },
      { name: 'Golconda Fort', description: 'Imposing medieval fort with acoustic marvel', category: 'Heritage', entryFee: '₹30', timings: '9 AM – 5:30 PM' },
      { name: 'Ramoji Film City', description: 'World\'s largest film studio complex', category: 'Entertainment', entryFee: '₹1350+', timings: '9 AM – 6 PM' },
      { name: 'Hussain Sagar Lake', description: 'Artificial lake with Buddha statue island', category: 'Nature', entryFee: 'Free', timings: 'Open all day' }
    ],
    popularFor: ['Biryani', 'Pearls', 'Charminar', 'Nawabi culture', 'IT hub'],
    travelTips: ['Use Metro for convenient travel', 'Try biryani at Paradise or Bawarchi', 'Visit Laad Bazaar for pearls and bangles']
  },
  {
    name: 'Goa', city: 'Panaji', state: 'Goa', category: 'Beach',
    description: 'Goa is India\'s smallest state and most beloved beach destination. With sun-kissed shores, Portuguese-colonial architecture, vibrant nightlife, fresh seafood, and a laid-back lifestyle, Goa attracts millions of visitors year-round.',
    shortDescription: 'India\'s premier beach destination with Portuguese heritage.',
    bestTimeToVisit: 'November to February', climate: 'Tropical monsoon', language: 'Konkani',
    coordinates: { lat: 15.2993, lng: 74.1240 }, averageBudgetPerDay: 3000,
    rating: 4.7, tags: ['beach', 'nightlife', 'portuguese', 'seafood', 'water sports'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Calangute_Beach.jpg/1280px-Calangute_Beach.jpg',
    attractions: [
      { name: 'Calangute Beach', description: 'Queen of Goa beaches with water sports', category: 'Beach', entryFee: 'Free', timings: 'Open all day' },
      { name: 'Baga Beach', description: 'Famous for nightlife, shacks, and water sports', category: 'Beach', entryFee: 'Free', timings: 'Open all day' },
      { name: 'Basilica of Bom Jesus', description: 'UNESCO World Heritage baroque church', category: 'Heritage', entryFee: 'Free', timings: '9 AM – 6:30 PM' },
      { name: 'Dudhsagar Falls', description: 'Spectacular four-tiered waterfall on Goa-Karnataka border', category: 'Nature', entryFee: '₹400', timings: '7 AM – 5 PM' }
    ],
    popularFor: ['Beaches', 'Seafood', 'Nightlife', 'Portuguese heritage', 'Water sports'],
    travelTips: ['Rent a scooter for easy beach hopping', 'North Goa for parties, South Goa for serenity']
  },
  {
    name: 'Delhi', city: 'New Delhi', state: 'Delhi', category: 'Heritage',
    description: 'India\'s capital, Delhi, is a living history book with 8 cities built over centuries. From the imposing Red Fort and Qutb Minar to the spiritual Lotus Temple and India Gate, Delhi is the political, cultural and historical heartbeat of India.',
    shortDescription: 'India\'s historic capital with Mughal and colonial grandeur.',
    bestTimeToVisit: 'October to March', climate: 'Semi-arid', language: 'Hindi',
    coordinates: { lat: 28.6139, lng: 77.2090 }, averageBudgetPerDay: 2000,
    rating: 4.5, tags: ['capital', 'history', 'mughal', 'food', 'monuments'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Red_fort_in_Delhi_03-2016_img3.jpg/1280px-Red_fort_in_Delhi_03-2016_img3.jpg',
    attractions: [
      { name: 'Red Fort', description: 'UNESCO World Heritage Mughal fort', category: 'Heritage', entryFee: '₹35', timings: '9:30 AM – 4:30 PM' },
      { name: 'Qutb Minar', description: 'UNESCO World Heritage 73m minaret', category: 'Heritage', entryFee: '₹35', timings: '7 AM – 5 PM' },
      { name: 'India Gate', description: 'War memorial and popular evening gathering spot', category: 'Heritage', entryFee: 'Free', timings: 'Open all day' },
      { name: 'Humayun\'s Tomb', description: 'Precursor to the Taj Mahal, Mughal garden tomb', category: 'Heritage', entryFee: '₹35', timings: '7 AM – 5 PM' }
    ],
    popularFor: ['Monuments', 'Street food', 'Mughal history', 'Shopping', 'Diplomacy'],
    travelTips: ['Use Delhi Metro for affordable travel', 'Try chaat and parathas in Old Delhi\'s lanes']
  },
  {
    name: 'Jaipur', city: 'Jaipur', state: 'Rajasthan', category: 'Heritage',
    description: 'The Pink City of Rajasthan, Jaipur is famous for its magnificent forts, opulent palaces, vibrant bazaars, and Rajput architecture. Part of the Golden Triangle along with Delhi and Agra, it\'s one of India\'s most visited cities.',
    shortDescription: 'The Pink City — Rajasthan\'s royal jewel of forts and palaces.',
    bestTimeToVisit: 'October to March', climate: 'Semi-arid', language: 'Hindi, Rajasthani',
    coordinates: { lat: 26.9124, lng: 75.7873 }, averageBudgetPerDay: 2000,
    rating: 4.6, tags: ['pink city', 'forts', 'palaces', 'rajasthan', 'heritage'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Hawa_Mahal_Jaipur.jpg/800px-Hawa_Mahal_Jaipur.jpg',
    attractions: [
      { name: 'Amber Fort', description: 'Majestic hilltop fort with mirror palace', category: 'Heritage', entryFee: '₹100', timings: '8 AM – 5:30 PM' },
      { name: 'Hawa Mahal', description: 'Palace of Winds — iconic 953-windowed facade', category: 'Heritage', entryFee: '₹50', timings: '9 AM – 5 PM' },
      { name: 'City Palace', description: 'Royal palace complex and museum', category: 'Heritage', entryFee: '₹200', timings: '9:30 AM – 5 PM' },
      { name: 'Jantar Mantar', description: 'UNESCO World Heritage astronomical observatory', category: 'Heritage', entryFee: '₹50', timings: '9 AM – 4:30 PM' }
    ],
    popularFor: ['Rajput heritage', 'Shopping', 'Forts', 'Cuisine', 'Textile'],
    travelTips: ['Hire an auto for fort-hopping', 'Shop for gems and textiles at Johari Bazaar']
  },
  {
    name: 'Agra', city: 'Agra', state: 'Uttar Pradesh', category: 'Heritage',
    description: 'Home to the Taj Mahal — one of the Seven Wonders of the World — Agra is a mandatory stop on any India itinerary. The city also boasts the imposing Agra Fort and the ghost city of Fatehpur Sikri, all UNESCO World Heritage Sites.',
    shortDescription: 'Home of the Taj Mahal, one of the Seven Wonders of the World.',
    bestTimeToVisit: 'October to March', climate: 'Semi-arid', language: 'Hindi',
    coordinates: { lat: 27.1767, lng: 78.0081 }, averageBudgetPerDay: 2500,
    rating: 4.8, tags: ['taj mahal', 'wonder', 'mughal', 'heritage', 'UNESCO'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/TajMahal_2012.jpg/1280px-TajMahal_2012.jpg',
    attractions: [
      { name: 'Taj Mahal', description: 'Iconic 17th century Mughal mausoleum — UNESCO World Heritage', category: 'Heritage', entryFee: '₹50 (Indian)', timings: '6 AM – 6:30 PM (closed Friday)' },
      { name: 'Agra Fort', description: 'UNESCO World Heritage Mughal fort', category: 'Heritage', entryFee: '₹40', timings: '6 AM – 6 PM' },
      { name: 'Fatehpur Sikri', description: 'Abandoned Mughal capital, UNESCO World Heritage', category: 'Heritage', entryFee: '₹35', timings: '6 AM – 6 PM' }
    ],
    popularFor: ['Taj Mahal', 'Mughal heritage', 'Petha sweets', 'Marble crafts'],
    travelTips: ['Visit Taj Mahal at sunrise for best light', 'Avoid Fridays when Taj is closed']
  },
  {
    name: 'Mumbai', city: 'Mumbai', state: 'Maharashtra', category: 'City',
    description: 'India\'s financial capital and the city of dreams, Mumbai is a vibrant metropolis where colonial architecture, Bollywood glamour, beautiful sea promenades, and incredible street food converge. The Gateway of India and Marine Drive are iconic symbols.',
    shortDescription: 'India\'s financial capital — the city that never sleeps.',
    bestTimeToVisit: 'November to February', climate: 'Tropical', language: 'Marathi, Hindi',
    coordinates: { lat: 19.0760, lng: 72.8777 }, averageBudgetPerDay: 3500,
    rating: 4.5, tags: ['bollywood', 'gateway', 'marine drive', 'financial', 'nightlife'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/1280px-Mumbai_03-2016_30_Gateway_of_India.jpg',
    attractions: [
      { name: 'Gateway of India', description: 'Iconic 1924 colonial monument on the seafront', category: 'Heritage', entryFee: 'Free', timings: 'Open all day' },
      { name: 'Marine Drive', description: 'Scenic coastal road known as Queen\'s Necklace', category: 'Nature', entryFee: 'Free', timings: 'Open all day' },
      { name: 'Elephanta Caves', description: 'UNESCO World Heritage cave temples on island', category: 'Heritage', entryFee: '₹40', timings: '9 AM – 5:30 PM (closed Monday)' },
      { name: 'Chhatrapati Shivaji Maharaj Terminus', description: 'UNESCO World Heritage Victorian railway station', category: 'Heritage', entryFee: 'Free', timings: 'Open all day' }
    ],
    popularFor: ['Bollywood', 'Street food', 'Gateway of India', 'Nightlife', 'Marine Drive'],
    travelTips: ['Use local trains — fastest way to travel', 'Try vada pav for authentic Mumbai experience']
  },
  {
    name: 'Manali', city: 'Manali', state: 'Himachal Pradesh', category: 'Hill Station',
    description: 'Manali, nestled in the Kullu Valley of Himachal Pradesh, is one of India\'s most popular hill stations. Known for snow-capped peaks, adventure sports, hot springs, and the gateway to Rohtang Pass and Lahaul-Spiti, it draws thrill-seekers and nature lovers alike.',
    shortDescription: 'Himalayan gateway for snow, adventure, and alpine beauty.',
    bestTimeToVisit: 'October to June (avoid monsoon)', climate: 'Alpine', language: 'Hindi, Pahari',
    coordinates: { lat: 32.2432, lng: 77.1892 }, averageBudgetPerDay: 2500,
    rating: 4.6, tags: ['snow', 'adventure', 'mountains', 'himachal', 'trekking'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Solang_Valley.jpg/1280px-Solang_Valley.jpg',
    attractions: [
      { name: 'Rohtang Pass', description: 'High-altitude pass with spectacular snow views', category: 'Nature', entryFee: '₹500 (permit)', timings: 'Seasonal' },
      { name: 'Solang Valley', description: 'Adventure hub for skiing, paragliding, zorbing', category: 'Adventure', entryFee: 'Activity based', timings: 'Open all day' },
      { name: 'Hadimba Temple', description: '16th century wooden temple amid cedar forest', category: 'Religious', entryFee: 'Free', timings: '8 AM – 6 PM' },
      { name: 'Old Manali', description: 'Charming village with cafes and handicraft shops', category: 'Culture', entryFee: 'Free', timings: 'Open all day' }
    ],
    popularFor: ['Snow activities', 'Trekking', 'Rohtang Pass', 'Adventure sports'],
    travelTips: ['Book Rohtang permits in advance online', 'Carry warm layers even in summer']
  },
  {
    name: 'Ooty', city: 'Ooty', state: 'Tamil Nadu', category: 'Hill Station',
    description: 'Ooty (Udhagamandalam), the Queen of Hill Stations in the Nilgiris, is famous for its tea gardens, eucalyptus forests, and the charming Nilgiri Mountain Railway (UNESCO World Heritage). A favourite summer retreat since British times.',
    shortDescription: 'Queen of Hill Stations — Nilgiris tea country.',
    bestTimeToVisit: 'April to June, September to November', climate: 'Subtropical highland', language: 'Tamil',
    coordinates: { lat: 11.4102, lng: 76.6950 }, averageBudgetPerDay: 1800,
    rating: 4.4, tags: ['tea gardens', 'nilgiris', 'toy train', 'hill station', 'nature'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Ooty_Lake.jpg/1280px-Ooty_Lake.jpg',
    attractions: [
      { name: 'Ooty Lake', description: 'Artificial lake with boating facilities', category: 'Nature', entryFee: '₹20', timings: '9 AM – 6 PM' },
      { name: 'Nilgiri Mountain Railway', description: 'UNESCO World Heritage toy train through hills', category: 'Heritage', entryFee: '₹25 (2nd class)', timings: 'Multiple departures' },
      { name: 'Botanical Gardens', description: '55-acre government botanical garden', category: 'Nature', entryFee: '₹30', timings: '7 AM – 6:30 PM' },
      { name: 'Doddabetta Peak', description: 'Highest peak in the Nilgiris at 2,637m', category: 'Nature', entryFee: '₹10', timings: '7 AM – 6 PM' }
    ],
    popularFor: ['Tea gardens', 'Toy train', 'Botanical gardens', 'Hiking'],
    travelTips: ['Ride the Nilgiri toy train from Mettupalayam', 'Buy fresh Nilgiri tea from estates']
  },
  {
    name: 'Varanasi', city: 'Varanasi', state: 'Uttar Pradesh', category: 'Religious',
    description: 'Varanasi (Kashi) is one of the world\'s oldest living cities and the spiritual capital of India. Pilgrims flock to bathe in the sacred Ganga ghats, witness the spectacular Ganga Aarti, and walk through ancient narrow lanes to temple after temple.',
    shortDescription: 'The spiritual capital of India on the banks of the Ganges.',
    bestTimeToVisit: 'October to March', climate: 'Humid subtropical', language: 'Hindi',
    coordinates: { lat: 25.3176, lng: 82.9739 }, averageBudgetPerDay: 1500,
    rating: 4.5, tags: ['ghats', 'ganges', 'spiritual', 'temples', 'aarti'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Ganga_Aarti_at_Varanasi.jpg/1280px-Ganga_Aarti_at_Varanasi.jpg',
    attractions: [
      { name: 'Dashashwamedh Ghat', description: 'Main ghat famous for spectacular daily Ganga Aarti', category: 'Religious', entryFee: 'Free', timings: 'Aarti at dusk' },
      { name: 'Kashi Vishwanath Temple', description: 'Sacred Jyotirlinga Shiva temple', category: 'Religious', entryFee: 'Free', timings: '3 AM – 11 PM' },
      { name: 'Sarnath', description: 'Buddhist pilgrimage site where Buddha first preached', category: 'Heritage', entryFee: '₹25', timings: '9 AM – 5 PM' },
      { name: 'Manikarnika Ghat', description: 'Sacred cremation ghat on the Ganges', category: 'Religious', entryFee: 'Free', timings: 'Open 24 hours' }
    ],
    popularFor: ['Ganga Aarti', 'Ghats', 'Temples', 'Boat rides', 'Silk weaving'],
    travelTips: ['Take a sunrise boat ride on the Ganga', 'Respect local customs at ghats and temples']
  },
  {
    name: 'Udaipur', city: 'Udaipur', state: 'Rajasthan', category: 'Heritage',
    description: 'The City of Lakes, Udaipur is one of India\'s most romantic and picturesque cities. With the shimmering Lake Pichola, the majestic City Palace, and marble-white heritage hotels, it is often called the Venice of the East.',
    shortDescription: 'City of Lakes — Rajasthan\'s most romantic destination.',
    bestTimeToVisit: 'September to March', climate: 'Semi-arid', language: 'Hindi, Rajasthani',
    coordinates: { lat: 24.5854, lng: 73.7125 }, averageBudgetPerDay: 2500,
    rating: 4.7, tags: ['lakes', 'palaces', 'romantic', 'rajasthan', 'heritage'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Udaipur_City_Palace.jpg/1280px-Udaipur_City_Palace.jpg',
    attractions: [
      { name: 'City Palace', description: 'Grand palace complex overlooking Lake Pichola', category: 'Heritage', entryFee: '₹300', timings: '9:30 AM – 5:30 PM' },
      { name: 'Lake Pichola', description: 'Artificial lake with islands and boat rides', category: 'Nature', entryFee: '₹400 (boat)', timings: '9 AM – 5 PM' },
      { name: 'Jag Mandir Palace', description: 'Island palace on Lake Pichola', category: 'Heritage', entryFee: '₹400', timings: '10 AM – 6 PM' },
      { name: 'Saheliyon ki Bari', description: 'Royal garden with fountains', category: 'Heritage', entryFee: '₹10', timings: '9 AM – 7 PM' }
    ],
    popularFor: ['Romantic getaway', 'Lake views', 'Palace hotels', 'Rajput cuisine'],
    travelTips: ['Take a boat ride at sunset on Lake Pichola', 'Book heritage hotel stays for full experience']
  },
  {
    name: 'Mysuru', city: 'Mysuru', state: 'Karnataka', category: 'Heritage',
    description: 'Known as the City of Palaces, Mysuru is famous for the opulent Mysore Palace, which is one of India\'s most visited monuments. The city is also renowned for its fragrant sandalwood, silk, yoga traditions, and the grand Dasara festival.',
    shortDescription: 'City of Palaces — Karnataka\'s royal and cultural capital.',
    bestTimeToVisit: 'October to February', climate: 'Tropical savanna', language: 'Kannada',
    coordinates: { lat: 12.2958, lng: 76.6394 }, averageBudgetPerDay: 1800,
    rating: 4.5, tags: ['palace', 'dasara', 'sandalwood', 'silk', 'karnataka'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Mysore_Palace_Morning.jpg/1280px-Mysore_Palace_Morning.jpg',
    attractions: [
      { name: 'Mysore Palace', description: 'Magnificent royal palace, 3rd most visited in India', category: 'Heritage', entryFee: '₹100', timings: '10 AM – 5:30 PM' },
      { name: 'Chamundeshwari Temple', description: 'Hilltop temple with panoramic views', category: 'Religious', entryFee: 'Free', timings: '7:30 AM – 2 PM, 3:30 PM – 9 PM' },
      { name: 'Brindavan Gardens', description: 'Beautiful terraced gardens with musical fountains', category: 'Nature', entryFee: '₹60', timings: '6 AM – 8 PM' },
      { name: 'Mysore Zoo', description: 'One of India\'s best zoological gardens', category: 'Nature', entryFee: '₹100', timings: '8:30 AM – 5:30 PM' }
    ],
    popularFor: ['Mysore Palace', 'Silk sarees', 'Dasara festival', 'Yoga'],
    travelTips: ['Visit palace during Dasara for illumination', 'Buy Mysore silk from government emporium']
  },
  {
    name: 'Amritsar', city: 'Amritsar', state: 'Punjab', category: 'Religious',
    description: 'Amritsar is the spiritual and cultural centre of Sikhism. The Golden Temple (Harmandir Sahib) — glistening in gold beside the sacred Amrit Sarovar — is one of India\'s most sacred and visited sites. The Jallianwala Bagh memorial and Wagah Border ceremony add historical depth.',
    shortDescription: 'Home of the Golden Temple — heart of Sikh heritage.',
    bestTimeToVisit: 'October to March', climate: 'Semi-arid', language: 'Punjabi',
    coordinates: { lat: 31.6340, lng: 74.8723 }, averageBudgetPerDay: 1500,
    rating: 4.8, tags: ['golden temple', 'sikh', 'wagah border', 'langar', 'punjab'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Golden_Temple_1.jpg/1280px-Golden_Temple_1.jpg',
    attractions: [
      { name: 'Golden Temple', description: 'Holiest Sikh shrine, free langar for all visitors', category: 'Religious', entryFee: 'Free', timings: 'Open 24 hours' },
      { name: 'Jallianwala Bagh', description: 'Historic memorial of the 1919 massacre', category: 'Heritage', entryFee: 'Free', timings: '6:30 AM – 7:30 PM' },
      { name: 'Wagah Border Ceremony', description: 'Evening retreat ceremony at India-Pakistan border', category: 'Cultural', entryFee: 'Free', timings: 'Sunset (timing varies)' }
    ],
    popularFor: ['Golden Temple', 'Langar', 'Wagah Border', 'Punjabi food', 'Kulcha'],
    travelTips: ['Cover head before entering Golden Temple', 'Try Amritsari kulcha and lassi']
  },
  {
    name: 'Rishikesh', city: 'Rishikesh', state: 'Uttarakhand', category: 'Adventure',
    description: 'Rishikesh, where the Ganges descends from the Himalayas, is the Yoga Capital of the World and an adventure sports hub. White-water rafting, bungee jumping, camping, and trekking attract thrill-seekers, while ashrams and yoga centres welcome seekers of spiritual peace.',
    shortDescription: 'Yoga capital and adventure sports hub on the Ganges.',
    bestTimeToVisit: 'February to November', climate: 'Subtropical highland', language: 'Hindi',
    coordinates: { lat: 30.0869, lng: 78.2676 }, averageBudgetPerDay: 1500,
    rating: 4.6, tags: ['yoga', 'rafting', 'ganges', 'spiritual', 'adventure'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Laxman_Jhula_Rishikesh.jpg/1280px-Laxman_Jhula_Rishikesh.jpg',
    attractions: [
      { name: 'Laxman Jhula', description: 'Iconic suspension bridge over the Ganges', category: 'Heritage', entryFee: 'Free', timings: 'Open all day' },
      { name: 'Triveni Ghat', description: 'Sacred bathing ghat with evening aarti', category: 'Religious', entryFee: 'Free', timings: 'Aarti at sunset' },
      { name: 'White Water Rafting', description: 'Rafting on Grade 3-4 rapids of the Ganges', category: 'Adventure', entryFee: '₹600+', timings: 'Season: Sept–June' },
      { name: 'Neelkanth Mahadev Temple', description: 'Sacred Shiva temple in forested hills', category: 'Religious', entryFee: 'Free', timings: '5 AM – 8 PM' }
    ],
    popularFor: ['Yoga', 'River rafting', 'Bungee jumping', 'Ashrams', 'Camping'],
    travelTips: ['Book rafting in advance during peak season', 'Attend evening aarti at Parmarth Niketan']
  },
  {
    name: 'Darjeeling', city: 'Darjeeling', state: 'West Bengal', category: 'Hill Station',
    description: 'Darjeeling, the Queen of Hills in West Bengal, is renowned for its stunning views of Mount Kanchenjunga, world-famous Darjeeling tea estates, and the charming Darjeeling Himalayan Railway (UNESCO World Heritage toy train).',
    shortDescription: 'Queen of Hills — world-famous tea and Himalayan views.',
    bestTimeToVisit: 'March to May, September to November', climate: 'Subtropical highland', language: 'Bengali, Nepali',
    coordinates: { lat: 27.0360, lng: 88.2627 }, averageBudgetPerDay: 2000,
    rating: 4.5, tags: ['tea', 'himalaya', 'toy train', 'kanchenjunga', 'west bengal'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Darjeeling_Himalayan_railway.jpg/1280px-Darjeeling_Himalayan_railway.jpg',
    attractions: [
      { name: 'Tiger Hill', description: 'Best sunrise view of Kanchenjunga and Everest', category: 'Nature', entryFee: '₹35', timings: '4 AM – 8 AM (sunrise)' },
      { name: 'Darjeeling Himalayan Railway', description: 'UNESCO World Heritage toy train — Joy Ride', category: 'Heritage', entryFee: '₹80 (Joy Ride)', timings: 'Multiple departures' },
      { name: 'Happy Valley Tea Estate', description: 'Historic tea estate offering guided tours', category: 'Cultural', entryFee: '₹100', timings: '8 AM – 4:30 PM' },
      { name: 'Batasia Loop', description: 'Scenic spiral railway loop with war memorial', category: 'Heritage', entryFee: 'Free', timings: 'Open all day' }
    ],
    popularFor: ['Darjeeling tea', 'Toy train', 'Sunrise views', 'Trekking'],
    travelTips: ['Wake up early for Tiger Hill sunrise', 'Buy fresh first-flush tea directly from estates']
  },
  {
    name: 'Puducherry', city: 'Puducherry', state: 'Puducherry', category: 'Beach',
    description: 'Puducherry (Pondicherry) blends French colonial charm with Tamil culture. The French Quarter with its colourful villas, the pristine beaches, the Sri Aurobindo Ashram, and the experimental township of Auroville make it a unique destination.',
    shortDescription: 'French Riviera of the East — colonial charm meets Tamil culture.',
    bestTimeToVisit: 'October to March', climate: 'Tropical wet and dry', language: 'Tamil, French',
    coordinates: { lat: 11.9416, lng: 79.8083 }, averageBudgetPerDay: 2000,
    rating: 4.4, tags: ['french colony', 'beach', 'auroville', 'ashram', 'pondicherry'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Pondicherry_beach.jpg/1280px-Pondicherry_beach.jpg',
    attractions: [
      { name: 'French Quarter', description: 'Charming colonial streets with French villas', category: 'Heritage', entryFee: 'Free', timings: 'Open all day' },
      { name: 'Auroville', description: 'Experimental township for human unity', category: 'Cultural', entryFee: 'Free (Matrimandir viewing ₹10)', timings: '9 AM – 5 PM' },
      { name: 'Sri Aurobindo Ashram', description: 'Spiritual ashram founded by Sri Aurobindo', category: 'Religious', entryFee: 'Free', timings: '8 AM – 12 PM, 2 PM – 6 PM' },
      { name: 'Promenade Beach', description: 'Scenic 1.5km seafront promenade', category: 'Beach', entryFee: 'Free', timings: 'Open all day' }
    ],
    popularFor: ['French architecture', 'Auroville', 'Beaches', 'Cuisine', 'Yoga'],
    travelTips: ['Rent a cycle — best way to explore French Quarter', 'Try French-Tamil fusion cuisine']
  },
  {
    name: 'Kochi', city: 'Kochi', state: 'Kerala', category: 'Heritage',
    description: 'Kochi (Cochin), the commercial capital of Kerala, is a fascinating blend of Portuguese, Dutch, and British colonial heritage with traditional Kerala culture. Chinese fishing nets, ancient synagogues, spice markets, and Kathakali performances define this port city.',
    shortDescription: 'Kerala\'s heritage port city with multicultural colonial legacy.',
    bestTimeToVisit: 'October to March', climate: 'Tropical monsoon', language: 'Malayalam',
    coordinates: { lat: 9.9312, lng: 76.2673 }, averageBudgetPerDay: 2500,
    rating: 4.5, tags: ['chinese nets', 'backwaters', 'kerala', 'spices', 'colonial'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Chinese_fishing_nets_in_Kochi_2.jpg/1280px-Chinese_fishing_nets_in_Kochi_2.jpg',
    attractions: [
      { name: 'Chinese Fishing Nets', description: 'Iconic cantilevered fishing nets at Fort Kochi', category: 'Cultural', entryFee: 'Free', timings: 'Sunrise – 6 PM' },
      { name: 'Mattancherry Palace', description: 'Dutch Palace with Kerala murals', category: 'Heritage', entryFee: '₹5', timings: '10 AM – 5 PM (closed Friday)' },
      { name: 'Paradesi Synagogue', description: 'India\'s oldest active synagogue (1568)', category: 'Heritage', entryFee: '₹5', timings: '10 AM – 12 PM, 3 PM – 5 PM' },
      { name: 'Kerala Folklore Museum', description: 'Rich collection of traditional Kerala artifacts', category: 'Cultural', entryFee: '₹100', timings: '9:30 AM – 6 PM' }
    ],
    popularFor: ['Backwaters', 'Seafood', 'Kathakali', 'Spice trade history'],
    travelTips: ['Watch Kathakali performance in Fort Kochi', 'Explore Mattancherry spice market on foot']
  },
  {
    name: 'Munnar', city: 'Munnar', state: 'Kerala', category: 'Hill Station',
    description: 'Munnar, nestled at 1,600m in the Western Ghats, is a breathtaking hill station famous for its vast carpet of tea plantations, misty mountains, exotic wildlife, and cool climate. Eravikulam National Park, home to the endangered Nilgiri Tahr, is a major attraction.',
    shortDescription: 'Emerald tea estates in Kerala\'s misty Western Ghats.',
    bestTimeToVisit: 'September to March', climate: 'Subtropical highland', language: 'Malayalam',
    coordinates: { lat: 10.0889, lng: 77.0595 }, averageBudgetPerDay: 2000,
    rating: 4.7, tags: ['tea plantations', 'western ghats', 'kerala', 'trekking', 'wildlife'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Munnar_tea_plantations.jpg/1280px-Munnar_tea_plantations.jpg',
    attractions: [
      { name: 'Eravikulam National Park', description: 'Home of Nilgiri Tahr; best Neelakurinji views', category: 'Wildlife', entryFee: '₹125', timings: '7:30 AM – 4 PM' },
      { name: 'Tea Museum', description: 'History of tea cultivation in Munnar', category: 'Cultural', entryFee: '₹75', timings: '9 AM – 4 PM' },
      { name: 'Mattupetty Dam', description: 'Scenic reservoir with boating', category: 'Nature', entryFee: '₹20', timings: '9 AM – 5 PM' }
    ],
    popularFor: ['Tea estates', 'Trekking', 'Wildlife', 'Misty hills'],
    travelTips: ['Book Eravikulam tickets online in advance', 'Best fog views in morning — wake up early']
  },
  {
    name: 'Shimla', city: 'Shimla', state: 'Himachal Pradesh', category: 'Hill Station',
    description: 'Shimla, the capital of Himachal Pradesh, was once the summer capital of British India. The charming Mall Road, colonial architecture, Jakhu Temple, and the scenic Kalka-Shimla UNESCO World Heritage Railway make it the most popular hill station in North India.',
    shortDescription: 'Former British summer capital — North India\'s favourite hill station.',
    bestTimeToVisit: 'March to June, December to February', climate: 'Subtropical highland', language: 'Hindi',
    coordinates: { lat: 31.1048, lng: 77.1734 }, averageBudgetPerDay: 2500,
    rating: 4.5, tags: ['hill station', 'colonial', 'snow', 'himachal', 'toy train'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Shimla_Street.jpg/1280px-Shimla_Street.jpg',
    attractions: [
      { name: 'Mall Road', description: 'Pedestrian promenade with colonial buildings', category: 'Cultural', entryFee: 'Free', timings: 'Open all day' },
      { name: 'Jakhu Temple', description: 'Hilltop Hanuman temple with city views', category: 'Religious', entryFee: 'Free', timings: '7 AM – 7 PM' },
      { name: 'Kalka-Shimla Railway', description: 'UNESCO World Heritage narrow-gauge railway', category: 'Heritage', entryFee: '₹115+', timings: 'Multiple departures' }
    ],
    popularFor: ['Snow', 'Colonial architecture', 'Toy train', 'Shopping'],
    travelTips: ['Walk on Mall Road in the morning', 'Visit Kufri for snow activities in winter']
  },
  {
    name: 'Srinagar', city: 'Srinagar', state: 'Jammu & Kashmir', category: 'Hill Station',
    description: 'Srinagar, the summer capital of Jammu & Kashmir, is famous for its enchanting Dal Lake houseboats, Mughal gardens, and the majestic Himalayas. Often called the Venice of the East, it\'s a paradise for nature lovers and culture enthusiasts alike.',
    shortDescription: 'Paradise on Earth — Dal Lake and Mughal gardens.',
    bestTimeToVisit: 'April to October', climate: 'Humid continental', language: 'Kashmiri, Urdu',
    coordinates: { lat: 34.0837, lng: 74.7973 }, averageBudgetPerDay: 3000,
    rating: 4.7, tags: ['dal lake', 'houseboat', 'kashmir', 'mughal gardens', 'shikara'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Dal_Lake_Srinagar.jpg/1280px-Dal_Lake_Srinagar.jpg',
    attractions: [
      { name: 'Dal Lake', description: 'Iconic lake with houseboats and shikara rides', category: 'Nature', entryFee: 'Shikara ₹500+', timings: 'Open all day' },
      { name: 'Shalimar Bagh', description: 'Stunning Mughal terraced garden', category: 'Heritage', entryFee: '₹10', timings: '9 AM – 7 PM' },
      { name: 'Nishat Bagh', description: 'Largest Mughal garden overlooking Dal Lake', category: 'Heritage', entryFee: '₹10', timings: '9 AM – 7 PM' },
      { name: 'Shankaracharya Temple', description: 'Ancient hilltop temple with panoramic views', category: 'Religious', entryFee: 'Free', timings: '7 AM – 5 PM' }
    ],
    popularFor: ['Houseboats', 'Shikara rides', 'Mughal gardens', 'Kashmiri cuisine'],
    travelTips: ['Stay in a houseboat for authentic Dal Lake experience', 'Check travel advisories before visiting']
  },
  {
    name: 'Leh', city: 'Leh', state: 'Ladakh', category: 'Adventure',
    description: 'Leh, the capital of Ladakh at 3,500m altitude, is a high-altitude desert paradise with dramatic lunar landscapes, ancient Buddhist monasteries, pristine Himalayan lakes, and some of the world\'s highest motorable passes including Khardung La.',
    shortDescription: 'Ladakh\'s remote Himalayan capital — land of passes and monasteries.',
    bestTimeToVisit: 'June to September', climate: 'Cold desert', language: 'Ladakhi, Hindi',
    coordinates: { lat: 34.1526, lng: 77.5771 }, averageBudgetPerDay: 3500,
    rating: 4.8, tags: ['ladakh', 'monasteries', 'pangong lake', 'adventure', 'high altitude'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Pangong_Tso.jpg/1280px-Pangong_Tso.jpg',
    attractions: [
      { name: 'Pangong Tso Lake', description: 'Famous high-altitude lake spanning India and China', category: 'Nature', entryFee: 'Permit required', timings: 'Open all day' },
      { name: 'Thiksey Monastery', description: 'Impressive 12-storey monastery with giant Buddha', category: 'Religious', entryFee: '₹30', timings: '7 AM – 7 PM' },
      { name: 'Nubra Valley', description: 'Double-humped Bactrian camels and sand dunes', category: 'Nature', entryFee: 'Permit required', timings: 'Seasonal' },
      { name: 'Magnetic Hill', description: 'Optical illusion — vehicles appear to roll uphill', category: 'Nature', entryFee: 'Free', timings: 'Open all day' }
    ],
    popularFor: ['Pangong Lake', 'Monasteries', 'Khardung La', 'Bactrian camels'],
    travelTips: ['Acclimatize for 2 days before activities at altitude', 'Obtain Inner Line Permits for Nubra and Pangong']
  },
  {
    name: 'Jaisalmer', city: 'Jaisalmer', state: 'Rajasthan', category: 'Heritage',
    description: 'The Golden City of Rajasthan, Jaisalmer rises from the Thar Desert like a mirage. Its magnificent sandstone fort, ornate havelis, camel safaris, and camp-under-the-stars dune experiences make it one of India\'s most romantic desert destinations.',
    shortDescription: 'The Golden City — Rajasthan\'s desert fort jewel.',
    bestTimeToVisit: 'October to February', climate: 'Hot desert', language: 'Hindi, Rajasthani',
    coordinates: { lat: 26.9157, lng: 70.9083 }, averageBudgetPerDay: 2000,
    rating: 4.6, tags: ['desert', 'fort', 'camel safari', 'golden city', 'thar'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Jaisalmer_Fort.jpg/1280px-Jaisalmer_Fort.jpg',
    attractions: [
      { name: 'Jaisalmer Fort', description: 'Living UNESCO World Heritage sandstone fort', category: 'Heritage', entryFee: '₹50', timings: '9 AM – 6 PM' },
      { name: 'Sam Sand Dunes', description: 'Camel safaris and sunset dune views', category: 'Adventure', entryFee: 'Camel ₹300+', timings: '9 AM – 7 PM' },
      { name: 'Patwon Ki Haveli', description: 'Cluster of 5 ornately carved havelis', category: 'Heritage', entryFee: '₹30', timings: '9 AM – 6 PM' }
    ],
    popularFor: ['Camel safari', 'Desert camping', 'Fort', 'Havelis', 'Folk music'],
    travelTips: ['Book desert camp stay for magical stargazing', 'Visit during Desert Festival (Jan-Feb)']
  },
  {
    name: 'Jodhpur', city: 'Jodhpur', state: 'Rajasthan', category: 'Heritage',
    description: 'The Blue City of Rajasthan, Jodhpur is dominated by the mighty Mehrangarh Fort rising 400 feet above the city. Below it, the old city\'s blue-washed houses create a spectacular view that has made it one of India\'s most photographed cities.',
    shortDescription: 'The Blue City — Mehrangarh Fort and azure old city.',
    bestTimeToVisit: 'October to March', climate: 'Hot desert', language: 'Hindi, Rajasthani',
    coordinates: { lat: 26.2389, lng: 73.0243 }, averageBudgetPerDay: 1800,
    rating: 4.5, tags: ['blue city', 'fort', 'rajasthan', 'mehrangarh', 'heritage'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Mehrangarh_Fort.jpg/1280px-Mehrangarh_Fort.jpg',
    attractions: [
      { name: 'Mehrangarh Fort', description: 'One of India\'s largest forts with outstanding museum', category: 'Heritage', entryFee: '₹100', timings: '9 AM – 5 PM' },
      { name: 'Jaswant Thada', description: 'White marble cenotaph with beautiful gardens', category: 'Heritage', entryFee: '₹30', timings: '9 AM – 5 PM' },
      { name: 'Umaid Bhawan Palace', description: 'Art deco palace — still a royal residence and hotel', category: 'Heritage', entryFee: '₹30 (museum)', timings: '9 AM – 5 PM' }
    ],
    popularFor: ['Blue city views', 'Mehrangarh Fort', 'Rajasthani food', 'Handicrafts'],
    travelTips: ['Climb to Mehrangarh battlements for city views', 'Try Mirchi Bada — Jodhpur\'s famous snack']
  },
  {
    name: 'Kolkata', city: 'Kolkata', state: 'West Bengal', category: 'City',
    description: 'Kolkata, the City of Joy, is the cultural, intellectual, and artistic capital of India. From the Victoria Memorial and Howrah Bridge to Durga Puja pandals, Rabindranath Tagore\'s Jorasanko Thakurbari, and incredible street food — Kolkata is a sensory delight.',
    shortDescription: 'City of Joy — India\'s cultural and intellectual capital.',
    bestTimeToVisit: 'October to February', climate: 'Tropical wet and dry', language: 'Bengali',
    coordinates: { lat: 22.5726, lng: 88.3639 }, averageBudgetPerDay: 2000,
    rating: 4.4, tags: ['city of joy', 'durga puja', 'colonial', 'bengali cuisine', 'trams'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Victoria_Memorial_Kolkata.jpg/1280px-Victoria_Memorial_Kolkata.jpg',
    attractions: [
      { name: 'Victoria Memorial', description: 'Marble monument and museum from British era', category: 'Heritage', entryFee: '₹30', timings: '10 AM – 5 PM' },
      { name: 'Howrah Bridge', description: 'Iconic cantilever bridge over the Hooghly River', category: 'Heritage', entryFee: 'Free', timings: 'Open all day' },
      { name: 'Dakshineswar Kali Temple', description: 'Sacred temple associated with Ramakrishna', category: 'Religious', entryFee: 'Free', timings: '6 AM – 12:30 PM, 3 PM – 8:30 PM' }
    ],
    popularFor: ['Durga Puja', 'Rosogolla', 'Colonial architecture', 'Trams', 'Literature'],
    travelTips: ['Ride the historic tram for authentic Kolkata experience', 'Try kati rolls and mishti doi']
  },
  {
    name: 'Andaman Islands', city: 'Port Blair', state: 'Andaman & Nicobar Islands', category: 'Beach',
    description: 'The Andaman Islands offer an unspoilt tropical paradise with some of the world\'s finest beaches, pristine coral reefs, turquoise waters, and lush rainforests. Radhanagar Beach, Cellular Jail, and vibrant scuba diving and snorkelling make it India\'s most exotic destination.',
    shortDescription: 'India\'s tropical island paradise with world-class beaches.',
    bestTimeToVisit: 'October to May', climate: 'Tropical rainforest', language: 'Bengali, Tamil, Hindi',
    coordinates: { lat: 11.7401, lng: 92.6586 }, averageBudgetPerDay: 4000,
    rating: 4.8, tags: ['islands', 'beach', 'scuba diving', 'coral reefs', 'andaman'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Radhanagar_Beach.jpg/1280px-Radhanagar_Beach.jpg',
    attractions: [
      { name: 'Radhanagar Beach', description: 'Asia\'s best beach — Havelock Island', category: 'Beach', entryFee: 'Free', timings: 'Open all day' },
      { name: 'Cellular Jail', description: 'Colonial prison — national memorial and light show', category: 'Heritage', entryFee: '₹30', timings: '9 AM – 5 PM' },
      { name: 'Neil Island', description: 'Unspoilt island with natural bridge and beaches', category: 'Beach', entryFee: 'Free', timings: 'Open all day' }
    ],
    popularFor: ['Beaches', 'Scuba diving', 'Snorkelling', 'Cellular Jail', 'Coral reefs'],
    travelTips: ['Book inter-island ferries in advance', 'Obtain Inner Line Permit for tribal areas']
  },
  {
    name: 'Coorg', city: 'Madikeri', state: 'Karnataka', category: 'Hill Station',
    description: 'Coorg (Kodagu), the Scotland of India, is a mist-covered hill district in Karnataka famous for coffee plantations, spice gardens, picturesque waterfalls, and the martial Kodava culture. It is one of the most visited hill stations in South India.',
    shortDescription: 'Scotland of India — Karnataka\'s coffee and spice paradise.',
    bestTimeToVisit: 'October to March', climate: 'Subtropical highland', language: 'Kodava, Kannada',
    coordinates: { lat: 12.4244, lng: 75.7382 }, averageBudgetPerDay: 2500,
    rating: 4.6, tags: ['coffee', 'coorg', 'karnataka', 'waterfalls', 'spices'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Coorg_Coffee_Estate.jpg/1280px-Coorg_Coffee_Estate.jpg',
    attractions: [
      { name: 'Abbey Falls', description: 'Scenic 70-foot waterfall surrounded by coffee estates', category: 'Nature', entryFee: '₹30', timings: '8 AM – 6 PM' },
      { name: 'Raja\'s Seat', description: 'Hilltop garden with panoramic valley views', category: 'Nature', entryFee: '₹10', timings: '6 AM – 8:30 PM' },
      { name: 'Dubare Elephant Camp', description: 'Elephant interaction on the Kaveri riverbank', category: 'Wildlife', entryFee: '₹800', timings: '8:30 AM – 5 PM' }
    ],
    popularFor: ['Coffee estates', 'Rafting', 'Elephant camp', 'Birdwatching'],
    travelTips: ['Stay in a coffee plantation homestay for best experience', 'Buy fresh Coorg coffee directly from estates']
  },
  {
    name: 'Tirupati', city: 'Tirupati', state: 'Andhra Pradesh', category: 'Religious',
    description: 'Tirupati is home to the Tirumala Venkateswara Temple, one of the most visited religious sites on Earth. Millions of devotees visit annually to seek blessings at this hilltop temple dedicated to Lord Venkateswara (Balaji). The seven-hill Tirumala is considered sacred in Hinduism.',
    shortDescription: 'Abode of Lord Venkateswara — the world\'s most visited pilgrimage.',
    bestTimeToVisit: 'All year (avoid major festivals for shorter queues)', climate: 'Tropical semi-arid', language: 'Telugu',
    coordinates: { lat: 13.6288, lng: 79.4192 }, averageBudgetPerDay: 1500,
    rating: 4.8, tags: ['temple', 'venkateswara', 'pilgrimage', 'andhra', 'tirumala'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Tirumala_Sri_Venkateswara_Swamy_Vaari_Devasthanam.jpg/1280px-Tirumala_Sri_Venkateswara_Swamy_Vaari_Devasthanam.jpg',
    attractions: [
      { name: 'Tirumala Venkateswara Temple', description: 'World\'s most visited religious site — Lord Balaji', category: 'Religious', entryFee: 'Free (Special darshan ₹300)', timings: 'Open 24 hours (queue regulated)' },
      { name: 'Sri Govindarajaswami Temple', description: 'Major temple at the base of Tirumala hills', category: 'Religious', entryFee: 'Free', timings: '7 AM – 9 PM' },
      { name: 'Silathoranam', description: 'Natural rock arch — geological wonder on Tirumala', category: 'Nature', entryFee: 'Free', timings: 'Open all day' }
    ],
    popularFor: ['Lord Venkateswara darshan', 'Tirumala laddu prasad', 'Pilgrimage'],
    travelTips: ['Book darshan slots online via TTD well in advance', 'Hair donation is a common custom at the temple']
  },
  {
    name: 'Bengaluru', city: 'Bengaluru', state: 'Karnataka', category: 'City',
    description: 'Bengaluru (Bangalore), the Silicon Valley of India, is a cosmopolitan city with a pleasant climate year-round. Known for its vibrant pub culture, lush gardens, world-class tech companies, and the nearby Nandi Hills and Mysuru day trips.',
    shortDescription: 'Silicon Valley of India — IT hub with garden city charm.',
    bestTimeToVisit: 'October to February', climate: 'Tropical savanna', language: 'Kannada',
    coordinates: { lat: 12.9716, lng: 77.5946 }, averageBudgetPerDay: 2500,
    rating: 4.3, tags: ['tech hub', 'garden city', 'pub culture', 'karnataka', 'gardens'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Lalbagh_Botanical_Garden.jpg/1280px-Lalbagh_Botanical_Garden.jpg',
    attractions: [
      { name: 'Lalbagh Botanical Garden', description: '240-acre botanical garden with glasshouse', category: 'Nature', entryFee: '₹20', timings: '6 AM – 7 PM' },
      { name: 'Cubbon Park', description: 'Green lung of Bengaluru — 300-acre park', category: 'Nature', entryFee: 'Free', timings: '6 AM – 6 PM' },
      { name: 'Bangalore Palace', description: 'Tudor-style royal palace with 45,000 sq ft area', category: 'Heritage', entryFee: '₹230', timings: '10 AM – 5:30 PM' }
    ],
    popularFor: ['IT industry', 'Pub street', 'Gardens', 'Start-up culture', 'Craft beer'],
    travelTips: ['Visit Nandi Hills for early morning sunrise views', 'Explore Indiranagar and Koramangala for food and nightlife']
  },
  {
    name: 'Chennai', city: 'Chennai', state: 'Tamil Nadu', category: 'City',
    description: 'Chennai, the cultural capital of South India, is known for its classical Carnatic music, Bharatanatyam dance, ancient Dravidian temples, long Marina Beach, and authentic South Indian cuisine. It is also a gateway to Tamil Nadu\'s temple circuit.',
    shortDescription: 'Cultural capital of South India — temples, music, and Marina Beach.',
    bestTimeToVisit: 'November to February', climate: 'Tropical wet and dry', language: 'Tamil',
    coordinates: { lat: 13.0827, lng: 80.2707 }, averageBudgetPerDay: 2000,
    rating: 4.3, tags: ['marina beach', 'dravidian temples', 'carnatic music', 'tamil', 'south india'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Marina_Beach_Chennai.jpg/1280px-Marina_Beach_Chennai.jpg',
    attractions: [
      { name: 'Marina Beach', description: 'World\'s second longest urban beach at 13km', category: 'Beach', entryFee: 'Free', timings: 'Open all day' },
      { name: 'Kapaleeshwarar Temple', description: 'Ancient Dravidian temple in Mylapore', category: 'Religious', entryFee: 'Free', timings: '5:30 AM – 12 PM, 4 PM – 9:30 PM' },
      { name: 'Fort St. George', description: 'First English fort in India (1644)', category: 'Heritage', entryFee: '₹15', timings: '9 AM – 5 PM' }
    ],
    popularFor: ['Marina Beach', 'South Indian food', 'Silk sarees', 'Classical arts'],
    travelTips: ['Avoid Marina Beach in heavy monsoon season', 'Try filter coffee and idli-sambar at local restaurants']
  }
];

// ─── HOTELS DATA ──────────────────────────────────────────────────────────────
const hotels = [
  // Warangal
  { name: 'Hotel Ratna', city: 'Warangal', state: 'Telangana', type: 'Budget', pricePerNight: 600, rating: 3.8, description: 'Clean, comfortable budget hotel near Warangal railway station.', amenities: ['WiFi', 'AC', 'TV'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Station Road, Warangal' },
  { name: 'Suprabha Hotel', city: 'Warangal', state: 'Telangana', type: 'Mid-Range', pricePerNight: 1200, rating: 4.0, description: 'Popular mid-range hotel with restaurant, close to Thousand Pillar Temple.', amenities: ['WiFi', 'AC', 'TV', 'Restaurant', 'Parking'], travellerTypes: ['Family', 'Solo', 'Business'], address: 'Hanamkonda, Warangal' },
  { name: 'Kakatiya Residency', city: 'Warangal', state: 'Telangana', type: 'Mid-Range', pricePerNight: 1800, rating: 4.2, description: 'Heritage-themed hotel near the Kakatiya monuments with modern amenities.', amenities: ['WiFi', 'AC', 'TV', 'Restaurant', 'Room Service', 'Parking'], travellerTypes: ['Family', 'Business', 'Couple'], address: 'Hanmakonda Road, Warangal' },
  { name: 'Budget Inn Warangal', city: 'Warangal', state: 'Telangana', type: 'Budget', pricePerNight: 450, rating: 3.5, description: 'Very affordable lodging ideal for students and backpackers.', amenities: ['WiFi', 'Fan', 'TV'], travellerTypes: ['Student', 'Solo'], address: 'Bus Stand Area, Warangal' },
  // Hyderabad
  { name: 'Golconda Hotel', city: 'Hyderabad', state: 'Telangana', type: 'Luxury', pricePerNight: 5000, rating: 4.7, description: 'Five-star hotel with stunning views of Hussain Sagar Lake and rooftop restaurant.', amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Parking', 'Bar'], travellerTypes: ['Business', 'Couple', 'Family'], address: 'HITECH City, Hyderabad' },
  { name: 'Pearl Guest House', city: 'Hyderabad', state: 'Telangana', type: 'Budget', pricePerNight: 800, rating: 3.7, description: 'Comfortable budget stay near Charminar in the old city.', amenities: ['WiFi', 'AC', 'TV'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Abids, Hyderabad' },
  { name: 'Deccan Heritage Inn', city: 'Hyderabad', state: 'Telangana', type: 'Mid-Range', pricePerNight: 2200, rating: 4.3, description: 'Well-located hotel close to Charminar, Golconda, and major IT hubs.', amenities: ['WiFi', 'AC', 'Restaurant', 'Parking', 'Room Service'], travellerTypes: ['Business', 'Family', 'Couple'], address: 'Banjara Hills, Hyderabad' },
  // Goa
  { name: 'Calangute Beach Resort', city: 'Panaji', state: 'Goa', type: 'Resort', pricePerNight: 3500, rating: 4.5, description: 'Beautiful resort steps from Calangute Beach with pool and sea view rooms.', amenities: ['WiFi', 'AC', 'Pool', 'Restaurant', 'Bar', 'Beach Access', 'Parking'], travellerTypes: ['Family', 'Couple', 'Solo'], address: 'Calangute, Goa' },
  { name: 'Old Goa Hostel', city: 'Panaji', state: 'Goa', type: 'Hostel', pricePerNight: 600, rating: 4.0, description: 'Vibrant backpacker hostel in Old Goa, close to basilica and spice markets.', amenities: ['WiFi', 'Common Kitchen', 'Lockers', 'Common Area'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Old Goa Road, Panaji' },
  { name: 'Beach Shack Villa', city: 'Panaji', state: 'Goa', type: 'Guesthouse', pricePerNight: 1800, rating: 4.2, description: 'Charming villa with tropical garden near Baga Beach.', amenities: ['WiFi', 'AC', 'Breakfast'], travellerTypes: ['Couple', 'Family', 'Solo'], address: 'Baga, North Goa' },
  // Delhi
  { name: 'Delhi Budget Stays', city: 'New Delhi', state: 'Delhi', type: 'Budget', pricePerNight: 800, rating: 3.6, description: 'Affordable accommodation in central Delhi, near India Gate and Metro.', amenities: ['WiFi', 'AC', 'TV'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Paharganj, New Delhi' },
  { name: 'Heritage Haveli Delhi', city: 'New Delhi', state: 'Delhi', type: 'Mid-Range', pricePerNight: 2800, rating: 4.4, description: 'Colonial-era haveli converted into a boutique hotel in Old Delhi.', amenities: ['WiFi', 'AC', 'Restaurant', 'Rooftop', 'Heritage Decor'], travellerTypes: ['Couple', 'Family', 'Business'], address: 'Old Delhi, New Delhi' },
  // Jaipur
  { name: 'Pink City Guesthouse', city: 'Jaipur', state: 'Rajasthan', type: 'Guesthouse', pricePerNight: 900, rating: 4.0, description: 'Colourful guesthouse in the heart of the old city near Hawa Mahal.', amenities: ['WiFi', 'AC', 'Rooftop Terrace', 'Breakfast'], travellerTypes: ['Student', 'Solo', 'Couple'], address: 'Near Hawa Mahal, Jaipur' },
  { name: 'Rajputana Palace Hotel', city: 'Jaipur', state: 'Rajasthan', type: 'Luxury', pricePerNight: 6000, rating: 4.8, description: 'Heritage palace hotel with royal Rajput interiors, pool, and spa.', amenities: ['WiFi', 'AC', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Heritage Decor', 'Parking'], travellerTypes: ['Couple', 'Family', 'Business'], address: 'Civil Lines, Jaipur' },
  // Agra
  { name: 'Taj Ganj Lodge', city: 'Agra', state: 'Uttar Pradesh', type: 'Budget', pricePerNight: 700, rating: 3.8, description: 'Simple, clean budget hotel with partial Taj Mahal views.', amenities: ['WiFi', 'AC', 'TV', 'Breakfast'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Taj Ganj, Agra' },
  { name: 'Mughal Heritage Inn', city: 'Agra', state: 'Uttar Pradesh', type: 'Mid-Range', pricePerNight: 2500, rating: 4.3, description: 'Lovely heritage inn near the Taj Mahal with Mughal-inspired interiors.', amenities: ['WiFi', 'AC', 'Restaurant', 'Rooftop with Taj View', 'Room Service'], travellerTypes: ['Couple', 'Family', 'Business'], address: 'Near Taj East Gate, Agra' },
  // Manali
  { name: 'Snow View Cottage', city: 'Manali', state: 'Himachal Pradesh', type: 'Guesthouse', pricePerNight: 1200, rating: 4.1, description: 'Cosy pine wood cottage with mountain views in Old Manali.', amenities: ['WiFi', 'Heater', 'Mountain View', 'Bonfire'], travellerTypes: ['Couple', 'Family', 'Solo', 'Student'], address: 'Old Manali, Himachal Pradesh' },
  { name: 'Himalayan Backpacker Hostel', city: 'Manali', state: 'Himachal Pradesh', type: 'Hostel', pricePerNight: 500, rating: 4.2, description: 'Popular backpacker hostel with dorm beds and great mountain views.', amenities: ['WiFi', 'Common Kitchen', 'Lockers', 'Dorm Beds', 'Bonfire'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Vashisht Village, Manali' },
  // Varanasi
  { name: 'Ganges View Hotel', city: 'Varanasi', state: 'Uttar Pradesh', type: 'Mid-Range', pricePerNight: 1600, rating: 4.4, description: 'Elegant hotel directly overlooking the Ganges with Aarti viewing terrace.', amenities: ['WiFi', 'AC', 'Restaurant', 'Ghat View', 'Room Service'], travellerTypes: ['Family', 'Couple', 'Solo', 'Senior'], address: 'Assi Ghat, Varanasi' },
  { name: 'Kashi Guest House', city: 'Varanasi', state: 'Uttar Pradesh', type: 'Budget', pricePerNight: 600, rating: 3.7, description: 'Budget guesthouse in the old city near the main ghats.', amenities: ['WiFi', 'Fan', 'Ghat Walk Distance'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Near Dashashwamedh Ghat, Varanasi' },
  // Srinagar
  { name: 'Dal Lake Houseboat', city: 'Srinagar', state: 'Jammu & Kashmir', type: 'Homestay', pricePerNight: 3000, rating: 4.6, description: 'Authentic traditional houseboat on Dal Lake — a unique Kashmiri experience.', amenities: ['WiFi', 'Breakfast Included', 'Shikara Service', 'Lake View'], travellerTypes: ['Couple', 'Family', 'Solo', 'Senior'], address: 'Dal Lake, Srinagar' },
  // Munnar
  { name: 'Tea Estate Bungalow', city: 'Munnar', state: 'Kerala', type: 'Resort', pricePerNight: 4000, rating: 4.7, description: 'Luxury bungalow in the middle of tea plantations with valley views.', amenities: ['WiFi', 'Fireplace', 'Breakfast', 'Tea Estate Tour', 'Parking'], travellerTypes: ['Couple', 'Family', 'Senior'], address: 'Chinnakanal, Munnar' },
  // Leh
  { name: 'Ladakhi Guest House', city: 'Leh', state: 'Ladakh', type: 'Guesthouse', pricePerNight: 1500, rating: 4.3, description: 'Traditional Ladakhi homestay with mountain views and home-cooked meals.', amenities: ['WiFi', 'Heater', 'Home-cooked meals', 'Mountain View'], travellerTypes: ['Solo', 'Couple', 'Student', 'Family'], address: 'Main Bazaar, Leh' },
  // Coorg
  { name: 'Coorg Coffee Homestay', city: 'Madikeri', state: 'Karnataka', type: 'Homestay', pricePerNight: 2500, rating: 4.6, description: 'Charming homestay on a working coffee estate in the heart of Coorg.', amenities: ['WiFi', 'Breakfast', 'Coffee Estate Tour', 'Birdwatching'], travellerTypes: ['Couple', 'Family', 'Senior', 'Solo'], address: 'Siddapura, Coorg' },
  // Tirupati
  { name: 'Pilgrim Rest House', city: 'Tirupati', state: 'Andhra Pradesh', type: 'Budget', pricePerNight: 800, rating: 3.9, description: 'Clean, comfortable budget accommodation for pilgrims visiting Tirumala.', amenities: ['WiFi', 'AC', 'TV', 'Vegetarian Restaurant'], travellerTypes: ['Student', 'Family', 'Senior', 'Solo'], address: 'TP Area, Tirupati' },
  // Andaman
  { name: 'Island Paradise Resort', city: 'Port Blair', state: 'Andaman & Nicobar Islands', type: 'Resort', pricePerNight: 5500, rating: 4.8, description: 'Stunning beachfront resort in Havelock Island with sea-view cottages.', amenities: ['WiFi', 'AC', 'Pool', 'Beach Access', 'Restaurant', 'Snorkelling', 'Kayaking'], travellerTypes: ['Couple', 'Family', 'Solo', 'Business'], address: 'Havelock Island, Andaman' },

  // Guntur
  { name: 'Hotel Minerva Grand', city: 'Guntur', state: 'Andhra Pradesh', type: 'Mid-Range', pricePerNight: 1800, rating: 4.2, description: 'Premium hotel in Guntur city centre with excellent South Indian cuisine and business facilities.', amenities: ['WiFi', 'AC', 'Restaurant', 'Parking', 'Room Service', 'TV'], travellerTypes: ['Business', 'Family', 'Couple'], address: 'Brodipet, Guntur' },
  { name: 'Krishna Residency', city: 'Guntur', state: 'Andhra Pradesh', type: 'Budget', pricePerNight: 700, rating: 3.8, description: 'Affordable and clean hotel near Guntur bus station, ideal for budget travellers.', amenities: ['WiFi', 'AC', 'TV', 'Parking'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Bus Stand Road, Guntur' },
  { name: 'GRT Regency', city: 'Guntur', state: 'Andhra Pradesh', type: 'Mid-Range', pricePerNight: 2200, rating: 4.4, description: 'Modern hotel with spacious rooms and a popular multi-cuisine restaurant in Guntur.', amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Parking', 'Room Service'], travellerTypes: ['Business', 'Family', 'Couple', 'Solo'], address: 'Arundelpet, Guntur' },
  { name: 'Sriraam Residency', city: 'Guntur', state: 'Andhra Pradesh', type: 'Budget', pricePerNight: 550, rating: 3.6, description: 'Simple, no-frills accommodation close to temples and local markets in Guntur.', amenities: ['WiFi', 'AC', 'TV'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Naaz Centre, Guntur' },

  // Vijayawada
  { name: 'Hotel Manorama', city: 'Vijayawada', state: 'Andhra Pradesh', type: 'Mid-Range', pricePerNight: 1600, rating: 4.1, description: 'Well-established hotel near Kanaka Durga Temple with river views and multi-cuisine dining.', amenities: ['WiFi', 'AC', 'Restaurant', 'Parking', 'TV', 'Room Service'], travellerTypes: ['Family', 'Business', 'Solo'], address: 'Governorpet, Vijayawada' },
  { name: 'Raj Towers', city: 'Vijayawada', state: 'Andhra Pradesh', type: 'Luxury', pricePerNight: 4500, rating: 4.6, description: 'Upscale hotel on the Krishna riverside with panoramic views and rooftop pool.', amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Bar', 'Spa', 'Parking'], travellerTypes: ['Business', 'Couple', 'Family'], address: 'Bandar Road, Vijayawada' },
  { name: 'Swarna Palace', city: 'Vijayawada', state: 'Andhra Pradesh', type: 'Budget', pricePerNight: 800, rating: 3.7, description: 'Budget hotel near Vijayawada railway station, clean rooms at affordable rates.', amenities: ['WiFi', 'AC', 'TV', 'Parking'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Station Road, Vijayawada' },

  // Visakhapatnam
  { name: 'The Park Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh', type: 'Luxury', pricePerNight: 6000, rating: 4.7, description: 'Beachfront luxury hotel with stunning Bay of Bengal views, infinity pool, and fine dining.', amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Beach Access'], travellerTypes: ['Business', 'Couple', 'Family'], address: 'Beach Road, Visakhapatnam' },
  { name: 'Hotel Daspalla', city: 'Visakhapatnam', state: 'Andhra Pradesh', type: 'Mid-Range', pricePerNight: 2800, rating: 4.3, description: 'City-centre hotel with ocean views, popular for weddings and corporate events.', amenities: ['WiFi', 'AC', 'Restaurant', 'Banquet Hall', 'Parking', 'Gym'], travellerTypes: ['Business', 'Family', 'Couple'], address: 'Suryabagh, Visakhapatnam' },
  { name: 'Beach View Budget Inn', city: 'Visakhapatnam', state: 'Andhra Pradesh', type: 'Budget', pricePerNight: 900, rating: 3.9, description: 'Affordable stays near RK Beach, perfect for families and solo travellers.', amenities: ['WiFi', 'AC', 'TV', 'Parking'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Lawsons Bay Colony, Visakhapatnam' },

  // Chennai
  { name: 'The Taj Connemara', city: 'Chennai', state: 'Tamil Nadu', type: 'Luxury', pricePerNight: 8000, rating: 4.8, description: 'Heritage luxury hotel in the heart of Chennai, blending colonial architecture with modern comforts.', amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking'], travellerTypes: ['Business', 'Couple', 'Family'], address: 'Binny Road, Chennai' },
  { name: 'Hotel Palmgrove', city: 'Chennai', state: 'Tamil Nadu', type: 'Mid-Range', pricePerNight: 2500, rating: 4.2, description: 'Centrally located hotel near Marina Beach with South Indian and continental dining.', amenities: ['WiFi', 'AC', 'Restaurant', 'Parking', 'Room Service'], travellerTypes: ['Business', 'Family', 'Solo'], address: 'Nungambakkam, Chennai' },
  { name: 'Marina Backpackers Hostel', city: 'Chennai', state: 'Tamil Nadu', type: 'Hostel', pricePerNight: 600, rating: 4.0, description: 'Budget-friendly hostel near Marina Beach, popular with solo travellers and students.', amenities: ['WiFi', 'Lockers', 'Common Kitchen', 'Common Area'], travellerTypes: ['Student', 'Solo'], address: 'Triplicane, Chennai' },
  { name: 'Royal Chennai Inn', city: 'Chennai', state: 'Tamil Nadu', type: 'Budget', pricePerNight: 950, rating: 3.8, description: 'Clean, comfortable budget hotel near Chennai Central railway station.', amenities: ['WiFi', 'AC', 'TV', 'Parking'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Park Town, Chennai' },

  // Bangalore
  { name: 'The Leela Palace Bengaluru', city: 'Bangalore', state: 'Karnataka', type: 'Luxury', pricePerNight: 12000, rating: 4.9, description: 'Ultra-luxury 5-star hotel with opulent interiors, award-winning dining, and world-class spa.', amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Concierge', 'Parking'], travellerTypes: ['Business', 'Couple', 'Family'], address: 'HAL Airport Road, Bangalore' },
  { name: 'Treebo Trend Bangalore', city: 'Bangalore', state: 'Karnataka', type: 'Mid-Range', pricePerNight: 2000, rating: 4.1, description: 'Modern business hotel in Koramangala with comfortable rooms and co-working spaces.', amenities: ['WiFi', 'AC', 'TV', 'Parking', 'Co-working Space'], travellerTypes: ['Business', 'Solo', 'Couple'], address: 'Koramangala, Bangalore' },
  { name: 'Zostel Bangalore', city: 'Bangalore', state: 'Karnataka', type: 'Hostel', pricePerNight: 550, rating: 4.3, description: 'India\'s most popular hostel chain — vibrant social space near Indiranagar.', amenities: ['WiFi', 'Lockers', 'Common Kitchen', 'Bar', 'Social Events'], travellerTypes: ['Student', 'Solo'], address: 'Indiranagar, Bangalore' },
  { name: 'Lemon Tree Bangalore', city: 'Bangalore', state: 'Karnataka', type: 'Mid-Range', pricePerNight: 3500, rating: 4.4, description: 'Fresh, contemporary hotel near Electronic City with cheerful interiors and great breakfast.', amenities: ['WiFi', 'AC', 'Pool', 'Restaurant', 'Gym', 'Parking'], travellerTypes: ['Business', 'Family', 'Solo'], address: 'Electronic City, Bangalore' },

  // Pune
  { name: 'JW Marriott Pune', city: 'Pune', state: 'Maharashtra', type: 'Luxury', pricePerNight: 9000, rating: 4.8, description: 'International luxury hotel in Senapati Bapat Road with multiple restaurants and rooftop pool.', amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Concierge'], travellerTypes: ['Business', 'Couple', 'Family'], address: 'Senapati Bapat Road, Pune' },
  { name: 'Hotel Sunderban', city: 'Pune', state: 'Maharashtra', type: 'Mid-Range', pricePerNight: 2200, rating: 4.2, description: 'Comfortable hotel near Koregaon Park, popular with tourists visiting Osho Ashram.', amenities: ['WiFi', 'AC', 'Restaurant', 'Parking', 'Room Service'], travellerTypes: ['Family', 'Solo', 'Couple'], address: 'Koregaon Park, Pune' },
  { name: 'Gokhale Nagar Guesthouse', city: 'Pune', state: 'Maharashtra', type: 'Budget', pricePerNight: 750, rating: 3.7, description: 'Affordable guesthouse near Shivajinagar, easy access to Pune university area.', amenities: ['WiFi', 'AC', 'TV'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Shivajinagar, Pune' },

  // Kolkata
  { name: 'The Oberoi Grand Kolkata', city: 'Kolkata', state: 'West Bengal', type: 'Luxury', pricePerNight: 9500, rating: 4.8, description: 'Colonial-era grand hotel on Jawaharlal Nehru Road with magnificent interiors and butler service.', amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Butler Service'], travellerTypes: ['Business', 'Couple', 'Family'], address: 'Jawaharlal Nehru Road, Kolkata' },
  { name: 'Peerless Inn Kolkata', city: 'Kolkata', state: 'West Bengal', type: 'Mid-Range', pricePerNight: 2800, rating: 4.3, description: 'Heritage hotel near Victoria Memorial with excellent Bengali cuisine.', amenities: ['WiFi', 'AC', 'Restaurant', 'Parking', 'Room Service', 'Gym'], travellerTypes: ['Business', 'Family', 'Couple'], address: 'Chowringhee Road, Kolkata' },
  { name: 'Broadway Hotel Kolkata', city: 'Kolkata', state: 'West Bengal', type: 'Budget', pricePerNight: 850, rating: 3.8, description: 'Vintage budget hotel in old Kolkata, walking distance from BBD Bagh.', amenities: ['WiFi', 'AC', 'TV', 'Restaurant'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Ganesh Chandra Avenue, Kolkata' },

  // Ahmedabad
  { name: 'Hyatt Regency Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', type: 'Luxury', pricePerNight: 7000, rating: 4.7, description: 'International luxury hotel near Sabarmati Riverfront with rooftop dining and spa.', amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Concierge'], travellerTypes: ['Business', 'Couple', 'Family'], address: 'SG Road, Ahmedabad' },
  { name: 'Zostel Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', type: 'Hostel', pricePerNight: 500, rating: 4.2, description: 'Vibrant backpacker hostel near the Sabarmati Ashram, great for budget travellers.', amenities: ['WiFi', 'Lockers', 'Common Kitchen', 'Common Area'], travellerTypes: ['Student', 'Solo'], address: 'Ashram Road, Ahmedabad' },
  { name: 'Hotel Comfort Inn Sabari', city: 'Ahmedabad', state: 'Gujarat', type: 'Mid-Range', pricePerNight: 2400, rating: 4.1, description: 'Mid-range hotel in central Ahmedabad with Gujarati thali restaurant.', amenities: ['WiFi', 'AC', 'Restaurant', 'Parking', 'Room Service'], travellerTypes: ['Business', 'Family', 'Solo'], address: 'CG Road, Ahmedabad' },

  // Srinagar
  { name: 'Vivanta Srinagar', city: 'Srinagar', state: 'Jammu & Kashmir', type: 'Luxury', pricePerNight: 8500, rating: 4.7, description: 'Luxury hotel with panoramic views of Dal Lake and snow-capped Zabarwan hills.', amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Spa', 'Shikara Service', 'Heater'], travellerTypes: ['Business', 'Couple', 'Family'], address: 'Boulevard Road, Srinagar' },
  { name: 'Houseboat New Number One', city: 'Srinagar', state: 'Jammu & Kashmir', type: 'Homestay', pricePerNight: 2500, rating: 4.5, description: 'Classic cedar-wood houseboat on Dal Lake with Shikara pickup and home-cooked Kashmiri meals.', amenities: ['WiFi', 'Heater', 'Breakfast Included', 'Shikara Service', 'Lake View'], travellerTypes: ['Couple', 'Family', 'Solo', 'Senior'], address: 'Dal Lake Boulevard, Srinagar' },
  { name: 'Bund Residency Srinagar', city: 'Srinagar', state: 'Jammu & Kashmir', type: 'Mid-Range', pricePerNight: 2200, rating: 4.1, description: 'Comfortable hotel on the Jhelum river bank, walking distance from Lal Chowk.', amenities: ['WiFi', 'AC', 'Heater', 'Restaurant', 'Parking'], travellerTypes: ['Business', 'Family', 'Solo'], address: 'Residency Road, Srinagar' },

  // Rishikesh
  { name: 'Aloha on the Ganges', city: 'Rishikesh', state: 'Uttarakhand', type: 'Resort', pricePerNight: 4500, rating: 4.6, description: 'Riverside resort with yoga pavilion, Ganga views, and organic restaurant.', amenities: ['WiFi', 'Restaurant', 'Yoga', 'River View', 'Meditation', 'Parking'], travellerTypes: ['Couple', 'Family', 'Solo', 'Senior'], address: 'Tapovan, Rishikesh' },
  { name: 'Zostel Rishikesh', city: 'Rishikesh', state: 'Uttarakhand', type: 'Hostel', pricePerNight: 450, rating: 4.4, description: 'Popular backpacker hostel near Laxman Jhula with river views and trekking info.', amenities: ['WiFi', 'Lockers', 'Common Area', 'River View', 'Social Events'], travellerTypes: ['Student', 'Solo'], address: 'Laxman Jhula, Rishikesh' },
  { name: 'Divine Ganga Cottages', city: 'Rishikesh', state: 'Uttarakhand', type: 'Guesthouse', pricePerNight: 1500, rating: 4.3, description: 'Cosy riverside cottages with private sit-outs, perfect for yoga and meditation retreats.', amenities: ['WiFi', 'Breakfast', 'Ganga View', 'Yoga Classes'], travellerTypes: ['Solo', 'Couple', 'Senior'], address: 'Swarg Ashram, Rishikesh' },

  // Ooty
  { name: 'Savoy Hotel Ooty', city: 'Ooty', state: 'Tamil Nadu', type: 'Luxury', pricePerNight: 7000, rating: 4.7, description: 'Colonial 1829 heritage hotel with cottages set in six acres of private gardens.', amenities: ['WiFi', 'Restaurant', 'Garden', 'Heater', 'Heritage Decor', 'Parking'], travellerTypes: ['Couple', 'Family', 'Senior'], address: 'Sylks Road, Ooty' },
  { name: 'YWCA Anandagiri Ooty', city: 'Ooty', state: 'Tamil Nadu', type: 'Budget', pricePerNight: 900, rating: 3.9, description: 'Simple hill-station accommodation with garden views, popular with students and families.', amenities: ['WiFi', 'Heater', 'Breakfast', 'Garden'], travellerTypes: ['Student', 'Family', 'Solo'], address: 'Ettines Road, Ooty' },
  { name: 'Tea Nest Ooty', city: 'Ooty', state: 'Tamil Nadu', type: 'Resort', pricePerNight: 5500, rating: 4.6, description: 'Boutique resort surrounded by tea plantations with valley views and guided tea walks.', amenities: ['WiFi', 'Heater', 'Breakfast', 'Tea Estate Walk', 'Mountain View'], travellerTypes: ['Couple', 'Family', 'Senior'], address: 'Kodanad Estate, Ooty' },

  // Udaipur
  { name: 'Taj Lake Palace Udaipur', city: 'Udaipur', state: 'Rajasthan', type: 'Luxury', pricePerNight: 25000, rating: 4.9, description: 'Iconic white marble palace hotel floating on Lake Pichola — one of India\'s most romantic hotels.', amenities: ['WiFi', 'AC', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Lake View', 'Boat Transfer'], travellerTypes: ['Couple', 'Business', 'Family'], address: 'Lake Pichola, Udaipur' },
  { name: 'Nukkad Guesthouse Udaipur', city: 'Udaipur', state: 'Rajasthan', type: 'Budget', pricePerNight: 800, rating: 4.1, description: 'Charming rooftop guesthouse with lake views in the old city, very popular with backpackers.', amenities: ['WiFi', 'AC', 'Rooftop Terrace', 'Breakfast', 'Lake View'], travellerTypes: ['Student', 'Solo', 'Couple'], address: 'Gangaur Ghat, Udaipur' },
  { name: 'Amet Haveli Udaipur', city: 'Udaipur', state: 'Rajasthan', type: 'Mid-Range', pricePerNight: 3500, rating: 4.5, description: 'Heritage haveli on Lake Pichola waterfront with rooftop restaurant and sunset views.', amenities: ['WiFi', 'AC', 'Restaurant', 'Lake View', 'Heritage Decor'], travellerTypes: ['Couple', 'Family', 'Solo'], address: 'Hanuman Ghat, Udaipur' },

  // Mysuru
  { name: 'Royal Orchid Metropole Mysuru', city: 'Mysuru', state: 'Karnataka', type: 'Luxury', pricePerNight: 6500, rating: 4.7, description: 'Heritage hotel built in 1920 with colonial architecture, royal decor, and lush gardens.', amenities: ['WiFi', 'AC', 'Pool', 'Restaurant', 'Bar', 'Spa', 'Parking', 'Heritage Decor'], travellerTypes: ['Business', 'Couple', 'Family'], address: 'Jhansi Lakshmibai Road, Mysuru' },
  { name: 'Zostel Mysore', city: 'Mysuru', state: 'Karnataka', type: 'Hostel', pricePerNight: 500, rating: 4.2, description: 'Clean and social hostel near Mysore Palace with bicycle rentals and city tours.', amenities: ['WiFi', 'Lockers', 'Common Kitchen', 'Cycle Rental'], travellerTypes: ['Student', 'Solo'], address: 'Sayyaji Rao Road, Mysuru' },
  { name: 'Hotel Dasaprakash Mysuru', city: 'Mysuru', state: 'Karnataka', type: 'Mid-Range', pricePerNight: 1800, rating: 4.0, description: 'Well-known vegetarian hotel near Mysore Palace with famous South Indian thali.', amenities: ['WiFi', 'AC', 'Restaurant', 'Parking'], travellerTypes: ['Family', 'Solo', 'Senior'], address: 'Gandhi Square, Mysuru' },

  // Kochi
  { name: 'Casino Hotel Kochi', city: 'Kochi', state: 'Kerala', type: 'Luxury', pricePerNight: 7500, rating: 4.6, description: 'Waterfront luxury hotel with stunning harbour views, rooftop pool, and Kerala cuisine.', amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Bar', 'Harbour View', 'Parking'], travellerTypes: ['Business', 'Couple', 'Family'], address: 'Wellington Island, Kochi' },
  { name: 'Fort House Kochi', city: 'Kochi', state: 'Kerala', type: 'Guesthouse', pricePerNight: 2200, rating: 4.4, description: 'Boutique guesthouse at the Chinese fishing nets waterfront, great for photography and heritage walks.', amenities: ['WiFi', 'AC', 'Breakfast', 'Waterfront View', 'Heritage Decor'], travellerTypes: ['Couple', 'Solo', 'Senior'], address: 'Fort Kochi, Kochi' },
  { name: 'Zostel Kochi', city: 'Kochi', state: 'Karnataka', type: 'Hostel', pricePerNight: 600, rating: 4.3, description: 'Social backpacker hostel in Fort Kochi, close to Chinese fishing nets and museums.', amenities: ['WiFi', 'Lockers', 'Common Kitchen', 'Common Area'], travellerTypes: ['Student', 'Solo'], address: 'Fort Kochi, Kochi' },

  // Nainital
  { name: 'The Naini Retreat', city: 'Nainital', state: 'Uttarakhand', type: 'Luxury', pricePerNight: 8000, rating: 4.7, description: 'Heritage luxury hotel perched above Naini Lake with panoramic Himalayan views.', amenities: ['WiFi', 'Heater', 'Restaurant', 'Lake View', 'Garden', 'Spa', 'Parking'], travellerTypes: ['Couple', 'Family', 'Senior'], address: 'Ayarpatta, Nainital' },
  { name: 'Sher-Ka-Danda Hostel', city: 'Nainital', state: 'Uttarakhand', type: 'Budget', pricePerNight: 700, rating: 3.9, description: 'Budget guesthouse with hillside views, easy walking distance from Naini Lake.', amenities: ['WiFi', 'Heater', 'TV'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Mallital, Nainital' },

  // Bhopal
  { name: 'Hotel Jehan Numa Palace', city: 'Bhopal', state: 'Madhya Pradesh', type: 'Luxury', pricePerNight: 5500, rating: 4.6, description: 'British-era heritage palace hotel set in 4 acres of landscaped gardens in Bhopal.', amenities: ['WiFi', 'AC', 'Pool', 'Restaurant', 'Bar', 'Heritage Decor', 'Parking'], travellerTypes: ['Business', 'Couple', 'Family'], address: 'Shamla Hills, Bhopal' },
  { name: 'Hotel Ranjit Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', type: 'Budget', pricePerNight: 800, rating: 3.7, description: 'Budget hotel near Bhopal railway station, good base for exploring Upper Lake.', amenities: ['WiFi', 'AC', 'TV', 'Parking'], travellerTypes: ['Student', 'Solo', 'Family'], address: 'Hamidia Road, Bhopal' },

  // Chandigarh
  { name: 'JW Marriott Chandigarh', city: 'Chandigarh', state: 'Punjab', type: 'Luxury', pricePerNight: 8000, rating: 4.8, description: 'Contemporary luxury hotel in Sector 35 with rooftop bar and international dining.', amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking'], travellerTypes: ['Business', 'Couple', 'Family'], address: 'Sector 35, Chandigarh' },
  { name: 'Hotel Shivalik View', city: 'Chandigarh', state: 'Punjab', type: 'Mid-Range', pricePerNight: 2500, rating: 4.2, description: 'Government-run hotel in the planned city centre with views of the Shivalik hills.', amenities: ['WiFi', 'AC', 'Restaurant', 'Parking', 'Room Service'], travellerTypes: ['Business', 'Family', 'Solo'], address: 'Sector 17, Chandigarh' }
];

// ─── LOCAL BUSINESSES DATA ────────────────────────────────────────────────────
const businesses = [
  { name: 'Warangal Lacquer Crafts', category: 'Handicrafts', city: 'Warangal', state: 'Telangana', description: 'Authentic Kakatiya-style lacquerware and traditional Telugu handicrafts made by local artisans.', products: ['Lacquerware toys', 'Wooden figurines', 'Traditional paintings'], contactPhone: '+91-9876543210', rating: 4.5, tags: ['lacquerware', 'kakatiya', 'handmade', 'souvenirs'] },
  { name: 'Nirmal Arts Emporium', category: 'Handicrafts', city: 'Nirmal', state: 'Telangana', description: 'Government-registered emporium for authentic Nirmal lacquerware — the famous black-and-gold folk art of Telangana.', products: ['Nirmal paintings', 'Lacquerware', 'Wooden toys', 'Decorative items'], contactPhone: '+91-9876543211', rating: 4.8, tags: ['nirmal', 'lacquerware', 'folk art', 'government emporium'] },
  { name: 'Hyderabadi Biryani House', category: 'Food & Beverages', city: 'Hyderabad', state: 'Telangana', description: 'Authentic dum biryani cooked over slow fire using traditional recipes passed down 3 generations.', products: ['Hyderabadi Dum Biryani', 'Haleem', 'Kebabs', 'Sheer Khurma'], contactPhone: '+91-9876543212', rating: 4.9, tags: ['biryani', 'hyderabadi', 'authentic', 'restaurant'] },
  { name: 'Goa Spice Garden Tour', category: 'Experience', city: 'Panaji', state: 'Goa', description: 'Guided tour of a working spice plantation — taste fresh spices, see exotic birds, enjoy traditional Goan lunch.', products: ['Spice plantation tour', 'Goan lunch', 'Spice packages', 'Elephant ride'], contactPhone: '+91-9876543213', rating: 4.7, tags: ['spice', 'plantation', 'experience', 'goa'] },
  { name: 'Rajasthani Craft Village', category: 'Artisan', city: 'Jaipur', state: 'Rajasthan', description: 'Visit master artisans creating block-printed textiles, blue pottery, and semi-precious stone jewelry.', products: ['Block print textiles', 'Blue pottery', 'Gem jewellery', 'Miniature paintings'], contactPhone: '+91-9876543214', rating: 4.6, tags: ['block print', 'blue pottery', 'jaipur', 'artisan'] },
  { name: 'Kerala Backwater Cruise', category: 'Experience', city: 'Kochi', state: 'Kerala', description: 'Traditional kettuvallam (rice boat) cruises through Kerala\'s famous backwaters with home-cooked meals.', products: ['Houseboat cruise', 'Village tours', 'Traditional Kerala meals', 'Sunset cruise'], contactPhone: '+91-9876543215', rating: 4.8, tags: ['backwaters', 'kettuvallam', 'houseboat', 'kerala'] },
  { name: 'Varanasi Silk Weavers', category: 'Artisan', city: 'Varanasi', state: 'Uttar Pradesh', description: 'Traditional Banarasi silk weavers — watch the intricate handloom process and purchase directly from artisans.', products: ['Banarasi sarees', 'Silk stoles', 'Brocade fabric', 'Custom orders'], contactPhone: '+91-9876543216', rating: 4.7, tags: ['banarasi silk', 'weaving', 'sarees', 'varanasi'] },
  { name: 'Darjeeling Tea Tour', category: 'Experience', city: 'Darjeeling', state: 'West Bengal', description: 'Guided tour of Darjeeling\'s finest tea estates — plucking, processing, and tasting fresh first-flush tea.', products: ['Tea estate tour', 'Tea tasting', 'First flush tea', 'Organic tea packages'], contactPhone: '+91-9876543217', rating: 4.9, tags: ['tea', 'darjeeling', 'first flush', 'estate tour'] },
  { name: 'Manali Adventure Sports', category: 'Experience', city: 'Manali', state: 'Himachal Pradesh', description: 'Full-service adventure operator — paragliding, river rafting, trekking, and camping packages.', products: ['Paragliding', 'River rafting', 'Trekking', 'Camping'], contactPhone: '+91-9876543218', rating: 4.6, tags: ['adventure', 'paragliding', 'rafting', 'manali'] },
  { name: 'Amritsari Kulcha Corner', category: 'Food & Beverages', city: 'Amritsar', state: 'Punjab', description: 'Famous street stall serving piping hot Amritsari kulcha with chole and lassi since 1975.', products: ['Aloo Kulcha', 'Chole Kulche', 'Punjabi Lassi', 'Makki di Roti'], contactPhone: '+91-9876543219', rating: 4.8, tags: ['kulcha', 'amritsar', 'punjabi food', 'authentic'] },
  { name: 'Mysore Silk House', category: 'Local Shop', city: 'Mysuru', state: 'Karnataka', description: 'Government-registered Mysore silk retailer with authentic Mysore crepe silk sarees and handicrafts.', products: ['Mysore silk sarees', 'Sandalwood products', 'Agarbathi', 'Rosewood crafts'], contactPhone: '+91-9876543220', rating: 4.7, tags: ['mysore silk', 'sarees', 'sandalwood', 'government shop'] },
  { name: 'Leh Local Guide Services', category: 'Tour Guide', city: 'Leh', state: 'Ladakh', description: 'Licensed Ladakhi guides for monastery tours, Pangong Lake trips, and trekking expeditions.', products: ['Monastery tours', 'Pangong Lake day trip', 'Nubra Valley tour', 'High altitude trekking'], contactPhone: '+91-9876543221', rating: 4.9, tags: ['guide', 'monastery', 'pangong', 'ladakh'] },
  { name: 'Coorg Estate Coffee Shop', category: 'Food & Beverages', city: 'Madikeri', state: 'Karnataka', description: 'Farm-to-cup coffee experience — fresh-roasted Coorg single-estate coffee served with local snacks.', products: ['Single-origin coffee', 'Coorg honey', 'Cardamom', 'Coffee powder'], contactPhone: '+91-9876543222', rating: 4.8, tags: ['coffee', 'coorg', 'farm to cup', 'organic'] },
  { name: 'Andaman Scuba School', category: 'Experience', city: 'Port Blair', state: 'Andaman & Nicobar Islands', description: 'PADI-certified scuba diving centre for beginners and advanced divers exploring Andaman coral reefs.', products: ['Discover scuba', 'PADI open water course', 'Advanced dives', 'Snorkelling'], contactPhone: '+91-9876543223', rating: 4.9, tags: ['scuba', 'diving', 'coral reefs', 'andaman'] }
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────
async function seed() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  🌱 Camp With Us — Database Seeder');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!MONGO_URI || MONGO_URI.includes('<username>')) {
    console.error('❌  MONGO_URI is not set in .env  — aborting seed.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  Connected to MongoDB');

    // --- Destinations ---
    const existingDests = await Destination.countDocuments();
    if (existingDests >= destinations.length) {
      console.log(`ℹ️   Destinations already seeded (${existingDests} records). Skipping.`);
    } else {
      await Destination.deleteMany({});
      await Destination.collection.dropIndexes().catch(() => {});
      await Destination.syncIndexes().catch(() => {});
      const inserted = await Destination.insertMany(destinations);
      console.log(`✅  Inserted ${inserted.length} destinations`);
    }

    // --- Hotels ---
    const existingHotels = await Hotel.countDocuments();
    if (existingHotels >= hotels.length) {
      console.log(`ℹ️   Hotels already seeded (${existingHotels} records). Skipping.`);
    } else {
      await Hotel.deleteMany({});
      const inserted = await Hotel.insertMany(hotels);
      console.log(`✅  Inserted ${inserted.length} hotels`);
    }

    // --- Local Businesses ---
    const existingBiz = await LocalBusiness.countDocuments();
    if (existingBiz >= businesses.length) {
      console.log(`ℹ️   Businesses already seeded (${existingBiz} records). Skipping.`);
    } else {
      await LocalBusiness.deleteMany({});
      const inserted = await LocalBusiness.insertMany(businesses);
      console.log(`✅  Inserted ${inserted.length} local businesses`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  ✅  Seeding complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed error:', err.message);
    process.exit(1);
  }
}

seed();
