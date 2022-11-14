import appleAuth from '@invertase/react-native-apple-authentication';
import { Auth } from 'aws-amplify';
import jwtDecode from 'jwt-decode';

export const CUSTOM_CHALLENGE = 'CUSTOM_CHALLENGE';

// If decoded is not null, we are logging in after the signup and already have the SIWA token
export const appleSignIn = async (token=null, decoded=null) => {

  if (token === null || decoded == null) {
    let appleAuthRequestResponse;

    try {
      appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL]
      });
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      if (!credentialState === appleAuth.State.AUTHORIZED) {
        console.log('Apple auth not authorized.');
        return;
      }

      token = appleAuthRequestResponse.identityToken;
      decoded = jwtDecode(appleAuthRequestResponse.identityToken);
    } catch (e) {
      console.log('Apple auth error.')
      return;
    }
  }

  const {email} = decoded;
  console.log(decoded);

  Auth.signIn(email)
    .then(result => {
      if(result.challengeName === CUSTOM_CHALLENGE) {
        Auth.sendCustomChallengeAnswer(result, token)
          .then(user => console.log(user))
          .catch(e => console.log(e));

      }
    })
    .catch(err => {
      if (err.code === 'UserNotFoundException') {
        Auth.signUp({
          username: email,
          password: email,
          attributes: {
            email: email,
            'custom:siwa': 'true'
          }
        })
          .then(() => appleSignIn(token, decoded))
          .catch(err => console.log(err))
      } else if (err.code === 'UsernameExistsException') {
        console.log('Need verification')
      }
    });
};

//https://thetravellingsquid.com/2019/05/27/send-emails-with-gmail-using-amazon-simple-email-service/
// is the link you're looking for
export const emailSignIn = email => {
  // not super sure of this and not sure if it works lol let's try it otu
  return new Promise((resolve, reject) => {

    if (email.length === 0)
      return;

    Auth.signIn(email)
      .then(result => {
        console.log(result);
        if (result.challengeName === CUSTOM_CHALLENGE) {
          // Nothing we can do here, we need to wait for user input
          resolve(result);
        }
      })
      .catch(err => {
        if (err.code === 'UserNotFoundException') {
          Auth.signUp({
            username: email,
            password: email,
            attributes: {
              email: email,
              'custom:siwa': 'false'
            }
          })
            .then(() => {
              emailSignIn(email).then(inner => resolve(inner))
            })
            .catch(reject);

        } else if (err.code === 'UsernameExistsException') {
          reject('Need verification');
        }
      });
  });
}

// Unused, for now...
const phoneSignIn = phone => {
  return new Promise((resolve, reject) => {
    const formattedPhone = phone.replaceAll(/[()\-\s]/ig, '');
    if (formattedPhone.length === 0)
      return;

    Auth.signIn(phone)
      .then(result => {
        console.log(result);
        if (result.challengeName === CUSTOM_CHALLENGE)
          resolve(result);
      })
      .catch(err => {
        if (err.code === 'UserNotFoundException') {
          Auth.signUp({
            username: phone,
            password: phone,
            attributes: {
              phone_number: phone,
              'custom:siwa': 'false'
            }
          })
            .then(() => {
              phoneSignIn(phone).then(inner => resolve(inner));
            })
            .catch(reject);

        } else if (err.code === 'UsernameExistsException') {
          reject('Need verification');
        }
      });
  });
}
