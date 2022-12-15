import { StyleSheet, Modal, SafeAreaView, TextInput, TouchableOpacity, View } from 'react-native';
import { Words } from '../Basic/Words';
import { useContext, useState } from 'react';
import { BACKGROUND, DARKER, LIGHTER, TEXT_COLOR } from '../../Values/Colors';
import { UserContext } from '../../Providers/UserProvider';
import { GroupContext } from '../../Providers/GroupProvider';

const NewGroupButton = ({close}) => {
    const {username} = useContext(UserContext);
    const {makeGroup} = useContext(GroupContext);
    const [name, setName] = useState('');
    const [groupCreating, setGroupCreating] = useState(false);

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
                onSubmitEditing={async () => {
                    await makeGroup(username, name);
                    close();
                    setName('');
                }}

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
