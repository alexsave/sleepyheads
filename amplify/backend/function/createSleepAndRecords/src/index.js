/* Amplify Params - DO NOT EDIT
	API_SLEEPYHEADSAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_SLEEPYHEADSAPI_GRAPHQLAPIIDOUTPUT
	API_SLEEPYHEADSAPI_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

// Annoying but saves a lot of space in lambdas
import gql from '/opt/nodejs/node_modules/graphql-tag/main.js';
import fetch from '/opt/nodejs/node_modules/node-fetch/src/index.js';
import { AWSAppSyncClient } from '/opt/nodejs/node_modules/aws-appsync/lib/index.js';
global.fetch = fetch;


/*exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
        body: JSON.stringify('Hello from Lambda!'),
    };
};*/

let graphqlClient;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event, context, callback){

    if (!graphqlClient) {
        let env;
        let graphql_auth;
        if ('AWS_EXECUTION_ENV' in process.env && process.env.AWS_EXECUTION_ENV.startsWith('AWS_Lambda_')) {
            //for cloud env
            env = process.env;
            graphql_auth = {
                type: "AWS_IAM",
                credentials: {
                    accessKeyId: env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
                    sessionToken: env.AWS_SESSION_TOKEN,
                }
            };
        } else {
            // for local mock
            env = {
                API_SLEEPYHEADSAPI_GRAPHQLAPIENDPOINTOUTPUT: 'http://192.168.1.2:20002/graphql',
                REGION: 'us-east-1',
            }
            graphql_auth = {
                type: "AWS_IAM",
                credentials: {
                    accessKeyId: 'mock',
                    secretAccessKey: 'mock',
                    sessionToken: 'mock',
                }
            };
        }
        console.log(JSON.stringify({url: env.API_SLEEPYHEADSAPI_GRAPHQLAPIENDPOINTOUTPUT,
              region: env.REGION,
              auth: graphql_auth,}));
        graphqlClient = new AWSAppSyncClient({
            //i think this is the problem
            url: env.API_SLEEPYHEADSAPI_GRAPHQLAPIENDPOINTOUTPUT,
            region: env.REGION,
            auth: graphql_auth,
            disableOffline: true,
        });
    }

    //update routine in here somewhere, don't forget
    //event.arguments.workoutData will be used

    const userID = event.identity.username;

    console.log(JSON.stringify(event));

    const sleepData = event.arguments.csi.data;


    console.log('sleepData', sleepData);

    //sleeprecord is KINDA similar to the old report
    let start = secondsFromDayStart(sleepData.bedStart);
    let end = secondsFromDayStart(sleepData.bedEnd);

    // this is a whole class in itself
    const asleep = event.arguments.csi.data.samples
      .filter(x => !['INBED', 'AWAKE'].includes(x.type) )
      .reduce((acc, cur) => acc + cur.endOffset - cur.startOffset, 0);

    const sleepInput = {
        mutation: gql(createSleep),
        variables: {
            input: {
                type: 'sleep',
                title: event.arguments.csi.title,
                description: event.arguments.csi.description,
                data: sleepData,
                media: event.arguments.csi.media,
                userID,
            }
        }
    };

    const sleepRes = await graphqlClient.mutate(sleepInput);

    //this is the most important variable
    const sleepID = sleepRes.data.createSleep.id;

    //we now split into 4 independent processing paths
    console.log('creating timelines');
    const input = {
        sleepRecordSleepId: sleepID,
        rankBedStart: start,
        rankBedEnd: end,
        rankSleepTime: asleep
    }
    await createSleepRecords(graphqlClient, userID, input)
    // might add some stat work here
    console.log('done')

    return sleepRes.data.createSleep;
};

const secondsFromDayStart = t => {
    const today = new Date(t), today_abs = new Date(t);
    today_abs.setHours(0);
    today_abs.setMinutes(0);
    today_abs.setSeconds(0);
    return (today.getTime() - today_abs.getTime()) / 1000;
}

const createSleepRecords = async (graphqlClient, userID, input) => {
    const queryInput = {
        userID,
        limit: 100000,
    };

    //bascially we need groups by user,
    const listGroupUsersResult = await graphqlClient.query({
        query: gql(listGroupUsers),
        fetchPolicy: 'network-only',
        variables: queryInput,
    });

    console.log(listGroupUsersResult.data.listGroupUsers);
    const groupIDs = listGroupUsersResult.data.listGroupUsers.items.map(x => x.groupID);

    /*// if the user isn't following themselves
    if(!groupIDs.some(follower => follower.followerID === userID )){
        // count them in anyways
        groupIDs.push({ followerID: userID });
    }*/

    // if the singleton [userID] group doesn't exist, make it for personal stats
    if (!groupIDs.some(id => id === userID)){
        // build user group and then
        groupIDs.push(userID);
    }


    //do we really need to await?
    //could be this guy, if listFollowRelationships fails
    //then again, it would just be []
    //so not this
    console.log(groupIDs);
    await Promise.all(groupIDs.map(groupID =>
      createRecordForGroup(graphqlClient, {...input, groupID})
    ));

}

const createRecordForGroup = async (graphqlClient, input) => {
    const timelineInput = {
        mutation: gql(createSleepRecord),
        variables: { input },
    };
    console.log('mutating for group ' + input.groupID);
    await graphqlClient.mutate(timelineInput);
};


// In tabe, we had it set up where mutations and queries were copied to amplify/backend/function/library/opt/
// then from here we do const {} = require('/opt/queries')
// could use a script to copy them over
const createSleep = /* GraphQL */ `
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

const listGroupUsers = /* GraphQL */ `
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

const createSleepRecord = /* GraphQL */ `
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
            userID
            createdAt
            updatedAt
            sleepRecordSleepId
        }
    }
`;
