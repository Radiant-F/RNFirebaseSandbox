import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useRef} from 'react';
import {
  ChatScreenScreenProps,
  InputMessage,
  RenderMessage,
  useMessages,
  useSendMessage,
} from '../../features/chat';
import {Gap, Header} from '../../components';
import FormInput from '../../components/FormInput';
import {useForm} from 'react-hook-form';
import {useAppSelector} from '../../hooks';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

type MessageType = {
  createdAt: FirebaseFirestoreTypes.Timestamp;
  id: string;
  senderId: string;
  text: string;
};

export default function ChatScreen({navigation, route}: ChatScreenScreenProps) {
  const {chatId, targetFcmToken, chat_name} = route.params;
  const {messages}: {messages: MessageType[]} = useMessages(chatId);

  const flatListRef = useRef<FlatList>(null);

  return (
    <View style={{flex: 1}}>
      <Header
        title={chat_name}
        buttonLeft={{
          onPress: () => navigation.goBack(),
          icon: 'chevron-left',
        }}
      />
      <FlatList
        ListFooterComponent={<Gap height={5} />}
        ref={flatListRef}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({animated: true})
        }
        data={messages}
        renderItem={({item}) => {
          return <RenderMessage item={item} />;
        }}
      />
      <InputMessage chatId={chatId} targetFcmToken={targetFcmToken} />
    </View>
  );
}

const styles = StyleSheet.create({});
