// routes.js
const express = require('express');
const router = express.Router();

const addTeam = require('./routes/addTeam')
router.post('/add-team', addTeam);
const processResult = require('./routes/processResult')
router.post('/process-result', processResult);
const teamResult = require('./routes/teamResult')
router.get('/team-result', teamResult);



module.exports = router;
