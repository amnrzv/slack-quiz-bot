const fetch = require('node-fetch');
const htmlify = require('js-htmlencode');
const uuid = require('uuid/v4');
const Content = require('./Content');
const Utils = require('./Utils');

const dataURL = `https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple`;
const webhookURL = `https://hooks.slack.com/services/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`;
const debug_mode = true;
let questionsList = [];
let shuffledAnswers = [];
let currentIndex = -1;
let answersList = {};
let quizOn = false;

exports.stopQuiz = (req, res) => {
  res.status(200).end();

  const message = {
    text: quizOn ? 'Quiz stopped.' : 'No quiz running currently.',
    response_type: quizOn ? 'in_channel': 'ephemeral'
  }
  
  if (quizOn) { quizOn = false; }
  sendResponse(req.body.response_url, message);
}

exports.startQuiz = (req, res) => {
  res.status(200).end();
  
  if (quizOn) {
    const message = {
      text: 'A quiz is already running.'
    }
    
    sendResponse(req.body.response_url, message);
    return;
  }

  quizOn = true;
  
  const reqBodyToken = req.body.token;
  const responseURL = req.body.response_url;
  if (reqBodyToken != 'uXkcIJMRpYm5l3Kjr9yyYIBD') {
    res.status(403).end('Access forbidden');
    return;
  }
  
  sendResponse(responseURL, {text: 'Alright... starting quiz. First question coming up.', response_type: 'in_channel'})
  displayQuestion();
};

function displayQuestion() {
  if (!quizOn) return;

  console.log(currentIndex);
  if (currentIndex === -1 || currentIndex >= questionsList.length) {
    fetchQuestions().then(json => {
      currentIndex = 0;
      questionsList = json.results;
      questionsList = questionsList.map(question => {
        return { ...question, uid: uuid() };
      });
      answersList[questionsList[currentIndex].uid] = {};
      const question = buildQuestion();
      currentIndex++;
      sendWebhook(question);
    });
  } else {
    answersList[questionsList[currentIndex].uid] = {};
    const question = buildQuestion();
    currentIndex++;
    sendWebhook(question);
  }
}

function buildQuestion() {
  const { question, uid, correct_answer, incorrect_answers } = questionsList[
    currentIndex
  ];
  shuffledAnswers = Utils.shuffle([correct_answer, ...incorrect_answers]);
  return Content.buildMessage(question, uid, shuffledAnswers);
}

function fetchQuestions() {
  return fetch(dataURL).then(body => body.json());
}

exports.responseAction = (req, res) => {
  res.status(200).end(); // best practice to respond with 200 status
  const actionJSONPayload = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
  const { callback_id: uid } = actionJSONPayload;
  const { name: username } = actionJSONPayload.user;
  const { name: answer } = actionJSONPayload.actions[0];
  let message = {};

  if (answersList[uid][actionJSONPayload.user.id] !== undefined && !debug_mode) {
    message = {
      text: "You have answered already!",
      replace_original: false,
      response_type: 'ephemeral'
    }

    sendResponse(actionJSONPayload.response_url, message);
    return;
  } else {
    answersList[uid][actionJSONPayload.user.id] = { answer, username };
  }

  const selected_question = questionsList.filter(q => q.uid === uid)[0];
  const { question, correct_answer, incorrect_answers } = selected_question;
  if (htmlify.htmlDecode(correct_answer) === htmlify.htmlDecode(answer)) {
    message = {
      text: `Correct answer given by *${actionJSONPayload.user.name}*`,
      response_type: 'in_channel',
      replace_original: true,
      attachments: [{
        text: htmlify.htmlDecode(`${question}\n*${correct_answer}*`),
        fallback: "Shame... this isn't working!",
        color: '#3AA3E3',
        attachment_type: 'default'
      }]
    }

    setTimeout(() => displayQuestion(actionJSONPayload.response_url), 1500);
  }
  else {
    message = Content.buildMessage(question, uid, shuffledAnswers);

    Object.keys(answersList[uid]).forEach(response =>
      message.attachments.push({
        text: `${answersList[uid][response].username} : ${answersList[uid][response].answer}`
      })
    );
  }

  sendResponse(actionJSONPayload.response_url, message);
};

function sendResponse(responseURL, JSONmessage) {
  fetch(responseURL, {
    method: 'POST',
    body: JSON.stringify(JSONmessage),
    headers: { 'Content-Type': 'application/json' }
  })
  .catch(error => console.error(error));
}

function sendWebhook(JSONmessage) {
  fetch(webhookURL, {
    method: 'POST',
    body: JSON.stringify(JSONmessage),
    headers: { 'Content-Type': 'application/json' }
  })
  .catch(error => console.error(error));
}
