import React, { useEffect, useReducer, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Post } from './Post';
//import { API, graphqlOperation } from 'aws-amplify';
import { Words } from '../Basic/Words';

//going to move so that post list handles all the loading and shit
//all we need to pass down is what kind of post list to load
//global, timeline, or profile, or whatever may come next

const SUBSCRIPTION = 'SUBSCRIPTION';
const INITIAL_QUERY = 'INITIAL_QUERY';
const ADDITIONAL_QUERY = 'ADDITIONAL_QUERY';

const reducer = (state, action) => {
    switch(action.type){
        case INITIAL_QUERY:
            return action.posts;
        case ADDITIONAL_QUERY:
            return [...state, ...action.posts];
        case SUBSCRIPTION:
            return [action.post, ...state];
        default:
            return state;
    };
};

const PostList = props => {
    //i wonder if its a good idea to pass around the grapqhl operations
    //subscriber is gonna be pretty complex function as each post list has its own way of subscribin
    //so thanks to the unique ness of subscription operations,
    // the parent has to send in seomething we can use in API.graphql(...)
    const {listOperation, sortKey, sortValue, filledSubscriptionOperation, subscriptionCriteria} = props;

    const [posts, dispatch] = useReducer(reducer, []);

    const [nextToken, setNextToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getPosts = async (type, nextToken=null) => {
        /*const res = await API.graphql(graphqlOperation(listOperation, {
            [sortKey]: sortValue,
            sortDirection: 'DESC',
            limit: 20,
            nextToken: nextToken
        }));
        //so sorry
        const list = Object.values(res.data)[0];

        //this is kinda a lazy way to do it, but hey what can you do
        //list of timelines, which contains posts
        if(list.items.length !== 0) {
            if ('post' in list.items[0])
                dispatch({ type: type, posts: list.items.map(timeline => timeline.post) });
            else//list of posts
                dispatch({ type: type, posts: list.items });
        }
        setNextToken(list.nextToken);
        setIsLoading(false);*/
    };

    const getAdditionalPosts = () => {
        if(nextToken === null) return;
        getPosts(ADDITIONAL_QUERY, nextToken);
    };


    useEffect(() => {
        //usually indicates not loaded yet
        if(!sortValue)
            return;

        getPosts(INITIAL_QUERY);

        /*const subscription = API.graphql(filledSubscriptionOperation)
            .subscribe({
                next: msg => {
                    const post = Object.values(msg.value.data)[0];
                    if(!subscriptionCriteria(post))
                        return;
                    dispatch({type: SUBSCRIPTION, post: post});
                }
            });
        return () => subscription.unsubscribe();*/
    }, [sortValue]);

    //this should be a flatlist, it's huge
    return <View>
        {
            isLoading
                ?
                <Words>loading...</Words>
                :
                <ScrollView>
                    {
                        posts.map(post => <Post
                            key={post.id}
                            post={post}
                        />)
                    }
                    <TouchableOpacity onPress={getAdditionalPosts}>
                        <Words>More</Words>

                    </TouchableOpacity>

                </ScrollView>

        }
    </View>
};


export default PostList;
