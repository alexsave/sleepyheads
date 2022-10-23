import { SafeAreaView, ScrollView, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Words } from '../Components/Basic/Words';
import { loadPosts } from '../Network/PostLoad';
import { BACKGROUND, DARKER, PRIMARY } from '../Values/Colors';
import { Row } from '../Components/Basic/Row';

//similar to the import activites screen in Strava, but this might just be temporary while I figure out how to upload stuff

// Apple Health -> react-native-async-storage
// this will probably be automatic
// react-native-async-storage -> cloud
// this can be automatic, but have manual option

export const Upload = props => {
  const [sleepInfo, setSleepInfo] = useState([]);
  useEffect(() => {
    loadPosts(setSleepInfo)

  }, []);
// Apple Health -> react-native-async-storage
  return <SafeAreaView style={{flex: 1, backgroundColor: BACKGROUND}}>
    <ScrollView >
      {
        sleepInfo.map(sess =>
          <Row
            key={sess.bedStart}
            style={{justifyContent: 'space-around', height: 50, backgroundColor: DARKER, borderColor: BACKGROUND, borderWidth: 1}}>
            <Words>Sleep on {new Date(sess.bedStart).toLocaleDateString()}</Words>
            <Words>Backed up: {true}</Words>
            <Words>Uploaded: {true}</Words>
          </Row>
        )
      }
    </ScrollView>
  </SafeAreaView>
};
