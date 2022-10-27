import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Words } from '../Components/Basic/Words';
import { BACKGROUND, DARKER, PRIMARY } from '../Values/Colors';
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Row } from '../Components/Basic/Row';

export const Group = props => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const groupNames = ['thesleepiestheads', 'snoozers', 'jcbrothayaknow'];

  return <SafeAreaView style={{flex: 1, backgroundColor: BACKGROUND}}>
    <View style={{height: 100, backgroundColor: DARKER}}>
      <Words>Create a new group</Words>
    </View>
    {
    groupNames.map(name => {
      return <Row key={name} style={{height: 100, backgroundColor: PRIMARY, justifyContent: 'space-between'}}>
        <Words>{name}</Words>
        <TouchableOpacity>

        <Words>Join</Words>
        </TouchableOpacity>
      </Row>;
    })
  }
  </SafeAreaView>;
}
