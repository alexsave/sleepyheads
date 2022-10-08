/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';

import AppleHealthKit, {
    HealthValue,
    HealthKitPermissions
} from 'react-native-health';
import {Words} from './src/Components/Basic/Words';
import {processSleep} from './src/Utils/ProcessSleep';


const getSleepPermissions = cb => {
    const permissions = {
        permissions: {
            read: [AppleHealthKit.Constants.Permissions.SleepAnalysis]
        }
    };
    AppleHealthKit.initHealthKit(permissions, error => {
        if (error)
            console.log(error);
        else
            cb();
    });
};


const getSleep = cb => {
    const startDate = new Date(Date.now() - 7*24*60*60*1000).toISOString();
    const options = {
        startDate,
        ascending: true
    };
    AppleHealthKit.getSleepSamples(options, (error, results) => {

        if (error) console.log(error);
        //console.log(results);
        cb(results);
    })
}

/*
adding chagnes from
/https://github.com/agencyenterprise/react-native-health/pull/247
to fix sleep
 */

const App: () => Node = () => {
    const [sleepData, setSleepData] = useState([]);

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        height: '100%'
    };

    useEffect(() => {
        getSleep(sd => setSleepData(processSleep(sd)));

    }, []);

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <View style={{backgroundColor: 'red'}}>
                    <Text>Hello</Text>
                </View>
                <Words>Step One: Just get the sleep data and display it</Words>
                {
                    sleepData.map(sample => {
                            const something = (new Date(sample.endDate) - new Date(sample.startDate)) / 1000 / 100;
                            const pos = (new Date(sample.startDate) - new Date(2022, 8, 29))/1000/ 100;
                            //const pos = new Date(sample.startDate).getTime();
                            //const pos = new Date(2022, 9, 25).getTime();
                            return <View style={{
                                position: 'absolute',
                                top: pos,
                                //borderWidth: 1,
                                borderColor: 'blue',
                                backgroundColor: sample.value === 'UNKNOWN' ? 'black' : sample.value === 'ASLEEP' ? 'blue': 'green',
                                zIndex: sample.value === 'INBED' ? -1: 1,
                                height: something,
                                key: sample.id
                            }}>
                                <Words>{JSON.stringify({...sample})}</Words>
                                <Words>Height {something}</Words>
                                <Words>Pos {pos}</Words>
                            </View>
                        }
                    )
                }
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;
