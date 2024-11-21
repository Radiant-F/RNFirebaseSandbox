import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import React from 'react';
import {ButtonStyled, Gap, Header} from '../../components';
import {ChatScreenProps, useChatList} from '../../features/chat';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

type ChatType = {
  createdAt: FirebaseFirestoreTypes.Timestamp;
  id: string;
  lastMessage: string;
  lastMessageTimestamp: FirebaseFirestoreTypes.Timestamp;
  members: string[];
  otherUser: {
    displayName: string;
    photo: string;
  };
};

export default function Chat({navigation}: ChatScreenProps) {
  const {chats}: {chats: ChatType[]} = useChatList();

  return (
    <View style={{flex: 1}}>
      <Header
        title="Chat"
        buttonLeft={{icon: 'chevron-left', onPress: () => navigation.goBack()}}
        buttonRight={{
          icon: 'contacts-outline',
          onPress: () => navigation.navigate('ContactList'),
        }}
      />

      <FlatList
        contentContainerStyle={styles.container}
        ListEmptyComponent={<Text style={styles.textEmpty}>Such empty!</Text>}
        data={chats}
        renderItem={({item}) => {
          return (
            <TouchableNativeFeedback
              useForeground
              onPress={() =>
                navigation.navigate('ChatScreen', {chatId: item.id})
              }>
              <View style={styles.btnChatContainer}>
                <Image
                  source={{uri: item.otherUser.photo}}
                  style={{width: 50, height: 50, borderRadius: 50 / 2}}
                  resizeMethod="resize"
                />
                <Text style={{color: 'white'}}>
                  {item.otherUser.displayName}
                </Text>
                <Text style={{color: 'white'}} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
                <Text style={{color: 'white'}}>ID: {item.id}</Text>
              </View>
            </TouchableNativeFeedback>
          );
        }}
      />

      <ButtonStyled
        onPress={() => navigation.navigate('SearchUser')}
        title="Add Contact"
        icon="chat-plus-outline"
        style={styles.btnFloat}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btnChatContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'white',
    padding: 10,
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  textEmpty: {
    color: 'grey',
    margin: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  btnFloat: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    paddingHorizontal: 20,
  },
});
