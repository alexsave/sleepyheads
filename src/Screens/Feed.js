import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import NavBar from '../Components/Navigation/NavBar';
import { useContext, useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Sleep } from '../Components/Feed/Sleep';
import { BACKGROUND, DARKER, PRIMARY } from '../Values/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SleepContext } from '../Providers/SleepProvider';
import { NOT_SIGNED_IN, UserContext } from '../Providers/UserProvider';
import { GLOBAL, GroupContext } from '../Providers/GroupProvider';
import { Words } from '../Components/Basic/Words';
import { GroupModal } from '../Components/Feed/GroupModal';
import { SocialContext } from '../Providers/SocialProvider';
import { Row } from '../Components/Basic/Row';

const statsAnalysis = posts => {
  //first split up and group by userID
  let byUser = {};
  posts.forEach(({rankBedStart, rankBedEnd, rankSleepTime, sleep}) => {
    const k = sleep.user.name;

    if (!byUser[k])
      byUser[k] = []
    byUser[k].push({rankBedStart, rankBedEnd, rankSleepTime});
  })

  let earlyRise, lateRise, mostSleep, leastSleep;

  //averages? sure why not
  byUser = Object.entries(byUser).map(([key, userStats]) => {
    const reduced = userStats.reduce((a,b) => {
        a.rankBedStart += b.rankBedStart/userStats.length;
        a.rankBedEnd += b.rankBedEnd/userStats.length;
        a.rankSleepTime += b.rankSleepTime/userStats.length;
        return a

      }, {rankBedStart: 0, rankBedEnd: 0, rankSleepTime: 0});

    // check stats
    if (!lateRise || reduced.rankBedEnd > lateRise.val)
      lateRise = {name: key, val: reduced.rankBedEnd}
    if (!earlyRise || reduced.rankBedEnd < earlyRise.val)
      earlyRise = {name: key, val: reduced.rankBedEnd}
    if (!mostSleep || reduced.rankSleepTime > mostSleep.val)
      mostSleep = {name: key, val: reduced.rankSleepTime}
    if (!leastSleep || reduced.rankSleepTime < leastSleep.val)
      leastSleep = {name: key, val: reduced.rankSleepTime}
  });

  // then transform to
  return {earlyRise, lateRise, mostSleep, leastSleep};
};

export const Feed = (props) => {
  //const [sleepData, setSleepData] = useState([]);
  const {username, userGroups} = useContext(UserContext);
  const {recentSleep} = useContext(SleepContext);
  const {groups, groupID, getGroupName, setGroupID, addUserToGroup} = useContext(GroupContext);
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
    else if (!props.route.params?.groupID) {
      setGroupID(GLOBAL); //global
    }
  }, [username]);

  const [groupModalVisible, setGroupModalVisible] = useState(false);

  const showRecent = groups.includes(groupID) || groupID === GLOBAL;

  // final addition before release attempt: get stats of who sleeps least/ most/earliest/latest in group
  // How do I want to do this?
  // When they open the feed, they'll see all the usual posts of the timeline, but on top of every group timeline,
  // they will see their latest sleep, If auto upload is not enabled.
  // If it is enabled, it'll just upload automatically and they can find it in
  return <SafeAreaView style={backgroundStyle}><View style={{flex: 1}}>

    <Row style={{ zIndex: 5, alignItems: 'center', right:0,left: 0, top: 0, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: DARKER, height: 60, justifyContent: 'space-between'}}>
      <View style={{width: 100}}/>
      <TouchableOpacity onPress={() => {
        setGroupModalVisible(true);
        //open group view
      }}>
        <Words style={{fontSize: 30, fontWeight: 'bold'}}>{getGroupName(groupID)}<Ionicons size={30} name={'chevron-down-outline'}/></Words>
      </TouchableOpacity>
      <View style={{width: 100}}>
        {
          (groupID !== GLOBAL && !userGroups.includes(groupID)) &&
          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center', backgroundColor: PRIMARY, width: '100%', height: 60}}
            onPress={() => addUserToGroup(username, groupID)}>
            <Words>Join Group</Words>
          </TouchableOpacity>
        }
      </View>
    </Row>

    {
      groupID !== GLOBAL &&

      <View>
        {
          userGroups.includes(groupID) &&
          <View>
            <Words>Sleepiest head: {statsAnalysis(posts).mostSleep.name}</Words>
            <Words>Insomniac: {statsAnalysis(posts).leastSleep.name}</Words>
            <Words>Best grindset: {statsAnalysis(posts).earlyRise.name}</Words>
            <Words>Snooziest head: {statsAnalysis(posts).lateRise.name}</Words>
          </View>
        }

      </View>
    }

    <FlatList
      data={showRecent? [recentSleep, ...posts] : posts}
      //data={posts}
      // rename this from sleepSession to postData or smth
      renderItem={({item}) => <Sleep sleepRecord={item}/>}
    />

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
