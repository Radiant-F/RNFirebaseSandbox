// firebase
import {cloudStorageFileDelete, useCloudStorageFileUpload} from './firebase';
export {cloudStorageFileDelete, useCloudStorageFileUpload};

// mmkv
import {MMKV} from 'react-native-mmkv';
export const localStorage = new MMKV();

// misc
export const defaultPfp =
  'https://firebasestorage.googleapis.com/v0/b/fauthdemo-4d043.appspot.com/o/124034934_p0.jpg?alt=media&token=dc9cc480-52e8-41b2-b07f-6fb69696becc';

// notifee
import {notificationCreateChannel, notificationRequest} from './notifee';
export {notificationCreateChannel, notificationRequest};
