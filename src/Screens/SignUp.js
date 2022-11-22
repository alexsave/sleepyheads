import { SafeAreaView, TextInput, View } from 'react-native';
import { Words } from '../Components/Basic/Words';
import { BACKGROUND, PRIMARY, TEXT_COLOR } from '../Values/Colors';
import { useContext, useState } from 'react';
import { UserContext } from '../Providers/UserProvider';
import { useNavigation } from '@react-navigation/native';

// We need to somehow disable navigation by sliding from the left
export const SignUp = () => {
  const [name, setName] = useState('');
  const {makeUser} = useContext(UserContext);

  const navigation = useNavigation();


  return <View style={{flex: 1, backgroundColor: PRIMARY}}>
    <SafeAreaView>

      <Words>Choose a display name:</Words>
      <Words style={{fontSize: 10}}>(You can change it later)</Words>

      <TextInput
        // this doesn't have to be a textInput, it could be 4 cool boxes
        value={name}
        onChangeText={setName}
        style={{color: TEXT_COLOR, height: 50, width: '80%', fontSize: 25, backgroundColor: BACKGROUND, padding: 10}}
        placeholder='Name'
        //autoCapitalize='none'
        textContentType={'name'}
        returnKeyType={'go'}
        //keyboardType={'number-pad'}
        onSubmitEditing={async () =>{

          if (!(await makeUser(name)))
            return;

          navigation.reset({
            index: 0,
            routes: [{name: 'feed'}]
          })
          // create user api call
        }}
      />
    </SafeAreaView>

  </View>
}
