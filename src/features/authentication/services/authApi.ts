import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {AuthType, setCurrentUser} from '..';
import auth from '@react-native-firebase/auth';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/types';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
const defaultProfilePicture =
  'https://firebasestorage.googleapis.com/v0/b/fauthdemo-4d043.appspot.com/o/124034934_p0.jpg?alt=media&token=1f549c26-802b-4257-9115-f1871df8c20f';

const dateISOString = new Date().toISOString();
const defaultUserData: AuthType['user'] = {
  name: '',
  email: '',
  createdAt: dateISOString,
  updatedAt: dateISOString,
  photo: defaultProfilePicture,
  anonymous: false,
  uid: '',
};

async function getUserSnapshot(uid: string): Promise<AuthType['user']> {
  try {
    const userSnapshot = await firestore().collection('users').doc(uid).get();
    const useData = {
      ...userSnapshot.data(),
      uid: uid,
    } as AuthType['user'];
    return useData;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function setUserSnapshot(uid: string) {
  try {
    const userSnapshot = await firestore().collection('users').doc(uid).get();
    const useData = {
      ...userSnapshot.data(),
      uid: uid,
    } as AuthType['user'];
    return useData;
  } catch (error) {
    return Promise.reject(error);
  }
}

export function useCurrentUser() {
  const uid = auth().currentUser?.uid;
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<AuthType['user']>();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(snapshot => {
        if (snapshot) {
          const userSnapshot = {
            ...snapshot.data(),
            uid: snapshot.id,
          } as AuthType['user'];

          setUser(userSnapshot);
          dispatch(setCurrentUser(userSnapshot));
        }
      });

    return () => unsubscribe();
  }, []);

  return user;
}

export function useSignIn() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function signIn(credential: {email: string; password: string}) {
    setLoading(true);
    try {
      let userCredential: FirebaseAuthTypes.UserCredential =
        await auth().signInWithEmailAndPassword(
          credential.email,
          credential.password,
        );
      // const signedInUserData = await getUserSnapshot(userCredential.user.uid);
      // dispatch(setCurrentUser(signedInUserData));
      navigation.replace('Home');
    } catch (error) {
      setLoading(false);
      console.log('sign in error:', error);
    }
  }

  return {loading, signIn};
}

export function useSignUp() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function signUp(credential: {
    name: string;
    email: string;
    password: string;
  }) {
    setLoading(true);
    try {
      let userCredential: FirebaseAuthTypes.UserCredential =
        await auth().createUserWithEmailAndPassword(
          credential.email,
          credential.password,
        );

      await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set({
          ...defaultUserData,
          email: credential.email,
          name: credential.name,
          uid: userCredential.user.uid,
        });

      const signedInUserData = await getUserSnapshot(userCredential.user.uid);
      dispatch(setCurrentUser(signedInUserData));
      navigation.replace('Home');
    } catch (error) {
      setLoading(false);
      console.log('sign up error:', error);
    }
  }

  return {loading, signUp};
}

export function useSignInAnonymous() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function signInAnonymously() {
    Alert.alert(
      'Sign In Anonymously?',
      "Certain features won't be available and your account won't be stored once you signed out.",
      [
        {text: 'Cancel'},
        {
          text: 'Continue',
          onPress: async () => {
            setLoading(true);
            try {
              const userCredential = await auth().signInAnonymously();
              const uid = userCredential.user.uid;

              await firestore()
                .collection('users')
                .doc(uid)
                .set({
                  ...defaultUserData,
                  name: `Anon_${uid}`,
                  anonymous: true,
                  uid: uid,
                });

              const signedInUserData = await getUserSnapshot(uid);
              dispatch(setCurrentUser(signedInUserData));
              navigation.replace('Home');
            } catch (error) {
              setLoading(false);
              console.log('anon sign in error:', error);
            }
          },
        },
      ],
    );
  }

  return {loading, signInAnonymously};
}

export function useSignInGoogle() {
  GoogleSignin.configure({
    webClientId:
      '623167292612-4jimakng4ts38ig93lvnrpf0as759jn8.apps.googleusercontent.com',
  });
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function signInGoogle() {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const response = await GoogleSignin.signIn();

      if (response.data) {
        const googleCredential = auth.GoogleAuthProvider.credential(
          response.data.idToken,
        );
        const userCredential = await auth().signInWithCredential(
          googleCredential,
        );

        const {email, name, photo} = response.data.user;
        await firestore().collection('users').doc(userCredential.user.uid).set({
          name: name,
          email: email,
          createdAt: dateISOString,
          updatedAt: dateISOString,
          photo: photo,
          anonymous: false,
        });
        const signedInUserData = await getUserSnapshot(userCredential.user.uid);
        dispatch(setCurrentUser(signedInUserData));

        navigation.replace('Home');
      } else {
        console.warn('google sign in warning:', response);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('google sign in error:', error);
    }
  }

  return {loading, signInGoogle};
}

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  // const user = useCurrentUser();
  const user = useAppSelector(state => state.auth.user);

  async function updateProfile(data: AuthType['user']) {
    setLoading(true);
    try {
      await firestore().collection('users').doc(user?.uid).update(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error updating profile:', error);
    }
  }

  return {loading, updateProfile};
}
