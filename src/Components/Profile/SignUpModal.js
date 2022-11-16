import { Modal, TextInput, TouchableOpacity, View } from 'react-native';
import { BACKGROUND, DARKER, LIGHTER, TEXT_COLOR } from '../../Values/Colors';
import Write from '../Basic/Write';
import { useEffect, useRef, useState } from 'react';
import { Words } from '../Basic/Words';
import { Auth } from 'aws-amplify';
import { emailSignIn } from '../../Network/Login';

// for signing up and signing in
export const SignUpModal = ({visible, close}) => {

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

  const handleOTPChange = text => {
    setOtp(text);
    if (text.length === 4) {
      // Turn off keyboard
      otpRef.current.blur();
      Auth.sendCustomChallengeAnswer(session, val)
        .then(res => {
          close();
        })
        .catch(e => {
          otpRef.current.focus();
          //probably wrong code, clear otp field
          setOtp('');
        })
    }
  };

  return <Modal animationType={'slide'} transparent={true} visible={visible}>
    <TouchableOpacity
      onPress={close}
      style={{alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}
    >
      <View
        style={{height: 200, width: '95%', backgroundColor: LIGHTER, borderWidth: 1, borderColor: DARKER, borderRadius: 10, alignItems: 'center', justifyContent: 'space-around', padding: 10}}
      >
        <Words style={{fontSize: 40, fontWeight: 'bold'}}>Sign In</Words>
        <Write
          value={email}
          onChange={setEmail}
          style={{height: 50, width: '80%', fontSize: 25, backgroundColor: BACKGROUND, padding: 10}}
          placeholder='email address'
          autoCapitalize='none'
          autoFocus={true}
          autoCorrect={false}
          //returnKeyType={'done'}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            setWaitingForOtp(true);
            emailSignIn(email).then(setSession);
          }}
          textContentType={'emailAddress'}
          keyboardType={'email-address'}

        />
        <TextInput
          // this doesn't have to be a textInput, it could be 4 cool boxes
          ref={otpRef}
          value={otp}
          onChangeText={handleOTPChange}
          style={{display: waitingForOtp? 'inline':'none', color: TEXT_COLOR, height: 50, width: '80%', fontSize: 25, backgroundColor: BACKGROUND, padding: 10}}
          placeholder='OTP code'
          autoCapitalize='none'
          password={true}
          secureTextEntry={true}
          textContentType={'oneTimeCode'}
          keyboardType={'number-pad'}
        />
      </View>
    </TouchableOpacity>


  </Modal>
}
