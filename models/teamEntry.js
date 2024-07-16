const mongoose = require('mongoose');

const teamEntrySchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  players: [{ type: String, required: true }],
  captain: { type: String, required: true },
  viceCaptain: { type: String, required: true },
  points: { type: Number, default: 0 },
});

module.exports = mongoose.model('TeamEntry', teamEntrySchema);
