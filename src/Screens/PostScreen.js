import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, View } from 'react-native';
import { Words } from '../Components/Basic/Words';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { BACKGROUND } from '../Values/Colors';

// look up shared transitions, that's the ideal behavior for this
export const PostScreen = props => {
  const id = props.route.params.id;
  const [sleep, setSleep] = useState({});
  useEffect(() => {
    if (!id)
      return;

    (async () => {
      console.log(id);
      const val = await AsyncStorage.getItem(id);
      console.log(val);
      setSleep(val);
    })();

  }, [id]);


  const navigation = useNavigation();
  return <SafeAreaView style={{background: BACKGROUND}}>
    <Words>{JSON.stringify(sleep)}</Words>
  </SafeAreaView>
}
