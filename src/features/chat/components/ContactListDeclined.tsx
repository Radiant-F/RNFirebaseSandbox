import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {ButtonStyled, Gap} from '../../../components';
import {
  useGetContacts,
  useRealtimeGetContacts,
  useRespondToContactRequest,
} from '../services/chatApi';
import {useAppSelector} from '../../../hooks';

export default function ContactListDeclined() {
  const storedUser = useAppSelector(state => state.auth.user);
  const {contacts, loading} = useRealtimeGetContacts('declined');
  const {respondToRequest, loading: responding} = useRespondToContactRequest();
  const [loadingIndicator, setLoadingIndicator] = useState<{
    index: number | null;
    type: '' | 'accept' | 'decline';
  }>({index: null, type: ''});

  return (
    <FlatList
      ListEmptyComponent={<Text style={styles.textEmpty}>Such empty!</Text>}
      ListHeaderComponent={
        <View style={styles.viewHeader}>
          <View style={styles.line} />
          <Text style={{color: 'white'}}>Declined Contact</Text>
          <View style={styles.line} />
        </View>
      }
      ListFooterComponent={<View style={styles.line} />}
      data={contacts}
      renderItem={({item, index}) => {
        return (
          <View style={styles.viewContact}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{uri: item.photo}}
                style={styles.viewImage}
                resizeMethod="resize"
              />
              <Gap width={10} />
              <View style={{flex: 1}}>
                <Text style={styles.textDisplayName}>{item.displayName}</Text>
                <Text style={{color: 'white', fontStyle: 'italic'}}>
                  {item.status}
                </Text>
              </View>
            </View>

            <Gap height={10} />
            <Text style={{color: 'white'}}>ID: {item.contactId}</Text>
            <Gap height={10} />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <ButtonStyled
                onPress={async () => {
                  setLoadingIndicator({index: index, type: 'decline'});
                  await respondToRequest(storedUser.uid, item, 'declined');
                  setLoadingIndicator({index: null, type: ''});
                }}
                icon="trash-can"
                title="Remove"
                style={{width: 130}}
                loading={
                  loadingIndicator.type == 'decline' &&
                  loadingIndicator.index == index
                }
                disabled={responding}
              />
              <Gap width={10} />
              <ButtonStyled
                onPress={async () => {
                  setLoadingIndicator({index: index, type: 'accept'});
                  await respondToRequest(storedUser.uid, item, 'accepted');
                  setLoadingIndicator({index: null, type: ''});
                }}
                icon="check-bold"
                title="Accept"
                style={{width: 120}}
                loading={
                  loadingIndicator.type == 'accept' &&
                  loadingIndicator.index == index
                }
                disabled={responding}
              />
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  textEmpty: {
    textAlign: 'center',
    color: 'grey',
    fontStyle: 'italic',
    marginVertical: 10,
    marginTop: 0,
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'white',
    flex: 0.25,
  },
  textDisplayName: {
    color: 'white',
    fontWeight: '500',
    fontSize: 17,
  },
  viewContact: {
    backgroundColor: '#ffffff1a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
  },
  viewImage: {
    borderRadius: 60 / 2,
    width: 60,
    height: 60,
  },
});
