/**
 * @type {import('@types/aws-lambda').CreateAuthChallengeTriggerHandler}
 */
const AWS = require('aws-sdk');
exports.handler = (event, context, callback) => {
  console.log(event, context);

  const phoneAuth = phone_number in event.request.userAttributes;
  const siwa = !phoneAuth
  if (phoneAuth){


    const phoneNumber = event.request.userAttributes.phone_number;
    const challengeAnswer = Math.random().toString(10).substring(2, 6);

    console.log(event, context);

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

    event.response.challengeMetadata = 'OTP_CHALLENGE';

    callback(null, event);
  }

  else if (siwa) {
    // The answer is that the JWT was signed by Apple
    //event.response.privateChallengeParameters = {};
    //event.response.privateChallengeParameters.answer = '';

    event.response.challengeMetadata = 'SIWA_CHALLENGE';

    callback(null, event);

  }
  /*if (event.request.session.length === 2 && event.request.challengeName === 'CUSTOM_CHALLENGE') {
    event.response.publicChallengeParameters = { trigger: 'true' };

    event.response.privateChallengeParameters = {};
    event.response.privateChallengeParameters.answer = process.env.CHALLENGEANSWER;
  }
  return event;*/
};
