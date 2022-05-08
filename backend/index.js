const express = require('express');

const app = express();

const bPongTeams = [];
const fChugContestants = [];

app.get('/', (req, res) => {
	res.send('Hello World');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server started on port: ${port}`);
});
