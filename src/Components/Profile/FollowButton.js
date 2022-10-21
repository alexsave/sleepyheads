import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
//import { API, graphqlOperation } from 'aws-amplify';
//import { getFollowRelationship } from '../../../graphql/queries';
//import { createFollowRelationship, deleteFollowRelationship } from '../../../graphql/mutations';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Words } from '../Basic/Words';
import { UserContext } from '../../Providers/UserProvider';
import { DARKER, PRIMARY } from '../../Values/Colors';

const FollowButton = props => {
    const {profileUser} = props;
    const [isFollowing, setIsFollowing] = useState(false);
    const {username} = useContext(UserContext).username;
    const [viewingSelf, setViewingSelf] = useState(true);

    useEffect(() => {
        if(!username)
            return;
        setViewingSelf(username === profileUser);
        /*API.graphql(graphqlOperation(getFollowRelationship, {
            followeeID: profileUser,
            followerID: username
        })).then(res => {
            setIsFollowing(res.data.getFollowRelationship !== null);
        });*/

    }, [username, profileUser]);

    const follow = async () => {
        const input = {
            followeeID: profileUser,
            followerID: username,
        };
        /*const res = await API.graphql(graphqlOperation(createFollowRelationship, {
            input: input
        }));
        if(!res.data.createFollowRelationship.errors)//is it errors or error?
            setIsFollowing(true);*/
    };

    const unfollow = async () => {
        const input = {
            followeeID: profileUser,
            followerID: username
        };
        /*const res = await API.graphql(graphqlOperation(deleteFollowRelationship, {
            input: input
        }));
        if(!res.data.deleteFollowRelationship.errors)//is it errors or error?
            setIsFollowing(false);*/
    };

    return <View>{
        viewingSelf &&(

            isFollowing ?
                <TouchableOpacity
                    style={{justifyContent: 'center', alignItems: 'center', borderRadius: 5, width: 50, height: 40, borderColor: PRIMARY, borderWidth: 1}}
                    onPress={unfollow}
                >
                    <Words><Ionicons size={25} name={'person-remove-outline'}/></Words>
                </TouchableOpacity>
                :
                <TouchableOpacity
                    style={{justifyContent: 'center', alignItems: 'center', borderRadius: 5, width: 50, height: 40, backgroundColor: DARKER}}
                    onPress={follow}
                >
                    <Words><Ionicons size={25} name={'person-add-outline'}/></Words>
                </TouchableOpacity>
        )
    }</View>
};

export default FollowButton;
