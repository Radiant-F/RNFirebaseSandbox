import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {ButtonStyled, Gap} from '../../../components';
import {useGetContacts, useGetOrStartChat} from '../services/chatApi';
import {useAppSelector} from '../../../hooks';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/type';

export default function ContactListAccepted() {
  const {contacts} = useGetContacts('accepted');
  const {getOrStartChat} = useGetOrStartChat();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  return (
    <FlatList
      ListEmptyComponent={<Text style={styles.textEmpty}>Such empty!</Text>}
      ListHeaderComponent={
        <View style={styles.viewHeader}>
          <View style={styles.line} />
          <Text style={{color: 'white'}}>Accepted Contacts</Text>
          <View style={styles.line} />
        </View>
      }
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
              <ButtonStyled
                icon="chat-plus-outline"
                style={{width: 50, height: 50}}
                onPress={async () => {
                  setLoadingIndex(index);
                  await getOrStartChat(item.contactId);
                }}
                loading={index == loadingIndex}
              />
            </View>

            {/* <Gap height={10} /> */}
            {/* <Text style={{color: 'white'}}>ID: {item.contactId}</Text> */}
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
