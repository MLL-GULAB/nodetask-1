const express = require('express');
const { body, validationResult } = require('express-validator');
const Player = require('../models/player');
console.log(__dirname); // Log the current directory
const teamEntry = require('../models/teamEntry');
const router = express.Router();

// Constants for player type limits
const MIN_PLAYERS = 11;
const MAX_PLAYERS = 11;
const MIN_PLAYER_TYPE = 1;
const MAX_PLAYER_TYPE = 8;
const MAX_PLAYERS_PER_TEAM = 10;

router.post('/', [
  body('teamName').notEmpty().withMessage('Team name is required'),
  body('players').isArray({ min: MIN_PLAYERS, max: MAX_PLAYERS }).withMessage(`Exactly ${MIN_PLAYERS} players are required`),
  body('captain').notEmpty().withMessage('Captain is required'),
  body('viceCaptain').notEmpty().withMessage('Vice-Captain is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { teamName, players, captain, viceCaptain } = req.body;

  if (captain === viceCaptain) {
    return res.status(400).json({ error: 'Captain and Vice-Captain cannot be the same player' });
  }

  try {
    // Validate player selection
    const playerTypes = { WK: 0, BAT: 0, AR: 0, BWL: 0 };
    const playerTeams = {};

    const playerDocs = await Player.find({ name: { $in: players } });

    if (playerDocs.length !== players.length) {
      return res.status(400).json({ error: 'Some players not found' });
    }

    playerDocs.forEach(player => {
      playerTypes[player.type]++;
      playerTeams[player.team] = (playerTeams[player.team] || 0) + 1;
    });

    if (playerTypes.WK < MIN_PLAYER_TYPE || playerTypes.WK > MAX_PLAYER_TYPE ||
        playerTypes.BAT < MIN_PLAYER_TYPE || playerTypes.BAT > MAX_PLAYER_TYPE ||
        playerTypes.AR < MIN_PLAYER_TYPE || playerTypes.AR > MAX_PLAYER_TYPE ||
        playerTypes.BWL < MIN_PLAYER_TYPE || playerTypes.BWL > MAX_PLAYER_TYPE) {
      return res.status(400).json({ error: 'Invalid player type distribution' });
    }

    for (const team in playerTeams) {
      if (playerTeams[team] > MAX_PLAYERS_PER_TEAM) {
        return res.status(400).json({ error: `Too many players from ${team}` });
      }
    }

    // Ensure captain and vice-captain are part of the team
    if (!players.includes(captain)) {
      return res.status(400).json({ error: 'Captain must be one of the selected players' });
    }
    if (!players.includes(viceCaptain)) {
      return res.status(400).json({ error: 'Vice-Captain must be one of the selected players' });
    }

    const newTeam = new teamEntry({ teamName, players, captain, viceCaptain });
    await newTeam.save();
    res.status(201).json({ message: 'Team added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
