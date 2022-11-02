import React, { useEffect, useState } from 'react';
import { Auth, Hub } from 'aws-amplify';

//import { API, Auth, graphqlOperation } from 'aws-amplify';
//import { getUserImage, getUserLocation } from '../../graphql/queries';

export const UserContext = React.createContext();

const UserProvider = props => {
    //is this legal
    const [username, setUsername] = useState(null);
    const [profileURI, setProfileURI] = useState('');


    useEffect(() => {
        //hopefully this doesn't take long lol
        Auth.currentAuthenticatedUser().then(user => {
            setUsername(user.username);
        }).catch(() => setUsername(''))

        return Hub.listen("auth", ({ payload: { event, data } }) => {
            switch (event) {
                case "signIn":
                    console.log(data);
                    setUsername(data);
                    break;
                case "signOut":
                    console.log(null);
                    setUsername(null)
                    break;
                case "customOAuthState":
                    console.log(data);
            }
        });
    }, []);

    return (
        <UserContext.Provider value={{
            username,
            profileURI: profileURI
        }}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserProvider;
