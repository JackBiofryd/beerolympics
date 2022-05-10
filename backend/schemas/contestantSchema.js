const mongoose = require('mongoose');

const contestantSchema = new mongoose.Schema({
	name: { type: String, required: true }
});

module.exports = mongoose.model('Contestant', contestantSchema);
