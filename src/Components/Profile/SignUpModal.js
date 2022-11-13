import { KeyboardAvoidingView, Modal, TextInput, TouchableOpacity, View } from 'react-native';
import { BACKGROUND, DARKER, LIGHTER } from '../../Values/Colors';
import Write from '../Basic/Write';
import { useEffect, useRef, useState } from 'react';
import { BlurView } from '@react-native-community/blur';
import { Words } from '../Basic/Words';
import { Auth } from 'aws-amplify';
import { CUSTOM_CHALLENGE } from '../../Network/Login';

export const SIGNUP = 'SIGNUP'
export const SIGNIN = 'SIGNIN'

// for signing up and signing in
export const SignUpModal = ({type=SIGNUP, close}) => {

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [waitingForOtp, setWaitingForOtp] = useState(false);

  const formComplete = async () => {
    try {
      if (type === SIGNUP) {
        const {user} = await Auth.signUp({username, password, autoSignIn: {enabled: true}});
        console.log(user);

      } else if (type === SIGNIN) {
        await Auth.signIn(username, password);
      }
    } catch (e) {
      console.log(e, 'deez nuts');
    }
  };

  const passwordRef = useRef();

  useEffect(() => {
    // if we set waitingForOtp to true, we assume
    if(waitingForOtp)
      passwordRef.current.focus()

  }, [waitingForOtp]);

  const [session, setSession] = useState(null);

  const phoneSignIn = () => {
    setWaitingForOtp(true);
    Auth.signIn(phone)
      .then(result => {
        setSession(result);
        console.log(result);
        if(result.challengeName === CUSTOM_CHALLENGE){
          // nothign we can do here, we need to wait for user input
          setSession(res);
        }
      })
      .catch(err => {
        console.log(err);
        if (err.code === 'UserNotFoundException'){
          Auth.signUp({
            username: phone,
            password, phone,
            attributes: {
              'custom:siwa': 'false'
            }
          })
            .then(result => {
              Auth.signIn(phone)
                .then(res => {
                  if(res.challengeName === CUSTOM_CHALLENGE) {
                    //also just wait
                    setSession(res);
                  }
                })
            }).catch(e => console.log(e))

        } else if (err.code === 'UsernameExistsException') {
          console.log('need verification')
        }
      })

  }

  const verifyPhone = () => {
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
          value={phone}
          onChange={setPhone}
          style={{height: 50, width: '75%', fontSize: 25, backgroundColor: BACKGROUND, padding: 10}}
          placeholder='phone number'
          autoCapitalize='none'
          autoFocus={true}
          autoCorrect={false}
          returnKeyType={'done'}
          blurOnSubmit={false}
          onSubmitEditing={phoneSignIn}
          textContentType={'telephoneNumber'}
          keyboardType={'phone-pad'}

        />

        <TextInput
          ref={passwordRef}
          value={otp}
          onChange={setOtp}
          style={{display: waitingForOtp? 'inline':'none', height: 50, width: '75%', fontSize: 25, backgroundColor: BACKGROUND, padding: 10}}
          placeholder='OTP code'
          autoCapitalize='none'
          password={true}
          secureTextEntry={true}
          textContentType={'oneTimeCode'}
          returnKeyType={'go'}
          onSubmitEditing={verifyPhone}
          keyboardType={'number-pad'}
        />
      </View>
    </TouchableOpacity>


  </Modal>
}
