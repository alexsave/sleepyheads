import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
//import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
//import { UserContext } from '../../Contexts/UserProvider';
import { Words } from "../Basic/Words";
import { DARKER } from "../../Values/Colors";
import Ionicons from 'react-native-vector-icons/Ionicons';

const routes = [
    'feed',
    'search',
    'profile',
];

const iconMapping = {
    feed: 'home',
    search: 'search',
    profile: 'person',
};

const NavBar = props => {
    //const {username} = useContext(UserContext);

    const navigation = useNavigation();

    const currentPage = props.current;
    const handlePress = (r) => {
        if (r === currentPage)
            return;

        if (r === 'profile')
            //navigation.replace(r, {userID: username});
            navigation.reset({index: 0, routes: [{name:r}]});
        else
            navigation.reset({index: 0, routes: [{name:r}]});
    };

    return (<View style={styles.navBar}>{
        routes.map(r => {
            let icon = iconMapping[r];
            if (r !== currentPage)
                icon += '-outline'

            if (r === 'workout') {
                //return <WorkoutButton key={r}/>
            }

            return (<TouchableOpacity style={styles.button} key={r} onPress={() => handlePress(r)}>
                <Words><Ionicons name={icon} size={40}/></Words>
            </TouchableOpacity>); })
    }</View>);
};
//needs to be placed in safeareaview and view with flex:1
const styles = StyleSheet.create({
    navBar: {
        height: 60,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: 'black',
        justifyContent: 'space-around',
        borderColor: DARKER,
        borderTopWidth: StyleSheet.hairlineWidth,
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
    },
});

export default NavBar;
