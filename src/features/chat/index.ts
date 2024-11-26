import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../routes/type';

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
  createdAt: FirebaseFirestoreTypes.Timestamp;
  otherUser: {
    displayName: string;
    photo: string;
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
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
export {
  RenderSearchContact,
  ContactListRequest,
  ContactListAccepted,
  ContactListPending,
  RenderMessage,
  InputMessage,
  ContactListDeclined,
  RenderChatList,
};
