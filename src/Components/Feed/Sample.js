import { View } from "react-native";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";
import { ASLEEP, AWAKE, CORE, DEEP, INBED, REM } from "../../Utils/ProcessSleep";
import { DARKER, PRIMARY } from "../../Values/Colors";
import { BlurView } from "@react-native-community/blur";

const sleepTypeToColor = value => {
  switch (value) {
    case AWAKE:
      return 'white';
    case INBED:
      return 'gray';
    case CORE:
      return PRIMARY;//'blue';
    case REM:
      return 'skyblue';
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
            <Stop offset="1" stopColor={ sleepTypeToColor(samples[0].value)}/>
          </LinearGradient>
        </Defs>
        <Rect width={(samples[0].start)/duration*100 + '%'} height="100%" fill={"url(#grad)"}/>
        {
          samples.map(sample =>
            <Rect x={sample.start/duration*100 + '%'} width={(sample.end-sample.start)/duration*100 + '%'} height="100%" fill={sleepTypeToColor(sample.value)} key={sample.start}/>
          )
        }
      </Svg>
    <BlurView
      style={{position: 'absolute',/*has to match svg*/ height: 0, width: '100%'}}
      blurType='light'//dark not bad
      blurAmount={1}
      reducedTransparencyFallbackColor={'black'}/>

  </View>
};
