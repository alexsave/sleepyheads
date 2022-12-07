import { StyleSheet, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import { Words } from '../Basic/Words';
import { Row } from '../Basic/Row';
import { BACKGROUND, DARKER, PRIMARY, TEXT_COLOR } from '../../Values/Colors';
import { Sample } from './Sample';
import UserImage from '../Profile/UserImage';
import { RECENT, SleepContext } from '../../Providers/SleepProvider';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useContext, useState } from 'react';
import { UserContext } from '../../Providers/UserProvider';
import { LikeType } from '../../models';
import { API, graphqlOperation } from 'aws-amplify';
import { createComment, likeSleep } from '../../graphql/mutations';
import { formatMilliSeconds } from '../../Utils/MathUtil';

const PostFooter = ({sleep}) => {
    const {username} = useContext(UserContext);
    const [commenting, setCommenting] = useState(false);
    const [commentDraft, setCommentDraft] = useState('');

    const postComment = async () => {
        const input = {
            sleepID: sleep.id,
            userID: username,
            content: commentDraft
        };

        const res = await API.graphql(graphqlOperation(createComment, {input}));
        setCommenting(false);
        setCommentDraft('');
        console.log(res);
    }

    const likeAction = async type => {
        const lsi = {
            sleepID: sleep.id,
            userID: username,
            type
        };
        const res = await API.graphql(graphqlOperation(likeSleep, {lsi} ));
        console.log(res);
    }

    const comments = sleep.comments.items;

    const likes = sleep.likes.items;
    const zzz = likes.filter(l => l.type === LikeType.SNOOZE);//.length;
    const alarm = likes.filter(l => l.type === LikeType.ALARM);//.length;

    return <Row style={{width: '100%', height: 40, justifyContent: 'space-between', alignItems: 'center', backgroundColor: PRIMARY}}>
        {
            commenting ?
                <TextInput
                    value={commentDraft}
                    placeholder='Leave a roast of their sleep'
                    autoFocus
                    onChangeText={setCommentDraft}
                    onBlur={() => setCommenting(false)}
                    //placeholderTextColor={TEXT_COLOR}

                    style={{color: TEXT_COLOR, width: '80%', paddingLeft: 10}}
                    returnKeyType={'go'}
                    onSubmitEditing={postComment}
                />
                :

                <>
                    <Row style={{flex: 1}}>
                        <TouchableOpacity
                            style={{flex:1, alignItems: 'center'}}
                            onPress={() => likeAction(LikeType.SNOOZE)}
                        >
                            <Words style={{fontWeight: zzz.some(l => l.userID === username)? 'bold': 'normal'}}> 😴{zzz.length}</Words>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{flex:1, alignItems: 'center'}}
                            onPress={() => likeAction(LikeType.ALARM)}
                        >
                            <Words style={{fontWeight: alarm.some(l => l.userID === username)? 'bold': 'normal'}}> 😳{alarm.length}</Words>
                        </TouchableOpacity>
                    </Row>

                    <TouchableOpacity
                        style={{
                            borderLeftWidth: StyleSheet.hairlineWidth,
                            borderRightWidth: StyleSheet.hairlineWidth,
                            flex:1, alignItems: 'center', justifyContent: 'center'
                        }}
                        // maybe long press?
                        onPress={() => setCommenting(true)}
                    >
                        <Words><Ionicons color={TEXT_COLOR} name={'chatbox-outline'} size={20}></Ionicons>️{comments.length}</Words>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{flex:1, justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Words><Ionicons color={BACKGROUND} name={'push-outline'} size={20}></Ionicons>️</Words>
                    </TouchableOpacity>

                </>
        }
    </Row>
}

export const Post = ({sleepRecord}) => {
    const navigation = useNavigation();
    const {username} = useContext(UserContext);
    const {uploadSleep} = useContext(SleepContext);

    // ew
    //const sleepSession = props.sleepSession.data;
    const {sleep} = sleepRecord;
    if (!sleep)
        return <View/>;
    const {data} = sleep;

    const postUploaded = sleep.id !== RECENT;

    const highlight = postUploaded ? PRIMARY : DARKER;

    // !sleep.userID is possible for the "recentSleep", which we own
    const ownPost = sleep && (username === sleep.userID || !sleep.userID);

    if (!data)
        return <View/>;

    const {duration} = data;

    return <TouchableOpacity
        style={{
            //position: 'absolute',
            //top: pos,
            //height: 200,
            borderWidth: 3,
            borderRadius: 10,
            borderStyle: postUploaded ? 'solid': 'dashed',
            borderColor: highlight,
            margin: 5,
            //backgroundColor: sample.value === 'UNKNOWN' ? 'black' : sample.value === 'ASLEEP' ? 'blue': 'green',
            //zIndex: sample.value === 'INBED' ? -1: 1,
            //height: something,
        }}
        onPress={() => navigation.navigate('post', {sleep})}
    >
        <View style={{borderRadius: 10, backgroundColor: BACKGROUND}}>


            <Row style={{height: 50, justifyContent: 'flex-end'}}>

                { postUploaded &&
                    <View style={{flex: 1}}>
                        <UserImage imageKey={sleep.user.image} userID={sleep.userID} size={50} />
                    </View>
                }

                {
                    ownPost &&
                    <Row style={{paddingLeft: 3, alignItems: 'center', backgroundColor: highlight, borderBottomLeftRadius: 10}}>
                        {
                            !postUploaded &&

                            <TouchableOpacity
                                style={{width: 50, alignItems: 'center', borderRightWidth: StyleSheet.hairlineWidth}}
                                onPress={() => uploadSleep(sleep)}
                            >
                                <Words><Ionicons size={30} name='cloud-upload-outline'/></Words>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity
                            style={{width: 50, alignItems: 'center'}}
                            onPress={() => navigation.navigate('post', {sleep})}
                        >
                            <Words><Ionicons size={30} name='pencil-outline'/></Words>
                        </TouchableOpacity>
                    </Row>
                }
            </Row>

            <Words style={{fontSize: 30}}>{sleep.title}</Words>
            <Words style={{fontSize: 30}}>{new Date(data.bedStart).toDateString()}</Words>
            <Words>{formatMilliSeconds(duration)}</Words>
            <Sample duration={duration} session={data}/>
        </View>

        {
            postUploaded && <PostFooter sleep={sleep}/>
        }
    </TouchableOpacity>;
}


