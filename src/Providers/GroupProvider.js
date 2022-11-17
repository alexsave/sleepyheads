import { API, graphqlOperation } from 'aws-amplify';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { NOT_SIGNED_IN, UserContext } from './UserProvider';
import { sleepByTimestamp, sleepsByTimestamp } from '../graphql/queries';

export const GroupContext = React.createContext();

const INITIAL_QUERY = 'INITIAL_QUERY';
const ADDITIONAL_QUERY = 'ADDITIONAL_QUERY';
const SUBSCRIPTION = 'SUBSCRIPTION';

const reducer = (state, action) => {
  switch(action.type){
    case INITIAL_QUERY:
      return action.posts;
    case ADDITIONAL_QUERY:
      return [...state, ...action.posts];
    case SUBSCRIPTION:
      return [action.post, ...state];
    default:
      return state;
  }
};

const GroupProvider = props => {

  const {username} = useContext(UserContext);

  // essentially a map of [groupID -> [timelines]], timelines used in Feed.js & Profile.js
  const [postMap, setPostMap] = useState({});

  const [groupID, setGroupID] = useState('');

  // Let's just worry about one 'group' for now, the global group
  const [posts, dispatch] = useReducer(reducer, []);
  const [isLoading, setIsLoading] = useState(true);
  const [nextToken, setNextToken] = useState(null);


  // later this will be used to load "sleeprecords"
  const loadFeed = async (type = INITIAL_QUERY, nextToken = null) => {
    const res = await API.graphql(graphqlOperation(sleepsByTimestamp, {
      type: 'sleep',
      sortDirection: 'DESC',
      limit: 20,
      nextToken: nextToken
    }));
    console.log(JSON.stringify(res));

    dispatch({ type: type, posts: res.data.sleepsByTimestamp.items });

    setNextToken(res.data.sleepsByTimestamp.nextToken);
    setIsLoading(false);


  };

  const getAdditionalPosts = () => {
    if(nextToken === null) return;
    loadFeed(ADDITIONAL_QUERY, nextToken);
  };

  useEffect(() => {
    if (username && !username === NOT_SIGNED_IN)
      return;
    loadFeed(INITIAL_QUERY);

    /*const subscription = API.graphql(onCreateSleep)
      .subscribe({
        next: msg => {
          const post = Object.values(msg.value.data)[0];
          dispatch({type: SUBSCRIPTION, post: post});
        }
      });
    return () => subscription.unsubscribe();*/
  }, [username, groupID])

  return (
    <GroupContext.Provider value={{
      loadFeed,
      isLoading,
      posts,
      getAdditionalPosts
    }}>
      {props.children}
    </GroupContext.Provider>
  );
}

export default GroupProvider;
