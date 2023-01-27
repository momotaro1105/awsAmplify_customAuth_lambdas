// make sure to add dependency to package.json

const aws = require("aws-sdk");
var ses = new aws.SES({ region: "ENTER_REGION" });
const digitGenerator = require('crypto-secure-random-digit');

function sendChallengeCode(emailAddress, secretCode) {
  const params = {
    Destination: {
      ToAddresses: [emailAddress],
    },
    Message: {
      Body: {
        Text:  { Data: secretCode },
      },
      Subject: { Data: "ENTER_CUSTOM_SUBJECT" },
    },
    Source: "ENTER_SES_EMAIL_ADDRESS",
  };

  return ses.sendEmail(params).promise()
}

function createAuthChallenge(event) {
  if (event.request.challengeName === 'CUSTOM_CHALLENGE') {
    const challengeCode = digitGenerator.randomDigits(6).join('');
    sendChallengeCode(event.request.userAttributes.email, challengeCode);

    event.response.privateChallengeParameters = {};
    event.response.privateChallengeParameters.answer = challengeCode;
    event.response.publicChallengeParameters = {
      hint: "ENTER_IF_NEED"
    };
  }
}

exports.handler = async (event) => {
  createAuthChallenge(event);
};