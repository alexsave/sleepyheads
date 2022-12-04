import React, { useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { ANONYMOUS, NOT_SIGNED_IN, UserContext } from './UserProvider';
import { GroupContext, GLOBAL } from './GroupProvider';
import { API, graphqlOperation } from 'aws-amplify';
import { recordsByGroup, sleepsByTimestamp } from '../graphql/queries';

export const SocialContext = React.createContext();

const INITIAL_QUERY = 'INITIAL_QUERY';
const ADDITIONAL_QUERY = 'ADDITIONAL_QUERY';
const SUBSCRIPTION = 'SUBSCRIPTION';
const LOGOUT = 'LOGOUT';

const groupReducer = (state, action) => {
  //do I need full copy?
  switch(action.type) {
    case INITIAL_QUERY:
      return {...state, [action.groupID]: action.posts};
    case ADDITIONAL_QUERY:
      //ffs
      return {...state, [action.groupID]: [...state[action.groupID], ...action.posts]};
    case SUBSCRIPTION:
      return {...state, [action.groupID]: [action.post, ...state[action.groupID]]};
    case LOGOUT:
      return {};
    default:
      return state;
  }
}

const SocialProvider = props => {
  const {username} = useContext(UserContext);
  const {groupID} = useContext(GroupContext)

  const [isLoading, setIsLoading] = useState(true);
  const [nextToken, setNextToken] = useState(null);
  const [postsByGroup, dispatch] = useReducer(groupReducer, {});

  // this one is fine
  useEffect(() => {
    if (!username || username === NOT_SIGNED_IN || username === ANONYMOUS)
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

  // later this will be used to load "sleeprecords"
  const loadFeed = async (type = INITIAL_QUERY, nextToken = null) => {
    // this could be more intricate, maybe we don't NEED to reload

    //groupID = '', global query on sleepsByTimestamp or recordsByTimestamp
    //gropuID = username, sleepsByUser
    //groupID = group, recordsByGroup
    console.log(groupID);

    if (groupID === GLOBAL) {
      const res = await API.graphql(graphqlOperation(sleepsByTimestamp, {
        type: 'sleep',
        sortDirection: 'DESC',
        limit: 20,
        nextToken: nextToken
      }));

      dispatch({ type: type, groupID, posts: res.data.sleepsByTimestamp.items });

      setNextToken(res.data.sleepsByTimestamp.nextToken);
      setIsLoading(false);
    } else {
      if (groupID === '')
        return;

      const res = await API.graphql(graphqlOperation(recordsByGroup, {
        groupID: groupID,
        sortDirection: 'DESC',
        limit: 20,
        nextToken: nextToken
      }));

      dispatch({ type: type, groupID, posts: res.data.recordsByGroup.items });

      setNextToken(res.data.recordsByGroup.nextToken);
      setIsLoading(false);
    }
  };

  const getAdditionalPosts = () => {
    if(nextToken === null) return;
    loadFeed(ADDITIONAL_QUERY, nextToken);
  };

  const posts = useMemo(() => postsByGroup[groupID] || [], [postsByGroup, groupID]);

  return <SocialContext.Provider value={{
    loadFeed,
    isLoading,
    posts,
    getAdditionalPosts,
  }}>
    {props.children}
  </SocialContext.Provider>
}

export default SocialProvider;
