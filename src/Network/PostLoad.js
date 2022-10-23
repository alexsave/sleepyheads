// in the tabe app, we had an idea of a PostList that handled some rendering as well as
// loading of all stuff. in this folder, we'll handle the network requests


// probably used by useEffect in some other component
// might move this into two methods, one to load from apple health and one to load from AWS
// for now it'll just load from health
import { getSleepPermissions } from '../Utils/Permissions';
import { processSleep } from '../Utils/ProcessSleep';
import AppleHealthKit from 'react-native-health';

const getSleep = cb => {
  const startDate = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const options = {
    startDate,
    ascending: true
  };
  AppleHealthKit.getSleepSamples(options, (error, results) => {
    if (error) {
      console.log(error);
    }
    //console.log(results);
    cb(results);
  });
};


// check sleep permissions, get sleep, process sleep, then send back the promise
export const loadPosts = cb => {

  getSleepPermissions(() => {
    getSleep(sd => cb(processSleep(sd)))
  })
};
