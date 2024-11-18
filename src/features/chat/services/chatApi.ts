import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../../../hooks';
import {UserType} from '../../authentication';
import {Alert} from 'react-native';

export function useContactList() {
  const storedUser = useAppSelector(state => state.auth.user);
  const [contacts, setContacts] = useState();
  async function searchUser(query: string) {
    try {
      const snapshot = await firestore()
        .collection('users')
        .where('email', '==', query)
        .get();

      //   setContacts(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    } catch (error) {
      console.log('error getting contact:', error);
    }
  }
  useEffect(() => {
    searchUser(storedUser.email);
  }, []);

  return contacts;
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
  const [loading, setLoading] = useState(false);

  async function addContact(currentUserId: string, contactId: string) {
    setLoading(true);
    try {
      const timestamp = new Date().toISOString();

      const currentUserContactData = {
        id: contactId,
        status: 'pending',
        createdAt: timestamp,
      };

      const contactUserContactData = {
        id: currentUserId,
        status: 'requested', // the other side sees it as "requested"
        createdAt: timestamp,
      };

      const batch = firestore().batch();

      const currentUserRef = firestore()
        .collection('users')
        .doc(currentUserId)
        .collection('contacts')
        .doc(contactId);
      batch.set(currentUserRef, currentUserContactData);

      const contactUserRef = firestore()
        .collection('users')
        .doc(contactId)
        .collection('contacts')
        .doc(currentUserId);
      batch.set(contactUserRef, contactUserContactData);

      await batch.commit();

      setLoading(false);
      Alert.alert(
        '',
        'Contact request has been sent to the user! Open contact list?',
        [{text: 'Open Contact List'}, {text: 'Later'}],
      );
    } catch (error) {
      setLoading(false);
      console.log('error adding contact:', error);
    }
  }

  return {addContact, loading};
}
