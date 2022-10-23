import { StyleSheet, SafeAreaView, ScrollView, StatusBar, useColorScheme, View } from 'react-native';
import NavBar from '../Components/Navigation/NavBar';
import { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Post } from '../Components/Feed/Post';
import { loadPosts } from '../Network/PostLoad';

// this is fine to call every time, it'll only bring up the prompt if you add more permissions

export const Feed = props => {
  const [sleepData, setSleepData] = useState([]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    height: '100%',
  };

  useEffect(() => {
    SplashScreen.hide();
    loadPosts(setSleepData);
    /*getSleepPermissions(() =>
      getSleep(sd => setSleepData(processSleep(sd)))
    );*/
    /* Register native listener that will be triggered when successfuly enabled */
  }, []);

  return <SafeAreaView style={backgroundStyle}><View style={{flex: 1}}>

    <StatusBar
      // do we need this?
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      backgroundColor={backgroundStyle.backgroundColor}
    />
    <ScrollView
      contentInsetAdjustmentBehavior='automatic'
      style={backgroundStyle}>
      {sleepData.reverse().map(sleepSession => <Post key={sleepSession.bedStart} sleepSession={sleepSession} />)}
    </ScrollView>
    <NavBar/>
  </View></SafeAreaView>
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
