import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, View } from 'react-native';
import { Words } from '../Components/Basic/Words';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { BACKGROUND } from '../Values/Colors';
import { Post } from '../Components/Feed/Post';
import Write from '../Components/Basic/Write';

// look up shared transitions, that's the ideal behavior for this
export const PostScreen = props => {
  const id = props.route.params.id;
  const [sleep, setSleep] = useState(null);
  useEffect(() => {
    if (!id)
      return;

    (async () => {
      const val = await AsyncStorage.getItem(id);
      setSleep(JSON.parse(val));
    })();

  }, [id]);


  const navigation = useNavigation();
  return <SafeAreaView style={{flex: 1, backgroundColor: BACKGROUND}}>
      <Write style={{height: 100, fontSize: 40}} placeholder={'Title'}/>
      <Write style={{height: 200}} placeholder={'notes'}/>



    {
      sleep &&
      <Post sleepSession={sleep}/>
    }
  </SafeAreaView>
}
