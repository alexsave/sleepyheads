import React, { useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadFromHealth } from '../Network/PostLoad';
import { API, graphqlOperation } from 'aws-amplify';
import { UserContext } from './UserProvider';
import { createSleepAndRecords, updateSleep } from '../graphql/mutations';
import { listSleeps } from '../graphql/queries';

export const SleepContext = React.createContext();

const SLEEP_PREFIX = 'sleep-';
// also consider that we need the username too
export const makeSleepKey = sleep => {
  let x =  SLEEP_PREFIX + new Date(sleep.bedStart).getTime();
  return x;
}

export const RECENT = 'RECENT';

// this does rely on username btw
// or we just delete everything on signout lol
// then on signin, make one call to get post ids
// This one's more for uploading and editing sleeps,
// Group provider will be more for showing the feed and such

// holy fuck this is complicated. better idea is to just save a string in async storage of a list of uploaded sleeps
// and get rid of the whole idea of importing, only keep uploaded

const UPLOADED_SLEEPS_KEY = "uploadedSleep";

const SleepProvider = props => {

  const {username} = useContext(UserContext);

  // there are three "levels" of getting sleep
  // ONE: only exists in health "inHealth"
  // this could be visible if the user opts for manual import
  // TWO: exists in health, , uploaded to cloud
  // this would be visible if they view their own sleeps
  const [inHealth, setInHealth] = useState([]);

  // best to only call this in the settings screen
  // what's better, to store all the sleep sessions in a single AsyncStorage object,
  // or to split them up?

  // really should be UserDefault
  const [autoUpload, setAutoUpload] = useState(false);
  const [uploaded, setUploaded] = useState(null);

  useEffect(() => {
    if(username) // not this simple
      init();
  }, [username]);

  const init = async () => {
    //await AsyncStorage.setItem(UPLOADED_SLEEPS_KEY, JSON.stringify('[]'))
    const us = await AsyncStorage.getItem(UPLOADED_SLEEPS_KEY);

    let existing = []
    let nextUploaded;

    if (us === null || us === '{}') {
      console.log('cache is null, getting from network')
      // no cache, try getting from network
      //setUploaded(new Set(res.data.listSleeps.items.map(s => makeSleepKey(s.data))));
      const fu = await fetchUploaded();
      nextUploaded = await handleUploadedChange(fu, true);

      // handle it here
      //setUploaded(new Set());

    } else {
      const list = JSON.parse(us);
      existing = list;
      //setUploaded(new Set(list));
      nextUploaded = await handleUploadedChange(new Set(list), false);
    }
    const n = new Set([...existing, ...nextUploaded]);
    await AsyncStorage.setItem(UPLOADED_SLEEPS_KEY, JSON.stringify([...n]));
    setUploaded(n);
  }

  const handleUploadedChange = async (u, checkedNetwork) => {

    const ih = await loadFromHealth();
    setInHealth(ih); // it's own thing

    // now, check for the diff between ih and uploaded

    let inHealthNotUploaded = ih.filter(x => !u.has(makeSleepKey(x)));

    if (inHealthNotUploaded.length === 0)
      return u;

    if (!checkedNetwork) {
      u = await fetchUploaded();// the point of this is that here we can check AFTER some date
      const checkDiff = ih.filter(x => !u.has(makeSleepKey(x)));

      // nothing to upload again, but go ahead and upadte the thing in asyncstorage
      if (checkDiff.length === 0 || !autoUpload)
        return u;

      //otherwise, set the other variable and proceed
      inHealthNotUploaded = checkDiff;
    }

    // at this point, inHealthNotUploaded DEFINITELY has something

    // everything in health is uploaded and marked uploaded, nothing to do
    if (!autoUpload)
      return u;

    // for loop await isn't ideal, but Promise.all is too fast for lambda
    const newUploads = [];
    for (let i = 0; i < inHealthNotUploaded.length; i++){
      let k = await uploadSleep({
        id: RECENT,
        description: `uploaded from useEffect at ${new Date().toLocaleString()}`,
        data: inHealthNotUploaded[i]
      });
      newUploads.push(k)
    }

    return [...u, ...newUploads];
  }

  const fetchUploaded = async (after) => {
    const res = await API.graphql(graphqlOperation(listSleeps, {
      //this filter is crucial
      filter: {
        userID: {eq: username},
      }
    }));
    return new Set(res.data.listSleeps.items.map(s => makeSleepKey(s.data)))
  };

  // the "recent sleep data" useEffect
  useEffect(() => {
    if (!username || !uploaded)
      return;

    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);

    let candidate = inHealth.filter(sleep => new Date(sleep.bedEnd) > today)
      .filter(x => !uploaded.has(makeSleepKey(x)))

    if (candidate.length !== 0 && !autoUpload) {
      setRecentSleepData(candidate[0]);
    } else {
      setRecentSleepData(null);
    }

    // most recent first

  }, [inHealth, uploaded, username]);

// this one's going to be a bit more interesting

// two uses: manually uploading recentSleep object
// auto upload, no title
  const uploadSleep = async sleep => {
    const key = makeSleepKey(sleep.data);
    //convert to proper post object, with comments and shit
    // then upload to AWS

    //1
    if (sleep.id === RECENT){

      // we'll do this for now
      const csi = {...sleep,
        type: 'sleep',
        userID: username,
        //title: '',
        //description: '',
        //data: sleep
      };
      console.log(JSON.stringify(csi));

      await API.graphql(graphqlOperation(createSleepAndRecords,  {csi} ));


      return key;
    } else { //2
      //console.log(Object.keys(sleep))
      delete sleep.likes;
      delete sleep.comments;
      delete sleep.updatedAt;
      delete sleep.createdAt;//hmm

      const res = await API.graphql(graphqlOperation(updateSleep, {input: sleep}));
      //console.log(res);
    }
  }

  const clearCache = async () => {
    try {
      await AsyncStorage.clear();
      setUploaded(new Set());
    } catch(e) {
      console.log(e);
    }
  }

// most recent unuploaded sleep, as long as sleepEnd is today

// this is a state so that we have a little "staging" post thing
//const [recentSleep, setRecentSleep] = useState({data:null});
  const [recentSleepData, setRecentSleepData] = useState(null);

  const recentSleep = useMemo(() => {
    return {id: RECENT, data: recentSleepData};
  }, [recentSleepData]);

  return (
    <SleepContext.Provider value={{
      inHealth,

      //  could be in settings for sure
      autoUpload,
      setAutoUpload,

      recentSleep,

      uploadSleep,
      uploaded,

      clearCache,
    }}>
      {props.children}
    </SleepContext.Provider>
  );
}

export default SleepProvider;
