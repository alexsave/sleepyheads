import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CachedImage from './CachedImage';
import { Words } from '../Basic/Words';
import { DARKER } from '../../Values/Colors';

const UserImagePlaceHolder = ({size}) => {
    return <View style={{height: size, width: size, alignItems: 'center', justifyContent: 'center', backgroundColor: DARKER}}>
        <Words style={{fontSize: 40}}>😴</Words>
    </View>
};

//nice and circular, with default little icon if not loaded
const UserImage = ({userID, imageKey, onPress, size=100}) => {
    const navigation = useNavigation();

    return <TouchableOpacity
      style={{height: size, width: size, borderRadius: size/2, overflow: 'hidden'}}
      onPress={() =>{
          if(!onPress)//default behavior
              navigation.navigate('profile', {userID: userID});
          else
              onPress();
      }}
    >
        <CachedImage
          imageKey={imageKey} style={{height: size, width: size}}
          placeholder={
              <UserImagePlaceHolder size={size}/>
          }/>
    </TouchableOpacity>;
};

export default UserImage;
