import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../routes/type';

export type SocialScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Social'
>;
export type SocialPersonalScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SocialPersonal'
>;
export type PostCreateScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PostCreate'
>;
export type PostUpdateScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PostUpdate'
>;
export type PostDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PostDetail'
>;

export type PostType = {
  title: string;
  description: string;
  mediaUrl: {
    url: string;
    fileType: string;
  }[];
  createdAt: string;
  updatedAt: string;
  likes: {[userId: string]: boolean};
  likeCount: number;
  creator: UserType;
  id: string;
};
export type MediaFileType = {
  fileUri: string;
  fileName: string;
  fileType: string;
};

// hooks
import {
  useSocialPosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useSocialPostsPersonal,
} from './services/socialApi';
export {
  useSocialPosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useSocialPostsPersonal,
};

// components
import RenderPost from './components/RenderPost';
import ProfileHeader from './components/ProfileHeader';
import RenderPostDetail from './components/RenderPostDetail';
import {UserType} from '../authentication';
export {RenderPost, ProfileHeader, RenderPostDetail};

// redux actions
import {setViewablePostIndex} from './services/socialSlice';
export {setViewablePostIndex};
