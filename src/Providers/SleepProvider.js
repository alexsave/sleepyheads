import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadFromHealth } from '../Network/PostLoad';
//import { API, Auth, graphqlOperation } from 'aws-amplify';
//import { getUserImage, getUserLocation } from '../../graphql/queries';

export const SleepContext = React.createContext();

const SLEEP_PREFIX = 'sleep-';
export const getSleepKey = sleep => SLEEP_PREFIX + sleep.bedStart;

const SleepProvider = props => {

  // there are three "levels" of getting sleep
  // ONE: only exists in health "inHealth"
  // this could be visible if the user opts for manual import
  // TWO: exists in health, imported in storage "imported"
  // this will be visible if the user opts for manual upload
  // THREE: exists in health, imported in storage, uploaded to cloud
  // this would be visible if they view their own sleeps
  const [inHealth, setInHealth] = useState([]);

  const [imported, setImported] = useState(new Set());
  // what's better, to store all the sleep sessions in a single AsyncStorage object,
  // or to split them up?

  // check which workouts are backedup in async storage
  useEffect(() => {
    (async () => {
      setInHealth(await loadFromHealth());
      // so what do we want to do
      // if there are imported sleeps, let's use those first
      // THEN look at inhealth only
      const keys = await AsyncStorage.getAllKeys();
      setImported(new Set(keys.filter(k => k.startsWith(SLEEP_PREFIX))));
    })();

  }, [])

  const importSleep = async sleep => {
    try {

      await AsyncStorage.setItem(getSleepKey(sleep), JSON.stringify(sleep));
      console.log(imported);
      setImported(prev => new Set(prev).add(getSleepKey(sleep)))
    } catch (e) {
      console.log(e);// could make a custom error bar popup
    }
  }




  return (
    <SleepContext.Provider value={{
      inHealth,
      imported,
      importSleep

    }}>
      {props.children}
    </SleepContext.Provider>
  );
}

export default SleepProvider;
