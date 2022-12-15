import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createGroup, createGroupUser } from '../graphql/mutations';

export const GroupContext = React.createContext();

export const GLOBAL = 'GLOBAL';

const GroupProvider = props => {

  const [groups, setGroups] = useState([]);
  const [groupID, setGroupID] = useState(GLOBAL);

  const makeGroup = async (username, groupName) => {
    let res;
    //... just give it a name, and off you go
    try  {
      res = await API.graphql(graphqlOperation(createGroup, {input: {name: groupName}}))
    } catch (e) {
      // fails because there are no users in it?
      console.log(e)
      res = e; //absolute hack

    }
    console.log('create group result', res);
    // of course, the user joins the gropu immediately
    await addUserToGroup(username, res.data.createGroup.id);

  };

  const addUserToGroup = async (username, groupID) => {
    const guInput = {
      userID: username,
      groupID
    }

    try {
      const res = await API.graphql(graphqlOperation(createGroupUser, {input: guInput/*???*/}));
      console.log(res);
    } catch (e) {
      //ignore it, the createGroupUser operation seems to load groups before the user is an owner
    }
  }

  const getGroupName = gId => {
    if (!gId)
      return '';
    if (gId === GLOBAL)
      return 'Global Feed';
    return groups.find(g => g.id === gId)?.name;
  }

  return (
    <GroupContext.Provider value={{
      groups,
      setGroups,
      groupID,
      setGroupID,
      getGroupName,

      makeGroup,
      addUserToGroup
    }}>
      {props.children}
    </GroupContext.Provider>
  );
}

export default GroupProvider;
