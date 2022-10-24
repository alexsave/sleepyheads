import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { Words } from '../Components/Basic/Words';
import { loadFromHealth } from '../Network/PostLoad';
import { BACKGROUND, DARKER, PRIMARY, TEXT_COLOR } from '../Values/Colors';
import { Row } from '../Components/Basic/Row';
import { getSleepKey, SLEEP_PREFIX, SleepContext } from '../Providers/SleepProvider';
import SplashScreen from 'react-native-splash-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

//similar to the import activites screen in Strava, but this might just be temporary while I figure out how to upload stuff

// Apple Health -> react-native-async-storage
// this will probably be automatic
// react-native-async-storage -> cloud
// this can be automatic, but have manual option

// I'm thinking we should use some context to provide the backed up info
// Backing up is so that we don't have to re-parse from health kit multiple times


export const Upload = props => {

  const {inHealth, imported, importSleep} = useContext(SleepContext);

  useEffect(() => {
    SplashScreen.hide();

  }, []);
// Apple Health -> react-native-async-storage
  return <SafeAreaView style={{flex: 1, backgroundColor: BACKGROUND}}>
    <ScrollView >

      <Words>Auto-upload: false</Words>
      {
        inHealth.map(sess => {
          const i = imported.has(getSleepKey(sess));
          return <Row
            key={sess.bedStart}
            style={{
              justifyContent: 'space-between',
              height: 50,
              backgroundColor: i ? PRIMARY : DARKER,
              borderColor: BACKGROUND,
              borderWidth: 1
            }}>
            <Words>Sleep on {new Date(sess.bedStart).toLocaleDateString()}</Words>
            <Words>Backed up: {i ? 'true' : 'false'}</Words>
            <Words>Uploaded: {true}</Words>
            <TouchableOpacity
              onPress={() => importSleep(sess)}
            >
              <Words><Ionicons color={TEXT_COLOR} size={40} name={'save-outline'} /></Words>

            </TouchableOpacity>
          </Row>
        })
      }
    </ScrollView>
  </SafeAreaView>
};
