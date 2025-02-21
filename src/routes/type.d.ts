import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PostType} from '../features/social';
import {AuthType} from '../features/authentication';

export type RootStackParamList = {
  Splash: undefined;
  Authentication: undefined;
  Home: undefined;
  UserProfile: AuthType['user'];
  Demo: undefined;
  Task: undefined;

  Social: undefined;
  SocialPersonal: undefined;
  PostCreate: undefined;
  PostUpdate: PostType;
  PostDetail: PostType;

  Chat: undefined;
  SearchUser: undefined;
  ContactList?: {status: 'accepted' | 'declined' | 'requested' | 'pending'};
  ChatScreen: {chatId: string; targetFcmToken: string; chat_name: string};
};

export type SplashScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Splash'
>;

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;
