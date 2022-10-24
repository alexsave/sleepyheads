import { FlatList, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { Words } from '../Components/Basic/Words';
import { BACKGROUND, DARKER, PRIMARY, TEXT_COLOR } from '../Values/Colors';
import { Row } from '../Components/Basic/Row';
import { makeSleepKey, SleepContext } from '../Providers/SleepProvider';
import SplashScreen from 'react-native-splash-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Flip from '../Components/Basic/Flip';

//similar to the import activites screen in Strava, but this might just be temporary while I figure out how to upload stuff

// Apple Health -> react-native-async-storage
// this will probably be automatic
// react-native-async-storage -> cloud
// this can be automatic, but have manual option

// I'm thinking we should use some context to provide the backed up info
// Backing up is so that we don't have to re-parse from health kit multiple times


export const Upload = props => {

  const {inHealth, autoImport, setAutoImport, imported, uploadSleep, importSleep, clearCache} = useContext(SleepContext);

  const [autoUpload, setAutoUpload] = useState(false);

  useEffect(() => {
    SplashScreen.hide();

  }, []);
// Apple Health -> react-native-async-storage
  return <SafeAreaView style={{flex: 1, backgroundColor: BACKGROUND}}>
    <Row style={{height: 50}}>
      <Words>Auto-import: </Words>
      <Flip value={autoImport} onChange={setAutoImport}/>
    </Row>

    <Row style={{height: 50}}>
      <Words>Auto-upload: </Words>
      <Flip value={autoUpload} onChange={setAutoUpload}/>
    </Row>

    <TouchableOpacity style={{backgroundColor: 'red', height: 50, width: 100}} onPress={clearCache}>
      <Words>Clear cache</Words>
    </TouchableOpacity>

    <FlatList

      data={inHealth}
      renderItem={({item}) => {
        const i = imported.has(makeSleepKey(item));
        return <Row
          key={item.bedStart}
          style={{
            justifyContent: 'space-between',
            height: 50,
            backgroundColor: i ? PRIMARY : DARKER,
            borderColor: BACKGROUND,
            borderWidth: 1
          }}>
          <Words>Sleep on {new Date(item.bedStart).toLocaleDateString()}</Words>
          <Words>Backed up: {i ? 'true' : 'false'}</Words>
          <Words>Uploaded: {true}</Words>
          <TouchableOpacity onPress={() => importSleep(item)}>
            <Words><Ionicons color={TEXT_COLOR} size={40} name={'save-outline'} /></Words>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => uploadSleep(item)}>
            <Words><Ionicons color={TEXT_COLOR} size={40} name={'cloud-upload-outline'} /></Words>
          </TouchableOpacity>
        </Row>

      }
      }/>
  </SafeAreaView>
};
