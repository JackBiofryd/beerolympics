const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Contestant = require('./schemas/contestantSchema');
const Team = require('./schemas/teamSchema');

// Init app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database
const mongoURI =
	'mongodb://jackbiofryd:eBKOKZgP9oX7I6uT@ac-hxl5ehb-shard-00-00.x6qewte.mongodb.net:27017,ac-hxl5ehb-shard-00-01.x6qewte.mongodb.net:27017,ac-hxl5ehb-shard-00-02.x6qewte.mongodb.net:27017/?ssl=true&replicaSet=atlas-rhwybx-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(
	mongoURI,
	() => console.log('connected'),
	e => console.log(e)
);

// Nodemailer
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'beerolympwebsite@gmail.com',
		pass: 'pnulxadatcvhvhpd'
	}
});

const maxChugContestants = 10;
const maxPongTeams = 32;

// Routes
app.get('/', async (req, res) => {
	const registeredContestants = await Contestant.find();
	const registeredTeams = await Team.find();

	res.json({
		chugSpacesLeft: maxChugContestants - registeredContestants.length,
		pongSpacesLeft: maxPongTeams - registeredTeams.length
	});
});

app.post('/', async (req, res) => {
	if (!req.body || !req.body.name || !(req.body.chug ^ req.body.pong))
		return res.json({
			code: 422,
			msg: 'Please input all fields.',
			success: false
		});

	const isRegisteringForFastestChug = req.body.chug;
	const contestantName = req.body.name;

	if (isRegisteringForFastestChug) {
		const contestants = await Contestant.find();

		if (
			contestants.find(
				contestant =>
					contestant.name.toLowerCase() ===
					contestantName.toLowerCase()
			)
		) {
			return res.json({
				code: 422,
				msg: 'You are already registered for Fastest Chug.',
				success: false
			});
		}

		if (contestants.length >= maxChugContestants) {
			return res.json({
				code: 400,
				msg: 'No more spaces left for Fastest Chug. Sorry!',
				success: false
			});
		}

		try {
			await Contestant.create({
				name: contestantName
			});
		} catch (err) {
			res.json({
				code: 500,
				msg: 'Error with database. Please try again later.',
				success: false
			});
		}

		const message = {
			from: 'beerolympwebsite@gmail.com',
			to: 'beerolympicss@gmail.com',
			subject: 'Fastest Chug New Register',
			text: `Name: ${contestantName}`
		};

		transporter.sendMail(message);

		return res.json({
			code: 200,
			msg: `${contestantName} has been registered for Fastest Chug!`,
			success: true
		});
	}

	const isRegisteringForBeerPong = req.body.pong;
	if (isRegisteringForBeerPong) {
		const allTeams = await Team.find();

		if (!req.body.teammate || !req.body.team)
			return res.json({
				code: 422,
				msg: 'Please input all fields.',
				success: false
			});

		const { teammate, team } = req.body;

		if (teammate.toLowerCase() === contestantName.toLowerCase()) {
			return res.json({
				code: 422,
				msg: 'Members of the teams cannot be the same person.',
				success: false
			});
		}

		let contestantIsAlreadyRegistered = false;
		allTeams.forEach(pongTeam => {
			const { members } = pongTeam;

			if (pongTeam.name.toLowerCase() === team.toLowerCase()) {
				return res.json({
					code: 422,
					msg: 'Team name is already taken.',
					success: false
				});
			}

			members.forEach(member => {
				if (
					member.toLowerCase() === teammate.toLowerCase() ||
					member.toLowerCase() === contestantName.toLowerCase()
				)
					contestantIsAlreadyRegistered = true;
			});
		});

		if (contestantIsAlreadyRegistered)
			return res.json({
				code: 422,
				msg: 'Someone from your team is already registered for Beer Pong.',
				success: false
			});

		if (allTeams.length >= maxPongTeams) {
			return res.json({
				code: 400,
				msg: 'No more spaces left for Beer Pong. Sorry!',
				success: false
			});
		}

		try {
			await Team.create({
				members: [contestantName, teammate],
				name: team
			});
		} catch (err) {
			res.json({
				code: 500,
				msg: 'Error with database. Please try again later.',
				success: false
			});
		}

		const message = {
			from: 'beerolympwebsite@gmail.com',
			to: 'beerolympicss@gmail.com',
			subject: 'Fastest Chug New Register',
			text: `Team Name: ${team}\n Members: ${contestantName}, ${teammate}`
		};

		transporter.sendMail(message);
		res.json({
			code: 200,
			msg: 'You have been registered for Beer Pong!',
			success: true
		});
	}
});

// Starting server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server started on port: ${port}`);
});
