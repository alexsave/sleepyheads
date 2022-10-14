import { StyleSheet, View } from "react-native";
import { Words } from "../Basic/Words";
import { Row } from "../Basic/Row";
import { PRIMARY } from "../../Values/Colors";
import { Sample } from "./Sample";


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
  const duration =
    new Date(sleepSession.bedEnd) -
    new Date(sleepSession.bedStart);
  return <View
    style={{
      //position: 'absolute',
      //top: pos,
      //height: 200,
      borderWidth: 3,
      borderRadius: 10,
      borderColor: PRIMARY,
      backgroundColor: PRIMARY,
      margin: 5,
      //backgroundColor: sample.value === 'UNKNOWN' ? 'black' : sample.value === 'ASLEEP' ? 'blue': 'green',
      //zIndex: sample.value === 'INBED' ? -1: 1,
      //height: something,
    }}>
    <View style={{backgroundColor: 'black'}}>
      <Words style={{fontSize: 30}}>{new Date(sleepSession.bedEnd).toDateString()}</Words>
      <Words>{formatDuration(duration)}</Words>
      <Sample duration={duration} samples={sleepSession.samples}/>
    </View>

    <Row style={{width: '100%', height: 50, justifyContent: 'space-between', alignItems: 'center', backgroundColor: PRIMARY}}>
      <View style={{flex:1, alignItems: 'center'}}>
        <Words>
          😴
        </Words>
      </View>
      <View style={{
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderRightWidth: StyleSheet.hairlineWidth,
        flex:1, alignItems: 'center'}}>
        <Words>
          😴
        </Words>
      </View>
      <View style={{flex:1, alignItems: 'center'}}>
        <Words>
          😴
        </Words>
      </View>

    </Row>
  </View>;
}


