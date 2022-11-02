import { useContext, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { BACKGROUND, PRIMARY } from '../Values/Colors';
import { Words } from '../Components/Basic/Words';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { UserContext } from '../Providers/UserProvider';

export const Join = props => {
  const {username} = useContext(UserContext);

  useEffect(() =>  {

  }, [username]);

  return <SafeAreaView style={{flex: 1, backgroundColor: PRIMARY}}>
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={{height: 100, backgroundColor: BACKGROUND}}
        onPress={() => Join.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Apple})}
      >
        <Words>SIGN IN WITH APPLE</Words>
      </TouchableOpacity>

    </View>
  </SafeAreaView>;
}
