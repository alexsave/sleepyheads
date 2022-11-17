// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const LikeType = {
  "SNOOZE": "SNOOZE",
  "ALARM": "ALARM"
};

const SleepSampleType = {
  "AWAKE": "AWAKE",
  "INBED": "INBED",
  "CORE": "CORE",
  "REM": "REM",
  "DEEP": "DEEP",
  "ASLEEP": "ASLEEP"
};

const { Sleep, Like, Comment, User, Group, SleepRecord, GroupUser, SleepData, SleepSample } = initSchema(schema);

export {
  Sleep,
  Like,
  Comment,
  User,
  Group,
  SleepRecord,
  GroupUser,
  LikeType,
  SleepSampleType,
  SleepData,
  SleepSample
};