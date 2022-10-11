/**
 * Sample React Native App
 * https://github.com/facebook/react-native *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
    DeviceEventEmitter,
    EventEmitter,
    NativeEventEmitter,
    NativeModules,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import {NativeAppEventEmitter} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import AppleHealthKit, {
    HealthValue,
    HealthKitPermissions,
} from 'react-native-health';
import {Words} from './src/Components/Basic/Words';
import {
    ASLEEP,
    AWAKE,
    CORE,
    DEEP,
    INBED,
    processSleep,
    REM,
} from './src/Utils/ProcessSleep';
import {Row} from './src/Components/Basic/Row';

// this is fine to call every time, it'll only bring up the prompt if you add more permissions
const getSleepPermissions = cb => {
    const permissions = {
        permissions: {
            read: [
                AppleHealthKit.Constants.Permissions.SleepAnalysis,
                AppleHealthKit.Constants.Permissions.StepCount,
            ],
        },
    };
    AppleHealthKit.initHealthKit(permissions, error => {
        if (error) {
            console.log(error);
        } else if (cb) {
            cb();
        }
    });
};

const sleepTypeToColor = value => {
    switch (value) {
        case AWAKE:
            return 'white';
        case INBED:
            return 'gray';
        case CORE:
            return 'blue';
        case REM:
            return 'green';
        case DEEP:
            return 'navy';
        case ASLEEP:
            return 'blue';
    }
};

const getSleep = cb => {
    const startDate = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const options = {
        startDate,
        //ascending: true
    };
    AppleHealthKit.getSleepSamples(options, (error, results) => {
        if (error) {
            console.log(error);
        }
        //console.log(results);
        cb(results);
    });
};

/*
adding chagnes from
/https://github.com/agencyenterprise/react-native-health/pull/247
to fix sleep
 */

// We now have our basic data type:
/*
{
    bedStart: int,
    bedEnd: int,
    samples: [{
        startDiff: int,
        endDiff: int,
        value: AWAKE | INBED | CORE | REM | DEEP | ASLEEP,
    }]
}


Workflow:
The user wakes up, gets a notification that a new sleep is available to upload manually
    Or has it already been uploaded automatically
    To do so, we also need to keep track of new INBED events
    How to do so?


 */

const App: () => Node = () => {
    const [sleepData, setSleepData] = useState([]);

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        height: '100%',
    };

    useEffect(() => {
        getSleepPermissions(() =>
          getSleep(sd => setSleepData(processSleep(sd)))
        );
        /* Register native listener that will be triggered when successfuly enabled */
    }, []);

    // going with https://medium.com/react-native-training/how-to-handle-background-app-refresh-with-healthkit-in-react-native-3a32704461fe

    // fuck that, it's old. Just going to wait for a fix to react-native-health. In the mean time, let's just run a query once an hour and see if any new bed thing pops up
    // then notify the user.

    return (
      <SafeAreaView style={backgroundStyle}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={backgroundStyle}>
              <Words>Step One: Just get the sleep data and display it</Words>
              {sleepData.map(sleepSession => {
                  const duration =
                    new Date(sleepSession.bedEnd) -
                    new Date(sleepSession.bedStart);
                  /*const something = (new Date(sample.endDate) - new Date(sample.startDate)) / 1000 / 100;
                              const pos = (new Date(sample.startDate) - new Date(2022, 8, 29))/1000/ 100;
                              //const pos = new Date(sample.startDate).getTime();
                              //const pos = new Date(2022, 9, 25).getTime();
                              return <View style={{
                              }}>
                                  <Words>{JSON.stringify({...sample})}</Words>
                                  <Words>Height {something}</Words>
                                  <Words>Pos {pos}</Words>
                              </View>*/
                  return (
                    <View
                      style={{
                          //position: 'absolute',
                          //top: pos,
                          //height: 200,
                          borderWidth: 1,
                          borderColor: 'blue',
                          //backgroundColor: sample.value === 'UNKNOWN' ? 'black' : sample.value === 'ASLEEP' ? 'blue': 'green',
                          //zIndex: sample.value === 'INBED' ? -1: 1,
                          //height: something,
                          key: sleepSession.startDate,
                      }}>
                        <Words>{duration}</Words>
                        <Row style={{height: 200}}>
                            {sleepSession.samples.map(sample => {
                                return (
                                  <View style={{
                                      position: 'absolute',
                                      //top: sample.start/1000,
                                      //height: (sample.end - sample.start)/1000,
                                      //bottom: sample.end/1000,
                                      //top: 0,
                                      //bottom: 0,

                                      //height: sample.,
                                      //left: 0,
                                      left:
                                        (sample.start / duration) *
                                        100 +
                                        '%',
                                      height: 100,
                                      width:
                                        ((sample.end -
                                            sample.start) /
                                          duration) *
                                        100 +
                                        '%',
                                      backgroundColor:
                                        sleepTypeToColor(
                                          sample.value,
                                        ),
                                      key: sample.end,
                                  }}
                                  />
                                );
                            })}
                        </Row>
                    </View>
                  );
              })}
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
