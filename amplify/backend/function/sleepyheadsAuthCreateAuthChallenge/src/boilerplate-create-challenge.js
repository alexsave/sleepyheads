/**
 * @type {import('@types/aws-lambda').CreateAuthChallengeTriggerHandler}
 */
const AWS = require('aws-sdk');
exports.handler = async event => {
  console.log(event);
  if (event.request.challengeName === 'CUSTOM_CHALLENGE') {
    if (event.request.userAttributes.hasOwnProperty('custom:siwa') &&
      event.request.userAttributes['custom:siwa'] === 'true'
    ) {
      event.response.privateChallengeParameters = {};
      event.response.privateChallengeParameters.answer = event.userName;
      event.response.privateChallengeParameters.challenge = 'SIWA_CHALLENGE';
      event.response.challengeMetadata = 'SIWA_CHALLENGE';

    } else if (event.request.userAttributes.hasOwnProperty('phone_number')) {
      const phoneNumber = event.request.userAttributes.phone_number;
      const challengeAnswer = Math.random().toString(10).substring(2, 6);

      const sns = new AWS.SNS({region: 'us-west-1'});
      sns.publish({
          Message: 'Your otp: ' + challengeAnswer,
          PhoneNumber: phoneNumber,
          MessageStructure: 'string',
          MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
              DataType: 'String',
              StringValue: 'AMPLIFY'
            },
            'AWS.SNS.SMS.SMSType': {
              DataType: 'String',
              StringValue: 'Transactional'
            }
          }


        }, (err, data) => {
          if (err) {
            console.log(err.stack);
            console.log(data);
            return;
          }
          console.log(`SMS sent to ${phoneNumber} and otp = ${challengeAnswer}`);
          return data;
        }
      )
      event.response.privateChallengeParameters = {};
      event.response.privateChallengeParameters.answer = challengeAnswer;
      event.response.privateChallengeParameters.challenge = 'OTP_CHALLENGE';
      event.response.challengeMetadata = 'OTP_CHALLENGE';
    }
  }
  console.log(event);
  return event;
};
