const express = require('express');
const router = express.Router();

// GET /api/safety/numbers  — static emergency data
router.get('/numbers', (_req, res) => {
  res.json({
    success: true,
    emergency: [
      { service: 'National Emergency',     number: '112', icon: '🆘', description: 'All emergencies – police, fire, ambulance' },
      { service: 'Ambulance',              number: '108', icon: '🚑', description: 'Medical emergency ambulance service' },
      { service: 'Police',                 number: '100', icon: '👮', description: 'Police helpline' },
      { service: 'Fire',                   number: '101', icon: '🔥', description: 'Fire brigade' },
      { service: 'Women Helpline',         number: '1091', icon: '👩', description: 'Women safety helpline' },
      { service: 'Tourist Helpline',       number: '1800-111-363', icon: '✈️', description: 'India Tourism 24x7 helpline (toll-free)' },
      { service: 'Road Accident',          number: '1073', icon: '🚗', description: 'Road accident emergency' },
      { service: 'Child Helpline',         number: '1098', icon: '👶', description: 'Child safety helpline' },
      { service: 'Senior Citizen',         number: '14567', icon: '🧓', description: 'Senior citizen helpline' },
      { service: 'Railway Enquiry',        number: '139',  icon: '🚂', description: 'Railway emergency & enquiry' }
    ],
    safetyTips: [
      'Always keep a copy of your ID and travel documents.',
      'Share your itinerary with a trusted contact before travelling.',
      'Avoid deserted areas after dark.',
      'Keep emergency numbers saved offline.',
      'Use registered taxi/auto services only.',
      'Stay hydrated and carry basic medicines.',
      'Respect local customs and dress codes at religious sites.',
      'Do not share your accommodation address with strangers.',
      'Use ATMs inside secure premises; be cautious at night.',
      'In case of emergency, dial 112 immediately.'
    ],
    note: 'These are official Indian government helpline numbers. Pressing "Call" will initiate a call from your device.'
  });
});

module.exports = router;
