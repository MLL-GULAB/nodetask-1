const express = require('express');
const TeamEntry = require('../models/teamEntry');
const matchData = require('../data/match.json');
const router = express.Router();

router.post('/', async (req, res) => {
  const teamEntries = await TeamEntry.find();

  for (const team of teamEntries) {
    let totalPoints = 0;

    for (const playerName of team.players) {
      const player = matchData.players.find(p => p.name === playerName);
      if (!player) continue;

      let playerPoints = 0;

      // Batting points
      playerPoints += player.runs;
      playerPoints += player.boundaries * 1;
      playerPoints += player.sixes * 2;
      if (player.runs >= 30) playerPoints += 4;
      if (player.runs >= 50) playerPoints += 8;
      if (player.runs >= 100) playerPoints += 16;
      if (player.runs === 0 && ['BAT', 'WK', 'AR'].includes(player.type)) playerPoints -= 2;

      // Bowling points
      playerPoints += player.wickets * 25;
      playerPoints += player.lbwBowledBonus * 8;
      if (player.wickets >= 3) playerPoints += 4;
      if (player.wickets >= 4) playerPoints += 8;
      if (player.wickets >= 5) playerPoints += 16;
      playerPoints += player.maidenOvers * 12;

      // Fielding points
      playerPoints += player.catches * 8;
      if (player.catches >= 3) playerPoints += 4;
      playerPoints += player.stumpings * 12;
      playerPoints += player.runOuts * 6;

      // Captain and vice-captain bonus
      if (playerName === team.captain) playerPoints *= 2;
      if (playerName === team.viceCaptain) playerPoints *= 1.5;

      totalPoints += playerPoints;
    }

    team.points = totalPoints;
    await team.save();
  }

  res.json({ message: 'Results processed successfully' });
});

module.exports = router;
