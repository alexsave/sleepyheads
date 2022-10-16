import { SafeAreaView, ScrollView, StatusBar, useColorScheme } from 'react-native';
import NavBar from '../Components/Navigation/NavBar';
import AppleHealthKit from 'react-native-health';
import { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { processSleep } from '../Utils/ProcessSleep';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Post } from "../Components/Feed/Post";

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
    ascending: true
  };
  AppleHealthKit.getSleepSamples(options, (error, results) => {
    if (error) {
      console.log(error);
    }
    //console.log(results);
    cb(results);
  });
};

export const Feed = props => {
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

  return <SafeAreaView style={backgroundStyle}>
    <StatusBar
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      backgroundColor={backgroundStyle.backgroundColor}
    />
    <ScrollView
      contentInsetAdjustmentBehavior='automatic'
      style={backgroundStyle}>
      {sleepData.reverse().map(sleepSession => <Post key={sleepSession.bedStart} sleepSession={sleepSession} />)}
    </ScrollView>
    <NavBar/>
  </SafeAreaView>
}

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
