import auth from '@react-native-firebase/auth';
import {defaultPfp} from '../../../utils';
import {clearCurrentUser, setCurrentUser, UserType} from '..';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/type';
import {useDispatch} from 'react-redux';
import {Alert} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useState} from 'react';

const dateISOString = new Date().toISOString();

const defaultUser: UserType = {
  uid: '',
  displayName: '',
  email: '',
  anonymous: false,
  photoURL: defaultPfp,
  createdAt: dateISOString,
  updatedAt: dateISOString,
  contacts: {},
  fcmToken: '',
};

export function useSignIn() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function signIn(credential: {email: string; password: string}) {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(
        credential.email,
        credential.password,
      );

      const user = auth().currentUser;
      if (user) {
        const userSnapshot = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        dispatch(setCurrentUser(userSnapshot.data() as UserType));

        // check for new email
        if (user.email != userSnapshot.data()?.email) {
          await firestore()
            .collection('users')
            .doc(user.uid)
            .update({email: user.email});
        }

        navigation.replace('Home');
      }
    } catch (error: any) {
      console.log('error sign in:', error);
      Alert.alert('', error.message);
      setLoading(false);
    }
  }

  return {loading, signIn};
}

export function useSignUp() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function signUp(credential: {
    email: string;
    password: string;
    name: string;
  }) {
    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(
        credential.email,
        credential.password,
      );
      await auth().currentUser?.updateProfile({
        displayName: credential.name,
        photoURL: defaultPfp,
      });

      const user = auth().currentUser;
      if (user) {
        const {email, displayName, uid, photoURL} = user;
        const userData = {
          ...defaultUser,
          displayName,
          email,
          photoURL,
          uid,
        };

        await firestore().collection('users').doc(user.uid).set(userData);

        dispatch(setCurrentUser(userData as UserType));

        navigation.replace('Home');
      }
    } catch (error: any) {
      console.log('error sign up:', error);
      Alert.alert('', error.message);
      setLoading(false);
    }
  }

  return {loading, signUp};
}

export function useSignInAnonymous() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function signInAnonymous() {
    setLoading(true);
    try {
      await auth().signInAnonymously();

      const user = auth().currentUser;
      if (user) {
        const userData = {
          ...defaultUser,
          displayName: `Anon:${new Date().getTime()}`,
          photoURL: defaultPfp,
          anonymous: true,
          uid: user.uid,
        };
        await firestore().collection('users').doc(user.uid).set(userData);
        dispatch(setCurrentUser(userData));

        navigation.replace('Home');
      }
    } catch (error: any) {
      console.log('error sign in anon:', error);
      Alert.alert('', error.message);
      setLoading(false);
    }
  }

  return {loading, signInAnonymous};
}

export function useSignInGoogle() {
  const dispatch = useAppDispatch();
  GoogleSignin.configure({
    webClientId:
      '623167292612-4jimakng4ts38ig93lvnrpf0as759jn8.apps.googleusercontent.com',
  });

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

        await auth().signInWithCredential(googleCredential);

        const user = auth().currentUser;
        if (user) {
          const {email, displayName, photoURL} = user;
          const userData = {
            ...defaultUser,
            displayName,
            email,
            photoURL,
            uid: user.uid,
          };
          await firestore().collection('users').doc(user.uid).set(userData);
          dispatch(setCurrentUser(userData as UserType));

          navigation.replace('Home');
        }
      } else {
        console.warn('warning sign in google:', response);
        setLoading(false);
      }
    } catch (error: any) {
      console.log('error sign in google:', error);
      Alert.alert('', error.message);
      setLoading(false);
    }
  }

  return {loading, signInGoogle};
}

export function useSignOut() {
  const dispatch = useAppDispatch();
  const user = auth().currentUser;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  function signOut() {
    Alert.alert(
      'Sign Out?',
      'Your session will be ended.',
      [
        {text: 'Cancel'},
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              if (GoogleSignin.hasPreviousSignIn())
                await GoogleSignin.signOut();

              if (user) {
                if (user.isAnonymous) {
                  await firestore().collection('users').doc(user.uid).delete();
                  await user.delete();
                } else await auth().signOut();

                dispatch(clearCurrentUser());
                navigation.replace('Authentication');
              }
            } catch (error) {
              console.log('error signing out:', error);
              dispatch(clearCurrentUser());
              navigation.replace('Authentication');
            }
          },
        },
      ],
      {userInterfaceStyle: 'dark'},
    );
  }

  return {signOut};
}
