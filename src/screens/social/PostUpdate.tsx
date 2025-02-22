import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {ButtonStyled, Gap, Header} from '../../components';
import {
  MediaFileType,
  PostType,
  PostUpdateScreenProps,
  useUpdatePost,
} from '../../features/social';
import FormInput from '../../components/FormInput';
import {useForm} from 'react-hook-form';
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Video, {VideoRef} from 'react-native-video';

export default function PostUpdate({navigation, route}: PostUpdateScreenProps) {
  const post = route.params;
  const {control, handleSubmit} = useForm<PostType>({
    defaultValues: {
      title: post.title,
      description: post.description,
      createdAt: post.createdAt,
      updatedAt: new Date().toISOString(),
      mediaUrl: post.mediaUrl,
      creator: post.creator,
      likeCount: post.likeCount,
      likes: post.likes,
      id: post.id,
    },
  });
  const {updatePost, loading, mediaProgress} = useUpdatePost();
  const onCreatePost = (data: PostType) =>
    updatePost(data, mediaData, mediaToDelete);

  const [mediaData, setMediaData] = useState<MediaFileType[]>(
    post.mediaUrl.map(v => ({
      fileName: '',
      fileType: v.fileType,
      fileUri: v.url,
    })),
  );
  const [mediaToDelete, setMediaToDelete] = useState<string[]>([]);

  async function onSelectMedia(type: 'camera' | 'library') {
    try {
      const imageOptions: ImageLibraryOptions = {
        mediaType: 'mixed',
        selectionLimit: 3 - mediaData.length,
      };

      const data =
        type == 'library'
          ? await launchImageLibrary(imageOptions)
          : await launchCamera(imageOptions);

      if (data.assets) {
        const mediaFiles: MediaFileType[] = [];
        data.assets.map(v => {
          mediaFiles.push({
            fileName: v.fileName as string,
            fileType: v.type as string,
            fileUri: v.uri as string,
          });
        });
        setMediaData([...mediaFiles, ...mediaData]);
      }
    } catch (error) {
      console.log('error updating profile picture:', error);
    }
  }

  function removeMedia(mediaUrl: string, index: number) {
    setMediaData(mediaData.filter((v, i) => i != index));
    setMediaToDelete([...mediaToDelete, mediaUrl]);
  }

  const videoRef = useRef<VideoRef>(null);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);

  return (
    <View>
      <Header
        title="Update Post"
        buttonLeft={{icon: 'chevron-left', onPress: () => navigation.goBack()}}
      />
      <View style={{margin: 20}}>
        <FormInput
          control={control}
          fieldName="title"
          fieldIcon="text"
          fieldTitle="Title"
          placeholder="Post title..."
          rules={{required: true, minLength: 3}}
        />
        <FormInput
          control={control}
          fieldName="description"
          fieldIcon="text-long"
          fieldTitle="Description"
          placeholder="Post description..."
          rules={{minLength: 1}}
          multiline
          numberOfLines={2}
        />

        <ScrollView horizontal>
          {mediaData.length >= 1 &&
            mediaData.map((v, index) => (
              <View key={index} style={styles.viewMedia}>
                {/* <Image
                  source={{uri: v.fileUri}}
                  style={{width: '100%', height: 200}}
                  resizeMethod="resize"
                /> */}
                {/* display image */}
                {v.fileType.includes('image') && (
                  <Image
                    source={{uri: v.fileUri}}
                    style={{width: '100%', height: 200}}
                    resizeMethod="resize"
                  />
                )}
                {/* display video */}
                {v.fileType.includes('video') && (
                  <Video
                    ref={videoRef}
                    source={{uri: v.fileUri}}
                    style={{width: '100%', height: 200}}
                    controls={true}
                    paused={true}
                    resizeMode={isVideoFullscreen ? 'contain' : 'cover'}
                    onFullscreenPlayerDidPresent={() =>
                      setIsVideoFullscreen(true)
                    }
                    onFullscreenPlayerDidDismiss={() =>
                      setIsVideoFullscreen(false)
                    }
                    controlsStyles={{
                      hideForward: true,
                      hideNext: true,
                      hidePrevious: true,
                      hideRewind: true,
                    }}
                  />
                )}
                <TouchableOpacity
                  style={{
                    ...styles.btnClearMedia,
                    top: v.fileType.includes('video') ? 10 : undefined,
                    bottom: v.fileType.includes('image') ? 10 : undefined,
                  }}
                  onPress={() => removeMedia(v.fileUri, index)}>
                  <Icon
                    name="trash-can"
                    color={'white'}
                    size={20}
                    style={{textAlign: 'center'}}
                  />
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>

        <View style={{flexDirection: 'row'}}>
          <ButtonStyled
            icon="folder-multiple-image"
            title="Open Gallery"
            style={{flex: 1}}
            fontSizeTitle={15}
            onPress={() => onSelectMedia('library')}
            iconSize={20}
            disabled={mediaData.length == 3}
          />
          <Gap width={10} />
          <ButtonStyled
            icon="camera"
            title="Open Camera"
            style={{flex: 1}}
            fontSizeTitle={15}
            onPress={() => onSelectMedia('camera')}
            iconSize={20}
            disabled={mediaData.length == 3}
          />
        </View>
        <Gap height={20} />
        <ButtonStyled
          title="Update Post"
          onPress={handleSubmit(onCreatePost)}
          loading={loading}
        />
        {loading && <Text style={{color: 'white'}}>{mediaProgress}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnClearMedia: {
    width: 35,
    height: 35,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#00000080',
    borderRadius: 35 / 2,
    position: 'absolute',
    justifyContent: 'center',
    bottom: 10,
    right: 10,
  },
  viewMedia: {
    width: 300,
    marginHorizontal: 10,
    // height: 200,
    marginBottom: 10,
    overflow: 'hidden',
    borderRadius: 20,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'white',
  },
});
