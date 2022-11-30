import React, { useContext, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { v4 as uuidv4 } from 'uuid';
import NavBar from '../Components/Navigation/NavBar';
import FollowButton from '../Components/Profile/FollowButton';
import UserImage from '../Components/Profile/UserImage';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Words } from '../Components/Basic/Words';
import { Row } from '../Components/Basic/Row';
import PostList from '../Components/Feed/PostList';
import CachedImage from '../Components/Profile/CachedImage';
import { UserContext } from '../Providers/UserProvider';
import { BACKGROUND, DARKER } from '../Values/Colors';
import SplashScreen from 'react-native-splash-screen';
import { Post } from '../Components/Feed/Post';
import { GroupContext } from '../Providers/GroupProvider';
import { useNavigation } from '@react-navigation/native';
import { formatDuration } from '../Utils/MathUtil';

export const Profile = props => {
    useEffect(() => {
        SplashScreen.hide();
    }, []);
    //return <View></View>;
    //fuck it, we'll just do it straight from this without using the context
    // This could be something like longest sleep streak, longest sleep
    const [records, setRecords] = useState({
        'Earliest Wakeup': {weight: 0},
        'Latest Wakeup': {weight: 0},
        'Longest Sleep': {weight: 0},
    });

    //post loading bs part
    const signedInUser = useContext(UserContext).username;
    const {loadUser} = useContext(UserContext);

    const [name, setName] = useState('');

    // posts is a bit different from the feed here, as we get records
    const {posts, setGroupID} = useContext(GroupContext);


    const avg = posts.reduce((a,b) => a + b.rankSleepTime, 0)/posts.length;
    const sorted = posts.sort((a,b) => a.rankBedEnd - b.rankBedEnd);
    const max = sorted[sorted.length-1]?.rankBedEnd;//Math.max.apply(Math, posts.map(x => x.rankBedEnd));
    const min = sorted[0]?.rankBedEnd;//Math.max.apply(Math, posts.map(x => x.rankBedEnd));
    //const min = Math.min.apply(Math, posts.map(x => x.rankBedEnd));

    //this is useful, but only when viewing yourself

    let profileUser = signedInUser;
    if(props.route.params)
        profileUser = props.route.params.userID;

    useEffect(() => {

        SplashScreen.hide();
    }, [])

    useEffect(() => {
        if(!profileUser)
            return;
        setGroupID(profileUser);
        loadUser(profileUser).then(d => setName(d.name));
    }, [profileUser])

    const [imageKey, setImageKey] = useState('');

    const navigation = useNavigation();

    //this does so much lol
    useEffect(() => {
        if(!signedInUser || !profileUser)
            return;

    }, [signedInUser, profileUser]);

    const viewingSelf = signedInUser === profileUser;

    const handleProfilePress = () => {
        const options = {
            maxWidth: 1080,//is this important?
            maxHeight: 1080,
            durationLimit: 60,
            mediaType: 'photo'
        }

        launchImageLibrary(options, res => {

            if(!res.didCancel && !res.errorMessage){
                //save uri and show image
                //setMedia(res.uri);
                //res.uri is what you want

                uploadImage(res.uri)
                  .then(key => {
                      /*API.graphql(graphqlOperation(createUserImage, {
                          input: {
                              userID: signedInUser,
                              uri: key
                          }
                      }))*/
                  });
            }
        });
    };

    //almost as if you should resuse this code elsewhere...
    const uploadImage = async uri => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const urlParts = uri.split('.');
        const extension = urlParts[urlParts.length - 1];
        const key = `${uuidv4()}.${extension}`;
        //await Storage.put(key, blob);
        return key;
    };


    //next up, lets clean up the user profile
    //we may eblae to get graphs and shit too

    const y = useSharedValue(0);

    const HEADER_MAX_HEIGHT = 120;

    const {width} = useWindowDimensions();
    const imageHeight = width;

    const simpleHeaderStyle = useAnimatedStyle(() => ({
        opacity: interpolate(y.value,
          [imageHeight-25, imageHeight],
          [0, 1],
          Extrapolate.CLAMP,
        ),
    }));

    const scrollHandler = useAnimatedScrollHandler(e =>
      y.value = e.contentOffset.y
    );

    const imageStyle = useAnimatedStyle(() => {
        const scale = interpolate(y.value,
          [-width, 0, width/2],
          [4, 1.2, 1],
          Extrapolate.CLAMP
        );
        const opacity = interpolate(y.value,
          [-width, 0, width],
          [0, 1, 0],
          Extrapolate.CLAMP
        );
        return {
            transform: [{scale}],
            opacity
        };

    });

    const fadeInProfile = useAnimatedStyle(() => {
        return {
            opacity: interpolate(y.value,
              [imageHeight-25, imageHeight],
              [0, 1],
              Extrapolate.CLAMP
            )
        }

    });

    const coolText = useAnimatedStyle(() => {
        return {
            opacity: interpolate(y.value,
              [0, imageHeight],
              [1, 0],
              Extrapolate.CLAMP
            )
        }
    })

    return (
      <View style={{flex: 1, backgroundColor: BACKGROUND}}>
          <Animated.View style={[{position: 'absolute'}, imageStyle]}>
              <CachedImage imageKey={imageKey} style={{height: width, width: width}} placeholder={
                  <Words style={{fontSize: 50}}>
                      zzz😴z😴z😴z😴z😴z😴z😴z😴z😴
                      z😴zzz😴z😴z😴z😴z😴z😴zzz😴zzz😴
                      z😴zzz😴z😴z😴z😴z😴zzz😴z😴z😴
                      z😴z😴z😴z😴z😴zzz😴z😴z😴z😴
                      zzz😴z😴z😴z😴z😴z😴z😴z😴z😴
                      z😴zzz😴z😴z😴z😴z😴z😴zzz😴zzz😴
                      z😴z😴z😴z😴z😴zzz😴z😴z😴z😴
                  </Words>
              }/>
          </Animated.View>


          <SafeAreaView style={{flex: 1}}>
              <View style={{flex: 1}}>


                  <View style={{zIndex: 10, position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, top: 0, right: 0}}>
                      {
                          viewingSelf?
                            <>
                                <TouchableOpacity onPress={() => props.navigation.navigate('group')}>
                                    <Words><Ionicons size={30} name='people-outline'/></Words>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => props.navigation.navigate('settings')}>
                                    <Words><Ionicons size={30} name='settings-outline'/></Words>
                                </TouchableOpacity>
                            </>
                            :
                            <FollowButton profileUser={profileUser}/>
                      }
                  </View>

                  <Animated.View style={[{zIndex: 5, position: 'absolute', top: 10, left: 10}, fadeInProfile]}>
                      <UserImage onPress={handleProfilePress} imageKey={imageKey} userID={profileUser} size={100}/>
                  </Animated.View>


                  <Animated.View style={[{ alignItems: 'center', right:0,left: 0, top: 0, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: DARKER, height: 60, justifyContent: 'center'}, simpleHeaderStyle]}>
                      <Words style={{fontSize: 30, fontWeight: 'bold'}}>{name}</Words>
                  </Animated.View>


                  <Animated.ScrollView
                    onScroll={scrollHandler}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={1}
                    contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
                  >
                      <View
                        style={{width: '95%', backgroundColor: BACKGROUND, top: imageHeight-HEADER_MAX_HEIGHT}}
                      >

                          <Animated.View style={[{paddingHorizontal: 10, borderRadius: 10, position: 'absolute', right: 0, top: -70, zIndex: 20, backgroundColor: 'rgba(93,93,93,0.37)'},coolText]}>
                              <Words style={{fontSize: 60, fontWeight: 'bold'}}>{name}</Words>
                          </Animated.View>

                          <Words>Average: {formatDuration(avg)}</Words>

                          <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('post', {sleepSession: sorted[sorted.length-1]})
                            }
                          >
                              <Words>Latest Wakeup: {max}</Words>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('post', {sleepSession: sorted[0]})

                            }
                          >
                              <Words>Earliest Wakeup: {min}</Words>
                          </TouchableOpacity>

                          <Words style={{fontWeight: 'bold', fontSize: 40, textAlign: 'left'}}>Records</Words>
                          <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', height: 300}}>{
                              Object.entries(records).map(([k,v]) =>
                                <TouchableOpacity
                                  key={k}
                                  style={{width: 150}}
                                  onPress={() =>
                                    props.navigation.navigate('post', {postID: v.postID})
                                  }
                                >
                                    <Row style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Words style={{fontSize: 20, textAlign: 'center'}}>{k + '\n' /* + FORMAT_WEIGHT(v.weight)*/}</Words>
                                    </Row>
                                </TouchableOpacity>
                              )
                          }</View>

                          {
                            posts &&
                            posts.map(sleepSession => <Post key={sleepSession.id} sleepSession={sleepSession.sleep} />)
                          }
                          <PostList
                            listOperation={''/*listPostsSortedByUserAndTimestamp*/}
                            sortKey={'userID'}
                            sortValue={profileUser}
                            filledSubscriptionOperation={() => {}}
                            subscriptionCriteria={post =>
                              post.userID === profileUser
                            }
                          />
                      </View>

                  </Animated.ScrollView>

                  {
                    viewingSelf &&
                    <NavBar current={'profile'}/>
                  }
              </View>
          </SafeAreaView>
      </View>
    );
};
