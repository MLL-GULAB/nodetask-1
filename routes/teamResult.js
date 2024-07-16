const express = require('express');
const TeamEntry = require('../models/TeamEntry');
const router = express.Router();

router.get('/', async (req, res) => {
  const teamEntries = await TeamEntry.find().sort({ points: -1 });

  const maxPoints = teamEntries.length ? teamEntries[0].points : 0;
  const winners = teamEntries.filter(team => team.points === maxPoints);

  res.json({ winners });
});

module.exports = router;

