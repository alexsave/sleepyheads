import React from 'react';

//this is the header and the footer combined into one
import { SafeAreaView, View } from 'react-native';
import NavBar from './NavBar';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import TopBar from './TopBar';
import { BACKGROUND, PRIMARY } from "../../Values/Colors";

const GRADIENT_HEIGHT = 70;

//combination of header and navbar
const HeaderFooter = props => {
    return <SafeAreaView style={{backgroundColor: BACKGROUND, flex: 1}}>
        <TopBar {...props}/>
        <Svg width={'100%'} height={GRADIENT_HEIGHT} style={{zIndex: 1, position: 'absolute'}}>
            <Defs>
                <LinearGradient id='grad' x1='0' y1='0' x2='0' y2='1'>
                    <Stop offset='0' stopColor={PRIMARY} stopOpacity={1}/>
                    <Stop offset='1' stopColor={BACKGROUND} stopOpacity={1}/>
                </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width={'100%'} height={GRADIENT_HEIGHT} fill={'url(#grad)'}/>
        </Svg>
        <View style={{flex: 1, zIndex: 3}}>{
            props.children
        }<NavBar current={props.screen}/>
        </View>
    </SafeAreaView>;
};

export default HeaderFooter;
