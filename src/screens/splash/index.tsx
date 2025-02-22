import {useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import RootStack from '../../routes';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {setCurrentUser} from '../../features/authentication/services/authSlice';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator, View} from 'react-native';
import {localStorage} from '../../utils';
import {UserType} from '../../features/authentication';

export default function InitializeAuth() {
  const dispatch = useAppDispatch();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        setUser(user);
        const userSnapshot = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();

        localStorage.set(
          'current-user',
          JSON.stringify(userSnapshot.data() as UserType),
        );

        dispatch(setCurrentUser(userSnapshot.data() as UserType));
      }
      if (initializing) setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing)
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator color={'white'} size={'large'} />
      </View>
    );
  else return <RootStack user={user} />;
}
