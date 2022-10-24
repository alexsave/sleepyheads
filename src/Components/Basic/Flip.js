import React from 'react';
import { Switch } from 'react-native';
import { BACKGROUND, DARK_GRAY, PRIMARY } from '../../Values/Colors';
//pretty much text but not

const Flip = ({onChange, value}) =>
    <Switch
        trackColor={{ false: DARK_GRAY, true: PRIMARY }}
        thumbColor={BACKGROUND}
        ios_backgroundColor={DARK_GRAY}
        onValueChange={onChange}
        value={value}
    />
;

export default Flip;
