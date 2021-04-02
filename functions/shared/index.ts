const dataURL = `https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple`;
const webhookURL = `https://hooks.slack.com/services/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`;

function displayQuestion() {
    if (!quizOn) return;

    console.log(currentIndex);
    if (currentIndex === -1 || currentIndex >= questionsList.length) {
        fetchQuestions().then(json => {
            currentIndex = 0;
            questionsList = json.results;
            questionsList = questionsList.map(question => {
                return Object.assign({}, question, { uid: uuid() });
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

export { displayQuestion, sendResponse, sendWebhook }