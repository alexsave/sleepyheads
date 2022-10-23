import AppleHealthKit from 'react-native-health';

// this might link to native module later, that handles more
export const getSleepPermissions = cb => {
  const permissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.SleepAnalysis,
        AppleHealthKit.Constants.Permissions.StepCount,
      ],
    },
  };
  AppleHealthKit.initHealthKit(permissions, error => {
    if (error) {
      console.log(error);
    } else if (cb) {
      cb();
    }
  });
};
