import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadFromHealth } from '../Network/PostLoad';
//import { API, Auth, graphqlOperation } from 'aws-amplify';
//import { getUserImage, getUserLocation } from '../../graphql/queries';

export const SleepContext = React.createContext();

const SLEEP_PREFIX = 'sleep-';
// also consider that we need the username too
export const makeSleepKey = sleep => {
  let x =  SLEEP_PREFIX + new Date(sleep.bedStart).getTime();
  return x;
}

const SleepProvider = props => {

  // there are three "levels" of getting sleep
  // ONE: only exists in health "inHealth"
  // this could be visible if the user opts for manual import
  // TWO: exists in health, imported in storage "imported"
  // this will be visible if the user opts for manual upload
  // THREE: exists in health, imported in storage, uploaded to cloud
  // this would be visible if they view their own sleeps
  const [inHealth, setInHealth] = useState([]);

  //should probably go in settings honestly
  const [autoImport, setAutoImport] = useState(true);

  const [imported, setImported] = useState(new Set());
  // what's better, to store all the sleep sessions in a single AsyncStorage object,
  // or to split them up?

  // check which workouts are backedup in async storage
  // this needs to be called on wake, literally
  useEffect(() => {
    (async () => {
      setInHealth(await loadFromHealth());
      // so what do we want to do
      // if there are imported sleeps, let's use those first
      // THEN look at inhealth only
      const keys = await AsyncStorage.getAllKeys();
      setImported(new Set(keys.filter(k => k.startsWith(SLEEP_PREFIX))));
    })();
  }, []);

  useEffect(() => {
    tryImportDiff();
  }, [autoImport, imported])

  const tryImportDiff = async () => {
    console.log('called');
    if (!autoImport)
      return;


    // kind of a base case
    if (imported.size >= inHealth.length)
      return;

    /*let diff = new Set(inHealth.map(makeSleepKey));
    console.log(imported);
    [...imported].forEach(i => diff.delete(i));
    console.log(inHealth.length);
    console.log(imported.size);
    console.log(diff.size);*/

    let diff = [...inHealth];
    diff.filter(d => {
      !imported.has(makeSleepKey(d))
    })


    await Promise.all(
      diff.map(sleep =>
        new Promise((resolve, reject) =>
          AsyncStorage.setItem(makeSleepKey(sleep), JSON.stringify(sleep)).then(resolve))))
    setImported(new Set(inHealth.map(makeSleepKey)));

  }

  const importSleep = async sleep => {
    try {

      await AsyncStorage.setItem(makeSleepKey(sleep), JSON.stringify(sleep));
      setImported(prev => new Set(prev).add(makeSleepKey(sleep)))
    } catch (e) {
      console.log(e);// could make a custom error bar popup
    }
  }

  // this one's going to be a bit more interesting
  const uploadSleep = async sleep => {
    const id = makeSleepKey(sleep);
    //convert to proper post object, with comments and shit
    // then upload to AWS
  }

  const clearCache = async () => {
    try {

      await AsyncStorage.clear();
      setImported(new Set());
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <SleepContext.Provider value={{
      inHealth,

      //  could be in settings for sure
      autoImport,
      setAutoImport,

      importSleep,
      imported,

      uploadSleep,

      clearCache
    }}>
      {props.children}
    </SleepContext.Provider>
  );
}

export default SleepProvider;
