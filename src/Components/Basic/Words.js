import {Text} from 'react-native';
import { TEXT_COLOR } from '../../Values/Colors';

export const Words = props =>
  <Text style={[{ color: TEXT_COLOR }, props.style]}>{props.children}</Text>;
