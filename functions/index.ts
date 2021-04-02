import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as functions from 'firebase-functions';
import dotenv from 'dotenv';
import { responseAction } from './response-action';

const app = express();
dotenv.config();

const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
  res.status(200).send('Hi!');
});

app.use(cors());

app.post('/slack/action', urlencodedParser, (req, res) => responseAction(req, res));
app.post('/slack/quiz-start', urlencodedParser, (req, res) => startQuiz(req, res));
app.post('/slack/quiz-stop', urlencodedParser, (req, res) => stopQuiz(req, res));

app.listen(process.env.PORT, () => {
  console.log('Listening on port: ' + process.env.PORT);
})

exports.slackQuiz = functions.https.onRequest(app);
