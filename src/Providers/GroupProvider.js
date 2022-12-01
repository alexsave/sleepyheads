import React, { useState } from 'react';

export const GroupContext = React.createContext();

export const GLOBAL = 'GLOBAL';

const GroupProvider = props => {

  const [groups, setGroups] = useState([]);
  const [groupID, setGroupID] = useState(GLOBAL);

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
    }}>
      {props.children}
    </GroupContext.Provider>
  );
}

export default GroupProvider;
