/**
 * @type {import('@types/aws-lambda').VerifyAuthChallengeResponseTriggerHandler}
 */
const verifyAppleToken = require('verify-apple-id-token').default;
exports.handler = async event => {
  console.log(event);
  let challenge = event.request.privateChallengeParameters.challenge;

  if (challenge === 'OTP_CHALLENGE'){
    if (event.request.privateChallengeParameters.answer === event.request.challengeAnswer)
      event.response.answerCorrect = true;
    else
      event.response.answerCorrect = false;

  } else if (challenge === 'SIWA_CHALLENGE'){

    try {

      const jwtClaims = await verifyAppleToken({
        idToken: event.request.challengeAnswer,
        clientId: "com.roqyt.sleepyheads"
      });
      console.log(jwtClaims);
      if (jwtClaims.email === event.request.privateChallengeParameters.answer) {
        event.response.answerCorrect = true;
      } else {
        event.response.answerCorrect = true;
      }


    } catch (e) {
      event.response.answerCorrect = false;

    }

  } else {
    event.response.answerCorrect = false;
  }
  return event;
};
