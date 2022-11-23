import { Modal, TouchableOpacity, View } from 'react-native';
import { Words } from '../Basic/Words';
import { useContext, useState } from 'react';
import { DARKER, LIGHTER } from '../../Values/Colors';
import { UserContext } from '../../Providers/UserProvider';

export const GroupModal = ({visible, close}) => {

    //const [groups, setGroups] = useState(['the boyz', 'the sleepyheads', 'jim']);
    const {groups} = useContext(UserContext);

    return <Modal animationType={'slide'} transparent={true} visible={visible}>
        <TouchableOpacity
          onPress={close}
          style={{alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}
        >
            <View
              style={{height: 200, width: '95%', backgroundColor: LIGHTER, borderWidth: 1, borderColor: DARKER, borderRadius: 10, alignItems: 'center', justifyContent: 'space-around', padding: 10}}
            >
                <Words>{JSON.stringify(groups)}</Words>
                {
                    groups.map(g =>
                      <View>
                          <Words>{g}</Words>

                      </View>
                    )
                }
                <TouchableOpacity>
                    <Words>New group</Words>

                </TouchableOpacity>
            </View>
        </TouchableOpacity>

    </Modal>

};
