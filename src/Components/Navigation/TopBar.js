import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Words } from '../Basic/Words';
import { DARKER, PRIMARY } from '../../Values/Colors';
//again, this appears in nearly every screen

//this takes rightText, onPressLeft, title, onPressRight, and rightText
const TopBar = ({leftText, onPressLeft, title, onPressRight, rightText}) => {
    //const {leftText, onPressLeft, title, onPressRight, rightText} = props;
    return <View style={{ zIndex: 5, alignItems: 'center', right:0,left: 0, top: 0, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: DARKER, height: 60, justifyContent: 'center'}}>
        <View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, top: 0, left: 0}}>
            <TouchableOpacity onPress={onPressLeft} style={styles.topButton}>
                <Words style={{fontSize: 30}}>{leftText}</Words>
            </TouchableOpacity>
        </View>

        <Words style={{fontSize: 30, fontWeight: 'bold'}}>{title}</Words>

        <View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, top: 0, right: 0}}>
            <TouchableOpacity onPress={onPressRight} style={styles.topButton}>
                <Words style={{fontSize: 30, textAlign: 'right'}}>{rightText}</Words>
            </TouchableOpacity>
        </View>
    </View>
/*
    return <View style={styles.top}>
        <View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, top: 0, right: 0}}>
            <TouchableOpacity onPress={onPressLeft} style={styles.topButton}>
                <Words style={{fontSize: 30}}>{leftText}</Words>
            </TouchableOpacity>
        </View>


    </View>*/
};

const styles = StyleSheet.create({
    top: {
        height: 120,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: PRIMARY,
        alignItems: 'center',
        justifyContent: 'center'

    },
    topButton: {
        alignItems: 'center',
        width: 100,
        paddingHorizontal: 15,
    },
});

export default TopBar;
