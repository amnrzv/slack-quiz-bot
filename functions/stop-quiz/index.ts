import { sendResponse } from "../shared";

export const stopQuiz = (req, res) => {
    res.status(200).end();

    const message = {
        text: quizOn ? 'Quiz stopped.' : 'No quiz running currently.',
        response_type: quizOn ? 'in_channel' : 'ephemeral'
    }

    if (quizOn) { quizOn = false; }
    sendResponse(req.body.response_url, message);
}