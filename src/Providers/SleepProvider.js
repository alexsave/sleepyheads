import React, { useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadFromHealth } from '../Network/PostLoad';
import { API, graphqlOperation } from 'aws-amplify';
import { ANONYMOUS, NOT_SIGNED_IN, UserContext } from './UserProvider';
import { createSleepAndRecords, updateSleep } from '../graphql/mutations';
import { sleepsByUser } from '../graphql/queries';
import { Settings } from 'react-native';

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

const AUTO_UPLOAD_KEY = "autoUploadSleep"

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
  // new idea, autoupload is ONLY for new ones
  const [autoUpload, internalSetAutoUpload] = useState(false);
  const [uploaded, setUploaded] = useState(null);

  useEffect(() => {
    if(username && username !== ANONYMOUS && username !== NOT_SIGNED_IN)
      init();
  }, [username]);

  const setAutoUpload = async val => {
    await Settings.set({[AUTO_UPLOAD_KEY]: val})
    internalSetAutoUpload(val);
  }

  const init = async () => {
    //await AsyncStorage.setItem(UPLOADED_SLEEPS_KEY, JSON.stringify('[]'))
    const us = await AsyncStorage.getItem(UPLOADED_SLEEPS_KEY);

    const au = await Settings.get(AUTO_UPLOAD_KEY);
    internalSetAutoUpload(au);

    let existing = []
    let nextUploaded;

    if (us === null || us === '{}') {
      console.log('cache is null, getting from network')
      // no cache, try getting from network
      //setUploaded(new Set(res.data.listSleeps.items.map(s => makeSleepKey(s.data))));
      const fu = await fetchUploaded();
      nextUploaded = await handleUploadedChange(fu, true, au);

      // handle it here
      //setUploaded(new Set());

    } else {
      const list = JSON.parse(us);
      existing = list;
      //setUploaded(new Set(list));
      nextUploaded = await handleUploadedChange(new Set(list), false, au);
    }
    const n = new Set([...existing, ...nextUploaded]);
    await AsyncStorage.setItem(UPLOADED_SLEEPS_KEY, JSON.stringify([...n]));
    setUploaded(n);
  }

  // au is autoUpload, keeping serparate from the useState variable
  const handleUploadedChange = async (u, checkedNetwork, au) => {

    const ih = await loadFromHealth();
    setInHealth(ih); // it's own thing

    // now, check for the diff between ih and uploaded

    // at this point, inHealthNotUploaded DEFINITELY has something

    // everything in health is uploaded and marked uploaded, nothing to do
    if (!au)
      return u;

    // only upload the "candidate" sleep

    const candidate = retrieveCandidate(u, ih);
    if (!candidate)
      return u;

    const candidateKey = makeSleepKey(candidate);

    if (!checkedNetwork) {
      u = await fetchUploaded();
    }

    if (u.has(candidateKey))
      return u;

    let k = await uploadSleep({
      id: RECENT,
      description: `uploaded from useEffect at ${new Date().toLocaleString()}`,
      data: candidate // not sure about this one
    });

    return [...u, k];
  }

  const fetchUploaded = async (after) => {
    const res = await API.graphql(graphqlOperation(sleepsByUser, {
      userID: username
    }));
    return new Set(res.data.sleepsByUser.items.map(s => makeSleepKey(s.data)))
  };

  // the "recent sleep data" useEffect
  useEffect(() => {
    if (!username || !uploaded)
      return;

    if (!autoUpload) {
      setRecentSleepData(retrieveCandidate());
    } else {
      setRecentSleepData(null);
    }

  }, [inHealth, uploaded, username]);

  const retrieveCandidate = (u=uploaded, ih=inHealth) => {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);

    let candidate = ih.filter(sleep => new Date(sleep.bedEnd) > today)
      .filter(x => !u.has(makeSleepKey(x)))

    if (candidate.length !== 0) {
      return candidate[0];
    } else {
      return null;
    }
  }

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
    return {sleep: {id: RECENT, data: recentSleepData}};
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
