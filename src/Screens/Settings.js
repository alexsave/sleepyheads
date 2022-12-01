import { StyleSheet, FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { BACKGROUND, DARK_GRAY, DARKER, PRIMARY, TEXT_COLOR } from '../Values/Colors';
import { Words } from '../Components/Basic/Words';
import { Auth } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { makeSleepKey, SleepContext } from '../Providers/SleepProvider';
import { Row } from '../Components/Basic/Row';
import Flip from '../Components/Basic/Flip';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ROW_HEIGHT = 50;

export const Settings = () => {
  const {inHealth, uploaded, uploadSleep, clearCache, autoUpload, setAutoUpload} = useContext(SleepContext);

  const navigation = useNavigation();
  return <SafeAreaView style={{flex: 1, backgroundColor: BACKGROUND}}>

    <View style={{flex: 1}}>
      <Row style={styles.row}>
        <Words>Auto-upload: </Words>
        <Flip value={autoUpload} onChange={setAutoUpload}/>
      </Row>

      <FlatList
        data={inHealth}
        renderItem={({item}) => {
          const i = uploaded.has(makeSleepKey(item));
          return <Row
            key={item.bedStart}
            style={{
              justifyContent: 'space-between',
              height: ROW_HEIGHT,
              backgroundColor: i ? PRIMARY : DARKER,
              borderColor: BACKGROUND,
              borderWidth: 1
            }}>
            <Words>Sleep on {new Date(item.bedStart).toLocaleDateString()}</Words>
            <Words>Uploaded: {i ? 'true' : 'false'}</Words>
            <TouchableOpacity onPress={() => uploadSleep(item)}>
              <Words><Ionicons color={TEXT_COLOR} size={40} name={'cloud-upload-outline'} /></Words>
            </TouchableOpacity>
          </Row>

        }
        }/>
    </View>
    <TouchableOpacity style={styles.redRow} onPress={clearCache}>
      <Words style={{color: 'red'}}>Clear cache</Words>
    </TouchableOpacity>
    <View style={{height: ROW_HEIGHT/2}}/>
    <TouchableOpacity
      style={styles.redRow}
      onPress={() => {
        Auth.signOut().then(() => {
          clearCache();
          // quick flash of white here, I don't like it

          //default screen
          navigation.reset({
            index: 0,
            routes: [{name: 'feed'}]
          })
        })
      }}
    ><Words style={{color: 'red'}}>Sign out</Words></TouchableOpacity>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  row: {
    height: ROW_HEIGHT,
    backgroundColor: DARK_GRAY,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  redRow: {
    height: ROW_HEIGHT,
    backgroundColor: DARK_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    textColor: 'red'

  }
});


