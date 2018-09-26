const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const QuizFunctions = require('./QuizFunctions');
const functions = require('firebase-functions');
require('dotenv').config();

const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
  res.status(200).send('Hi!');
});

app.use(cors());

app.post('/slack/action', urlencodedParser, (req, res) => QuizFunctions.responseAction(req, res));

app.post('/slack/quiz-start', urlencodedParser, (req, res) => QuizFunctions.startQuiz(req, res));

app.post('/slack/quiz-stop', urlencodedParser, (req, res) => QuizFunctions.stopQuiz(req, res));

// app.listen(process.env.PORT, () => {
//   console.log('Listening on port: ' + process.env.PORT);
// })

exports.slackQuiz = functions.https.onRequest(app);
