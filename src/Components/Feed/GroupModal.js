import { Modal, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Words } from '../Basic/Words';
import { useContext, useState } from 'react';
import { BACKGROUND, DARKER, LIGHTER } from '../../Values/Colors';
import { UserContext } from '../../Providers/UserProvider';
import { API, graphqlOperation } from 'aws-amplify';
import { createGroup, createGroupUser } from '../../graphql/mutations';

export const GroupModal = ({visible, close}) => {

    //const [groups, setGroups] = useState(['the boyz', 'the sleepyheads', 'jim']);
    const {groups} = useContext(UserContext);

    const [name, setName] = useState('');

    const newGroupPress = () => {
        //open a keyboard to set the name
    }
    const makeGroup = async () => {
        //... just give it a name, and off you go
        const res = await API.graphql(graphqlOperation(createGroup, {input: {name}}))
        console.log(res);
        // of course, the user joins the gropu immediately
        const res2 = await API.graphql(graphqlOperation(createGroupUser, {input: {}/*???*/}));



    }

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
                    <Words>{JSON.stringify(groups)}</Words>
                    {
                        groups.map(g =>
                          <View style={{height: 50}}>
                              <Words>{g}</Words>

                          </View>
                        )
                    }
                    <TouchableOpacity
                      style={{backgroundColor: LIGHTER, justifyContent: 'center', borderRadius: 25, height: 50, width: '100%', alignItems: 'center'}}
                      onPress={newGroupPress}
                    >
                        <Words>Create new group</Words>

                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </SafeAreaView>

    </Modal>

};
