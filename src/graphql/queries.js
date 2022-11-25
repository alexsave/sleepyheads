/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSleep = /* GraphQL */ `
  query GetSleep($id: ID!) {
    getSleep(id: $id) {
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
export const listSleeps = /* GraphQL */ `
  query ListSleeps(
    $filter: ModelSleepFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSleeps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const sleepsByTimestamp = /* GraphQL */ `
  query SleepsByTimestamp(
    $type: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSleepFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sleepsByTimestamp(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          samples {
            startOffset
            endOffset
            type
          }
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const sleepsByUser = /* GraphQL */ `
  query SleepsByUser(
    $userID: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSleepFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sleepsByUser(
      userID: $userID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      sleepID
      content
      userID
      createdAt
      updatedAt
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const getLike = /* GraphQL */ `
  query GetLike($id: ID!) {
    getLike(id: $id) {
      id
      sleepID
      type
      userID
      createdAt
      updatedAt
    }
  }
`;
export const listLikes = /* GraphQL */ `
  query ListLikes(
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLikes(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
          group {
            id
            name
            createdAt
            updatedAt
            owner
          }
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
          userID
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $id: ID
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getSleepRecord = /* GraphQL */ `
  query GetSleepRecord($id: ID!) {
    getSleepRecord(id: $id) {
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
      userID
    }
  }
`;
export const listSleepRecords = /* GraphQL */ `
  query ListSleepRecords(
    $filter: ModelSleepRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSleepRecords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sleep {
          id
          type
          userID
          title
          description
          media
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
        userID
      }
      nextToken
    }
  }
`;
export const recordsByGroup = /* GraphQL */ `
  query RecordsByGroup(
    $groupID: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSleepRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    recordsByGroup(
      groupID: $groupID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        sleep {
          id
          type
          userID
          title
          description
          media
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
        userID
      }
      nextToken
    }
  }
`;
export const getGroup = /* GraphQL */ `
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
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
          userID
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
export const listGroups = /* GraphQL */ `
  query ListGroups(
    $filter: ModelGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getGroupUser = /* GraphQL */ `
  query GetGroupUser($id: ID!) {
    getGroupUser(id: $id) {
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
export const listGroupUsers = /* GraphQL */ `
  query ListGroupUsers(
    $filter: ModelGroupUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroupUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        groupID
        user {
          id
          image
          name
          createdAt
          updatedAt
        }
        group {
          id
          name
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
