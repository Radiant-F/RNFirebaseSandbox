import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {ButtonStyled, Gap} from '../../../components';
import {
  useGetContacts,
  useRealtimeGetContacts,
  useRespondToContactRequest,
} from '../services/chatApi';
import {useAppSelector} from '../../../hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ContactType = {
  createdAt: string;
  displayName: string;
  contactId: string;
  photo: string;
  status: string;
};

export default function ContactListDeclined() {
  const storedUser = useAppSelector(state => state.auth.user);
  const {contacts} = useRealtimeGetContacts('declined');
  const {respondToRequest} = useRespondToContactRequest();

  const [loadingIndicator, setLoadingIndicator] = useState<{
    index: number | null;
    type: '' | 'accept' | 'remove';
  }>({index: null, type: ''});

  function onRemoveContact(item: ContactType, index: number) {
    Alert.alert('', 'Remove contact?', [
      {text: 'Cancel'},
      {
        text: 'Remove',
        onPress: async () => {
          setLoadingIndicator({index: index, type: 'remove'});
          await respondToRequest(storedUser.uid, item, 'remove');
          setLoadingIndicator({index: null, type: ''});
        },
      },
    ]);
  }

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
      data={contacts}
      renderItem={({item, index}) => {
        const loadingAccept =
          index == loadingIndicator.index && loadingIndicator.type == 'accept';
        const loadingDecline =
          index == loadingIndicator.index && loadingIndicator.type == 'remove';

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

            {/* <Gap height={10} />
            <Text style={{color: 'white'}}>ID: {item.contactId}</Text>
            <Gap height={10} /> */}

            <Gap height={15} />

            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                style={styles.btnRespond}
                activeOpacity={0.75}
                onPress={() => onRemoveContact(item, index)}>
                {loadingDecline ? (
                  <ActivityIndicator color={'white'} size={'small'} />
                ) : (
                  <>
                    <Icon name="trash-can" color={'white'} size={20} />
                    <Text style={styles.textRespond}>Remove</Text>
                  </>
                )}
              </TouchableOpacity>
              <Gap width={10} />
              <TouchableOpacity
                style={styles.btnRespond}
                activeOpacity={0.75}
                onPress={async () => {
                  setLoadingIndicator({index: index, type: 'accept'});
                  await respondToRequest(storedUser.uid, item, 'accepted');
                  setLoadingIndicator({index: null, type: ''});
                }}>
                {loadingAccept ? (
                  <ActivityIndicator color={'white'} size={'small'} />
                ) : (
                  <>
                    <Icon
                      name="check-circle-outline"
                      color={'white'}
                      size={20}
                    />
                    <Text style={styles.textRespond}>Accept</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  textRespond: {
    color: 'white',
    marginHorizontal: 5,
    fontWeight: '500',
  },
  btnRespond: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: '#00000080',
    borderRadius: 40 / 2,
    borderColor: 'white',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
  },
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
