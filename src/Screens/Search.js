import { StyleSheet, SafeAreaView, TextInput, TouchableOpacity, View } from 'react-native';
import { BACKGROUND, DARKER, TEXT_COLOR } from '../Values/Colors';
import { Words } from '../Components/Basic/Words';
import NavBar from '../Components/Navigation/NavBar';
import Write from '../Components/Basic/Write';
import UserImage from '../Components/Profile/UserImage';
import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listGroups, listUsers } from '../graphql/queries';
import { Row } from '../Components/Basic/Row';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GroupContext } from '../Providers/GroupProvider';

export const Search = props => {
  const navigation = useNavigation();
  const {setGroups, setGroupID} = useContext(GroupContext);

  // so while we could turn on elastic search, I'm going to make it easy and just do a list users
  const [query, setQuery] = useState('');


  const [userResults, setUserResults] = useState([]);
  const [groupResults, setGroupResults] = useState([]);

  const fetchUsers = async () => {
    const res = await API.graphql(graphqlOperation(listUsers, {
      // sort? who knows, some function of #likes, #groups, #comments
      filter: {
        or: [
          {name: {contains: query}},
          {id: {contains: query}}
        ]
      }
    }));
    console.log(res);

    setUserResults(res.data.listUsers.items)
  };

  const fetchGroups = async () => {
    const res = await API.graphql(graphqlOperation(listGroups, {
      // sort? who knows, some function of #likes, #groups, #comments
      filter: {
        // //id is random, proabbly don't want to match on a query
        name: {contains: query},
      }
    }));
    console.log(JSON.stringify(res));

    // something weird is going on
    setGroupResults(res.data.listGroups.items)

  };

  const runSearch = async () => {
    if (query === '')
      return;

    // split query by ' ', make each token into another OR clause
    // holy shit this reminds me of work too much

    fetchUsers();
    fetchGroups();
  };

  // then filter it

  return <SafeAreaView style={{flex: 1, backgroundColor: BACKGROUND}}><View style={{flex: 1}}>
    <View style={{flex: 1, }}>
      <Row style={{paddingLeft: 10, height: 50, alignItems: 'center', justifyContent: 'center', borderBottomColor: DARKER, borderBottomWidth: StyleSheet.hairlineWidth}}>
        <TextInput
          value={query}
          style={{color: TEXT_COLOR, flex: 1}}
          onChangeText={setQuery}
          placeholder='Find fellow sleepyheads...'
          returnKeyType='search'
          onSubmitEditing={runSearch}
        />
        <Words style={{width: 30}}><Ionicons size={25} name={'search'} color={TEXT_COLOR}/></Words>
      </Row>
      <View style={{flex:1}}>{
        groupResults.length + userResults.length === 0 ?
          //sparkles-outline not working for some reason
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Words>
              <Ionicons size={50} name={'moon-outline'} color={DARKER}/>
              <Ionicons size={50} name={'moon-outline'} color={DARKER}/>
              <Ionicons size={50} name={'moon-outline'} color={DARKER}/>
            </Words>

          </View> :
          <>
            <Words>Users:</Words>
            {
              userResults.map(user =>
                <TouchableOpacity
                  key={user.id}
                  // since we have it, should we just send the entire user object over?
                  // nah, we have to load posts and we don't want to load them here
                  onPress={() => navigation.navigate('profile', {userID: user.id})}
                  style={{flexDirection: 'row', height: 100, alignItems: 'center', borderWidth: 1, borderColor: BACKGROUND, backgroundColor: DARKER}}
                >
                  <View style={{width: 100, alignItems: 'center'}}>
                    <UserImage imageKey={user.image} size={50}/>
                  </View>
                  <Words>{user.name}</Words>
                </TouchableOpacity>)
            }
            <Words>Groups:</Words>
            {
              groupResults.map(group =>
                <TouchableOpacity
                  key={group.id}
                  // since we have it, should we just send the entire user object over?
                  // nah, we have to load posts and we don't want to load them here
                  // group page later
                  onPress={async () => {
                    await setGroupID(group.id);
                    // avoid an extra call by doing this
                    setGroups(prev => [...prev, group]);
                    navigation.navigate('feed', {groupID: group.id});
                  }}
                  style={{flexDirection: 'row', height: 100, alignItems: 'center', borderWidth: 1, borderColor: BACKGROUND, backgroundColor: DARKER}}
                >
                  <View style={{width: 100, alignItems: 'center'}}/>
                  <Words>{group.name}</Words>
                </TouchableOpacity>)
            }
          </>

      }</View>
    </View>

    <NavBar current='search'/>
  </View></SafeAreaView>
}
