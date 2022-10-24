import { View } from "react-native";
import { Defs, LinearGradient, Path, Rect, Stop, Svg } from 'react-native-svg';
import { ASLEEP, AWAKE, CORE, DEEP, INBED, REM } from "../../Utils/ProcessSleep";
import { BACKGROUND, DARK_GRAY, DARKER, LIGHTER, PRIMARY } from '../../Values/Colors';
import { BlurView } from "@react-native-community/blur";

const sleepTypeToColor = value => {
  switch (value) {
    case AWAKE:
      return DARK_GRAY;
    case INBED:
      return 'gray';
    case CORE:
      return PRIMARY;//'blue';
    case REM:
      return LIGHTER;
    case DEEP:
      return DARKER;//'navy';
    case ASLEEP:
      return PRIMARY;
  }
};

const graphicWidth = 200;
const graphicHeight = 200;
const strokeWidth = 15;

const noon = 12 * 60 * 60 * 1000;

const timeToTheta = timestamp => {
  const s = new Date(timestamp)
  const mseconds = (s.getHours()*60*60 + s.getMinutes() * 60 + s.getSeconds())*1000 + s.getMilliseconds();
  return Math.PI/2 - (mseconds)/noon * 2*Math.PI;
}

const sampleToPath = (sample, radius, offset=0, curl=false) => {

  //const radiusSkew1 = strokeWidth * sample.start/noon;//*2*Math.PI/(2*Math.PI);
  //const radiusSkew1 = strokeWidth * sample.start/noon;//*2*Math.PI/(2*Math.PI);
  const r1 = radius - (curl ? strokeWidth*sample.start/noon : 0);
  const r2 = radius - (curl ? strokeWidth*sample.end/noon : 0);

  const theta1 = offset - sample.start/noon * 2*Math.PI;
  const x1 = Math.cos(theta1)*r1 + graphicWidth/2;
  const y1 = graphicHeight/2 - Math.sin(theta1)*r1;

  const theta2 = offset - sample.end/noon * 2*Math.PI;
  const x2 = Math.cos(theta2)*r2 + graphicWidth/2;
  const y2 = graphicHeight/2 - Math.sin(theta2)*r2;
  return `M ${x1} ${y1} A ${r1} ${r1} 0 0 1 ${x2} ${y2}`;
}

const bedToPath = (bedStart, bedEnd, radius) => {
  const theta1 = timeToTheta(bedStart);
  const x1 = Math.cos(theta1)*radius + graphicWidth/2;
  const y1 = graphicHeight/2 - Math.sin(theta1)*radius;

  const theta2 = timeToTheta(bedEnd);
  const x2 = Math.cos(theta2)*radius + graphicWidth/2;
  const y2 = graphicHeight/2 - Math.sin(theta2)*radius;
  return `M ${x1} ${y1} A ${radius} ${radius} 0 1 1 ${x2} ${y2}`;
}


export const Sample = props => {
  const {duration} = props;
  const {samples, bedStart, bedEnd} = props.session;

  const startTheta = timeToTheta(bedStart);

  const hourTicks = [1, 2, 4, 5, 7, 8, 10, 11].map(n => {
    const theta = Math.PI/2*(1- n/3);
    const r1 = graphicHeight/2/3;
    const r2 = r1 * 1.5;
    return `M ${graphicWidth/2 + r1*Math.cos(theta)} ${graphicHeight/2 - r1*Math.sin(theta)} L ${graphicWidth/2 + r2*Math.cos(theta)} ${graphicHeight/2 - r2*Math.sin(theta)} `;
  }).join('');

  return <View style={{alignItems: 'center'}}>
    <Svg height={graphicHeight} width={graphicWidth} style={{height: '100%', width: '100%'}}>
      <Defs>
        <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0" stopColor={ BACKGROUND }/>
          <Stop offset="1" stopColor={ sleepTypeToColor(samples[0].value)}/>
        </LinearGradient>
      </Defs>

      <Path
        d={bedToPath(bedStart, bedEnd, graphicHeight *.45)}
        stroke={DARK_GRAY}
        strokeWidth={strokeWidth} />

      <Path
        d={`M ${graphicWidth/2} 0 V ${graphicHeight} 
        M 0 ${graphicHeight/2} H ${graphicWidth}`}
        stroke={DARK_GRAY}
        strokeWidth={2}
      />

      <Path
        d={hourTicks}
        stroke={'gray'}
        strokeWidth={1}
      />


      {
        samples.map(sample =>
          <Path
            d={sampleToPath(sample, graphicHeight*.45, startTheta, duration > noon)}
            //fill={sleepTypeToColor(sample.value)}
            stroke={sleepTypeToColor(sample.value)}
            strokeWidth={10} />
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
