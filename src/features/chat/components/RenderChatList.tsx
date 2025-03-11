import {
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {ChatListType} from '..';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/type';
import {Gap} from '../../../components';
import {localStorage} from '../../../utils';
import {useAppSelector} from '../../../hooks';

export default function RenderChatList({item}: {item: ChatListType}) {
  const storedUser = useAppSelector(state => state.auth.user);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const lastMessageTimestamp = item.lastMessageTimestamp
    ?.toDate()
    .toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});

  function onNavigateToChatScreen() {
    navigation.navigate('ChatScreen', {
      chatId: item.id,
      targetFcmToken: item.otherUser.fcmToken,
      chat_name: item.otherUser.displayName,
    });
    localStorage.set(
      'current-chat-screen',
      JSON.stringify({
        chatId: item.id,
        targetFcmToken: item.otherUser.fcmToken,
        currentUid: storedUser.uid,
        currentName: storedUser.displayName,
        currentPfp: storedUser.photoURL,
      }),
    );
  }

  const lastMessageSender =
    item?.lastMessageSender == storedUser.displayName
      ? 'You: '
      : item?.lastMessageSender
      ? `${item?.lastMessageSender}: `
      : '';

  return (
    <TouchableNativeFeedback useForeground onPress={onNavigateToChatScreen}>
      <View style={styles.btnChatContainer}>
        <Image
          source={{uri: item.otherUser.photoURL}}
          style={{width: 50, height: 50, borderRadius: 50 / 2}}
          resizeMethod="resize"
        />
        <Gap width={10} />
        <View style={{flex: 1}}>
          <Text style={styles.textContactName}>
            {item.otherUser.displayName}
          </Text>
          <Text style={styles.textLastMessage} numberOfLines={1}>
            {lastMessageSender}
            {item.lastMessage}
          </Text>
        </View>
        <Gap width={20} />
        <Text style={{color: 'white'}}>{lastMessageTimestamp}</Text>
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  textLastMessage: {
    // textAlign: 'left',
    color: 'white',
  },
  textContactName: {
    textAlign: 'left',
    color: 'white',
    fontWeight: 'bold',
    // fontSize: 16,
  },
  btnChatContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'white',
    padding: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
});
