import { displayQuestion, sendResponse } from '../shared/index';

const debug_mode = true;
let questionsList = [];
let shuffledAnswers = [];
let answersList = {};
let currentIndex = -1;
let quizOn = false;

const responseAction = (req, res) => {
  res.status(200).end(); // best practice to respond with 200 status
  const actionJSONPayload: any = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
  const { callback_id: uid } = actionJSONPayload;
  const { name: username } = actionJSONPayload.user;
  const { name: answer } = actionJSONPayload.actions[0];
  let message: any = {};

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

    setTimeout(() => displayQuestion(), 1500);
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

export { responseAction }