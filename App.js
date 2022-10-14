/**
 * Sample React Native App
 * https://github.com/facebook/react-native *
 * @format
 * @flow strict-local
 */

import type { Node } from "react";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, useColorScheme } from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";

import AppleHealthKit from "react-native-health";
import { Words } from "./src/Components/Basic/Words";
import { processSleep } from "./src/Utils/ProcessSleep";
import SplashScreen from "react-native-splash-screen";
import { Post } from "./src/Components/Feed/Post";

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
        SplashScreen.hide();
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
              {sleepData.map(sleepSession => <Post key={sleepSession.bedStart} sleepSession={sleepSession} />)}
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
