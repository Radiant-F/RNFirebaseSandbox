import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../routes/type';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type ChatScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Chat'
>;
export type SearchUserScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SearchUser'
>;
export type ContactListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ContactList'
>;
export type ChatScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ChatScreen'
>;

export type ChatListType = {
  id: string;
  members: string[];
  lastMessage: string;
  lastMessageTimestamp: FirebaseFirestoreTypes.Timestamp;
  lastMessageSender: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  otherUser: {
    displayName: string;
    photoURL: string;
    fcmToken: string;
  };
};

import {
  useSearchUser,
  useAddContact,
  useChatList,
  useGetContacts,
  useGetOrStartChat,
  useMessages,
  useRespondToContactRequest,
  useSendMessage,
} from './services/chatApi';
export {
  useSearchUser,
  useAddContact,
  useChatList,
  useGetContacts,
  useGetOrStartChat,
  useMessages,
  useRespondToContactRequest,
  useSendMessage,
};

import RenderSearchContact from './components/RenderSearchContact';
import ContactListRequest from './components/ContactListRequest';
import ContactListAccepted from './components/ContactListAccepted';
import RenderMessage from './components/RenderMessage';
import InputMessage from './components/InputMessage';
import ContactListPending from './components/ContactListPending';
import ContactListDeclined from './components/ContactListDeclined';
import RenderChatList from './components/RenderChatList';
import NotificationPermission from './components/NotificationPermission';
export {
  RenderSearchContact,
  ContactListRequest,
  ContactListAccepted,
  ContactListPending,
  RenderMessage,
  InputMessage,
  ContactListDeclined,
  RenderChatList,
  NotificationPermission,
};
