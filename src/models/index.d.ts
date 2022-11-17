import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

export enum LikeType {
  SNOOZE = "SNOOZE",
  ALARM = "ALARM"
}

export enum SleepSampleType {
  AWAKE = "AWAKE",
  INBED = "INBED",
  CORE = "CORE",
  REM = "REM",
  DEEP = "DEEP",
  ASLEEP = "ASLEEP"
}

type EagerSleepData = {
  readonly bedStart: string;
  readonly bedEnd: string;
  readonly duration: number;
  readonly samples?: SleepSample[] | null;
}

type LazySleepData = {
  readonly bedStart: string;
  readonly bedEnd: string;
  readonly duration: number;
  readonly samples?: SleepSample[] | null;
}

export declare type SleepData = LazyLoading extends LazyLoadingDisabled ? EagerSleepData : LazySleepData

export declare const SleepData: (new (init: ModelInit<SleepData>) => SleepData)

type EagerSleepSample = {
  readonly type?: SleepSampleType | keyof typeof SleepSampleType | null;
  readonly startOffset: number;
  readonly endOffset: number;
}

type LazySleepSample = {
  readonly type?: SleepSampleType | keyof typeof SleepSampleType | null;
  readonly startOffset: number;
  readonly endOffset: number;
}

export declare type SleepSample = LazyLoading extends LazyLoadingDisabled ? EagerSleepSample : LazySleepSample

export declare const SleepSample: (new (init: ModelInit<SleepSample>) => SleepSample)

type SleepMetaData = {
  readOnlyFields: 'updatedAt';
}

type LikeMetaData = {
  readOnlyFields: 'updatedAt';
}

type CommentMetaData = {
  readOnlyFields: 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type GroupMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type SleepRecordMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type GroupUserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerSleep = {
  readonly id: string;
  readonly type: string;
  readonly userID: string;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly likes?: (Like | null)[] | null;
  readonly comments?: (Comment | null)[] | null;
  readonly media?: (string | null)[] | null;
  readonly data?: SleepData | null;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

type LazySleep = {
  readonly id: string;
  readonly type: string;
  readonly userID: string;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly likes: AsyncCollection<Like>;
  readonly comments: AsyncCollection<Comment>;
  readonly media?: (string | null)[] | null;
  readonly data?: SleepData | null;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

export declare type Sleep = LazyLoading extends LazyLoadingDisabled ? EagerSleep : LazySleep

export declare const Sleep: (new (init: ModelInit<Sleep, SleepMetaData>) => Sleep) & {
  copyOf(source: Sleep, mutator: (draft: MutableModel<Sleep, SleepMetaData>) => MutableModel<Sleep, SleepMetaData> | void): Sleep;
}

type EagerLike = {
  readonly id: string;
  readonly sleepID: string;
  readonly type?: LikeType | keyof typeof LikeType | null;
  readonly userID: string;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

type LazyLike = {
  readonly id: string;
  readonly sleepID: string;
  readonly type?: LikeType | keyof typeof LikeType | null;
  readonly userID: string;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

export declare type Like = LazyLoading extends LazyLoadingDisabled ? EagerLike : LazyLike

export declare const Like: (new (init: ModelInit<Like, LikeMetaData>) => Like) & {
  copyOf(source: Like, mutator: (draft: MutableModel<Like, LikeMetaData>) => MutableModel<Like, LikeMetaData> | void): Like;
}

type EagerComment = {
  readonly id: string;
  readonly sleepID: string;
  readonly content: string;
  readonly userID: string;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

type LazyComment = {
  readonly id: string;
  readonly sleepID: string;
  readonly content: string;
  readonly userID: string;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

export declare type Comment = LazyLoading extends LazyLoadingDisabled ? EagerComment : LazyComment

export declare const Comment: (new (init: ModelInit<Comment, CommentMetaData>) => Comment) & {
  copyOf(source: Comment, mutator: (draft: MutableModel<Comment, CommentMetaData>) => MutableModel<Comment, CommentMetaData> | void): Comment;
}

type EagerUser = {
  readonly id: string;
  readonly sleeps?: (Sleep | null)[] | null;
  readonly image?: string | null;
  readonly name?: string | null;
  readonly groups?: (GroupUser | null)[] | null;
  readonly sleepRecords?: (SleepRecord | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly id: string;
  readonly sleeps: AsyncCollection<Sleep>;
  readonly image?: string | null;
  readonly name?: string | null;
  readonly groups: AsyncCollection<GroupUser>;
  readonly sleepRecords: AsyncCollection<SleepRecord>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User, UserMetaData>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

type EagerGroup = {
  readonly id: string;
  readonly name: string;
  readonly sleepRecords?: (SleepRecord | null)[] | null;
  readonly users?: (GroupUser | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyGroup = {
  readonly id: string;
  readonly name: string;
  readonly sleepRecords: AsyncCollection<SleepRecord>;
  readonly users: AsyncCollection<GroupUser>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Group = LazyLoading extends LazyLoadingDisabled ? EagerGroup : LazyGroup

export declare const Group: (new (init: ModelInit<Group, GroupMetaData>) => Group) & {
  copyOf(source: Group, mutator: (draft: MutableModel<Group, GroupMetaData>) => MutableModel<Group, GroupMetaData> | void): Group;
}

type EagerSleepRecord = {
  readonly id: string;
  readonly sleep?: Sleep | null;
  readonly groupID: string;
  readonly rankBedStart?: number | null;
  readonly rankBedEnd?: number | null;
  readonly rankSleepTime?: number | null;
  readonly userID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly sleepRecordSleepId?: string | null;
}

type LazySleepRecord = {
  readonly id: string;
  readonly sleep: AsyncItem<Sleep | undefined>;
  readonly groupID: string;
  readonly rankBedStart?: number | null;
  readonly rankBedEnd?: number | null;
  readonly rankSleepTime?: number | null;
  readonly userID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly sleepRecordSleepId?: string | null;
}

export declare type SleepRecord = LazyLoading extends LazyLoadingDisabled ? EagerSleepRecord : LazySleepRecord

export declare const SleepRecord: (new (init: ModelInit<SleepRecord, SleepRecordMetaData>) => SleepRecord) & {
  copyOf(source: SleepRecord, mutator: (draft: MutableModel<SleepRecord, SleepRecordMetaData>) => MutableModel<SleepRecord, SleepRecordMetaData> | void): SleepRecord;
}

type EagerGroupUser = {
  readonly id: string;
  readonly user: User;
  readonly group: Group;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyGroupUser = {
  readonly id: string;
  readonly user: AsyncItem<User>;
  readonly group: AsyncItem<Group>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type GroupUser = LazyLoading extends LazyLoadingDisabled ? EagerGroupUser : LazyGroupUser

export declare const GroupUser: (new (init: ModelInit<GroupUser, GroupUserMetaData>) => GroupUser) & {
  copyOf(source: GroupUser, mutator: (draft: MutableModel<GroupUser, GroupUserMetaData>) => MutableModel<GroupUser, GroupUserMetaData> | void): GroupUser;
}