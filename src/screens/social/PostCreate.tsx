import {
  Image,
  ImageSourcePropType,
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
  PostCreateScreenProps,
  PostType,
  useCreatePost,
} from '../../features/social';
import FormInput from '../../components/FormInput';
import {useForm} from 'react-hook-form';
import {useAppSelector} from '../../hooks';
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Video, {VideoRef} from 'react-native-video';

export default function PostCreate({navigation}: PostCreateScreenProps) {
  const user = useAppSelector(state => state.auth.user);
  const {control, handleSubmit, setValue, watch} = useForm<PostType>({
    defaultValues: {
      title: '',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mediaUrl: [],
      creator: user,
      likeCount: 0,
      likes: {},
    },
  });
  const {createPost, loading, mediaProgress} = useCreatePost();
  const onCreatePost = (data: PostType) => createPost(data, mediaData);

  const [mediaData, setMediaData] = useState<MediaFileType[]>([]);

  const videoRef = useRef<VideoRef>(null);

  async function onSelectMedia(type: 'camera' | 'library') {
    try {
      const imageOptions: ImageLibraryOptions = {
        mediaType: 'mixed',
        selectionLimit: 3 - mediaData.length,
        formatAsMp4: true,
      };

      const data =
        type == 'library'
          ? await launchImageLibrary(imageOptions)
          : await launchCamera(imageOptions);

      if (data.assets) {
        const mediaFiles: MediaFileType[] = [...mediaData];
        data.assets.map(v => {
          mediaFiles.push({
            fileName: v.fileName as string,
            fileType: v.type as string,
            fileUri: v.uri as string,
          });
        });
        setMediaData(mediaFiles);
      }
    } catch (error) {
      console.log('error updating profile picture:', error);
    }
  }

  return (
    <View>
      <Header
        title="Create Post"
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
                  />
                )}
                <TouchableOpacity
                  style={{
                    ...styles.btnClearMedia,
                    top: v.fileType.includes('video') ? 10 : undefined,
                    bottom: v.fileType.includes('image') ? 10 : undefined,
                  }}
                  onPress={() =>
                    setMediaData(mediaData.filter((v, i) => i != index))
                  }>
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
          />
          <Gap width={10} />
          <ButtonStyled
            icon="camera"
            title="Open Camera"
            style={{flex: 1}}
            fontSizeTitle={15}
            onPress={() => onSelectMedia('camera')}
            iconSize={20}
          />
        </View>
        <Gap height={20} />
        <ButtonStyled
          title="Create Post"
          onPress={handleSubmit(onCreatePost)}
          loading={loading}
        />

        {loading && <Text style={{color: 'white'}}>{mediaProgress}</Text>}
      </View>
    </View>
  );
}

const dataToSend = {
  createdAt: '2024-11-13T15:21:19.862Z',
  creator: {
    anonymous: false,
    createdAt: '2024-11-11T10:16:04.361Z',
    email: 'exia@example.com',
    name: 'Exia',
    photo:
      'https://firebasestorage.googleapis.com/v0/b/fauthdemo-4d043.appspot.com/o/users%2Ff8C1BaEUN8hKH5d4MfEHGqtAMZ53_1731382341709?alt=media&token=0766541c-b7f3-4e36-a685-8935907c7e3b',
    uid: 'f8C1BaEUN8hKH5d4MfEHGqtAMZ53',
    updatedAt: '2024-11-12T03:26:58.370Z',
  },
  description: '',
  likeCount: 0,
  likes: {},
  mediaUrl: [
    'file:///data/user/0/com.rnfirebasesandbox/cache/rn_image_picker_lib_temp_021d9dd4-88eb-4ba2-9b1a-db9a2d224e8e.jpg',
    'file:///data/user/0/com.rnfirebasesandbox/cache/rn_image_picker_lib_temp_fb868deb-6f9b-4d15-9ae4-d9dbd5f419f4.jpg',
    'file:///data/user/0/com.rnfirebasesandbox/cache/rn_image_picker_lib_temp_75db6747-0d2b-4e4b-bd16-b5e454df6e67.jpg',
  ],
  title: 'wawawa',
  updatedAt: '2024-11-13T15:21:19.862Z',
};
const medias = [
  {
    fileName: '1000000033.jpg',
    fileType: 'image/jpeg',
    fileUri:
      'file:///data/user/0/com.rnfirebasesandbox/cache/rn_image_picker_lib_temp_c9050d17-f46c-4894-a659-da90c7baff44.jpg',
  },
  {
    fileName: '1000000037.jpg',
    fileType: 'image/jpeg',
    fileUri:
      'file:///data/user/0/com.rnfirebasesandbox/cache/rn_image_picker_lib_temp_7199ce41-908d-4529-9d6e-6c4537bf2510.jpg',
  },
  {
    fileName: '1000000034.jpg',
    fileType: 'image/jpeg',
    fileUri:
      'file:///data/user/0/com.rnfirebasesandbox/cache/rn_image_picker_lib_temp_b6d11f56-510d-4d2b-a72e-041bfbb5d30f.jpg',
  },
];

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
