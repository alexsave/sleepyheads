/**
 * Sample React Native App
 * https://github.com/facebook/react-native *
 * @format
 * @flow strict-local
 */

import type { Node } from "react";
import React from "react";
import { Feed } from "./src/Screens/Feed";
import { NavigationContainer } from "@react-navigation/native";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { Search } from "./src/Screens/Search";
import { Profile } from "./src/Screens/Profile";
import UserProvider from './src/Providers/UserProvider';
import SleepProvider from './src/Providers/SleepProvider';
import { Group } from './src/Screens/Group';
import { PostScreen } from './src/Screens/PostScreen';
import { Join } from './src/Screens/Join';
import { Settings } from './src/Screens/Settings';

/*
adding chagnes from
/https://github.com/agencyenterprise/react-native-health/pull/247
to fix sleep
 */

// We now have our basic data type:
/*
{
    bedStart: int,
    bedEnd: int,
    samples: [{
        startDiff: int,
        endDiff: int,
        value: AWAKE | INBED | CORE | REM | DEEP | ASLEEP,
    }]
}


Workflow:
The user wakes up, gets a notification that a new sleep is available to upload manually
    Or has it already been uploaded automatically
    To do so, we also need to keep track of new INBED events
    How to do so?


 */

const Stack = createStackNavigator();

const App: () => Node = () => {

  // going with https://medium.com/react-native-training/how-to-handle-background-app-refresh-with-healthkit-in-react-native-3a32704461fe

  // fuck that, it's old. Just going to wait for a fix to react-native-health. In the mean time, let's just run a query once an hour and see if any new bed thing pops up
  // then notify the user.

  return <UserProvider>

    <SleepProvider>

      <NavigationContainer>

        <Stack.Navigator initialRouteName="feed" screenOptions={{headerShown: false}}>
          <Stack.Screen name="feed" component={Feed} options={{cardStyleInterpolator: CardStyleInterpolators.forNoAnimation}}/>
          <Stack.Screen name="post" component={PostScreen}/>

          <Stack.Screen name="search" component={Search} options={{cardStyleInterpolator: CardStyleInterpolators.forNoAnimation}}/>

          <Stack.Screen name="profile" component={Profile} options={{cardStyleInterpolator: CardStyleInterpolators.forNoAnimation}}/>
          <Stack.Screen name="settings" component={Settings} options={{cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}}/>
          <Stack.Screen name="group" component={Group}/>

          <Stack.Screen name="join" component={Join} options={{cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SleepProvider>
  </UserProvider>

};


export default App;
