import { generateClient } from 'aws-amplify/api';

// Single GraphQL client for the app. generateClient() reads the Amplify
// configuration lazily at call time, so this is safe to create at module load.
export const client = generateClient();

// Amplify v6 removed the graphqlOperation helper. This shim returns exactly
// what it used to ({ query, variables }), which is what client.graphql expects,
// so the existing call sites can stay unchanged.
export const graphqlOperation = (query, variables) => ({ query, variables });
