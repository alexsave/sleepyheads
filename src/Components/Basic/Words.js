import {Text} from 'react-native';

export const Words = props =>
  <Text style={[{ color: "white" }, props.style]}>{props.children}</Text>;
