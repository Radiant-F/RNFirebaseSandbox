import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ButtonStyled, Header, SuchEmpty} from '../../components';
import {
  ChatScreenProps,
  NotificationPermission,
  RenderChatList,
  useChatList,
} from '../../features/chat';

export default function Chat({navigation}: ChatScreenProps) {
  const {chats} = useChatList();

  return (
    <View style={{flex: 1}}>
      {chats.length == 0 && <SuchEmpty />}

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
        data={chats}
        renderItem={({item}) => {
          return <RenderChatList item={item} />;
        }}
      />

      <ButtonStyled
        onPress={() => navigation.navigate('SearchUser')}
        title="Add Contact"
        icon="chat-plus-outline"
        style={styles.btnFloat}
      />

      {/* elp */}
      {chats.length > 0 && <NotificationPermission />}
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
