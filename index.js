const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const QuizFunctions = require('./QuizFunctions');

const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
  res.status(200).send('Hi!');
});

app.post('/slack/action', urlencodedParser, (req, res) => QuizFunctions.msgAction(req, res));

app.post('/slack/quiz', urlencodedParser, (req, res) => QuizFunctions.initialMsg(req, res));

app.post('/slack/event', (req, res) => {
  console.log(req.body);
  console.log("Hi!");
  res.status(200).send(req.body.challenge);
});

app.get('/slack/options', (req, res) => {
  console.log(req.body);
  console.log("Hi!");
  res.status(200).send('Hi!');
});

app.listen(8000, () => {
  console.log('Listening on port 8000');
})