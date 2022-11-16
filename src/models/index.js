// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Todo, Post } = initSchema(schema);

export {
  Todo,
  Post
};