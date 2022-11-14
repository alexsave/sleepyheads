import React, { useEffect, useState } from 'react';
import { Auth, Hub } from 'aws-amplify';

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
    const [profileURI, setProfileURI] = useState('');


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

    return (
        <UserContext.Provider value={{
            username,
            setUsername,
            profileURI: profileURI
        }}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserProvider;
