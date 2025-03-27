import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  ContactListAccepted,
  ContactListDeclined,
  ContactListPending,
  ContactListRequest,
  ContactListScreenProps,
} from '../../features/chat';
import {Gap, Header} from '../../components';
import {Picker} from '@react-native-picker/picker';

export default function ContactList({
  navigation,
  route,
}: ContactListScreenProps) {
  const [filter, setFilter] = useState<
    'accepted' | 'declined' | 'requested' | 'pending'
  >(route.params ? route.params.status : 'accepted');

  return (
    <View style={{flex: 1}}>
      <Header
        title="Contact List"
        buttonLeft={{onPress: () => navigation.goBack(), icon: 'chevron-left'}}
      />
      <View style={styles.container}>
        <Text style={{color: 'white'}}>Filter Contact:</Text>
        <Gap height={5} />
        <View style={styles.viewFilter}>
          <Picker
            selectedValue={filter}
            onValueChange={value => setFilter(value)}
            mode="dropdown"
            style={{color: 'white'}}
            dropdownIconColor={'white'}>
            <Picker.Item value={'accepted'} label="Accepted" />
            <Picker.Item value={'pending'} label="Pending" />
            <Picker.Item value={'requested'} label="Requested" />
            <Picker.Item value={'declined'} label="Declined" />
          </Picker>
        </View>
        <Gap height={10} />

        {filter == 'requested' && <ContactListRequest />}
        {filter == 'accepted' && <ContactListAccepted />}
        {filter == 'pending' && <ContactListPending />}
        {filter == 'declined' && <ContactListDeclined />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    padding: 20,
  },
  viewFilter: {
    backgroundColor: '#ffffff1a',
    paddingLeft: 20,
    height: 55,
    justifyContent: 'center',
    borderRadius: 55 / 2,
  },
});
