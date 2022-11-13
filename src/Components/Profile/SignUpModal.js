import { KeyboardAvoidingView, Modal, TextInput, TouchableOpacity, View } from 'react-native';
import { BACKGROUND, DARKER, LIGHTER } from '../../Values/Colors';
import Write from '../Basic/Write';
import { useEffect, useRef, useState } from 'react';
import { Words } from '../Basic/Words';
import { Auth } from 'aws-amplify';
import { CUSTOM_CHALLENGE } from '../../Network/Login';

export const SIGNUP = 'SIGNUP'
export const SIGNIN = 'SIGNIN'

// for signing up and signing in
export const SignUpModal = ({type=SIGNUP, close}) => {

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [waitingForOtp, setWaitingForOtp] = useState(false);

  const otpRef = useRef();

  useEffect(() => {
    // if we set waitingForOtp to true, we assume
    if(waitingForOtp)
      otpRef.current.focus()

  }, [waitingForOtp]);

  const [session, setSession] = useState(null);

  const emailSignIn = () => {

    // not super sure of this but it works
    //const formattedPhone = phone.replaceAll(/[()\-\s]/ig, '');

    if(email.length === 0)
      return;

    setWaitingForOtp(true);
    Auth.signIn(email)
      .then(result => {
        setSession(result);
        console.log(result);
        if(result.challengeName === CUSTOM_CHALLENGE){
          // nothign we can do here, we need to wait for user input
          setSession(result);
        }
      })
      .catch(err => {
        console.log('58', err);
        if (err.code === 'UserNotFoundException'){
          Auth.signUp({
            username: email,
            password: email,
            attributes: {
              email: email,
              'custom:siwa': 'false'
            }
          })
            .then(result => {
              Auth.signIn(email)
                .then(res => {
                  if(res.challengeName === CUSTOM_CHALLENGE) {
                    //also just wait
                    setSession(res);
                  }
                })
            }).catch(e => console.log('75', e))

        } else if (err.code === 'UsernameExistsException') {
          console.log('need verification')
        }
      })

  }

  const verifyEmail = () => {
    //better hope this is called after setSession lol
    if (!session)
      console.log('try again in like a second');

    Auth.sendCustomChallengeAnswer(session, otp)
      .then(res => {
        //this should sign us in
        console.log(res)
      })
      .catch(e => {
        //probably wrong code, clear otp field
        setOtp('');
        console.log(e)
      })
  }

  return <Modal animationType={'slide'} transparent={true} visible={!!type}>
    <TouchableOpacity
      onPress={close}
      style={{alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}
    >
      <View
        style={{height: 200, width: '95%', backgroundColor: LIGHTER, borderWidth: 1, borderColor: DARKER, borderRadius: 10, alignItems: 'center', justifyContent: 'space-around', padding: 10}}
      >
        <Words style={{fontSize: 40, fontWeight: 'bold'}}>{type === SIGNUP ? 'Sign Up' : 'Sign In'}</Words>
        <Write
          value={email}
          onChange={setEmail}
          style={{height: 50, width: '75%', fontSize: 25, backgroundColor: BACKGROUND, padding: 10}}
          placeholder='email address'
          autoCapitalize='none'
          autoFocus={true}
          autoCorrect={false}
          //returnKeyType={'done'}
          blurOnSubmit={false}
          onSubmitEditing={emailSignIn}
          textContentType={'emailAddress'}
          keyboardType={'email-address'}

        />
        <TextInput
          ref={otpRef}
          value={otp}
          onChange={setOtp}
          style={{display: waitingForOtp? 'inline':'none', height: 50, width: '75%', fontSize: 25, backgroundColor: BACKGROUND, padding: 10}}
          placeholder='OTP code'
          autoCapitalize='none'
          password={true}
          secureTextEntry={true}
          textContentType={'oneTimeCode'}
          returnKeyType={'go'}
          onSubmitEditing={verifyEmail}
          keyboardType={'number-pad'}
        />
      </View>
    </TouchableOpacity>


  </Modal>
}
