import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Words } from "../Basic/Words";
import { Row } from "../Basic/Row";
import { BACKGROUND, DARKER, PRIMARY } from '../../Values/Colors';
import { Sample } from "./Sample";
import UserImage from '../Profile/UserImage';
import { makeSleepKey, SleepContext } from '../../Providers/SleepProvider';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useContext, useEffect, useState } from 'react';


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
  const {sleepSession} = props;
  const navigation = useNavigation();
  const {imported, uploaded, uploadSleep} = useContext(SleepContext);

  const [postUploaded, setPostUploaded] = useState(false);

  useEffect(() => {
    setPostUploaded(uploaded.has(makeSleepKey(sleepSession)));

  }, [uploaded, sleepSession])

  const highlight = postUploaded ? PRIMARY : DARKER;

  const {duration} = sleepSession;
    //new Date(sleepSession.bedEnd) -
    //new Date(sleepSession.bedStart);

  return <View
    style={{
      //position: 'absolute',
      //top: pos,
      //height: 200,
      borderWidth: 3,
      borderRadius: 10,
      borderColor: highlight,
      margin: 5,
      //backgroundColor: sample.value === 'UNKNOWN' ? 'black' : sample.value === 'ASLEEP' ? 'blue': 'green',
      //zIndex: sample.value === 'INBED' ? -1: 1,
      //height: something,
    }}>
    <View style={{borderRadius: 10, backgroundColor: BACKGROUND}}>


      <Row style={{justifyContent: 'space-between'}}>

        <UserImage size={50}/>

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
            onPress={() => navigation.navigate('post', {id: makeSleepKey(sleepSession)})}
          >
            <Words><Ionicons size={30} name='pencil-outline'/></Words>
          </TouchableOpacity>
        </Row>
      </Row>

      <Words style={{fontSize: 30}}>{new Date(sleepSession.bedStart).toDateString()}</Words>
      <Words>{formatDuration(duration)}</Words>
      <Sample duration={duration} session={sleepSession}/>
    </View>

    <Row style={{width: '100%', height: 40, justifyContent: 'space-between', alignItems: 'center', backgroundColor: highlight}}>
      <View style={{flex:1, alignItems: 'center'}}>
        <Words> 😴</Words>
      </View>
      <View style={{
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderRightWidth: StyleSheet.hairlineWidth,
        flex:1, alignItems: 'center'}}>
        <Words>😳</Words>
      </View>
      <View style={{flex:1, alignItems: 'center'}}>
        <Words>⬆️</Words>
      </View>

    </Row>
  </View>;
}


