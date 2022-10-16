import { View } from "react-native";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";
import { Row } from "../Basic/Row";
import { ASLEEP, AWAKE, CORE, DEEP, INBED, REM } from "../../Utils/ProcessSleep";
import { DARKER, PRIMARY } from "../../Values/Colors";

const sleepTypeToColor = value => {
  switch (value) {
    case AWAKE:
      return 'white';
    case INBED:
      return 'gray';
    case CORE:
      return PRIMARY;//'blue';
    case REM:
      return 'green';
    case DEEP:
      return DARKER;//'navy';
    case ASLEEP:
      return 'blue';
  }
};

export const Sample = props => {
  const {duration, samples} = props;
  return <View>

    <Svg height={100} width='100%' style={{height: '100%', width: '100%'}}>
      <Defs>
        <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0" stopColor={ 'black' }/>
          {
            samples.map(sample => {
              return <Stop stopColor={sleepTypeToColor(sample.value)} offset={(sample.start + (sample.end-sample.start)/2)/duration} key={sample.start}/>
            })
          }
          <Stop offset="1" stopColor={ 'black' }/>
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#grad)"/>
    </Svg>
    <Row style={{height: 100}}>
      {samples.map((sample,i) => {
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

}
