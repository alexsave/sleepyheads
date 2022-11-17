import { FlatList, SafeAreaView, StyleSheet, useColorScheme, View } from 'react-native';
import NavBar from '../Components/Navigation/NavBar';
import { useContext, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Post } from '../Components/Feed/Post';
import { BACKGROUND } from '../Values/Colors';
import TopBar from '../Components/Navigation/TopBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SleepContext } from '../Providers/SleepProvider';
import { NOT_SIGNED_IN, UserContext } from '../Providers/UserProvider';
import { Auth } from 'aws-amplify';

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

  useEffect(() => {
    // yes, this definitely is called when the app opens due to background delivery. You can assume providers do too.
    SplashScreen.hide();
    console.log('feed use effect called')

    if (username === NOT_SIGNED_IN)
      navigation.navigate('join');

  }, [username]);

  // How do I want to do this?
  // When they open the feed, they'll see all the usual posts of the timeline, but on top of every group timeline,
  // they will see their latest sleep, If auto upload is not enabled.
  // If it is enabled, it'll just upload automatically and they can find it in
  return <SafeAreaView style={backgroundStyle}><View style={{flex: 1}}>

    <TopBar
      //rightText={<Ionicons name='server-outline' size={40}/>}
      //onPressRight={() => navigation.navigate('upload')}
    />
    <FlatList
      data={inHealth}
      renderItem={({item}) => <Post sleepSession={item}/>}
    />
    <NavBar current='feed'/>
  </View></SafeAreaView>
}

