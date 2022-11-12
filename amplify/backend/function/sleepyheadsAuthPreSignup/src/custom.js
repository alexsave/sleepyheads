/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
  console.log(event);
  event.response.autoConfirmUser = true;

  if (event.request.userAttributes.hasOwnProperty('email')){
    event.response.autoVerifyEmail = true;
  }
  if (event.request.userAttributes.hasOwnProperty('phone_number')){
    event.response.autoVerifyPhone = true;
  }

  return event
};
