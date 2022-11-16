import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { BACKGROUND, DARK_GRAY, PRIMARY } from '../Values/Colors';
import { Words } from '../Components/Basic/Words';
import { Auth } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';

export const Settings = () => {
  const navigation = useNavigation();
  return <SafeAreaView style={{flex: 1, backgroundColor: BACKGROUND}}>
    <View style={{flex: 1}}/>
    <TouchableOpacity
      style={{width: '100%',backgroundColor: DARK_GRAY, height: 50, justifyContent: 'center', alignItems: 'center'}}
      onPress={() => {
        Auth.signOut().then(() => {
          // quick flash of white here, I don't like it

          //default screen
          navigation.reset({
            index: 0,
            routes: [{name: 'feed'}]
          })
        })
      }}
    ><Words style={{color: 'red'}}>Sign out</Words></TouchableOpacity>
  </SafeAreaView>
}
