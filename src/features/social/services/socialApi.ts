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
import {RootStackParamList} from '../../../routes/types';

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
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [creating, setCreating] = useState<boolean>(false);
  const {progress, uploadFile, uploading} = useCloudStorageFileUpload();
  const uid = useAppSelector(state => state.auth.user.uid);

  const loading = creating || uploading;

  async function createPost(data: PostType, mediaFiles: MediaFileType[]) {
    setCreating(true);
    try {
      const postData = data;

      for (const media of mediaFiles) {
        const mediaUrl = await uploadFile(
          media.fileType,
          media.fileUri,
          `/posts/${uid}/${media.fileName}`,
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
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [updating, setUpdating] = useState(false);
  const {progress, uploadFile, uploading} = useCloudStorageFileUpload();
  const uid = useAppSelector(state => state.auth.user.uid);

  const loading = updating || uploading;

  async function updatePost(data: PostType, newMedia: MediaFileType[]) {
    setUpdating(true);
    try {
      const postData = {...data};

      // step 1: identify removed media
      const existingMediaUrls = postData.mediaUrl || [];
      const newMediaUris = newMedia.map(media => media.fileUri);
      const mediaToDelete = existingMediaUrls.filter(
        url => !newMediaUris.includes(url),
      );

      // step 2: delete removed media
      for (const mediaUrl of mediaToDelete) {
        console.log(mediaUrl);
        await cloudStorageFileDelete(mediaUrl);
      }

      // step 3: upload new media and get the URLs
      const updatedMediaUrls = [];
      for (const media of newMedia) {
        if (!existingMediaUrls.includes(media.fileUri)) {
          // only upload new media that werent part of the original post
          const mediaUrl = await uploadFile(
            media.fileType,
            media.fileUri,
            `/posts/${uid}/${media.fileName}`,
          );
          updatedMediaUrls.push(mediaUrl);
        } else {
          // keep existing media URLs that werent deleted
          updatedMediaUrls.push(media.fileUri);
        }
      }

      // // delete existing media and replace it with the new media
      // if (media.fileName) {
      //   data.imageUrl && (await cloudStorageFileDelete(data.imageUrl));
      //   const mediaUrl = await uploadFile(
      //     media.fileType,
      //     media.fileUri,
      //     `/posts/${uid}_${media.fileName}`,
      //   );
      //   postData.imageUrl = mediaUrl;
      // }

      // // delete existing media. might get false warning when updating a post without media
      // if (media.fileUri == '') {
      //   await cloudStorageFileDelete(data.imageUrl ? data.imageUrl : '');
      //   postData.imageUrl = '';
      // }

      // step 4: update
      postData.mediaUrl = updatedMediaUrls;
      await firestore().collection('posts').doc(data.id).update(data);
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
        for (const mediaIndex in item.mediaUrl) {
          await cloudStorageFileDelete(item.mediaUrl[mediaIndex]);
        }
      }
      await firestore().collection('posts').doc(item.id).delete();
    } catch (error) {
      console.log('error deleting post:', error);
    }
  }

  return {deletePost};
}
