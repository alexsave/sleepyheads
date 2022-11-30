import React, { useEffect, useState } from 'react';
import { API, Auth, graphqlOperation, Hub } from 'aws-amplify';
import { getUser } from '../graphql/queries';
import { createUser } from '../graphql/mutations';
import { GLOBAL } from './GroupProvider';

//import { API, Auth, graphqlOperation } from 'aws-amplify';
//import { getUserImage, getUserLocation } from '../../graphql/queries';

export const UserContext = React.createContext();

// Let them try out the rings and stuff, with no network access.
export const ANONYMOUS = 'ANONYMOUS';
// null will be the state before auth is checked, then this will be the state if not signed in
// we need this because navigation
export const NOT_SIGNED_IN = 'NOT_SIGNED_IN';


const UserProvider = props => {
    //is this legal
    const [username, setUsername] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [profileURI, setProfileURI] = useState('');
    const [newSignUp, setNewSignUp] = useState(false);

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        if(!username || username === ANONYMOUS || username === NOT_SIGNED_IN)
            return;
        //issue user info query


        (async () => {

            const res = await loadUser(username);

            console.log(JSON.stringify(res));
            setDisplayName(res.name);

            // Migth need more
            setGroups(res.groups.items.map(x => x.group))
        })();


    }, [username]);


    useEffect(() => {
        //hopefully this doesn't take long lol
        Auth.currentAuthenticatedUser().then(user => {
            console.log('signed in as ' + JSON.stringify(user.username))
            setUsername(user.username);
        }).catch(() => {
            console.log('not signed in');
            setUsername(NOT_SIGNED_IN)
        })

        return Hub.listen("auth", ({ payload: { event, data } }) => {
            console.log(event);//, JSON.stringify(data));
            switch (event) {
                case "signIn":
                    //console.log(data);
                    setUsername(data.username);
                    break;
                case 'signUp': //ffs, just do this lol
                    setNewSignUp(true);
                    setUsername(data.username);
                    break;
                case "signOut":
                    //console.log(null);
                    setUsername(NOT_SIGNED_IN)
                    break;
                case "customOAuthState":
                    console.log(data);
              //next up, phone number and OTP
            }
        });
    }, []);

    // username = id, name = name
    // I'd call this createUser but ya know
    const makeUser = async name => {
        if(!username || username === ANONYMOUS || username === NOT_SIGNED_IN)
            return false;

        const input = {
            id: username,
            name,
        };
        const res = await API.graphql(graphqlOperation(createUser, { input }));
        console.log(res);
        return true;
    }

    const loadUser = async id => {

        const res = await API.graphql(graphqlOperation(getUser, { id }));
        return res.data.getUser;
    }
        //const res = await

    const getGroupName = gId => {
        if (!gId)
            return '';
        if (gId === GLOBAL)
            return 'Global Feed';
        return groups.find(g => g.id === gId).name;
    }

    //}

    return (
      <UserContext.Provider value={{
          username,
          setUsername,
          newSignUp,
          makeUser,
          profileURI,
          groups,

          getGroupName,

          //more generic, for loading any user
          loadUser

      }}>
          {props.children}
      </UserContext.Provider>
    );
}

export default UserProvider;
