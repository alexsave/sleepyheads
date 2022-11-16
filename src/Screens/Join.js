import { useContext, useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { BACKGROUND, PRIMARY, TEXT_COLOR } from '../Values/Colors';
import { Words } from '../Components/Basic/Words';
import { ANONYMOUS, NOT_SIGNED_IN, UserContext } from '../Providers/UserProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';
import { SignUpModal } from '../Components/Profile/SignUpModal';
import { appleSignIn } from '../Network/Login';
import { BACKGROUND_ZZZ } from '../Values/Styles';

// the login/signup screen
export const Join = props => {
  const {username, setUsername} = useContext(UserContext);
  const navigation = useNavigation();

  const [signUpModal, setSignUpModal] = useState(false);

  useEffect(() =>  {
    if (username && username !== NOT_SIGNED_IN)
      navigation.goBack();
  }, [username]);

  return <View style={{flex: 1, backgroundColor: PRIMARY}}>
    <View style={{flex: 1}}>

      <Words style={{position: 'absolute', width: '200%', textAlign: 'center', fontSize: 65}}>{BACKGROUND_ZZZ}</Words>
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
              onPress={() => setSignUpModal(true)}
            >
              <Words style={{flex: 1, textAlign: 'center', color: BACKGROUND}}><Ionicons name={'mail-outline'} size={40}/></Words>
              <Words style={{flex: 3, textAlign: 'center', color: BACKGROUND}}>Sign in with email</Words>
            </TouchableOpacity>


            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '95%', height: 100, }}
              onPress={() => setUsername(ANONYMOUS)}
            >
              <Words style={{textAlign: 'center', color: 'gray', textDecorationLine: 'underline'}}>Try offline</Words>
            </TouchableOpacity>


          </View>
        </View>

        <SignUpModal visible={signUpModal} close={() => setSignUpModal(false)}/>


      </SafeAreaView>
    </View>
  </View>;
}
