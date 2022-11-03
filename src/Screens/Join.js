import { useContext, useEffect, useState } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { BACKGROUND, DARKER, LIGHTER, PRIMARY, TEXT_COLOR } from '../Values/Colors';
import { Words } from '../Components/Basic/Words';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { UserContext } from '../Providers/UserProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';
import { SIGNIN, SIGNUP, SignUpModal } from '../Components/Profile/SignUpModal';

// the login/signup screen
export const Join = props => {
  const {username} = useContext(UserContext);
  const [backgroundText, setBackgroundText] = useState('');

  const [signUpModal, setSignUpModal] = useState(null);

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
              onPress={() => Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Apple})}
            >

              <Words style={{flex: 1, textAlign: 'center'}}><Ionicons name={'logo-apple'} size={40}/></Words>
              <Words style={{flex: 3, textAlign: 'center'}}>Sign in with Apple</Words>

            </TouchableOpacity>

            <TouchableOpacity
              style={{shadowColor: 'black', shadowRadius: 5, shadowOpacity: 1.0, flexDirection: 'row', alignItems: 'center', width: '95%', height: 100, backgroundColor: TEXT_COLOR}}
              onPress={() => setSignUpModal(SIGNUP)}
            >

              <Words style={{flex: 1, textAlign: 'center', color: BACKGROUND}}><Ionicons name={'person-outline'} size={40}/></Words>
              <Words style={{flex: 3, textAlign: 'center', color: BACKGROUND}}>Sign up with username</Words>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center', width: '95%', height: 100, backgroundColor: TEXT_COLOR}}
              onPress={() => setSignUpModal(SIGNIN)}
            >

              <Words style={{flex: 1, textAlign: 'center', color: BACKGROUND}}><Ionicons name={'log-in-outline'} size={40}/></Words>
              <Words style={{flex: 3, textAlign: 'center', color: BACKGROUND}}>Sign in with username</Words>
            </TouchableOpacity>
          </View>
        </View>

        <SignUpModal type={signUpModal} close={() => setSignUpModal(null)}/>


      </SafeAreaView>
    </View>
  </View>;
}
