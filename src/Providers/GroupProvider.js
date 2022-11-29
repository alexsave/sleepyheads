import { API, graphqlOperation } from 'aws-amplify';
import React, { useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { ANONYMOUS, NOT_SIGNED_IN, UserContext } from './UserProvider';
import { recordsByGroup, sleepsByTimestamp } from '../graphql/queries';

export const GroupContext = React.createContext();

export const GLOBAL = 'GLOBAL';

const INITIAL_QUERY = 'INITIAL_QUERY';
const ADDITIONAL_QUERY = 'ADDITIONAL_QUERY';
const SUBSCRIPTION = 'SUBSCRIPTION';
const LOGOUT = 'LOGOUT';

// hmm I already don't like this, there's going to be a lot of copying
// we maybe just handle it in the methods themselves
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

const GroupProvider = props => {

  const {username} = useContext(UserContext);

  const [groupID, setGroupID] = useState(GLOBAL);
  // essentially a map of [groupID -> [timelines]], timelines used in Feed.js & Profile.js
  const [postsByGroup, dispatch] = useReducer(groupReducer, {});

  // Let's just worry about one 'group' for now, the global group
  //const [posts, dispatch] = useReducer(reducer, []);
  const [isLoading, setIsLoading] = useState(true);
  const [nextToken, setNextToken] = useState(null);

  // later this will be used to load "sleeprecords"
  const loadFeed = async (type = INITIAL_QUERY, nextToken = null) => {
    // this could be more intricate, maybe we don't NEED to reload

    // NOW we can change this based on groupID
    /*
    groupID = '', global query on sleepsByTimestamp or recordsByTimestamp
    gropuID = username, sleepsByUser
    groupID = group, recordsByGroup
     */
    console.log(groupID);

    if (groupID === GLOBAL) {
      const res = await API.graphql(graphqlOperation(sleepsByTimestamp, {
        type: 'sleep',
        sortDirection: 'DESC',
        limit: 20,
        nextToken: nextToken
      }));
      //console.log(JSON.stringify(res));

      //dispatch({ type: type, posts: res.data.sleepsByTimestamp.items });
      dispatch({ type: type, groupID, posts: res.data.sleepsByTimestamp.items });

      setNextToken(res.data.sleepsByTimestamp.nextToken);
      setIsLoading(false);
    } else {
      if (groupID === ''){
        console.log("OHHHH BUDDDDDY")
        return;
      }

      const res = await API.graphql(graphqlOperation(recordsByGroup, {
        groupID: groupID,
        sortDirection: 'DESC',
        limit: 20,
        nextToken: nextToken
      }));
      //console.log(JSON.stringify(res));

      //dispatch({ type: type, posts: res.data.sleepsByTimestamp.items });
      dispatch({ type: type, groupID, posts: res.data.recordsByGroup.items });

      setNextToken(res.data.recordsByGroup.nextToken);
      setIsLoading(false);
    }

  };

  const getAdditionalPosts = () => {
    if(nextToken === null) return;
    loadFeed(ADDITIONAL_QUERY, nextToken);
  };

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

  const posts = useMemo(() => postsByGroup[groupID] || [], [postsByGroup, groupID]);

  return (
    <GroupContext.Provider value={{
      loadFeed,
      isLoading,
      posts,
      getAdditionalPosts,
      setGroupID,

    }}>
      {props.children}
    </GroupContext.Provider>
  );
}

export default GroupProvider;
