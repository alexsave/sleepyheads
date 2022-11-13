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
    } else if (event.request.userAttributes.hasOwnProperty('email')){
      const email = event.request.userAttributes.email;
      const challengeAnswer = Math.random().toString(10).substring(2, 6);


      const ses = new AWS.SES({region: 'us-west-1'});
      const params = {
        Destination: {
          ToAddresses: [email]
        },
        Message: {
          Body: {
            Text: { Data: 'Your Sleepyheads otp is: ' + challengeAnswer}
          },
          Subject: {
            Data: 'Sleepyheads Verification Code'
          }
        },
        Source: 'verify@sleepyheads.app'

      };

      try {
        let key = await ses.sendEmail(params).promise();
        console.log(`Email sent to ${email} and otp = ${challengeAnswer}`);
      } catch (e) {
        console.log("Failed sending mail", e);
      }

      event.response.privateChallengeParameters = {};
      event.response.privateChallengeParameters.answer = challengeAnswer;
      event.response.privateChallengeParameters.challenge = 'OTP_CHALLENGE';
      event.response.challengeMetadata = 'OTP_CHALLENGE';

    } else if (event.request.userAttributes.hasOwnProperty('phone_number')) {
      // Setting up SMS is too much for now, skipping
      return event;
    }
  }
  console.log(event);
  return event;
};
