import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { BACKGROUND, DARK_GRAY, PRIMARY } from '../../Style/Colors';
//not really sure what to call this but I use this a lot


const SafeBorder = props => {
    return <SafeAreaView style={{backgroundColor: BACKGROUND, flex: 1}}>{
        props.children
    }</SafeAreaView>;
};

export default SafeBorder;
