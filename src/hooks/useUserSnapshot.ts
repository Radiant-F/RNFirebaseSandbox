import auth from '@react-native-firebase/auth';
import {useAppDispatch} from '.';
import {useEffect, useState} from 'react';
import {setCurrentUser} from '../features/authentication/services/authSlice';
import firestore from '@react-native-firebase/firestore';
import {UserType} from '../features/authentication';

export function useUserSnapshot() {
  const uid = auth().currentUser?.uid;
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(snapshot => {
        if (snapshot) {
          setUser(snapshot.data() as UserType);
          dispatch(setCurrentUser(snapshot.data() as UserType));
        }
      });

    return () => unsubscribe();
  }, []);

  return user;
}
