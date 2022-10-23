import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { BACKGROUND, DARKER } from '../Values/Colors';
import { Words } from '../Components/Basic/Words';
import NavBar from '../Components/Navigation/NavBar';
import Write from '../Components/Basic/Write';
import UserImage from '../Components/Profile/UserImage';
import { useNavigation } from '@react-navigation/native';

export const Search = props => {
  const navigation = useNavigation();

  return <SafeAreaView style={{flex: 1, backgroundColor: BACKGROUND}}><View style={{flex: 1}}>
    <View style={{flex: 1, }}>
      <View style={{height: 50, justifyContent: 'center'}}>
        <Write placeholder='Find fellow sleepyheads...'/>
      </View>
      <View style={{flex:1}}>
        {
          ['larry', 'jamie', 'tim k'].map(name =>
            // this doesn't really have to be a keyboard hiding view
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('profile', {userId: name})
              }
              style={{flexDirection: 'row', height: 100, alignItems: 'center', borderWidth: 1, borderColor: BACKGROUND, backgroundColor: DARKER}}
              key={name}
            >
              <UserImage/>
              <Words>{name}</Words>
            </TouchableOpacity>
          )
        }
      </View>
    </View>

    <NavBar current='search'/>
  </View></SafeAreaView>
}
