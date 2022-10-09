import {View} from 'react-native';

export const Row = props =>
    <View style={[{flexDirection: 'row'}, props.style]}>{
        props.children
    }</View>
;
