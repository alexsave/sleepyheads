import { StyleSheet, Modal, SafeAreaView, TextInput, TouchableOpacity, View } from 'react-native';
import { Words } from '../Basic/Words';
import { useContext, useState } from 'react';
import { BACKGROUND, DARKER, LIGHTER, TEXT_COLOR } from '../../Values/Colors';
import { UserContext } from '../../Providers/UserProvider';
import { API, graphqlOperation } from 'aws-amplify';
import { createGroup, createGroupUser } from '../../graphql/mutations';
import { GroupContext } from '../../Providers/GroupProvider';

const NewGroupButton = ({close}) => {
    const {username} = useContext(UserContext);
    const [name, setName] = useState('');
    const [groupCreating, setGroupCreating] = useState(false);

    const makeGroup = async () => {
        let res;
        //... just give it a name, and off you go
        try  {
            res = await API.graphql(graphqlOperation(createGroup, {input: {name}}))
        } catch (e) {
            // fails because there are no users in it?
            console.log(e)

        }
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

    return <View
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
                onPress={() => setGroupCreating(true)}
              >
                  <Words>Create new group</Words>

              </TouchableOpacity>

        }
    </View>
};

const GroupButton = ({group, close}) => {
    const {setGroupID} = useContext(GroupContext);
    return <TouchableOpacity
      style={{backgroundColor: DARKER, justifyContent: 'center', borderRadius: 25, height: 50, width: '100%', alignItems: 'center'}}
      onPress={() => {
          setGroupID(group.id);
          close();
      }}
    >
        <Words>{group.name}</Words>

    </TouchableOpacity>

}
export const GroupModal = ({visible, close}) => {
    const {groups } = useContext(GroupContext);


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
                        //next, make this switch the groupid
                        groups.map(g => <GroupButton key={g.id} group={g} close={close}/> )
                    }
                    <View style={{borderColor: TEXT_COLOR, borderWidth: StyleSheet.hairlineWidth, width: '80%'}}/>
                    <NewGroupButton close={close}/>
                </View>
            </TouchableOpacity>
        </SafeAreaView>

    </Modal>

};
