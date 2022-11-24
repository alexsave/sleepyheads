import { Modal, SafeAreaView, TextInput, TouchableOpacity, View } from 'react-native';
import { Words } from '../Basic/Words';
import { useContext, useState } from 'react';
import { BACKGROUND, DARKER, LIGHTER, TEXT_COLOR } from '../../Values/Colors';
import { UserContext } from '../../Providers/UserProvider';
import { API, graphqlOperation } from 'aws-amplify';
import { createGroup, createGroupUser } from '../../graphql/mutations';

export const GroupModal = ({visible, close}) => {

    //const [groups, setGroups] = useState(['the boyz', 'the sleepyheads', 'jim']);
    const {groups, username} = useContext(UserContext);

    const [name, setName] = useState('');
    const [groupCreating, setGroupCreating] = useState(false);

    const newGroupPress = () => {
        //open a keyboard to set the name
        setGroupCreating(true);
    };

    // do we NEED a lambda for this?
    const makeGroup = async () => {
        //... just give it a name, and off you go
        const res = await API.graphql(graphqlOperation(createGroup, {input: {name}}))
        console.log(res);
        // of course, the user joins the gropu immediately
        const guInput = {
            userID: username,
            groupID: res.data.createGroup.id
        }

        try {
            await API.graphql(graphqlOperation(createGroupUser, {input: guInput/*???*/}));
        } catch (e) {
            //ignore it, the createGroupUser operation seems to load groups before the user is an owner

        }
        close();
        setName('');

    };

    return <Modal animationType={'slide'} transparent={true} visible={visible}>
        <SafeAreaView>

            <TouchableOpacity
              onPress={close}
              style={{alignItems: 'center', width: '100%', height: '100%'}}
            >
                <View
                  //top:60 is a hack, it depends on the Feed header height
                  style={{top: 60, width: '75%', backgroundColor: BACKGROUND, borderWidth: 1, borderColor: DARKER, alignItems: 'center', justifyContent: 'space-around', padding: 10}}
                >
                    {
                        groups.map(g =>
                          <View style={{height: 50}}>
                              <Words>{g.name}</Words>

                          </View>
                        )
                    }
                    <View
                      style={{backgroundColor: LIGHTER, justifyContent: 'center', borderRadius: 25, height: 50, width: '100%', alignItems: 'center'}}
                    >
                        {
                            groupCreating ?

                              <TextInput
                                value={name}
                                onChangeText={setName}
                                style={{height: 40, color: TEXT_COLOR, backgroundColor: BACKGROUND, width: '80%', fontSize: 25, padding: 5}}
                                placeholder='Group name' // load a list of all groups, call it SleepyGroup67 or so
                                autoFocus={true}
                                autoCorrect={false}
                                returnKeyType={'go'}
                                onSubmitEditing={makeGroup}

                              />
                              :
                              <TouchableOpacity
                                style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}
                                onPress={newGroupPress}
                              >
                                  <Words>Create new group</Words>

                              </TouchableOpacity>


                        }
                    </View>
                </View>
            </TouchableOpacity>
        </SafeAreaView>

    </Modal>

};
