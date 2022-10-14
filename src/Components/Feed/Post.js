import { View } from "react-native";
import { Words } from "../Basic/Words";
import { Row } from "../Basic/Row";
import { ASLEEP, AWAKE, CORE, DEEP, INBED, REM } from "../../Utils/ProcessSleep";

const sleepTypeToColor = value => {
  switch (value) {
    case AWAKE:
      return 'white';
    case INBED:
      return 'gray';
    case CORE:
      return 'blue';
    case REM:
      return 'green';
    case DEEP:
      return 'navy';
    case ASLEEP:
      return 'blue';
  }
};

export const Post = props => {
  const {sleepSession} = props;
  const duration =
    new Date(sleepSession.bedEnd) -
    new Date(sleepSession.bedStart);
  return <View
    key={sleepSession.bedStart}
    style={{
      //position: 'absolute',
      //top: pos,
      //height: 200,
      borderWidth: 1,
      borderColor: 'blue',
      //backgroundColor: sample.value === 'UNKNOWN' ? 'black' : sample.value === 'ASLEEP' ? 'blue': 'green',
      //zIndex: sample.value === 'INBED' ? -1: 1,
      //height: something,
    }}>
    <Words>{duration}</Words>
    <Row style={{height: 200}}>
      {sleepSession.samples.map((sample,i) => {
        return (
          <View style={{
            position: 'absolute',
            //top: sample.start/1000,
            //height: (sample.end - sample.start)/1000,
            //bottom: sample.end/1000,
            //top: 0,
            //bottom: 0,

            //height: sample.,
            //left: 0,
            left:
              (sample.start / duration) *
              100 +
              '%',
            height: 100,
            width:
              ((sample.end -
                  sample.start) /
                duration) *
              100 +
              '%',
            backgroundColor:
              sleepTypeToColor(
                sample.value,
              ),
          }}
                key={sample.start}
          />
        );
      })}
    </Row>
  </View>
    ;
}


