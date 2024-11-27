import {useEffect, useState} from 'react';
import {MediaFileType, PostType} from '..';
import firestore from '@react-native-firebase/firestore';
import {
  cloudStorageFileDelete,
  useCloudStorageFileUpload,
} from '../../../utils/firebase';
import {useAppSelector} from '../../../hooks';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/type';

export function useSocialPosts() {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (!snapshot) return setPosts([]);
        const postArray = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(postArray as PostType[]);
      });

    return () => unsubscribe();
  }, []);

  return posts;
}

export function useSocialPostsPersonal() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const uid = useAppSelector(state => state.auth.user.uid);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .where('creator.uid', '==', uid)
      .onSnapshot(snapshot => {
        if (!snapshot) return setPosts([]);
        const postArray = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(postArray as PostType[]);
      });

    return () => unsubscribe();
  }, []);

  return posts;
}

export function useCreatePost() {
  const uid = useAppSelector(state => state.auth.user.uid);
  const {progress, uploadFile, uploading} = useCloudStorageFileUpload();
  const [creating, setCreating] = useState<boolean>(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const loading = creating || uploading;

  async function createPost(data: PostType, mediaFiles: MediaFileType[]) {
    setCreating(true);
    try {
      const postData = data;

      for (const media of mediaFiles) {
        const uniqueFileName = (new Date().getTime() * Math.random())
          .toFixed(0)
          .toString();
        const mediaUrl = await uploadFile(
          media.fileType,
          media.fileUri,
          `/users/${uid}/posts/${media.fileName}_${uniqueFileName}`,
        );
        postData.mediaUrl.push(mediaUrl);
      }

      await firestore().collection('posts').add(data);

      navigation.goBack();
    } catch (error) {
      setCreating(false);
      console.log('error creating post:', error);
    }
  }

  return {loading, createPost, mediaProgress: progress};
}

export function useUpdatePost() {
  const uid = useAppSelector(state => state.auth.user.uid);
  const [updating, setUpdating] = useState(false);
  const {progress, uploadFile, uploading} = useCloudStorageFileUpload();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const loading = updating || uploading;

  async function updatePost(
    data: PostType,
    mediaData: MediaFileType[],
    mediaToDelete: string[],
  ) {
    setUpdating(true);
    try {
      const postData = {...data};

      const mediaToUpload: string[] = [];

      // check for new media
      for (const media of mediaData) {
        if (media.fileName) {
          // upload new media
          const mediaUrl = await uploadFile(
            media.fileType,
            media.fileUri,
            `/users/${uid}/posts/${new Date().getTime()}_${media.fileName}`,
          );
          mediaToUpload.push(mediaUrl);
        } else {
          // keep old media
          mediaToUpload.push(media.fileUri);
        }
      }

      // delete removed media
      for (const mediaUrl of mediaToDelete) {
        await cloudStorageFileDelete(mediaUrl);
      }

      postData.mediaUrl = mediaToUpload;
      await firestore().collection('posts').doc(data.id).update(postData);
      navigation.goBack();
    } catch (error) {
      setUpdating(false);
      console.log('error updating post:', error);
    }
  }

  return {loading, updatePost, mediaProgress: progress};
}

export function useDeletePost() {
  async function deletePost(item: PostType) {
    try {
      if (item.mediaUrl) {
        for (const media of item.mediaUrl) {
          await cloudStorageFileDelete(media);
        }
      }
      await firestore().collection('posts').doc(item.id).delete();
    } catch (error) {
      console.log('error deleting post:', error);
    }
  }

  return {deletePost};
}
