import {Text} from 'react-native';
import { TEXT_COLOR } from '../../Values/Colors';
import { FONT } from '../../Values/Styles';

export const Words = props =>
  <Text style={[{ color: TEXT_COLOR, fontFamily: FONT }, props.style]}>{props.children}</Text>;
