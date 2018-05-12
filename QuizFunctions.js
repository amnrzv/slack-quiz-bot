const request = require("request");

exports.initialMsg = (req, res) => {
  res.status(200).end(); // best practice to respond with empty 200 status code
  var reqBody = req.body;
  var responseURL = reqBody.response_url;
  if (reqBody.token != "uXkcIJMRpYm5l3Kjr9yyYIBD") {
    res.status(403).end("Access forbidden");
  } else {
    var message = {
      text: "This is your first interactive message",
      attachments: [
        {
          text: "Building buttons is easy right?",
          fallback: "Shame... buttons aren't supported in this land",
          callback_id: "button_tutorial",
          color: "#3AA3E3",
          attachment_type: "default",
          actions: [
            {
              name: "yes",
              text: "yes",
              type: "button",
              value: "yes"
            },
            {
              name: "no",
              text: "no",
              type: "button",
              value: "no"
            },
            {
              name: "maybe",
              text: "maybe",
              type: "button",
              value: "maybe"
            }
          ]
        }
      ]
    };
    sendMessageToSlackResponseURL(responseURL, message);
  }
};

exports.msgAction = (req, res) => {
  res.status(200).end(); // best practice to respond with 200 status
  var actionJSONPayload = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
  var message = {
    text:
      actionJSONPayload.user.name +
      " clicked: " +
      actionJSONPayload.actions[0].name,
    replace_original: false
  };
  sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
};

function sendMessageToSlackResponseURL(responseURL, JSONmessage) {
  var postOptions = {
    uri: responseURL,
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    json: JSONmessage
  };
  request(postOptions, (error, response, body) => {
    if (error) {
      // handle errors as you see fit
    }
  });
}
