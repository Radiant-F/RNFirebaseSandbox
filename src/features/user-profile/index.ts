import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../routes/type';
export type UserProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'UserProfile'
>;
export type UserProfileType = {
  user: {
    uid: string;
    displayName: string;
    email: string;
    photo: string;
    anonymous: boolean;
    createdAt: string;
    updatedAt: string;
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
};

import ProfilePicture from './components/ProfilePicture';
import EditUserPassword from './components/EditUserPassword';
import EditUserProfile from './components/EditUserProfile';
import EditUserEmail from './components/EditUserEmail';
import DeleteMe from './components/DeleteMe';
export {
  ProfilePicture,
  EditUserPassword,
  EditUserProfile,
  EditUserEmail,
  DeleteMe,
};

import {
  useUpdateProfile,
  useUpdatePassword,
  useUpdateEmail,
  useUpdatePfp,
  useDeleteMe,
} from './services/userProfileApi';
export {
  useUpdateProfile,
  useUpdatePassword,
  useUpdateEmail,
  useUpdatePfp,
  useDeleteMe,
};
