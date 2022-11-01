import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

//import { API, Auth, graphqlOperation } from 'aws-amplify';
//import { getUserImage, getUserLocation } from '../../graphql/queries';

export const UserContext = React.createContext();

const UserProvider = props => {
    //is this legal
    const [username, setUsername] = useState('sleepyhead1');
    const [profileURI, setProfileURI] = useState('');

    const [location, setLocation] = useState([null, null, null, null]);

    useEffect(() => {
        //hopefully this doesn't take long lol
        Auth.currentAuthenticatedUser().then(user => {
            setUsername(user.username);
        }).catch(() => setUsername(''))
    }, []);

    useEffect(() => {
        if(!username)
            return;
        /*API.graphql(graphqlOperation(getUserLocation, {
            userID: username
        })).then(result => {
            //what if its null?
            if(!result.data.getUserLocation)
                return;
            if(!result.data.getUserLocation.gym.country)
                return;
            const gym = result.data.getUserLocation.gym;
            //maybe we need the region ids, but who cares
            //just names for now
            setLocation([gym.country.name, gym.state.name, gym.city.name, gym.name]);
        })

        API.graphql(graphqlOperation(getUserImage, {
            userID: username
        })).then(result => {
            if(result.data.getUserImage)
                setProfileURI(result.data.getUserImage.uri);
        });*/

    }, [username]);

    return (
        <UserContext.Provider value={{
            username,
            location: location,
            profileURI: profileURI
        }}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserProvider;
