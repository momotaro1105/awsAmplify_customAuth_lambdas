// make sure to add dependency to package.json

const AWS = require('aws-sdk');
const digitGenerator = require('crypto-secure-random-digit');

function sendSMS(phone, code) {
  const params = {
    Message: code,
    PhoneNumber: phone,
  };
  return new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
}

function createAuthChallenge(event) {
  if (event.request.challengeName === 'CUSTOM_CHALLENGE') {
    const challengeCode = digitGenerator.randomDigits(6).join('');
    sendSMS(event.request.userAttributes.phone_number, challengeCode);
  
    event.response.privateChallengeParameters = {};
    event.response.privateChallengeParameters.answer = challengeCode;
  }
}

exports.handler = async (event) => {
  createAuthChallenge(event);
};