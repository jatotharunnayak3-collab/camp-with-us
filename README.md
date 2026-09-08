# 🏕️ Camp With Us — Smart India Hackathon Tourism Platform
**Travel Smart • Travel Safe**

> Built for SIH 2024 Theme: "Student Innovation — A solution to boost the tourism industry"

---

## ⚡ Quick Start (Run This First)

### Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account (free tier works)
- Google Gemini API key (from https://aistudio.google.com)

---

## Step 1 — Configure Environment Variables

Open `backend/.env` and fill in your actual values:

```
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/campwithus?retryWrites=true&w=majority
GEMINI_API_KEY=AIzaSy...your_actual_key_here
JWT_SECRET=campwithus_jwt_secret_2024_sih_secure_key
NODE_ENV=development
```

**How to get MONGO_URI:**
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Click Connect → Connect your application
4. Copy the connection string, replace `<password>` with your password

**How to get GEMINI_API_KEY:**
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Paste it into GEMINI_API_KEY

---

## Step 2 — Install Backend Dependencies

Open a terminal/PowerShell and run:

```powershell
cd "C:\Users\Suresh\OneDrive\Documents\campwithus\backend"
npm install
```

---

## Step 3 — Seed the Database

```powershell
npm run seed
```

Expected output:
```
✅  Connected to MongoDB
✅  Inserted 30 destinations
✅  Inserted 26 hotels
✅  Inserted 13 local businesses
✅  Seeding complete!
```

---

## Step 4 — Start the Backend

```powershell
npm start
```

Expected output:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🏕️  Camp With Us server running on port 5000
  Travel Smart • Travel Safe
  API: http://localhost:5000/api
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  MongoDB connected successfully
```

Test the backend is running:
- Open browser → http://localhost:5000/api/test
- Should return: `{"success":true,"database":"connected",...}`

---

## Step 5 — Open the Frontend

**Option A — VS Code Live Server (recommended)**
1. Install the "Live Server" extension in VS Code
2. Right-click `frontend/index.html` → "Open with Live Server"
3. It opens at: **http://localhost:5501**

**Option B — Python simple server**
```powershell
cd "C:\Users\Suresh\OneDrive\Documents\campwithus\frontend"
python -m http.server 5501
```
Then open: http://localhost:5501

**Option C — Direct file open**
Open `frontend/index.html` directly in your browser.
*(Note: some browsers block fetch() for file:// URLs — use Live Server instead)*

---

## 🔌 API Endpoints

| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | /                                 | API info                       |
| GET    | /api/test                         | Health check                   |
| GET    | /api/destinations                 | All destinations                |
| GET    | /api/destinations/search?q=       | Search destinations             |
| GET    | /api/destinations/:id             | Single destination              |
| GET    | /api/hotels                       | All hotels                     |
| GET    | /api/hotels/search?city=&budget=  | Search hotels                  |
| POST   | /api/auth/register                | Register user                  |
| POST   | /api/auth/login                   | Login user                     |
| GET    | /api/auth/me                      | Current user (JWT required)    |
| POST   | /api/planner                      | Generate AI itinerary          |
| POST   | /api/ai/hotel-recommendations     | AI hotel matching               |
| POST   | /api/ai/assistant                 | Multilingual AI assistant       |
| GET    | /api/reviews?destination=         | Get reviews                    |
| POST   | /api/reviews                      | Submit review (JWT required)   |
| GET    | /api/businesses?city=&category=   | Local businesses               |
| GET    | /api/safety/numbers               | Emergency contacts             |

---

## 🧪 End-to-End Test Checklist

Run these after startup:

- [ ] http://localhost:5000/api/test returns `{"success":true,"database":"connected"}`
- [ ] http://localhost:5000/api/destinations returns 30 destinations
- [ ] http://localhost:5000/api/hotels/search?city=Warangal&budget=2000 returns hotels
- [ ] Frontend loads at http://localhost:5501
- [ ] Search "Warangal" on hero → destination card appears
- [ ] Click destination → detail page opens
- [ ] Hotels section → search "Warangal" → hotel cards appear
- [ ] Register new account → success toast
- [ ] Login → JWT stored, nav shows user name
- [ ] Planner → fill form → itinerary generated (requires Gemini key)
- [ ] Safety section → emergency numbers load
- [ ] Local businesses → cards load
- [ ] AI assistant → answer returns (requires Gemini key)
- [ ] Browser console → no red errors

---

## 📁 Project Structure

```
campwithus/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── package.json
│   ├── .env                   # ⚠️ Fill this in before running
│   ├── .gitignore
│   ├── seed.js                # Database seeder (npm run seed)
│   ├── models/
│   │   ├── User.js
│   │   ├── Destination.js
│   │   ├── Hotel.js
│   │   ├── Review.js
│   │   ├── LocalBusiness.js
│   │   └── Itinerary.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── destinations.js
│   │   ├── hotels.js
│   │   ├── planner.js
│   │   ├── ai.js
│   │   ├── reviews.js
│   │   ├── businesses.js
│   │   └── safety.js
│   ├── middleware/
│   │   └── auth.js
│   └── services/
│       └── geminiService.js   # Google Gemini AI integration
│
└── frontend/
    ├── index.html             # Complete single-page app
    ├── css/
    │   └── style.css
    └── js/
        ├── config.js          # API_BASE_URL — single source of truth
        ├── ui.js              # Toast, loading, empty states
        ├── auth.js            # JWT auth, session management
        ├── api.js             # All API calls (uses config.js)
        └── app.js             # All UI logic and event handlers
```

---

## ⚠️ Important Notes

- **Demo Data**: Hotel listings and seed destinations are curated demo data for SIH. They are NOT live commercial hotel inventory.
- **Gemini API**: The AI planner and assistant require a valid GEMINI_API_KEY. Without it, non-AI features (destinations, hotels, auth, safety) still work.
- **MongoDB**: Without MONGO_URI, the server starts but all database features fail. Set up a free MongoDB Atlas cluster.
- **Ports**: Backend on 5000, Frontend on 5501. Do not change these without updating `frontend/js/config.js`.

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript   |
| Backend    | Node.js + Express.js              |
| Database   | MongoDB Atlas + Mongoose          |
| AI         | Google Gemini 2.5 Flash (@google/genai) |
| Auth       | JWT + bcryptjs                    |
| Maps       | Google Maps (link-based)          |
