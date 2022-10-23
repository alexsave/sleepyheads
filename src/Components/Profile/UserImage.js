import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import { getUserImage } from '../../../graphql/queries';
import CachedImage from './CachedImage';
import { Words } from '../Basic/Words';

//nice and circular, with default little icon if not loaded
const UserImage = ({userID, imageKey, onPress, size=100}) => {
    const navigation = useNavigation();
    //const {size, userID, onPress} = props;
    //optionally uses prop.imagekey, np if this is undefined
    const [key, setKey] = useState(imageKey);

    useEffect(() => {
        if(!userID)
            return;

        /*API.graphql(graphqlOperation(getUserImage, {
            userID: userID
        })).then(result => {
            if(result.data.getUserImage)
                setImageKey(result.data.getUserImage.uri);
        });*/
    });

    return <TouchableOpacity
        style={{height: size, width: size, borderRadius: size/2, overflow: 'hidden'}}
        onPress={() =>{
            if(!onPress)//default behavior
                navigation.navigate('profile', {userID: userID});
            else
                onPress();
        }}
    >
        <CachedImage imageKey={key} style={{height: size, width: size}} placeholder={
            <View style={{height: size, justifyContent: 'center'}}>
                <Words style={{fontSize: 40}}>😴</Words>
            </View>
        }/>
    </TouchableOpacity>;
};

export default UserImage;
