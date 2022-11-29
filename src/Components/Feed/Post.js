import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Words } from "../Basic/Words";
import { Row } from "../Basic/Row";
import { BACKGROUND, DARKER, PRIMARY } from '../../Values/Colors';
import { Sample } from "./Sample";
import UserImage from '../Profile/UserImage';
import { makeSleepKey, RECENT, SleepContext } from '../../Providers/SleepProvider';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useContext, useEffect, useState } from 'react';
import { GroupContext } from '../../Providers/GroupProvider';
import { UserContext } from '../../Providers/UserProvider';
import { Like, LikeType } from '../../models';
import { API, graphqlOperation } from 'aws-amplify';
import { likeSleep } from '../../graphql/mutations';


const formatDuration = ms => {
  ms -= ms % 1000;
  ms /= 1000;

  let seconds = ms % 60;
  ms -= seconds;
  ms /= 60;

  let minutes = ms % 60;
  ms -= minutes;
  ms /= 60;

  let hours = ms % 24;
  ms -= hours;
  ms /= 24;
  let days = ms;

  if (seconds < 10)
    seconds = '0' + seconds;
  if (minutes < 10)
    minutes = '0' + minutes;
  if (hours < 10)
    hours = '0' + hours;

  return `${days}:${hours}:${minutes}:${seconds}`;
};

export const Post = props => {
  // ew
  //const sleepSession = props.sleepSession.data;
  const {sleepSession} = props;
  if (!sleepSession)
    return <View></View>
  const {data} = sleepSession;
  const navigation = useNavigation();
  const {username} = useContext(UserContext);
  const {imported, uploaded, uploadSleep} = useContext(SleepContext);
  const {posts} = useContext(GroupContext);

  const postUploaded = sleepSession.id !== RECENT;

  const highlight = postUploaded ? PRIMARY : DARKER;

  // !sleepSession.userID is possible for the "recentSleep", which we own
  const ownPost = sleepSession && (username === sleepSession.userID || !sleepSession.userID);

  if (!data)
    return <View></View>

  const {duration} = data;
  //new Date(sleepSession.bedEnd) -
  //new Date(sleepSession.bedStart);

  const likes = postUploaded ? sleepSession.likes.items : [];
  const zzz = likes.filter(l => l.type === LikeType.SNOOZE);//.length;
  const alarm = likes.filter(l => l.type === LikeType.ALARM);//.length;

  // might be good to have a lambda for this

  const likeAction = async type => {
    const lsi = {
      sleepID: sleepSession.id,
      userID: username,
      type
    };
    const res = await API.graphql(graphqlOperation(likeSleep,  {lsi} ));
    console.log(res);
  }

  return <View
    style={{
      //position: 'absolute',
      //top: pos,
      //height: 200,
      borderWidth: 3,
      borderRadius: 10,
      borderStyle: postUploaded ? 'solid': 'dashed',
      borderColor: highlight,
      margin: 5,
      //backgroundColor: sample.value === 'UNKNOWN' ? 'black' : sample.value === 'ASLEEP' ? 'blue': 'green',
      //zIndex: sample.value === 'INBED' ? -1: 1,
      //height: something,
    }}>
    <View style={{borderRadius: 10, backgroundColor: BACKGROUND}}>


      <Row style={{height: 50, justifyContent: 'flex-end'}}>

        { postUploaded &&
          <View style={{flex: 1}}>
            <UserImage size={50} />
          </View>
        }

        {
          ownPost &&
          <Row style={{paddingLeft: 3, alignItems: 'center', backgroundColor: highlight, borderBottomLeftRadius: 10}}>
            {
              !postUploaded &&

              <TouchableOpacity
                style={{width: 50, alignItems: 'center', borderRightWidth: StyleSheet.hairlineWidth}}
                onPress={() => uploadSleep(sleepSession)}
              >
                <Words><Ionicons size={30} name='cloud-upload-outline'/></Words>
              </TouchableOpacity>
            }
            <TouchableOpacity
              style={{width: 50, alignItems: 'center'}}
              onPress={() => navigation.navigate('post', {sleepSession})}
            >
              <Words><Ionicons size={30} name='pencil-outline'/></Words>
            </TouchableOpacity>
          </Row>
        }
      </Row>

      <Words style={{fontSize: 30}}>{sleepSession.title}</Words>
      <Words style={{fontSize: 30}}>{new Date(data.bedStart).toDateString()}</Words>
      <Words>{formatDuration(duration)}</Words>
      <Sample duration={duration} session={data}/>
    </View>

    {
      postUploaded &&

      <Row style={{width: '100%', height: 40, justifyContent: 'space-between', alignItems: 'center', backgroundColor: highlight}}>
        <TouchableOpacity
          style={{flex:1, alignItems: 'center'}}
          onPress={() => likeAction(LikeType.SNOOZE)}
        >
          <Words style={{fontWeight: zzz.some(l => l.userID === username)? 'bold': 'normal'}}> 😴{zzz.length}</Words>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderLeftWidth: StyleSheet.hairlineWidth,
            borderRightWidth: StyleSheet.hairlineWidth,
            flex:1, alignItems: 'center'}}
          onPress={() => likeAction(LikeType.ALARM)}
        >
          <Words style={{fontWeight: alarm.some(l => l.userID === username)? 'bold': 'normal'}}> 😳{alarm.length}</Words>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1, alignItems: 'center'}}>
          <Words>⬆️</Words>
        </TouchableOpacity>

      </Row>
    }
  </View>;
}


