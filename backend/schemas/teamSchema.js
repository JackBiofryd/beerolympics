const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
	members: { type: Array, required: true },
	name: { type: String, required: true }
});

module.exports = mongoose.model('Team', teamSchema);
