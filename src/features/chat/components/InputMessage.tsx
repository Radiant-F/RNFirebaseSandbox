import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Gap} from '../../../components';
import {useSendMessage} from '../services/chatApi';
import {useAppSelector} from '../../../hooks';

export default function InputMessage({
  chatId,
  targetFcmToken,
}: {
  chatId: string;
  targetFcmToken: string;
}) {
  const storedUser = useAppSelector(state => state.auth.user);
  const [text, setText] = useState<string>('');
  const {sendMessage, loading} = useSendMessage(chatId);

  async function onSendMessage() {
    await sendMessage({
      senderName: storedUser.displayName,
      senderPfp: storedUser.photoURL,
      senderUid: storedUser.uid,
      targetFcmToken: targetFcmToken,
      text,
    });
    setText('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Your message..."
          placeholderTextColor={'grey'}
          style={{color: 'black'}}
          onChangeText={setText}
          value={text}
          multiline
          numberOfLines={4}
        />
      </View>
      <Gap width={10} />
      <TouchableOpacity
        style={styles.btnSendMessage}
        activeOpacity={0.75}
        disabled={text == '' || loading}
        onPress={onSendMessage}>
        <Icon
          name={loading ? 'send-clock-outline' : 'send-outline'}
          size={20}
          color={text ? 'white' : '#ffffffbf'}
          style={{textAlign: 'center'}}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 10,
    marginTop: 0,
    alignItems: 'flex-end',
  },
  btnSendMessage: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
  },
  inputContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    minHeight: 40,
    borderRadius: 40 / 2,
    flex: 1,
  },
});
