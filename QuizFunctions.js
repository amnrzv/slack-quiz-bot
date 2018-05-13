const fetch = require('node-fetch');
const htmlify = require('js-htmlencode');
const uuid = require('uuid/v4');
const Content = require('./Content');
const Utils = require('./Utils');

const dataURL = `https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple`;
let questionsList = [];
let shuffledAnswers = [];
let currentIndex = -1;
let answersList = {};

exports.nextQuestion = (req, res) => {
  console.log(currentIndex);
  res.status(200).end();

  const reqBody = req.body;
  const responseURL = reqBody.response_url;
  if (reqBody.token != 'uXkcIJMRpYm5l3Kjr9yyYIBD') {
    res.status(403).end('Access forbidden');
    return;
  }

  if (currentIndex === -1 || currentIndex >= questionsList.length) {
    fetchQuestions().then(json => {
      currentIndex = 0;
      questionsList = json.results;
      questionsList = questionsList.map(question => {
        return { ...question, uid: uuid() };
      });
      answersList[questionsList[currentIndex].uid] = {};
      const message = buildQuestion();
      currentIndex++;
      sendMessageToSlackResponseURL(responseURL, message);
    });
  } else {
    answersList[questionsList[currentIndex].uid] = {};
    const message = buildQuestion();
    currentIndex++;
    sendMessageToSlackResponseURL(responseURL, message);
  }
};

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
  const {callback_id:uid} = actionJSONPayload;
  const {name:username} = actionJSONPayload.user;
  const {name:answer} = actionJSONPayload.actions[0];
  let message = {};
  
  if (answersList[uid][actionJSONPayload.user.id] !== undefined) {
    message = {
      text: "You have answered already!",
      replace_original: false,
      response_type: 'ephemeral'
    }

    sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
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
  }
  else
  {
    message = Content.buildMessage(question, uid, shuffledAnswers);
    
    Object.keys(answersList[uid]).forEach(response =>
      message.attachments.push({
        text: `${answersList[uid][response].username} : ${answersList[uid][response].answer}`
      })
    );
  }

  sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
};

function sendMessageToSlackResponseURL(responseURL, JSONmessage) {
  fetch(responseURL, {
    method: 'POST',
    body: JSON.stringify(JSONmessage),
    headers: { 'Content-Type': 'application/json' }
  }).catch(error => console.error(error));
}
