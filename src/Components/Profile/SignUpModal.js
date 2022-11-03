import { KeyboardAvoidingView, Modal, TextInput, TouchableOpacity, View } from 'react-native';
import { BACKGROUND, DARKER, LIGHTER } from '../../Values/Colors';
import Write from '../Basic/Write';
import { useRef, useState } from 'react';
import { BlurView } from '@react-native-community/blur';
import { Words } from '../Basic/Words';
import { Auth } from 'aws-amplify';

export const SIGNUP = 'SIGNUP'
export const SIGNIN = 'SIGNIN'

// for signing up and signing in
export const SignUpModal = ({type=SIGNUP, close}) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
          value={username}
          onChange={setUsername}
          style={{height: 50, width: '75%', fontSize: 25, backgroundColor: BACKGROUND, padding: 10}}
          placeholder='username'
          autoCapitalize='none'
          autoFocus={true}
          autoCorrect={false}
          returnKeyType={'next'}
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current.focus()}
          textContentType={'username'}

        />
        <Write
          innerRef={passwordRef}
          value={password}
          onChange={setPassword}
          style={{height: 50, width: '75%', fontSize: 25, backgroundColor: BACKGROUND, padding: 10}}
          placeholder='password'
          autoCapitalize='none'
          password={true}
          secureTextEntry={true}
          textContentType={type === SIGNUP ? 'newPassword' : 'password'}
          returnKeyType={'go'}
          onSubmitEditing={formComplete}
          //autoFocus={true}
        />
      </View>
    </TouchableOpacity>


  </Modal>
}
