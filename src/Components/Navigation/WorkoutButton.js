import React, { useContext } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import Words from '../Simple/Words';
import { WorkoutContext } from '../../Contexts/WorkoutProvider';
import { RoutinesContext } from '../../Contexts/RoutinesProvider';
import { useNavigation } from '@react-navigation/native';
import { TEXT_COLOR } from '../../Style/Colors';

const WorkoutButton = () => {
    const {getCurrent, checkRest} = useContext(RoutinesContext);
    const {generateCustom, createWorkout} = useContext(WorkoutContext);

    const navigation = useNavigation();

    const customStart = () => {
        //set up
        generateCustom();
        navigation.navigate('workout');
    };

    //need to fucking redo this whole thing too
    const routineStart = async () => {
        const currentR = getCurrent();

        if(!currentR){
            navigation.navigate('chooseroutine');
            return;
        }

        //if it's a rest day, ask for confirmation
        let isRest = checkRest();

        if(!isRest){
            //no it's possible it's already loaded
            createWorkout();
            navigation.navigate('workout');
            return;
        }

        //rest day
        Alert.alert(
            "Recovery Day",
            "Skip recovery day?",
            [
                {
                    text: "Cancel",//don't do the workout
                    style: "cancel"
                },
                {
                    text: "Skip",
                    onPress: () => {
                        createWorkout();
                        navigation.navigate('workout');
                    },
                }
            ],
            {cancelable: false}
        );
    };

    let icon = 'barbell';

    return (<TouchableOpacity style={styles.workoutButton} key={'workout'} onPress={routineStart} onLongPress={customStart}>
        <Words>
            ⬆️
        </Words>
    </TouchableOpacity>);
};
const styles = StyleSheet.create({
    //kinda squishes the other buttons, but whatever
    workoutButton:{
        backgroundColor: 'red',
        height: 80,
        width: 80,
        bottom: 10,
        //this
        marginHorizontal: -10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
    },
});

export default WorkoutButton;
