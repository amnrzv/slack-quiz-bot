const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const QuizFunctions = require('./QuizFunctions');

const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
  res.status(200).send('Hi!');
});

app.post('/slack/action', urlencodedParser, (req, res) => QuizFunctions.responseAction(req, res));

app.post('/slack/quiz-start', urlencodedParser, (req, res) => QuizFunctions.startQuiz(req, res));

app.post('/slack/quiz-stop', urlencodedParser, (req, res) => QuizFunctions.stopQuiz(req, res));

app.listen(8000, () => {
  console.log('Listening on port 8000');
})