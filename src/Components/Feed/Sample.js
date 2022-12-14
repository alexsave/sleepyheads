import { View } from "react-native";
import { Defs, LinearGradient, Path, Rect, Stop, Svg, Text, TextPath } from 'react-native-svg';
import { BACKGROUND, DARK_GRAY, DARKER, LIGHTER, PRIMARY } from '../../Values/Colors';
import { BlurView } from "@react-native-community/blur";
import { SleepSampleType } from '../../models';

const sleepTypeToColor = type => {
  switch (type) {
    case SleepSampleType.AWAKE:
      return DARK_GRAY;
    case SleepSampleType.INBED:
      return 'gray';
    case SleepSampleType.CORE:
      return PRIMARY;//'blue';
    case SleepSampleType.REM:
      return LIGHTER;
    case SleepSampleType.DEEP:
      return DARKER;//'navy';
    case SleepSampleType.ASLEEP:
      return PRIMARY;
  }
};

const graphicWidth = 300;
const graphicHeight = 300;
const strokeWidth = 15;

const noon = 12 * 60 * 60;
const SIX_HOURS = 6 * 60 * 60;

const timeToTheta = timestamp => {
  const s = new Date(timestamp)
  console.log(s);
  const seconds = s.getHours()*60*60 + s.getMinutes() * 60 + s.getSeconds();
  const mod = (Math.PI/2 - (seconds)/noon * 2*Math.PI) % (2*Math.PI);
  if (mod < 0)
    return mod + Math.PI * 2;
  return mod;
  //return Math.PI/2 - (mseconds)/noon * 2*Math.PI;
}

const sampleToPath = (sample, radius, offset=0, curl=false) => {

  //const radiusSkew1 = strokeWidth * sample.start/noon;//*2*Math.PI/(2*Math.PI);
  //const radiusSkew1 = strokeWidth * sample.start/noon;//*2*Math.PI/(2*Math.PI);
  const r1 = radius - (curl ? strokeWidth*sample.startOffset/noon : 0);
  const r2 = radius - (curl ? strokeWidth*sample.endOffset/noon : 0);

  const theta1 = offset - sample.startOffset/noon * 2*Math.PI;
  const x1 = Math.cos(theta1)*r1 + graphicWidth/2;
  const y1 = graphicHeight/2 - Math.sin(theta1)*r1;

  const theta2 = offset - sample.endOffset/noon * 2*Math.PI;
  const x2 = Math.cos(theta2)*r2 + graphicWidth/2;
  const y2 = graphicHeight/2 - Math.sin(theta2)*r2;
  return `M ${x1} ${y1} A ${r1} ${r1} 0 0 1 ${x2} ${y2}`;
}

const bedToPath = (bedStart, bedEnd, duration, radius) => {
  const theta1 = timeToTheta(bedStart);
  const x1 = Math.cos(theta1)*radius + graphicWidth/2;
  const y1 = graphicHeight/2 - Math.sin(theta1)*radius;

  const theta2 = timeToTheta(bedEnd);
  const x2 = Math.cos(theta2)*radius + graphicWidth/2;
  const y2 = graphicHeight/2 - Math.sin(theta2)*radius;

  const largeArc = duration > SIX_HOURS ? 1 : 0;
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
}

const textTheta = Math.PI/16;

const makeTextPath = (timestamp, radius) => {
  const theta1 = timeToTheta(timestamp) + textTheta;
  const x1 = Math.cos(theta1)*radius + graphicWidth/2;
  const y1 = graphicHeight/2 - Math.sin(theta1)*radius;

  const theta2 = theta1 - 2 * textTheta;
  const x2 = Math.cos(theta2)*radius + graphicWidth/2;
  const y2 = graphicHeight/2 - Math.sin(theta2)*radius;

  if (theta1 % (2*Math.PI) > Math.PI) {
    return `M ${x2} ${y2} A ${radius} ${radius} 0 0 0 ${x1} ${y1}`;
  } else {
    return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
  }
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
          <Stop offset="1" stopColor={ sleepTypeToColor(samples[0].type)}/>
        </LinearGradient>
      </Defs>



      <Path
        d={bedToPath(bedStart, bedEnd, duration, graphicHeight *.45)}
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
            stroke={sleepTypeToColor(sample.type)}
            strokeWidth={10}
            key={sample.startOffset}
          />
        )
      }
      <Path id="startText" fill="none"
            d={makeTextPath(bedStart, graphicHeight*.45 )}
      />
      <Text fill="gray">
        <TextPath
          href="#startText"
          startOffset={0}>
          {new Date(bedStart).toTimeString().split('GMT')[0]}
        </TextPath>
      </Text>


      <Path id="endText" fill="none"
            d={makeTextPath(bedEnd, graphicHeight*.45 )}
      />
      <Text fill="gray">
        <TextPath
          href="#endText"
          startOffset={0}>
          {new Date(bedEnd).toTimeString().split('GMT')[0]}
        </TextPath>
      </Text>

    </Svg>
    <BlurView
      style={{position: 'absolute',/*has to match svg*/ height: 0, width: '100%'}}
      blurType='light'//dark not bad
      blurAmount={1}
      reducedTransparencyFallbackColor={'black'}/>

  </View>
};
