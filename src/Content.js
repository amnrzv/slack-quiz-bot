const fetch = require('node-fetch');
const htmlify = require('js-htmlencode');
const Utils = require('./Utils');

exports.buildMessage = function(question, uid, all_answers) {
  return {
    text: 'This is your first interactive message',
    response_type: 'in_channel',
    replace_original: true,
    attachments: [
      {
        text: htmlify.htmlDecode(question),
        fallback: "Shame... this isn't working!",
        callback_id: uid,
        color: '#3AA3E3',
        attachment_type: 'default',
        actions: createBtnsObject(all_answers)
      }
    ]
  };
};

function createBtnsObject(all_answers) {
  return all_answers.map(answer => {
    return {
      name: htmlify.htmlDecode(answer),
      text: htmlify.htmlDecode(answer),
      type: 'button',
      value: htmlify.htmlDecode(answer)
    };
  });
}
