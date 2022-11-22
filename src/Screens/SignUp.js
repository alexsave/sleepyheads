import { TextInput, View } from 'react-native';
import { Words } from '../Components/Basic/Words';
import { BACKGROUND, PRIMARY, TEXT_COLOR } from '../Values/Colors';
import { useState } from 'react';

// We need to somehow disable navigation by sliding from the left
export const SignUp = () => {
  const [name, setName] = useState('');
  return <View style={{flex: 1, backgroundColor: PRIMARY}}>
    <Words>Choose a display name:</Words>

    <TextInput
      // this doesn't have to be a textInput, it could be 4 cool boxes
      value={name}
      onChange={setName}
      style={{color: TEXT_COLOR, height: 50, width: '80%', fontSize: 25, backgroundColor: BACKGROUND, padding: 10}}
      placeholder='Name'
      //autoCapitalize='none'
      textContentType={'name'}
      //keyboardType={'number-pad'}
      onSubmitEditing={() => {
        // create user api call
      }}
    />

  </View>
}
