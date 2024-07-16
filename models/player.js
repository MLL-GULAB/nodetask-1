const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // WK, BAT, AR, BWL
  team: { type: String, required: true }, // RR or CSK
});

module.exports = mongoose.model('Player', playerSchema);