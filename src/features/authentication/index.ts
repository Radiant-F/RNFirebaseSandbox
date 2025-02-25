// types
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../routes/type';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type UserType = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
  fcmToken: string;
  contacts?: {
    [contactId: string]: {
      displayName: string;
      photo: string;
      status: 'pending' | 'requested' | 'confirmed';
      lastMessage?: string;
      lastMessageTimestamp?: string;
    };
  };
};
export type AuthenticationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Authentication'
>;

// auth api
import {
  useSignIn,
  useSignUp,
  useSignInAnonymous,
  useSignOut,
  useSignInGoogle,
} from './services/authApi';
export {useSignIn, useSignUp, useSignInAnonymous, useSignOut, useSignInGoogle};

// component
