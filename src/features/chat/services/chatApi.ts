import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../../../hooks';
import {UserType} from '../../authentication';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/type';

type ContactType = {
  createdAt: string;
  displayName: string;
  contactId: string;
  photo: string;
  status: string;
};

export function useGetContacts(status: 'accepted' | 'declined' | 'requested') {
  const storedUser = useAppSelector(state => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactType[]>([]);

  useEffect(() => {
    async function getContacts() {
      try {
        const snapshot = await firestore()
          .collection('users')
          .doc(storedUser.uid)
          .collection('contacts')
          .where('status', '==', status)
          .get();

        if (snapshot.empty) {
          setContacts([]);
          setLoading(false);
          return;
        }

        const contactList = await Promise.all(
          snapshot.docs.map(async doc => {
            const contactRef = firestore()
              .collection('users')
              .doc(storedUser.uid)
              .collection('contacts')
              .doc(doc.id);
            // const contactRef = firestore().collection('users').doc(doc.id);
            // const contactDoc = await contactRef.get();

            return {
              ...doc.data(),
              contactId: doc.id,
              displayName: (await contactRef.get()).data()?.displayName || '',
              photo: (await contactRef.get()).data()?.photo || '',
              // displayName: contactDoc.data()?.displayName || '',
              // photo: contactDoc.data()?.photo || '',
            } as ContactType;
          }),
        );

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

export function useRespondToContactRequest() {
  const [loading, setLoading] = useState(false);

  async function respondToRequest(
    currentUid: string,
    requester: ContactType,
    response: 'accepted' | 'declined',
  ) {
    setLoading(true);
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
          createdAt: new Date().toISOString(),
        });
      } else if (response == 'declined') {
        batch.update(requesterRef, {status: 'declined'});
      }

      await batch.commit();
      setLoading(false);
      console.log(
        `successfully ${response} to contact ${requester.displayName}`,
      );
    } catch (error) {
      setLoading(false);
      console.log('error responding to contact request:', error);
    }
  }

  return {loading, respondToRequest};
}

export function useSearchUser() {
  const [users, setUsers] = useState<UserType[]>([]);

  async function searchUser(query: string) {
    try {
      const snapshot = await firestore()
        .collection('users')
        .where('email', '==', query)
        .get();

      const results = snapshot.docs.map(doc => ({...doc.data()})) as UserType[];
      setUsers(results);
    } catch (error) {
      console.log('error searching user:', error);
    }
  }

  return {users, searchUser};
}

export function useAddContact() {
  const storedUser = useAppSelector(state => state.auth.user);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  async function addContact(selectedContact: UserType) {
    setLoading(true);
    try {
      const timestamp = new Date().toISOString();

      const currentUserContactData = {
        id: selectedContact.uid,
        status: 'pending',
        createdAt: timestamp,
        displayName: storedUser.displayName,
        photo: storedUser.photo,
      };

      const contactUserContactData = {
        id: storedUser.uid,
        status: 'requested', // the other side sees it as "requested"
        createdAt: timestamp,
        displayName: storedUser.displayName,
        photo: storedUser.photo,
      };

      const batch = firestore().batch();

      const currentUserRef = firestore()
        .collection('users')
        .doc(storedUser.uid)
        .collection('contacts')
        .doc(selectedContact.uid);
      batch.set(currentUserRef, currentUserContactData);

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
            onPress: () => navigation.navigate('ContactList'),
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

  async function getOrStartChat(contactId: string) {
    setLoading(true);
    try {
      const chatRef = firestore().collection('chats');
      const existingChat = await chatRef
        .where('members', 'array-contains', storedUser.uid)
        .get();

      // Check if a chat already exists between the two users
      let chatId = '';
      existingChat.docs.forEach(doc => {
        if (doc.data().members.includes(contactId)) {
          chatId = doc.id;
        }
      });

      if (!chatId) {
        // create a new chat
        const newChat = await chatRef.add({
          members: [storedUser.uid, contactId],
          createdAt: firestore.FieldValue.serverTimestamp(),
          lastMessage: '',
          lastMessageTimestamp: null,
        });
        chatId = newChat.id;
      }

      setLoading(false);
      return chatId;
    } catch (error) {
      setLoading(false);
      console.log('error getting or starting chat:', error);
    }
  }

  return {loading, getOrStartChat};
}

export function useChatList() {
  const [chats, setChats] = useState<any[]>([]);
  const storedUser = useAppSelector(state => state.auth.user);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .where('members', 'array-contains', storedUser.uid)
      .orderBy('lastMessageTimestamp', 'desc')
      .onSnapshot(snapshot => {
        if (!snapshot) return setChats([]);
        const chatList = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setChats(chatList);
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
        .collection('messages');
      await messageRef.add({
        senderId,
        text,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // update chat last message and mesage timestamp
      await firestore().collection('chats').doc(chatId).update({
        lastMessage: text,
        lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
      });

      setLoading(false);
    } catch (error) {
      console.log('error sending message:', error);
    }
  }

  return {loading, sendMessage};
}
