const Team = require('../models/teamEntry');
const Player = require('../models/player');

const addTeam = async (req, res) => {
  try {
    const { name, players, captain, viceCaptain } = req.body;

    if (!name || !players || !captain || !viceCaptain) {
      return res.status(400).send('All fields are required');
    }

    if (players.length !== 11) {
      return res.status(400).send('Team must have exactly 11 players');
    }

    if (!players.includes(captain) || !players.includes(viceCaptain)) {
      return res.status(400).send('Captain and Vice-Captain must be part of the team');
    }

    const team = new Team({ name, players, captain, viceCaptain });
    await team.save();
    res.status(201).send(team);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).send(teams);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  addTeam,
  getTeams,
};
