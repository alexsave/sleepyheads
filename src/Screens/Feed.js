import { AppState, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import NavBar from '../Components/Navigation/NavBar';
import { useContext, useEffect, useRef, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Post } from '../Components/Feed/Post';
import { BACKGROUND } from '../Values/Colors';
import TopBar from '../Components/Navigation/TopBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SleepContext } from '../Providers/SleepProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Words } from '../Components/Basic/Words';

// this is fine to call every time, it'll only bring up the prompt if you add more permissions

export const Feed = props => {
  //const [sleepData, setSleepData] = useState([]);
  const {inHealth} = useContext(SleepContext);

  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? BACKGROUND : Colors.lighter,
    height: '100%',
  };

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const funKey = 'foregrounded';
  const [foregrounded, setForegrounded] = useState([]);

  useEffect(() => {
    SplashScreen.hide();

    (async () => {
      const val = await AsyncStorage.getItem(funKey);
      if (val)
        setForegrounded(JSON.parse(val));

    })();


    /*getSleepPermissions(() =>
      getSleep(sd => setSleepData(processSleep(sd)))
    );*/
    /* Register native listener that will be triggered when successfuly enabled */
    // check this out https://github.com/react-native-push-notification/ios#addnotificationrequest
    const subscription = AppState.addEventListener("change", nextAppState => {
      /*if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {*/
      console.log("App state has changed");

      (async () => {
        let val = await AsyncStorage.getItem(funKey);
        if(val === null)
          val = [];
        else
          val = JSON.parse(val);

        val.push(nextAppState + ' ' + new Date().toLocaleString());
        AsyncStorage.setItem(funKey, JSON.stringify(val));

        // on the swift side, we listen for new INBED values, and then send a notification to the user
        // apple says "HealthKit wakes your app whenever a process saves or deletes samples of the specified type. "
        // if "wakes your app" means what I think it means, we might be able to also handle some things on the RN side


      })();


      //}

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return <SafeAreaView style={backgroundStyle}><View style={{flex: 1}}>

    <TopBar
      rightText={<Ionicons name='server-outline' size={40}/>}
      onPressRight={() => navigation.navigate('upload')}
    />
    <TouchableOpacity onLongPress={() => {
      setForegrounded([]);
      AsyncStorage.removeItem(funKey)
    }}>
      <Words>{JSON.stringify(foregrounded)}</Words>
    </TouchableOpacity>
    <FlatList
      data={inHealth}
      renderItem={({item}) => <Post sleepSession={item}/>}
    />
    <NavBar current='feed'/>
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
