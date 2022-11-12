import { useContext, useEffect, useState } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { Linking, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { BACKGROUND, DARKER, LIGHTER, PRIMARY, TEXT_COLOR } from '../Values/Colors';
import { Words } from '../Components/Basic/Words';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { ANONYMOUS, UserContext } from '../Providers/UserProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';
import { SIGNIN, SIGNUP, SignUpModal } from '../Components/Profile/SignUpModal';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Authenticator, Greetings, SignUp } from 'aws-amplify-react-native/src/Auth';
import appleAuth from '@invertase/react-native-apple-authentication';
import jwtDecode from 'jwt-decode';


// the login/signup screen
export const Join = props => {
  const {username, setUsername} = useContext(UserContext);
  const [backgroundText, setBackgroundText] = useState('');

  const [signUpModal, setSignUpModal] = useState(null);

  const [session, setSession] = useState(null);
  const [appleToken, setAppleToken] = useState(null);

  const signOut = () => {};
  const signIn = (cred) => {
    Auth.signIn(cred)
      .then(result => {
        setSession(result)
        console.log(result);
      })
      .catch(err => {
        console.log(err)
        if (err.code === 'UserNotFoundException') {
          signUp(cred);
        } else if (err.code === 'UsernameExistsException') {
          console.log('need verification')
        }

      })

  };
  const signUp = async (cred) => {
    const result = await Auth.signUp({
      username: cred,
      password: cred,
      attributes: {
        //phone_number:
      }

    })

  };
  const verifyApple = (session, token) => {
    // no, this isn't it, the user is empty for some reason
    Auth.sendCustomChallengeAnswer(session, token).then(idk => {
      console.log(idk)

    }).catch(e => console.log('61', e))

  };
  const verifyAuth = () => {};

  const appleSignIn = async () => {
    let appleAuthRequestResponse;
    try {

      appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL]
      })
      //console.log('apple auth response', appleAuthRequestResponse);

      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      if (credentialState === appleAuth.State.AUTHORIZED) {
        setAppleToken(appleAuthRequestResponse.identityToken);

        const decoded = jwtDecode(appleAuthRequestResponse.identityToken);
        const {email, email_verified, is_private_email, sub} = decoded
        //console.log(decoded);
        //signIn(email);
        Auth.signIn(email)
          .then(result => {
            setSession(result)
            console.log(result);
            if(result.challengeName === 'CUSTOM_CHALLENGE'){
              verifyApple(result, appleAuthRequestResponse.identityToken);

            }
              console.log('we got em 96')
          })
          .catch(err => {
            console.log(err)
            if (err.code === 'UserNotFoundException') {
              Auth.signUp({
                username: email,
                password: email,
                attributes: {
                  //email: email,
                  'custom:siwa': 'true'
                }
              })
                .then(result => {
                  if(result.challengeName === 'CUSTOM_CHALLENGE')
                    console.log('we got em 104')
                  Auth.signIn(email )
                    .then(res=> {
                      if(res.challengeName === 'CUSTOM_CHALLENGE')
                        console.log('we got em 106')

                      console.log(res)
                      verifyApple(res, appleAuthRequestResponse.identityToken);
                    })
                    .catch(e => console.log(e));
                  console.log(result);
                })
                .catch(err => console.log(err))
              //signUp(cred);
            } else if (err.code === 'UsernameExistsException') {
              console.log('need verification')
            }

          })

        // Try to sign in


      } else {
        console.log(credentialState);
      }

    } catch (e) {

    }
  };



  useEffect(() =>  {
    setBackgroundText([...Array(120)].fill('😴 '))
  }, [username]);

  return <View style={{flex: 1, backgroundColor: PRIMARY}}>
    <View style={{flex: 1}}>

      <Words style={{position: 'absolute', width: '200%', textAlign: 'center', fontSize: 65}}>{backgroundText}</Words>
      <BlurView
        style={{position: 'absolute',/*has to match svg*/ height: '100%', width: '100%'}}
        blurType='dark'//dark not bad
        blurAmount={1}
        reducedTransparencyFallbackColor={'black'}/>


      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'center'}}>

          <Words
            style={{transform: [{rotate: '-30deg'}], fontSize: 50, fontWeight: 'bold', textAlign: 'center'}}
          >Join the <Words style={{color: 'red'}}>SLEEPYHEADS</Words>{'\n'}</Words>
        </View>

        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{alignItems: 'center', justifyContent: 'space-around'}}>

            <TouchableOpacity
              style={{shadowColor: 'black', shadowRadius: 5, shadowOpacity: 1.0,flexDirection: 'row', alignItems: 'center', marginBottom: 20, width: '95%', height: 100, backgroundColor: BACKGROUND}}
              onPress={appleSignIn}//Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Apple})}
            >

              <Words style={{flex: 1, textAlign: 'center'}}><Ionicons name={'logo-apple'} size={40}/></Words>
              <Words style={{flex: 3, textAlign: 'center'}}>Sign in with Apple</Words>

            </TouchableOpacity>

            <TouchableOpacity
              style={{shadowColor: 'black', shadowRadius: 5, shadowOpacity: 1.0, flexDirection: 'row', alignItems: 'center', width: '95%', height: 100, backgroundColor: TEXT_COLOR}}
              onPress={() => setSignUpModal(SIGNUP)}
            >
              <Words style={{flex: 1, textAlign: 'center', color: BACKGROUND}}><Ionicons name={'call-outline'} size={40}/></Words>
              <Words style={{flex: 3, textAlign: 'center', color: BACKGROUND}}>Sign up with username</Words>
            </TouchableOpacity>


            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center', width: '95%', height: 100, backgroundColor: TEXT_COLOR}}
              onPress={() => setSignUpModal(SIGNIN)}
            >
              <Words style={{flex: 1, textAlign: 'center', color: BACKGROUND}}><Ionicons name={'log-in-outline'} size={40}/></Words>
              <Words style={{flex: 3, textAlign: 'center', color: BACKGROUND}}>Sign in with username</Words>
            </TouchableOpacity>

            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '95%', height: 100, }}
              onPress={() => setUsername(ANONYMOUS)}
            >
              <Words style={{textAlign: 'center', color: 'gray', textDecorationLine: 'underline'}}>Try offline</Words>
            </TouchableOpacity>


          </View>
        </View>

        <SignUpModal type={signUpModal} close={() => setSignUpModal(null)}/>


      </SafeAreaView>
    </View>
  </View>;
}
