import { displayQuestion, sendResponse } from "../shared";

let quizOn = false;
export const startQuiz = (req, res) => {
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
  
    sendResponse(responseURL, { text: 'Alright... starting quiz. First question coming up.', response_type: 'in_channel' })
    displayQuestion();
};