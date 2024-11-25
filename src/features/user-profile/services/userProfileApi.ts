import {useState} from 'react';
import {UserProfileType} from '..';
import {useAppSelector} from '../../../hooks';
import {
  cloudStorageFileDelete,
  defaultPfp,
  useCloudStorageFileUpload,
} from '../../../utils';
import firestore from '@react-native-firebase/firestore';
import auth, {
  getAuth,
  updateEmail as onUpdateEmail,
} from '@react-native-firebase/auth';
import {Alert, Linking, ToastAndroid} from 'react-native';
import {UserType} from '../../authentication';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/type';

export function useUpdateProfile() {
  const storedUser = useAppSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);

  async function updateProfile(data: {displayName: string}) {
    setLoading(true);
    try {
      const userData = {...data, updatedAt: new Date().toISOString()};

      if (storedUser.displayName != userData.displayName)
        await auth().currentUser?.updateProfile({
          displayName: userData.displayName,
        });

      await firestore()
        .collection('users')
        .doc(storedUser.uid)
        .update(userData);

      setLoading(false);
    } catch (error) {
      console.log('error updating profile:', error);
      setLoading(false);
    }
  }

  return {loading, updateProfile};
}

export function useUpdatePfp() {
  const uid = useAppSelector(state => state.auth.user.uid);
  const [updating, setUpdating] = useState(false);
  const {progress, uploadFile, uploading} = useCloudStorageFileUpload();

  const loading = updating || uploading;

  async function updatePfp(photo: {
    fileType: string;
    fileUri: string;
    fileName: string;
  }) {
    setUpdating(true);
    try {
      const newPhotoURL = await uploadFile(
        photo.fileType,
        photo.fileUri,
        `/users/${uid}/pfp/${new Date().getTime()}_${photo.fileName}`,
      );

      await firestore()
        .collection('users')
        .doc(uid)
        .update({photoURL: newPhotoURL, updatedAt: new Date().toISOString()});

      setUpdating(false);
    } catch (error) {
      console.log('error updating pfp:', error);
    }
  }

  return {loading, updatePfp, progress};
}

export function useUpdatePassword() {
  const [loading, setLoading] = useState<boolean>(false);

  async function updatePassword(currentPassword: string, newPassword: string) {
    setLoading(true);
    try {
      const user = auth().currentUser;
      if (!user || !user.email) throw new Error('no authenticated user');

      // reauthenticate user
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await user.reauthenticateWithCredential(credential);

      // update the password
      await user.updatePassword(newPassword);
      ToastAndroid.show('Password changed successfully', ToastAndroid.SHORT);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      Alert.alert('', error.message);
      switch (error.code) {
        case 'auth/wrong-password':
          return console.log('current password is incorrect');
        case 'auth/weak-password':
          return console.log('new password is weak');
        default:
          return console.log('error updating password:', error);
      }
    }
  }

  return {loading, updatePassword};
}

export function useUpdateEmail() {
  const currentEmail = useAppSelector(state => state.auth.user.email);
  const [loading, setLoading] = useState<boolean>(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function updateEmail(newEmail: string, currentPassword: string) {
    setLoading(true);
    try {
      const user = auth().currentUser;
      if (!user) return Promise.reject('no authenticated user');

      await user.reauthenticateWithCredential(
        auth.EmailAuthProvider.credential(currentEmail, currentPassword),
      ); // check if user password is correct

      await user.verifyBeforeUpdateEmail(newEmail);
      Alert.alert(
        'Success',
        'Please check your inbox to verify, then sign in with new email.',
      );
      await auth().signOut();
      navigation.reset({routes: [{name: 'Authentication'}]});
    } catch (error: any) {
      console.log('error updating email:', error);
      Alert.alert('', error.message);
      setLoading(false);
      return Promise.reject(error);
    }
  }

  return {loading, updateEmail};
}

export function useDeleteMe() {
  const [loading, setLoading] = useState<boolean>(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function deleteMe(credential: {email: string; password: string}) {
    setLoading(true);
    try {
      const user = auth().currentUser;

      if (user) {
        await user.reauthenticateWithCredential(
          auth.EmailAuthProvider.credential(
            credential.email,
            credential.password,
          ),
        );

        await firestore().collection('users').doc(user.uid).delete();
        await user.delete();
      }

      navigation.reset({routes: [{name: 'Authentication'}]});
    } catch (error: any) {
      console.log('error delete me:', error);
      Alert.alert('', error.message);
      setLoading(false);
    }
  }

  return {loading, deleteMe};
}
