/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSleep = /* GraphQL */ `
  subscription OnCreateSleep($filter: ModelSubscriptionSleepFilterInput) {
    onCreateSleep(filter: $filter) {
      id
      type
      userID
      user {
        id
        sleeps {
          nextToken
        }
        image
        name
        groups {
          nextToken
        }
        sleepRecords {
          nextToken
        }
        createdAt
        updatedAt
      }
      title
      description
      likes {
        items {
          id
          sleepID
          type
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
      comments {
        items {
          id
          sleepID
          content
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
      media
      data {
        bedStart
        bedEnd
        duration
        samples {
          type
          startOffset
          endOffset
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateSleep = /* GraphQL */ `
  subscription OnUpdateSleep($filter: ModelSubscriptionSleepFilterInput) {
    onUpdateSleep(filter: $filter) {
      id
      type
      userID
      user {
        id
        sleeps {
          nextToken
        }
        image
        name
        groups {
          nextToken
        }
        sleepRecords {
          nextToken
        }
        createdAt
        updatedAt
      }
      title
      description
      likes {
        items {
          id
          sleepID
          type
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
      comments {
        items {
          id
          sleepID
          content
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
      media
      data {
        bedStart
        bedEnd
        duration
        samples {
          type
          startOffset
          endOffset
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteSleep = /* GraphQL */ `
  subscription OnDeleteSleep($filter: ModelSubscriptionSleepFilterInput) {
    onDeleteSleep(filter: $filter) {
      id
      type
      userID
      user {
        id
        sleeps {
          nextToken
        }
        image
        name
        groups {
          nextToken
        }
        sleepRecords {
          nextToken
        }
        createdAt
        updatedAt
      }
      title
      description
      likes {
        items {
          id
          sleepID
          type
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
      comments {
        items {
          id
          sleepID
          content
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
      media
      data {
        bedStart
        bedEnd
        duration
        samples {
          type
          startOffset
          endOffset
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $userID: String
  ) {
    onCreateComment(filter: $filter, userID: $userID) {
      id
      sleepID
      content
      userID
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $userID: String
  ) {
    onUpdateComment(filter: $filter, userID: $userID) {
      id
      sleepID
      content
      userID
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment(
    $filter: ModelSubscriptionCommentFilterInput
    $userID: String
  ) {
    onDeleteComment(filter: $filter, userID: $userID) {
      id
      sleepID
      content
      userID
      createdAt
      updatedAt
    }
  }
`;
export const onCreateLike = /* GraphQL */ `
  subscription OnCreateLike(
    $filter: ModelSubscriptionLikeFilterInput
    $userID: String
  ) {
    onCreateLike(filter: $filter, userID: $userID) {
      id
      sleepID
      type
      userID
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateLike = /* GraphQL */ `
  subscription OnUpdateLike(
    $filter: ModelSubscriptionLikeFilterInput
    $userID: String
  ) {
    onUpdateLike(filter: $filter, userID: $userID) {
      id
      sleepID
      type
      userID
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteLike = /* GraphQL */ `
  subscription OnDeleteLike(
    $filter: ModelSubscriptionLikeFilterInput
    $userID: String
  ) {
    onDeleteLike(filter: $filter, userID: $userID) {
      id
      sleepID
      type
      userID
      createdAt
      updatedAt
    }
  }
`;
export const onCreateSleepRecord = /* GraphQL */ `
  subscription OnCreateSleepRecord(
    $filter: ModelSubscriptionSleepRecordFilterInput
  ) {
    onCreateSleepRecord(filter: $filter) {
      id
      sleep {
        id
        type
        userID
        user {
          id
          image
          name
          createdAt
          updatedAt
        }
        title
        description
        likes {
          nextToken
        }
        comments {
          nextToken
        }
        media
        data {
          bedStart
          bedEnd
          duration
        }
        createdAt
        updatedAt
      }
      groupID
      rankBedStart
      rankBedEnd
      rankSleepTime
      createdAt
      updatedAt
      sleepRecordSleepId
    }
  }
`;
export const onUpdateSleepRecord = /* GraphQL */ `
  subscription OnUpdateSleepRecord(
    $filter: ModelSubscriptionSleepRecordFilterInput
  ) {
    onUpdateSleepRecord(filter: $filter) {
      id
      sleep {
        id
        type
        userID
        user {
          id
          image
          name
          createdAt
          updatedAt
        }
        title
        description
        likes {
          nextToken
        }
        comments {
          nextToken
        }
        media
        data {
          bedStart
          bedEnd
          duration
        }
        createdAt
        updatedAt
      }
      groupID
      rankBedStart
      rankBedEnd
      rankSleepTime
      createdAt
      updatedAt
      sleepRecordSleepId
    }
  }
`;
export const onDeleteSleepRecord = /* GraphQL */ `
  subscription OnDeleteSleepRecord(
    $filter: ModelSubscriptionSleepRecordFilterInput
  ) {
    onDeleteSleepRecord(filter: $filter) {
      id
      sleep {
        id
        type
        userID
        user {
          id
          image
          name
          createdAt
          updatedAt
        }
        title
        description
        likes {
          nextToken
        }
        comments {
          nextToken
        }
        media
        data {
          bedStart
          bedEnd
          duration
        }
        createdAt
        updatedAt
      }
      groupID
      rankBedStart
      rankBedEnd
      rankSleepTime
      createdAt
      updatedAt
      sleepRecordSleepId
    }
  }
`;
export const onCreateGroup = /* GraphQL */ `
  subscription OnCreateGroup(
    $filter: ModelSubscriptionGroupFilterInput
    $owner: String
  ) {
    onCreateGroup(filter: $filter, owner: $owner) {
      id
      name
      sleepRecords {
        items {
          id
          groupID
          rankBedStart
          rankBedEnd
          rankSleepTime
          createdAt
          updatedAt
          sleepRecordSleepId
        }
        nextToken
      }
      users {
        items {
          id
          userID
          groupID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateGroup = /* GraphQL */ `
  subscription OnUpdateGroup(
    $filter: ModelSubscriptionGroupFilterInput
    $owner: String
  ) {
    onUpdateGroup(filter: $filter, owner: $owner) {
      id
      name
      sleepRecords {
        items {
          id
          groupID
          rankBedStart
          rankBedEnd
          rankSleepTime
          createdAt
          updatedAt
          sleepRecordSleepId
        }
        nextToken
      }
      users {
        items {
          id
          userID
          groupID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteGroup = /* GraphQL */ `
  subscription OnDeleteGroup(
    $filter: ModelSubscriptionGroupFilterInput
    $owner: String
  ) {
    onDeleteGroup(filter: $filter, owner: $owner) {
      id
      name
      sleepRecords {
        items {
          id
          groupID
          rankBedStart
          rankBedEnd
          rankSleepTime
          createdAt
          updatedAt
          sleepRecordSleepId
        }
        nextToken
      }
      users {
        items {
          id
          userID
          groupID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateGroupUser = /* GraphQL */ `
  subscription OnCreateGroupUser(
    $filter: ModelSubscriptionGroupUserFilterInput
    $id: String
  ) {
    onCreateGroupUser(filter: $filter, id: $id) {
      id
      userID
      groupID
      user {
        id
        sleeps {
          nextToken
        }
        image
        name
        groups {
          nextToken
        }
        sleepRecords {
          nextToken
        }
        createdAt
        updatedAt
      }
      group {
        id
        name
        sleepRecords {
          nextToken
        }
        users {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateGroupUser = /* GraphQL */ `
  subscription OnUpdateGroupUser(
    $filter: ModelSubscriptionGroupUserFilterInput
    $id: String
  ) {
    onUpdateGroupUser(filter: $filter, id: $id) {
      id
      userID
      groupID
      user {
        id
        sleeps {
          nextToken
        }
        image
        name
        groups {
          nextToken
        }
        sleepRecords {
          nextToken
        }
        createdAt
        updatedAt
      }
      group {
        id
        name
        sleepRecords {
          nextToken
        }
        users {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteGroupUser = /* GraphQL */ `
  subscription OnDeleteGroupUser(
    $filter: ModelSubscriptionGroupUserFilterInput
    $id: String
  ) {
    onDeleteGroupUser(filter: $filter, id: $id) {
      id
      userID
      groupID
      user {
        id
        sleeps {
          nextToken
        }
        image
        name
        groups {
          nextToken
        }
        sleepRecords {
          nextToken
        }
        createdAt
        updatedAt
      }
      group {
        id
        name
        sleepRecords {
          nextToken
        }
        users {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
    }
  }
`;
