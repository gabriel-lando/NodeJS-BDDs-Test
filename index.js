const bodyParser = require('body-parser')
const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

let data = {};
try { data = JSON.parse(fs.readFileSync('./data/data.json', 'UTF-8')); }
catch { data = {} }

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/question', async function (req, res) {
	const question = req.body?.question;
	const correct = req.body?.correct;
	const wrong = req.body?.wrong;
	
	if(!question || (!correct && !wrong)) {
		res.status(400).send("Invalid data");
		res.end();
		return;
	}

    if (!data[question]){
        data[question] = {
            "corrects": [],
            "wrongs": []
        }
    }

    if (correct){
        if (!data[question].corrects.includes(correct.toLowerCase()))
	        data[question].corrects.push(correct);
    }
    if (wrong){
        if (!data[question].wrongs.includes(wrong.toLowerCase()))
	        data[question].wrongs.push(wrong);
    }

    const result = {
        question,
		answers: data[question]
	}

    fs.writeFileSync('./data/data.json', JSON.stringify(data, null, 2), 'UTF-8');

	res.status(201).send(result);
	res.end();
});

app.get('/question/:question', async function (req, res) {
	const question = req.params?.question;

	if(!question) {
		res.status(400).send();
		res.end();
		return;
	}

	const corrects = data[question]?.corrects;
	const wrongs = data[question]?.wrongs;

	if(!corrects && !wrongs) {
		res.status(404).send("Question not found");
		res.end();
		return;
	}

	const result = {
        question,
		answers: data[question]
	}

	res.status(200).send(result);
	res.end();
});

app.get('/', async function (req, res) {
	res.sendFile('data/index.html', { root: __dirname });
});


app.listen(port, function () {
	console.log('Servidor rodando a todo pau na porta %d!\n', port);
});