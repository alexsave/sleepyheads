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

let graphqlClient;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event, context, callback){

    // what do we do


    // big code, we should put this in a layer or somethign
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


    const likeInfo = event.arguments.lsi;

    // check likes on the post, filter on userID
    const queryInput = {
        userID,
        sleepID: {eq: likeInfo.sleepID},
        limit: 1,
    };

    //bascially we need groups by user,
    const getLikeResult = await graphqlClient.query({
        query: gql(likeByUserAndPost),
        fetchPolicy: 'network-only',
        variables: queryInput,
    });
    console.log('getlikeresult', getLikeResult);

    const theLike = getLikeResult.data.likeByUserAndPost.items[0];

    let mutation = '';

    //idk
    if (!theLike){
        // if doesn't exist
        // create it
        console.log('doesn"t exist')
        const likeInput = {
            mutation: gql(createLike),
            variables: {
                input: likeInfo
            }
        }

        const likeRes = await graphqlClient.mutate(likeInput);
        console.log(likeRes);
        return Object.values(likeRes.data)[0];

    } else if (theLike.type === likeInfo.type) {
        // if is of the same type
        // delete it... right?

        console.log('same type')
        const likeInput = {
            mutation: gql(deleteLike),
            variables: {
                input: {id: theLike.id}
            }
        }

        const likeRes = await graphqlClient.mutate(likeInput);
        console.log(likeRes);
        return theLike;//Object.values(likeRes.data)[0];

    } else if (theLike.type !== likeInfo.type) {

        // if of opposite type
        // update it
        console.log('opposite type')
        const likeInput = {
            mutation: gql(updateLike),
            variables: {
                input: {
                    id: theLike.id,
                    type: likeInfo.type
                }
            }
        }

        const likeRes = await graphqlClient.mutate(likeInput);
        console.log(likeRes);
        return Object.values(likeRes.data)[0];
    }


};

const likeByUserAndPost = /* GraphQL */ `
    query LikeByUserAndPost(
        $userID: ID!
        $sleepID: ModelIDKeyConditionInput
        $sortDirection: ModelSortDirection
        $filter: ModelLikeFilterInput
        $limit: Int
        $nextToken: String
    ) {
        likeByUserAndPost(
            userID: $userID
            sleepID: $sleepID
            sortDirection: $sortDirection
            filter: $filter
            limit: $limit
            nextToken: $nextToken
        ) {
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

const createLike = /* GraphQL */ `
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

const updateLike = /* GraphQL */ `
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

const deleteLike = /* GraphQL */ `
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
