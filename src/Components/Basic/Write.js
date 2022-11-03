import React from 'react';
import { TextInput } from 'react-native';
import { TEXT_COLOR } from '../../Values/Colors';

//my own text input, just want to keep style consistent
export const Write = ({value, onChange, style, ...props}) =>
  <TextInput
    style={[{color: TEXT_COLOR}, style]}
    value={value}
    //multiline={true}
    blurOnSubmit={true}
    placeholder={''}
    placeholderTextColor={'gray'}
    //onSubmitEditing could be very useful method to use
    onChangeText={onChange}
    //keyboardType="default"
    returnKeyType="done"
    {...{...props}}
  />;


export default Write;
