import { useNavigation } from '@react-navigation/native';
import { StyleSheet, SafeAreaView, TextInput, TouchableOpacity, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { BACKGROUND, PRIMARY, TEXT_COLOR } from '../Values/Colors';
import { Sample } from '../Components/Feed/Sample';
import { RECENT, SleepContext } from '../Providers/SleepProvider';
import { Row } from '../Components/Basic/Row';
import { Words } from '../Components/Basic/Words';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserContext } from '../Providers/UserProvider';

// look up shared transitions, that's the ideal behavior for this
export const PostScreen = props => {
  const {sleep} = props.route.params;
  const {id} = sleep;
  const {username} = useContext(UserContext);
  const {uploadSleep} = useContext(SleepContext);

  const [title, setTitle] = useState(sleep.title);
  const [description, setDesc] = useState(sleep.description);

  // recent is dirty by default, as it is not uploaded
  // uploaded posts can be made dirty if you modify them
  const [dirty, setDirty] = useState(id === RECENT);

  useEffect(() => {
    if (!id)
      return;

    /*(async () => {
      const val = await AsyncStorage.getItem(id);
      setSleep(JSON.parse(val));
    })();*/

  }, [id]);

  //use this a bit more
  const ownPost = id === RECENT || username === sleep.userID;

  const navigation = useNavigation();
  return <SafeAreaView style={{flex: 1, backgroundColor: BACKGROUND}}>
    <View
      style={{
        flex: 1,
        borderColor: PRIMARY,
        borderStyle: id === RECENT ? 'dashed': 'solid',
        borderWidth: 3,
        borderRadius: 10,
      }}
    >
      <Row style={{right: 0, height: 50, justifyContent: 'space-between', }}>
        <TouchableOpacity
          style={{flex: 1, height: '100%', right: 0, maxWidth: 50, alignItems: 'center', borderBottomRightRadius: 10, justifyContent: 'center', backgroundColor: PRIMARY, borderRightWidth: StyleSheet.hairlineWidth}}
          onPress={navigation.goBack}
        >
          <Words><Ionicons name={'close-outline'} size={30}/></Words>
        </TouchableOpacity>

          <TouchableOpacity
            style={{flex: 1, height: '100%', right: 0, maxWidth: 80, alignItems: 'center', borderBottomLeftRadius: 10, justifyContent: 'center', backgroundColor: PRIMARY }}
            onPress={() => {
              if(!dirty)
                return;
              // upload or update
              uploadSleep({...sleep, title, description})
                .then(navigation.goBack)
            }}
          >
            <Words style={{fontSize: 20, color: dirty? TEXT_COLOR : 'gray'}}>Save</Words>
          </TouchableOpacity>
      </Row>

      <TextInput
        onChangeText={t => {
          if(!ownPost)
            return;
          setDirty(true);
          setTitle(t);
        }}
        value={title}
        style={{height: 50, fontSize: 40, color: TEXT_COLOR}}
        placeholder={'Title'}
      />

      <Sample duration={sleep.data.duration} session={sleep.data}/>

      <TextInput
        onChangeText={t => {
          if(!ownPost)
            return;
          setDirty(true);
          setDesc(t);
        }}
        value={description}
        style={{height: 200, color: TEXT_COLOR}}
        placeholder={'Notes'}
      />

      {
        sleep.comments.items.map(comment => {

          return <View key={comment.id}>
            <Words>{JSON.stringify(comment)}</Words>
          </View>
        })
      }


    </View>

  </SafeAreaView>
}
