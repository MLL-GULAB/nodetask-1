const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Player = require('../models/player');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const loadPlayers = () => {
  fs.createReadStream('./data/players.csv')
    .pipe(csv())
    .on('data', async (row) => {
      const player = new Player({
        name: row.name,
        type: row.type,
        team: row.team,
      });
      await player.save();
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      mongoose.disconnect();
    });
};

loadPlayers();
