import { AppState, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import NavBar from '../Components/Navigation/NavBar';
import { useContext, useEffect, useRef, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Post } from '../Components/Feed/Post';
import { BACKGROUND, PRIMARY } from '../Values/Colors';
import TopBar from '../Components/Navigation/TopBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SleepContext } from '../Providers/SleepProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../Providers/UserProvider';
import { Auth, Hub } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { Words } from '../Components/Basic/Words';

// this is fine to call every time, it'll only bring up the prompt if you add more permissions

export const Feed = props => {
  //const [sleepData, setSleepData] = useState([]);
  const {username} = useContext(UserContext);
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
    // yes, this definitely is called when the app opens due to background delivery. You can assume providers do too.
    SplashScreen.hide();

    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          console.log(data);
          break;
        case "signOut":
          console.log(null);
          break;
        case "customOAuthState":
          console.log(data);
      }
    });

    Auth.currentAuthenticatedUser()
      .then(currentUser => console.log(currentUser))
      .catch(() => console.log("Not signed in"));

    return unsubscribe;

  }, []);


  //probably not the best place to put this
  if (!username){
    return <SafeAreaView style={{flex: 1, backgroundColor: PRIMARY}}>
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={{height: 100, backgroundColor: BACKGROUND}}
          onPress={() => Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Apple})}
        >
          <Words>SIGN IN WITH APPLE</Words>
        </TouchableOpacity>

      </View>
    </SafeAreaView>;
  }

  return <SafeAreaView style={backgroundStyle}><View style={{flex: 1}}>

    <TopBar
      rightText={<Ionicons name='server-outline' size={40}/>}
      onPressRight={() => navigation.navigate('upload')}
    />
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
