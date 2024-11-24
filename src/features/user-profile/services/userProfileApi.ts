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

export function useUpdateProfile() {
  const storedUser = useAppSelector(state => state.auth.user);
  const [updating, setUpdating] = useState(false);
  const {progress, uploadFile, uploading} = useCloudStorageFileUpload();

  async function updateProfile(data: {displayName: string}) {
    setUpdating(true);
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

      setUpdating(false);
    } catch (error) {
      console.log('error updating profile:', error);
      setUpdating(false);
    }
  }

  return {updating, updateProfile, progress, uploadingPhoto: uploading};
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
  const [loading, setLoading] = useState<boolean>(false);

  async function updateEmail(newEmail: string, currentPassword: string) {
    setLoading(true);
    try {
      // const user = auth().currentUser;
      // if (!user) throw new Error('no authenticated user');

      const auth = getAuth();
      if (!auth.currentUser) throw new Error('no authenticated user');
      await onUpdateEmail(auth.currentUser, newEmail);
      console.log('erm what the sigma');

      // reauthenticate user
      // const credential = auth.EmailAuthProvider.credential(
      //   user.email!,
      //   currentPassword,
      // );
      // await user.reauthenticateWithCredential(credential);

      // // update email
      // await user.verifyBeforeUpdateEmail(newEmail);

      // Alert.alert(
      //   '',
      //   'Verification URL has been sent to the new email! Please open the URL to confirm the email update. Check the spam folder if necessary.',
      // );

      // await firestore()
      //   .collection('users')
      //   .doc(user.uid)
      //   .update({email: newEmail});

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error updating email:', error);
      return Promise.reject(error);
    }
  }

  return {loading, updateEmail};
}

// export function useVerifyEmail() {
//   const [loading, setLoading] = useState<boolean>(false);

// async function verifyEmail() {
//   setLoading(true)
//   try {
//     const user = auth().currentUser
//     if(user && !user.emailVerified) {
//       await
//     }
//   } catch (error) {

//   }
// }

//   return {loading};
// }
