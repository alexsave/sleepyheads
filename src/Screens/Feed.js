import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import NavBar from '../Components/Navigation/NavBar';
import { useContext, useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Post } from '../Components/Feed/Post';
import { BACKGROUND, DARKER, PRIMARY } from '../Values/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SleepContext } from '../Providers/SleepProvider';
import { NOT_SIGNED_IN, UserContext } from '../Providers/UserProvider';
import { GLOBAL, GroupContext } from '../Providers/GroupProvider';
import { Words } from '../Components/Basic/Words';
import { GroupModal } from '../Components/Feed/GroupModal';
import { SocialContext } from '../Providers/SocialProvider';

export const Feed = () => {
  //const [sleepData, setSleepData] = useState([]);
  const {username} = useContext(UserContext);
  const {recentSleep} = useContext(SleepContext);
  const {groupID, getGroupName, setGroupID} = useContext(GroupContext);
  const {posts, getAdditionalPosts} = useContext(SocialContext);

  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? BACKGROUND : Colors.lighter,
    height: '100%',
  };

  useEffect(() => SplashScreen.hide(), []);

  useEffect(() => {
    // yes, this definitely is called when the app opens due to background delivery. You can assume providers do too.
    console.log('feed use effect called')

    if (username === NOT_SIGNED_IN)
      navigation.navigate('join');
    else
      setGroupID(GLOBAL); //global
  }, [username]);

  const [groupModalVisible, setGroupModalVisible] = useState(false);

  // How do I want to do this?
  // When they open the feed, they'll see all the usual posts of the timeline, but on top of every group timeline,
  // they will see their latest sleep, If auto upload is not enabled.
  // If it is enabled, it'll just upload automatically and they can find it in
  return <SafeAreaView style={backgroundStyle}><View style={{flex: 1}}>

    <View style={{ zIndex: 5, alignItems: 'center', right:0,left: 0, top: 0, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: DARKER, height: 60, justifyContent: 'center'}}>

      <TouchableOpacity onPress={() => {
        setGroupModalVisible(true);
        //open group view
      }}>
        <Words style={{fontSize: 30, fontWeight: 'bold'}}>{getGroupName(groupID)}<Ionicons size={30} name={'chevron-down-outline'}/></Words>
      </TouchableOpacity>
    </View>

    <View style={{height: 200}}>

    </View>

    <FlatList
      data={[recentSleep, ...posts]}
      //data={posts}
      // rename this from sleepSession to postData or smth
      renderItem={({item}) => <Post sleepRecord={item}/>}
    />
    <TouchableOpacity onPress={getAdditionalPosts}>
      <Words>More</Words>
    </TouchableOpacity>
    <NavBar current='feed'/>

    <GroupModal visible={groupModalVisible} close={() => setGroupModalVisible(false)}/>


  </View></SafeAreaView>
}

const styles = StyleSheet.create({
  top: {
    height: 120,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center'

  },
  topButton: {
    alignItems: 'center',
    width: 100,
    paddingHorizontal: 15,
  },
});
