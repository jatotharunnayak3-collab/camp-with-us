require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');

const MONGO_URI = process.env.MONGO_URI;

// ─── CITY DATA ────────────────────────────────────────────────────────────────
const cityData = {
  Hyderabad:  { state: 'Telangana',       coords: { lat: 17.3850, lng: 78.4867 } },
  Panaji:     { state: 'Goa',             coords: { lat: 15.4909, lng: 73.8278 } },
  Jaipur:     { state: 'Rajasthan',       coords: { lat: 26.9124, lng: 75.7873 } },
  Mumbai:     { state: 'Maharashtra',     coords: { lat: 19.0760, lng: 72.8777 } },
  Manali:     { state: 'Himachal Pradesh',coords: { lat: 32.2432, lng: 77.1892 } },
  Bangalore:  { state: 'Karnataka',       coords: { lat: 12.9716, lng: 77.5946 } },
  Warangal:   { state: 'Telangana',       coords: { lat: 17.9784, lng: 79.5941 } },
  Chennai:    { state: 'Tamil Nadu',      coords: { lat: 13.0827, lng: 80.2707 } },
  Varanasi:   { state: 'Uttar Pradesh',   coords: { lat: 25.3176, lng: 82.9739 } },
  Udaipur:    { state: 'Rajasthan',       coords: { lat: 24.5854, lng: 73.7125 } },
  Kolkata:    { state: 'West Bengal',     coords: { lat: 22.5726, lng: 88.3639 } },
  Agra:       { state: 'Uttar Pradesh',   coords: { lat: 27.1767, lng: 78.0081 } },
};

const types    = ['Budget', 'Mid-Range', 'Luxury', 'Hostel', 'Guesthouse', 'Resort', 'Homestay'];
const amenityPool = ['WiFi', 'AC', 'Parking', 'Restaurant', 'Pool', 'Breakfast', 'Gym', 'Spa',
                     'Room Service', 'Laundry', 'Bar', '24-Hour Front Desk', 'Airport Shuttle'];
const travellerPool = ['Student', 'Family', 'Solo', 'Senior', 'Couple', 'Business'];

// ─── PRICE RANGES BY TYPE ─────────────────────────────────────────────────────
const priceRange = {
  'Budget':     [400,  900],
  'Mid-Range':  [900,  3000],
  'Luxury':     [3000, 15000],
  'Hostel':     [300,  700],
  'Guesthouse': [500,  1500],
  'Resort':     [3500, 20000],
  'Homestay':   [400,  1200],
};

// ─── HOTEL NAME TEMPLATES PER CITY ───────────────────────────────────────────
const cityHotelNames = {
  Hyderabad: [
    'Pearl Residency','Golconda Grand','Nizam Palace Hotel','Charminar Inn','Banjara Heights Stay',
    'Hussain Sagar View','Hi-Tech City Lodge','Jubilee Hills Suites','Secunderabad Stay Inn',
    'Rajendra Nagar Comforts','Cyber Pearl Hotel','Old City Heritage Inn','Laad Bazaar Lodge',
    'Paradise Hotel','Taj Falaknuma Clone','HITEC Nest','Gachibowli Business Inn',
    'Begumpet Executive','Ameerpet Comforts','Madhapur Residency','Film Nagar Stay',
    'Kondapur Suites','Kukatpally Inn','Miyapur Lodge','LB Nagar Comforts',
    'Dilsukhnagar Stay','Koti Heritage Hotel','Abids Central Inn','Narayanguda Residency',
    'Mehdipatnam Suites','Toli Chowki Lodge','Shamshabad Airport Inn','Uppal Comforts',
    'Alwal Stay','Malkajgiri Residency','Moosapet Inn','Saroornagar Suites',
    'Vanasthalipuram Lodge','Hayathnagar Comforts','Ghatkesar Inn',
    'Suchitra Circle Stay','Kompally Residency','Medchal Road Inn','Patancheru Suites',
  ],
  Panaji: [
    'Calangute Beach Resort','Baga Breeze Hotel','Arambol Shacks Inn','Anjuna Cliffs Stay',
    'Palolem Paradise','Vagator View Resort','Colva Sands Hotel','Benaulim Palms Inn',
    'Candolim Bay Suites','Old Goa Heritage Stay','Mapusa Market Lodge','Margao Comforts',
    'Vasco Budget Inn','Dona Paula Residency','Fontainhas Colonial Stay','Panaji Riverside Inn',
    'Miramar Beach Lodge','Mandovi Suites','Casino Royale Hotel','Sinquerim Sands',
    'Morjim Turtle Resort','Ashvem Beachside Inn','Querim Tranquil Stay','Siolim Heritage House',
    'Tivim Traveller Inn','Porvorim Highway Hotel','Pernem Eco Lodge','Bicholim Homestay',
    'Sanquelim Comforts','Valpoi Forest Stay','Quepem Hill Inn','Sanguem Village Lodge',
    'Canacona Cliffs Resort','Chapora Fort View Inn','Reis Magos Heritage Stay',
    'Aguada Lighthouse Hotel','Sunset Beach Resort','Tropical Palm Inn','Green Goa Retreat',
    'Sun and Sand Hotel','Blue Lagoon Resort','Coconut Grove Inn','Mango Shade Stay',
    'Peacock Bay Hotel',
  ],
  Jaipur: [
    'Pink City Haveli','Amber Fort View Hotel','Hawa Mahal Inn','Jai Mahal Suites',
    'Rajputana Residency','City Palace Lodge','Jantar Mantar Stay','Nahargarh Nest',
    'Jaigarh Hill Resort','Sisodia Rani Garden Inn','Chokhi Dhani Comforts','Bapu Bazaar Lodge',
    'Johari Bazaar Stay','MI Road Suites','C-Scheme Executive Inn','Malviya Nagar Hotel',
    'Vaishali Nagar Residency','Tonk Road Lodge','Ajmer Road Inn','Delhi Road Suites',
    'Sindhi Camp Comforts','Gandhi Nagar Stay','Raja Park Inn','Mansarovar Hotel',
    'Sanganer Crafts Lodge','Jhotwara Suites','Vidyadhar Nagar Inn','Shastri Nagar Comforts',
    'Gopalpura Hotel','Jagatpura Residency','Murlipura Stay','Pratap Nagar Inn',
    'Adarsh Nagar Lodge','Bani Park Heritage','Civil Lines Executive','Hasanpura Inn',
    'Mahesh Nagar Comforts','Nirman Nagar Stay','Chitrakoot Lodge','Durgapura Suites',
    'Sodala Traveller Inn','Jawahar Nagar Hotel','Transport Nagar Stay','Chambal Valley Lodge',
    'Royal Desert Inn',
  ],
  Mumbai: [
    'Gateway Grand Hotel','Marine Drive Suites','Colaba Heritage Inn','Fort Mumbai Lodge',
    'CST Station Hotel','Churchgate Executive','Nariman Point Business Inn','Cuffe Parade Residency',
    'Worli Sea View','Bandra Kurla Complex Hotel','Andheri Traveller Inn','Juhu Beach Resort',
    'Santacruz Airport Hotel','Vile Parle Comforts','Goregaon Studio Inn','Malad Suites',
    'Kandivali Lodge','Borivali National Park Inn','Dahisar Comforts','Mira Road Residency',
    'Dadar Central Stay','Matunga Comforts','Sion Heritage Inn','Kurla Junction Hotel',
    'Ghatkopar Suites','Vikhroli Executive','Kanjurmarg Inn','Bhandup Comforts',
    'Mulund Lodge','Thane Creek View','Powai Lake Hotel','Hiranandani Suites',
    'Navi Mumbai Inn','Belapur Residency','Kharghar Comforts','Panvel Gateway Lodge',
    'Lower Parel Mill Hotel','Prabhadevi Stay','Parel Executive Inn','Chembur Residency',
    'Trombay Lodge','Mankhurd Comforts','Govandi Inn','Cheetah Camp Hotel',
    'Dharavi Community Stay',
  ],
  Manali: [
    'Snow Peak Resort','Rohtang View Hotel','Solang Valley Inn','Hadimba Forest Lodge',
    'Old Manali Cafe Stay','Vashisht Hot Spring Inn','Kullu Valley Resort','Beas River Side',
    'Mall Road Manali Hotel','Log Hut Residency','Pine View Inn','Apple Orchard Stay',
    'Cedar Wood Resort','Himalayan Nest','Adventure Base Camp','Mountain Echo Lodge',
    'Deodar Retreat','Naggar Castle View Inn','Jagatsukh Comforts','Prini Valley Lodge',
    'Bahang Riverside Inn','Palchan Mountain Stay','Goshal Village Lodge','Kothi Snow Resort',
    'Marhi Roadside Inn','Gramphu Camp Stay','Chatru Adventure Lodge','Losar Inn',
    'Spiti View Hotel','Keylong Transit Stay','Tandi Riverside Comforts','Udaipur HP Inn',
    'Triloknath Temple Stay','Killar Scenic Lodge','Tisa Valley Inn','Bhuntar Airport Hotel',
    'Kullu Town Comforts','Raison Riverside Inn','Aut Tunnel Side Stay','Larji Dam View',
    'Hanogi Temple Inn','Bajaura Heritage Stay','Anni Village Lodge','Nirmand Comforts',
    'Rampur Roadside Inn',
  ],
  Bangalore: [
    'Silicon Valley Hotel','MG Road Suites','Brigade Road Inn','Koramangala Tech Stay',
    'Indiranagar Executive','Whitefield Business Hotel','Electronic City Lodge','HSR Layout Inn',
    'BTM Layout Comforts','Jayanagar Heritage Stay','JP Nagar Residency','Banashankari Suites',
    'Vijayanagar Lodge','Rajajinagar Inn','Malleswaram Comforts','Sadashivanagar Stay',
    'Basavanagudi Heritage Inn','Ulsoor Lake View','Frazer Town Executive','Cleveland Town Lodge',
    'Shivajinagar Comforts','Majestic Station Hotel','KR Market Inn','Chamrajpet Suites',
    'Richmond Town Stay','Langford Town Inn','Langford Garden Lodge','Yelahanka Residency',
    'Hebbal Lake View','Bagalur Road Inn','KR Puram Comforts','Tin Factory Stay',
    'Marathahalli Tech Inn','Bellandur Lake Lodge','Sarjapur Road Suites','Bommanahalli Comforts',
    'Hosur Road Executive','Attibele Lodge','Electronic City Phase 2 Inn','Chandapura Comforts',
    'Anekal Town Stay','Doddaballapur Road Inn','Nelamangala Comforts','Tumkur Road Lodge',
    'Yeshwanthpur Residency',
  ],
  Warangal: [
    'Kakatiya Heritage Inn','Warangal Fort View Hotel','Ramappa Temple Lodge','Thousand Pillar Stay',
    'Bhadrakali Lake Inn','Pakhal Nature Resort','Kazipet Junction Hotel','Hanamkonda Suites',
    'Hunter Road Comforts','Subedari Executive Inn','REC Road Lodge','NIT Warangal Stay',
    'Mulugu Gate Inn','Hasanparthy Comforts','Elkathurthy Village Lodge','Rayaparthy Inn',
    'Dharmasagar Lake View','Waddepally Residency','Narsampet Road Stay','Parkal Junction Inn',
    'Dornakal Comforts','Mahabubabad Road Lodge','Bhupalpally Inn','Palakurthi Stay',
    'Nallabelli Eco Lodge','Station Road Hotel','Shyam Lodge','Vijaya Residency',
    'Srinivasa Inn','Balaji Comforts','Sri Venkateswara Stay','Sarada Lodge',
    'Annapurna Inn','Lakshmi Residency','Sri Ram Comforts','Krishna Lodge',
    'Kaveri Inn','Godavari View Stay','Central Hotel','Hotel Ratna',
    'Brundavan Inn','Mayuri Residency','Tourist Home','Sapthagiri Lodge',
    'Sri Durga Comforts',
  ],
  Chennai: [
    'Marina Beach View Hotel','T Nagar Suites','Anna Salai Executive','Egmore Station Inn',
    'Central Railway Lodge','Spencer Plaza Stay','Mount Road Residency','Nungambakkam Comforts',
    'Kodambakkam Film City Inn','Vadapalani Temple Lodge','Koyambedu Market Hotel','Porur IT Inn',
    'Tambaram Comforts','Chromepet Suites','Pallavaram Lodge','Pammal Residency',
    'Guindy National Park Inn','Adyar Riverside Stay','Besant Nagar Beach Inn','Thiruvanmiyur Suites',
    'Velachery Lake View','Perungudi Tech Lodge','Sholinganallur IT Inn','Thoraipakkam Comforts',
    'Medavakkam Residency','Madipakkam Stay','Nanganallur Lodge','Alandur Metro Inn',
    'Saidapet Comforts','Ashok Nagar Heritage Stay','KK Nagar Residency','Arumbakkam Suites',
    'Villivakkam Inn','Perambur Comforts','Kolathur Lodge','Tondiarpet Stay',
    'Royapuram Fishermen Inn','Tiruvottiyur Comforts','Ennore Port Side Lodge','Manali Industrial Stay',
    'Puzhal Lake View Inn','Ambattur Industrial Lodge','Avadi Comforts','Tiruvallur Road Inn',
    'Poonamallee Residency',
  ],
  Varanasi: [
    'Ganga View Guesthouse','Assi Ghat Inn','Dashashwamedh Heritage Stay','Kashi Vishwanath Lodge',
    'Manikarnika Riverside','Banaras Heritage Hotel','Lanka Crossing Inn','BHU Campus Lodge',
    'Sigra Comforts','Mahmoorganj Residency','Cantt Station Hotel','Nadesar Palace View',
    'Ramnagar Fort View Inn','Sarnath Buddhist Stay','Sarnath Pilgrim Lodge','Mughal Sarai Inn',
    'Kashi Pilgrim House','Godowlia Comforts','Chowk Heritage Inn','Kabirchaura Stay',
    'Lahurabir Lodge','Maldahiya Suites','Bhelpura Comforts','Shivpur Residency',
    'Pandeypur Inn','Bhelupur Stay','Lohta Comforts','Rohania Lodge',
    'Sunderpur Residency','Chitaipur Inn','Pandu Nagar Comforts','Beniabagh Stay',
    'Vidhyapith Inn','Shastri Nagar Varanasi Lodge','Jaitpura Comforts','Chauka Ghat View',
    'Tulsi Ghat Inn','Scindhi Ghat Stay','Darbhanga Ghat Lodge','Rajghat Comforts',
    'Machodari Residency','Hukulganj Inn','Girijaghar Stay','Saraimohana Comforts',
    'Pahadia Lodge',
  ],
  Udaipur: [
    'Lake Pichola View Inn','City Palace Residency','Fateh Sagar Lodge','Sajjangarh Fort View',
    'Lake Palace View Hotel','Jag Mandir Heritage Stay','Saheliyon Bari Inn','Jagdish Temple Lodge',
    'Hathi Pol Comforts','Chetak Circle Hotel','Suraj Pol Suites','Bapu Bazaar Udaipur Stay',
    'Ambamata Inn','Bhuwana Comforts','Pratapnagar Residency','Hiran Magri Suites',
    'Sector 11 Comforts','Sector 14 Inn','Madhuban Stay','Titardi Gate Lodge',
    'Kalaji Goraji Comforts','Mewad Nagar Inn','Shobhagpura Residency','Badgaon Comforts',
    'Debari Village Stay','Mavli Junction Inn','Gogunda Heritage Lodge','Nathdwara Temple Stay',
    'Rajsamand Lake View','Kankroli Comforts','Rajnagar Inn','Bhinder Town Stay',
    'Salumber Comforts','Jhadol Eco Lodge','Kotra Forest Inn','Kumbhalgarh Fort View',
    'Ranakpur Temple Stay','Sirohi Road Inn','Pali Junction Comforts','Marwar Residency',
    'Ghanerao Heritage Lodge','Desuri Village Inn','Bali Town Comforts','Falna Station Stay',
    'Jawai Leopard Camp View',
  ],
  Kolkata: [
    'Park Street Grand Hotel','Howrah Bridge View Inn','Victoria Memorial Lodge','New Market Suites',
    'Esplanade Executive Inn','BBD Bagh Heritage Stay','Dalhousie Square Hotel','Salt Lake City Inn',
    'Sector V IT Lodge','Rajarhat Comforts','New Town Residency','EM Bypass Suites',
    'Tollygunge Comforts','Behala Residency','Jadavpur Inn','Garia Station Hotel',
    'Ruby Hospital Side Lodge','Phoolbagan Stay','Kankurgachi Comforts','Ultadanga Inn',
    'Nager Bazar Lodge','Dum Dum Airport Inn','Shyambazar Five Points Hotel','Shobhabazar Heritage',
    'Sovabazar Rajbari View','College Street Comforts','Presidency University Stay','Chitpur Road Inn',
    'Burrabazar Merchant Lodge','Chandni Chowk Kolkata Inn','Sealdah Junction Hotel',
    'Maniktala Comforts','Phool Bagan Residency','Lake Town Inn','Baranagar Comforts',
    'Serampore Riverside Lodge','Hooghly Ghat View Inn','Bandel Church Side Stay','Chandannagar Heritage',
    'Chinsurah Comforts','Rishra Inn','Konnagar Lodge','Uttarpara Comforts',
    'Bally Bridge View Stay','Garden Reach Inn',
  ],
  Agra: [
    'Taj Mahal View Grand','Agra Fort Heritage Inn','Fatehpur Sikri Lodge','Yamuna Riverside Stay',
    'Sadar Bazaar Comforts','Taj Ganj Hotel','Fatehabad Road Suites','MG Road Agra Inn',
    'Mantola Residency','Belanganj Lodge','Noori Gate Comforts','Kamla Nagar Inn',
    'Shahganj Suites','Bodla Road Stay','Dayal Bagh Heritage Lodge','Sikandra Akbar Tomb View',
    'Itmad-ud-Daulah Inn','Mehtab Bagh View Stay','Ram Bagh Comforts','Kheragarh Road Lodge',
    'Etmadpur Village Inn','Kiraoli Comforts','Jagdishpura Residency','Shastripuram Inn',
    'Kalindi Vihar Stay','Bichpuri Road Comforts','Runukta Village Lodge','Achhnera Junction Inn',
    'Khandauli Comforts','Firozabad Road Stay','Shamsabad Suites','Samsabad Inn',
    'Fatehabad Executive','Artoni Comforts','Shahabad Road Lodge','Pinahat Town Inn',
    'Bah Comforts','Etah Road Stay','Mathura Road Suites','Vrindavan Day Stay',
    'Govardhan Pilgrim Inn','Deeg Palace View','Bharatpur Bird Sanctuary Side','Dholpur Riverside',
    'Chambal Valley Lodge',
  ],
};

// ─── AMENITY SETS BY TYPE ─────────────────────────────────────────────────────
const amenityByType = {
  Budget:     ['WiFi', 'AC'],
  'Mid-Range':['WiFi', 'AC', 'Parking', 'Breakfast'],
  Luxury:     ['WiFi', 'AC', 'Parking', 'Restaurant', 'Pool', 'Breakfast', 'Gym', 'Spa', 'Bar', 'Room Service', 'Laundry', 'Airport Shuttle'],
  Hostel:     ['WiFi', 'Laundry'],
  Guesthouse: ['WiFi', 'AC', 'Breakfast'],
  Resort:     ['WiFi', 'AC', 'Parking', 'Restaurant', 'Pool', 'Breakfast', 'Gym', 'Spa'],
  Homestay:   ['WiFi', 'Breakfast', 'Laundry'],
};

// ─── TRAVELLER TYPES BY HOTEL TYPE ───────────────────────────────────────────
const travellerByType = {
  Budget:     ['Student', 'Solo'],
  'Mid-Range':['Family', 'Couple', 'Business'],
  Luxury:     ['Couple', 'Business', 'Family'],
  Hostel:     ['Student', 'Solo'],
  Guesthouse: ['Family', 'Solo', 'Senior'],
  Resort:     ['Family', 'Couple'],
  Homestay:   ['Family', 'Solo', 'Senior'],
};

// ─── DESCRIPTIONS BY TYPE ────────────────────────────────────────────────────
const descByType = {
  Budget:     'A clean and affordable stay perfect for budget-conscious travellers. Comfortable rooms with essential amenities in a convenient location.',
  'Mid-Range':'A comfortable mid-range hotel offering a great balance of amenities and value. Well-furnished rooms with friendly staff and easy access to local attractions.',
  Luxury:     'An exquisite luxury property offering world-class amenities, elegant interiors, fine dining, and impeccable service for a truly memorable stay.',
  Hostel:     'A vibrant and social hostel perfect for backpackers and solo travellers. Dormitory and private rooms available with common areas to meet fellow explorers.',
  Guesthouse: 'A cosy and homely guesthouse providing personalised service and a warm atmosphere. Ideal for families and solo travellers seeking a home away from home.',
  Resort:     'A premium resort offering spacious accommodations, lush gardens, swimming pool, and recreational facilities for a relaxing and rejuvenating holiday.',
  Homestay:   'An authentic homestay experience with a local host family. Enjoy home-cooked meals, cultural insights, and a genuine taste of local life.',
};

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function coordJitter(base, range = 0.05) {
  return parseFloat((base + (Math.random() - 0.5) * range).toFixed(4));
}

// ─── BUILD HOTELS ─────────────────────────────────────────────────────────────
function buildHotels() {
  const hotels = [];
  const cities = Object.keys(cityHotelNames);

  // ~42 hotels per city × 12 cities = ~500 total
  cities.forEach(city => {
    const { state, coords } = cityData[city];
    const names = cityHotelNames[city];

    names.forEach((name, i) => {
      const type = types[i % types.length];
      const [pMin, pMax] = priceRange[type] || [500, 2000];
      const price = rand(pMin, pMax);
      const rating = randFloat(3.0, 5.0);
      const reviewCount = rand(5, 500);

      hotels.push({
        name,
        city,
        state,
        address: `${rand(1, 999)}, ${name} Road, ${city} - ${rand(500001, 600099)}`,
        type,
        pricePerNight: price,
        rating,
        reviewCount,
        description: descByType[type],
        amenities: amenityByType[type] || ['WiFi', 'AC'],
        image: `https://source.unsplash.com/400x300/?hotel,${type.toLowerCase().replace('-', '')}`,
        coordinates: {
          lat: coordJitter(coords.lat),
          lng: coordJitter(coords.lng),
        },
        contactPhone: `+91 ${rand(70000, 99999)}${rand(10000, 99999)}`,
        contactEmail: `info@${name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
        checkInTime: '12:00 PM',
        checkOutTime: '11:00 AM',
        travellerTypes: travellerByType[type] || ['Solo', 'Family'],
        isVerified: Math.random() > 0.3,
        dataLabel: 'Curated Demo Data',
        isActive: true,
      });
    });
  });

  return hotels;
}

// ─── SEED ─────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅  MongoDB connected');

    // Clear existing hotels
    const deleted = await Hotel.deleteMany({});
    console.log(`🗑️   Cleared ${deleted.deletedCount} existing hotels`);

    const hotels = buildHotels();
    console.log(`🏗️   Building ${hotels.length} hotel records...`);

    await Hotel.insertMany(hotels, { ordered: false });
    console.log(`✅  Inserted ${hotels.length} hotels across ${Object.keys(cityHotelNames).length} cities`);

    // Print summary
    const cities = Object.keys(cityHotelNames);
    for (const city of cities) {
      const count = await Hotel.countDocuments({ city });
      console.log(`   📍 ${city}: ${count} hotels`);
    }

    const total = await Hotel.countDocuments();
    console.log(`\n🎉  Total hotels in DB: ${total}`);

    await mongoose.disconnect();
    console.log('👋  Done!');
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
