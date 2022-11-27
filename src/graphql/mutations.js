/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSleep = /* GraphQL */ `
  mutation CreateSleep(
    $input: CreateSleepInput!
    $condition: ModelSleepConditionInput
  ) {
    createSleep(input: $input, condition: $condition) {
      id
      type
      userID
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
export const updateSleep = /* GraphQL */ `
  mutation UpdateSleep(
    $input: UpdateSleepInput!
    $condition: ModelSleepConditionInput
  ) {
    updateSleep(input: $input, condition: $condition) {
      id
      type
      userID
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
export const deleteSleep = /* GraphQL */ `
  mutation DeleteSleep(
    $input: DeleteSleepInput!
    $condition: ModelSleepConditionInput
  ) {
    deleteSleep(input: $input, condition: $condition) {
      id
      type
      userID
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      sleepID
      content
      userID
      createdAt
      updatedAt
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
      id
      sleepID
      content
      userID
      createdAt
      updatedAt
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
      id
      sleepID
      content
      userID
      createdAt
      updatedAt
    }
  }
`;
export const createLike = /* GraphQL */ `
  mutation CreateLike(
    $input: CreateLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    createLike(input: $input, condition: $condition) {
      id
      sleepID
      type
      userID
      createdAt
      updatedAt
    }
  }
`;
export const updateLike = /* GraphQL */ `
  mutation UpdateLike(
    $input: UpdateLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    updateLike(input: $input, condition: $condition) {
      id
      sleepID
      type
      userID
      createdAt
      updatedAt
    }
  }
`;
export const deleteLike = /* GraphQL */ `
  mutation DeleteLike(
    $input: DeleteLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    deleteLike(input: $input, condition: $condition) {
      id
      sleepID
      type
      userID
      createdAt
      updatedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      sleeps {
        items {
          id
          type
          userID
          title
          description
          media
          createdAt
          updatedAt
        }
        nextToken
      }
      image
      name
      groups {
        items {
          id
          userID
          groupID
          createdAt
          updatedAt
        }
        nextToken
      }
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
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      sleeps {
        items {
          id
          type
          userID
          title
          description
          media
          createdAt
          updatedAt
        }
        nextToken
      }
      image
      name
      groups {
        items {
          id
          userID
          groupID
          createdAt
          updatedAt
        }
        nextToken
      }
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      sleeps {
        items {
          id
          type
          userID
          title
          description
          media
          createdAt
          updatedAt
        }
        nextToken
      }
      image
      name
      groups {
        items {
          id
          userID
          groupID
          createdAt
          updatedAt
        }
        nextToken
      }
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
      createdAt
      updatedAt
    }
  }
`;
export const createSleepRecord = /* GraphQL */ `
  mutation CreateSleepRecord(
    $input: CreateSleepRecordInput!
    $condition: ModelSleepRecordConditionInput
  ) {
    createSleepRecord(input: $input, condition: $condition) {
      id
      sleep {
        id
        type
        userID
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
export const updateSleepRecord = /* GraphQL */ `
  mutation UpdateSleepRecord(
    $input: UpdateSleepRecordInput!
    $condition: ModelSleepRecordConditionInput
  ) {
    updateSleepRecord(input: $input, condition: $condition) {
      id
      sleep {
        id
        type
        userID
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
export const deleteSleepRecord = /* GraphQL */ `
  mutation DeleteSleepRecord(
    $input: DeleteSleepRecordInput!
    $condition: ModelSleepRecordConditionInput
  ) {
    deleteSleepRecord(input: $input, condition: $condition) {
      id
      sleep {
        id
        type
        userID
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
export const createGroup = /* GraphQL */ `
  mutation CreateGroup(
    $input: CreateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    createGroup(input: $input, condition: $condition) {
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
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup(
    $input: UpdateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    updateGroup(input: $input, condition: $condition) {
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
export const deleteGroup = /* GraphQL */ `
  mutation DeleteGroup(
    $input: DeleteGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    deleteGroup(input: $input, condition: $condition) {
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
export const createGroupUser = /* GraphQL */ `
  mutation CreateGroupUser(
    $input: CreateGroupUserInput!
    $condition: ModelGroupUserConditionInput
  ) {
    createGroupUser(input: $input, condition: $condition) {
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
export const updateGroupUser = /* GraphQL */ `
  mutation UpdateGroupUser(
    $input: UpdateGroupUserInput!
    $condition: ModelGroupUserConditionInput
  ) {
    updateGroupUser(input: $input, condition: $condition) {
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
export const deleteGroupUser = /* GraphQL */ `
  mutation DeleteGroupUser(
    $input: DeleteGroupUserInput!
    $condition: ModelGroupUserConditionInput
  ) {
    deleteGroupUser(input: $input, condition: $condition) {
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
export const createSleepAndRecords = /* GraphQL */ `
  mutation CreateSleepAndRecords($csi: CreateSleepInput!) {
    createSleepAndRecords(csi: $csi) {
      id
      type
      userID
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
export const likeSleep = /* GraphQL */ `
  mutation LikeSleep($lsi: LikeSleepInput!) {
    likeSleep(lsi: $lsi) {
      id
      sleepID
      type
      userID
      createdAt
      updatedAt
    }
  }
`;
