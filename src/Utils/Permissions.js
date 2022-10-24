import AppleHealthKit from 'react-native-health';

// this might link to native module later, that handles more
export const getSleepPermissions = () => {
  const permissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.SleepAnalysis,
        AppleHealthKit.Constants.Permissions.StepCount,
      ],
    },
  };
  return new Promise((resolve, reject) => {
    AppleHealthKit.initHealthKit(permissions, error => {
      if (error) {
        reject(error);//console.log(error);
      } else {
        resolve();
      }
    });
  })
};
