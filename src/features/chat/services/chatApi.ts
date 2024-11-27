import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../../../hooks';
import {UserType} from '../../authentication';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/type';
import {ChatListType} from '..';
import messaging from '@react-native-firebase/messaging';
import {notificationCreateChannel, notificationRequest} from '../../../utils';
import {localStorage} from '../../../utils';

type ContactType = {
  createdAt: string;
  displayName: string;
  contactId: string;
  photo: string;
  status: string;
};

export function useGetContacts(
  status: 'accepted' | 'declined' | 'requested' | 'pending',
) {
  const storedUser = useAppSelector(state => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactType[]>([]);

  useEffect(() => {
    async function getContacts() {
      try {
        let query;

        if (status == 'pending') {
          query = firestore()
            .collection('users')
            .doc(storedUser.uid)
            .collection('contacts')
            .where('status', '==', 'pending')
            .where('requestedBy', '==', storedUser.uid);
        } else {
          query = firestore()
            .collection('users')
            .doc(storedUser.uid)
            .collection('contacts')
            .where('status', '==', status);
        }

        const snapshot = await query.get();

        if (!snapshot) {
          setContacts([]);
          setLoading(false);
          return;
        }

        const contactList = snapshot.docs.map(doc => ({
          ...doc.data(),
          contactId: doc.id,
        })) as ContactType[];

        setContacts(contactList);
        setLoading(false);
      } catch (error) {
        console.log('error getting contact:', error);
        setLoading(false);
      }
    }

    getContacts();
  }, []);

  return {contacts, loading};
}

export function useRealtimeGetContacts(
  status: 'accepted' | 'declined' | 'requested' | 'pending',
) {
  const storedUser = useAppSelector(state => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactType[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(storedUser.uid)
      .collection('contacts')
      .where('status', '==', status)
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          setContacts([]);
          setLoading(false);
          return;
        }

        const contactList = snapshot.docs.map(doc => ({
          ...doc.data(),
          contactId: doc.id,
        })) as ContactType[];

        setContacts(contactList);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [status]);

  return {contacts, loading};
}

export function useRespondToContactRequest() {
  async function respondToRequest(
    currentUid: string,
    requester: ContactType,
    response: 'accepted' | 'declined' | 'remove',
  ) {
    try {
      const batch = firestore().batch();

      // Update the requester's contact record
      const requesterRef = firestore()
        .collection('users')
        .doc(requester.contactId)
        .collection('contacts')
        .doc(currentUid);

      if (response == 'accepted') {
        batch.update(requesterRef, {status: 'accepted'});

        // Add the contact to the current user's contacts
        const currentUserRef = firestore()
          .collection('users')
          .doc(currentUid)
          .collection('contacts')
          .doc(requester.contactId);

        batch.set(currentUserRef, {
          id: requester.contactId,
          displayName: requester.displayName,
          photo: requester.photo,
          status: 'accepted',
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      } else if (response == 'declined') {
        batch.update(requesterRef, {status: 'declined'});

        // Optionally, remove the declined request from the current user's list
        const currentUserRef = firestore()
          .collection('users')
          .doc(currentUid)
          .collection('contacts')
          .doc(requester.contactId);

        batch.update(currentUserRef, {status: 'declined'}); // Ensure status is updated locally
      } else if (response == 'remove') {
        const currentUserRef = firestore()
          .collection('users')
          .doc(currentUid)
          .collection('contacts')
          .doc(requester.contactId);

        batch.delete(currentUserRef);
      }

      await batch.commit();
    } catch (error: any) {
      console.log('Error responding to contact request:', error);
      Alert.alert('', error.message);
    }
  }

  return {respondToRequest};
}

export function useSearchUser() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchUser(query: string) {
    setLoading(true);
    try {
      const snapshot = await firestore()
        .collection('users')
        .where('email', '==', query)
        .get();

      const results = snapshot.docs.map(doc => ({...doc.data()})) as UserType[];
      setUsers(results);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error searching user:', error);
    }
  }

  return {users, searchUser, loading};
}

export function useAddContact() {
  const storedUser = useAppSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function addContact(selectedContact: UserType) {
    setLoading(true);
    try {
      const timestamp = new Date().toISOString();

      // Data for the current user
      const currentUserContactData = {
        id: selectedContact.uid,
        status: 'pending', // This user sees it as pending
        requestedBy: storedUser.uid, // Tracks who initiated the request
        createdAt: timestamp,
        displayName: selectedContact.displayName,
        photo: selectedContact.photoURL,
      };

      // Data for the contact user
      const contactUserContactData = {
        id: storedUser.uid,
        status: 'requested', // The other side sees it as "requested"
        requestedBy: storedUser.uid, // Tracks who initiated the request
        createdAt: timestamp,
        displayName: storedUser.displayName,
        photo: storedUser.photoURL,
      };

      const batch = firestore().batch();

      // Reference for the current user's contact
      const currentUserRef = firestore()
        .collection('users')
        .doc(storedUser.uid)
        .collection('contacts')
        .doc(selectedContact.uid);
      batch.set(currentUserRef, currentUserContactData);

      // Reference for the contact user's contact
      const contactUserRef = firestore()
        .collection('users')
        .doc(selectedContact.uid)
        .collection('contacts')
        .doc(storedUser.uid);
      batch.set(contactUserRef, contactUserContactData);

      await batch.commit();

      setLoading(false);
      Alert.alert(
        '',
        'Contact request has been sent to the user! Open contact list?',
        [
          {
            text: 'Open Contact List',
            onPress: () =>
              navigation.navigate('ContactList', {status: 'pending'}),
          },
          {text: 'Later'},
        ],
      );
    } catch (error) {
      setLoading(false);
      console.log('error adding contact:', error);
    }
  }

  return {addContact, loading};
}

export function useGetOrStartChat() {
  const storedUser = useAppSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function getOrStartChat(contactId: string) {
    setLoading(true);
    try {
      const chatRef = firestore().collection('chats');
      // fetch chats where both members are present
      const existingChat = await chatRef
        .where('members', 'array-contains', storedUser.uid)
        .get();

      // Check if a chat already exists between the two users
      let chatId = '';
      existingChat.docs.forEach(doc => {
        const members = doc.data().members;
        if (members.includes(contactId)) {
          chatId = doc.id;
        }
      });

      if (!chatId) {
        // create a new chat
        const newChat = await chatRef.add({
          members: [storedUser.uid, contactId],
          createdAt: firestore.FieldValue.serverTimestamp(),
          lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
          lastMessage: '',
          // lastMessage: {
          //   text: '',
          //   sender: '',
          //   timestamp: firestore.FieldValue.serverTimestamp(),
          // },
        });
        chatId = newChat.id;
      }

      navigation.replace('ChatScreen', {chatId});
    } catch (error) {
      setLoading(false);
      console.log('error getting or starting chat:', error);
    }
  }

  return {loading, getOrStartChat};
}

async function fetchUserDetails(uid: string) {
  try {
    const userDoc = await firestore().collection('users').doc(uid).get();
    if (userDoc.exists) {
      const {displayName, photoURL} = userDoc.data() as UserType;
      return {displayName, photoURL};
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
  return {displayName: 'Unknown', photoURL: null}; // Default fallback
}

export function useOldChatList() {
  const [chats, setChats] = useState<any[]>([]);
  const storedUser = useAppSelector(state => state.auth.user);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .where('members', 'array-contains', storedUser.uid)
      // .orderBy('lastMessageTimestamp', 'desc') // fix the null when creating a new chat
      .onSnapshot(snapshot => {
        if (!snapshot) return setChats([]);
        const chatList = snapshot.docs
          .map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort(
            // temporary fix for orderBy method
            (a, b) =>
              (b.lastMessageTimestamp?.toDate?.() || 0) -
              (a.lastMessageTimestamp?.toDate?.() || 0),
          ); // Sort in memory to handle null timestamps
        setChats(chatList);
      });

    return () => unsubscribe();
  }, []);

  return {chats};
}

export function useChatList() {
  const [chats, setChats] = useState<ChatListType[]>([]);
  const storedUser = useAppSelector(state => state.auth.user);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .where('members', 'array-contains', storedUser.uid)
      .onSnapshot(async snapshot => {
        if (!snapshot) return setChats([]);

        const chatPromises = snapshot.docs.map(async (doc: any) => {
          const chatData = {id: doc.id, ...doc.data()};
          const otherMembers = chatData.members.filter(
            (uid: string) => uid !== storedUser.uid,
          );

          if (otherMembers.length === 1) {
            // For one-on-one chats, fetch the other user's details
            const otherUser = await fetchUserDetails(otherMembers[0]);
            return {...chatData, otherUser};
          }

          // For group chats, you can handle it differently if needed
          return chatData;
        });

        const resolvedChats = await Promise.all(chatPromises);
        const sortedChats = resolvedChats.sort(
          (a, b) =>
            (b.lastMessageTimestamp?.toDate?.() || 0) -
            (a.lastMessageTimestamp?.toDate?.() || 0),
        );

        setChats(sortedChats);
      });

    return () => unsubscribe();
  }, []);

  return {chats};
}

export function useMessages(chatId: string) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
        if (!snapshot) return setMessages([]);
        const messageList = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMessages(messageList);
      });

    return () => unsubscribe();
  }, [chatId]);

  return {messages};
}

export function useSendMessage(chatId: string) {
  const [loading, setLoading] = useState(false);

  async function sendMessage(senderId: string, text: string) {
    setLoading(true);
    try {
      const messageRef = firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .doc();

      const chatRef = firestore().collection('chats').doc(chatId);
      const batch = firestore().batch();

      // use a Firestore batch to atomically write both the message and update the chat
      batch.set(messageRef, {
        senderId,
        text,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // update chat last message and mesage timestamp
      batch.update(chatRef, {
        lastMessage: text,
        lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
      });

      await batch.commit();

      // await chatRef.add({
      //   senderId,
      //   text,
      //   createdAt: firestore.FieldValue.serverTimestamp(),
      // });

      // update chat last message and mesage timestamp
      // await firestore().collection('chats').doc(chatId).update({
      //   lastMessage: text,
      //   lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
      // });

      setLoading(false);
    } catch (error) {
      console.log('error sending message:', error);
    }
  }

  return {loading, sendMessage};
}

export function useInitializeNotification() {
  const storedUser = useAppSelector(state => state.auth.user);

  async function initializeNotification() {
    try {
      await notificationRequest();
      await notificationCreateChannel('chat-message', 'Chat');

      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();

      await firestore()
        .collection('users')
        .doc(storedUser.uid)
        .update({fcmToken});

      localStorage.set('init-permission-notification', true);
    } catch (error) {
      console.log('error initializing notification:', error);
    }
  }

  return {initializeNotification};
}
