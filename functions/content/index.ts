exports.buildMessage = (question, uid, allAnswers, shouldReplace = true) => ({
    text: '',
    response_type: 'in_channel',
    replace_original: shouldReplace,
    attachments: [
        {
            text: htmlify.htmlDecode(question),
            fallback: "Shame... this isn't working!",
            callback_id: uid,
            color: '#3AA3E3',
            attachment_type: 'default',
            actions: createBtnsObject(allAnswers)
        }
    ]
});

const createBtnsObject = (allAnswers) => allAnswers.map(answer => {
    return {
        name: htmlify.htmlDecode(answer),
        text: htmlify.htmlDecode(answer),
        type: 'button',
        value: htmlify.htmlDecode(answer)
    };
});

