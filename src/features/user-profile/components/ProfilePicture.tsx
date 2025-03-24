import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppSelector} from '../../../hooks';
import {useUpdatePfp, useUpdateProfile} from '../services/userProfileApi';
import {ModalBottomAction, ModalMediaViewer} from '../../../components';
import ImagePicker, {Options} from 'react-native-image-crop-picker';

export default function ProfilePicture() {
  const storedUser = useAppSelector(state => state.auth.user);
  const [visibleBottomAction, setVisibleBottomAction] =
    useState<boolean>(false);
  const closeBottomAction = () => setVisibleBottomAction(false);

  const mediaRef = useRef<View | null>(null);
  const [visibleModalPfp, setVisibleModalPfp] = useState(false);
  const onShowMedia = useCallback(() => {
    setVisibleBottomAction(false);
    setVisibleModalPfp(true);
  }, []);

  const {progress, loading, updatePfp} = useUpdatePfp();

  const [photo, setPhoto] = useState({
    fileType: '',
    fileName: '',
    fileUri: storedUser.photoURL,
  });
  async function onSelectPhoto(type: 'camera' | 'library') {
    try {
      if (type == 'camera') {
        // request camera permission
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (result != PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Camera Access',
            'To use camera, please go to the app settings and enable camera permission.',
            [
              {text: 'Cancel'},
              {
                text: 'Open App Settings',
                onPress: async () => await Linking.openSettings(),
              },
            ],
          );
        }
      }

      const imageOptions: Options = {
        mediaType: 'photo',
        multiple: false,
      };

      const image =
        type == 'library'
          ? await ImagePicker.openPicker(imageOptions)
          : await ImagePicker.openCamera(imageOptions);
      const croppedImage = await ImagePicker.openCropper({
        mediaType: 'photo',
        path: image.path,
      });

      if (croppedImage) {
        const {path, mime} = croppedImage;
        const photo = {
          fileType: mime,
          fileUri: path,
          fileName: (new Date().getTime() * Math.random())
            .toFixed(0)
            .toString(),
        };
        setPhoto(photo);
        setVisibleBottomAction(false);
        await updatePfp(photo);
      }
    } catch (error) {
      console.log('error updating profile picture:', error);
      setVisibleBottomAction(false);
    }
  }

  return (
    <View>
      <TouchableNativeFeedback
        onPress={() => setVisibleBottomAction(true)}
        useForeground
        background={TouchableNativeFeedback.Ripple('#ffffff40', false, 35)}>
        <View style={styles.btmImgPfp} ref={mediaRef}>
          <Image
            source={{uri: photo.fileUri}}
            // source={require('../../../assets/images/background.jpg')}
            style={styles.imgPfp}
            resizeMethod="resize"
          />
          {loading && (
            <View style={styles.viewPfpOverlay}>
              <ActivityIndicator size={'small'} color={'white'} />
              <Text style={{color: 'white', fontSize: 10}}>{progress}</Text>
            </View>
          )}
          {!loading && (
            <View style={styles.viewEdit}>
              <Icon name="camera-outline" color={'black'} size={15} />
            </View>
          )}
        </View>
      </TouchableNativeFeedback>

      {visibleModalPfp && (
        <ModalMediaViewer
          mediaSource={storedUser.photoURL}
          onCloseModal={() => setVisibleModalPfp(false)}
        />
      )}

      <ModalBottomAction
        visible={visibleBottomAction}
        onRequestClose={closeBottomAction}
        buttons={[
          {
            title: 'Camera',
            danger: false,
            icon: 'camera',
            onPress: () => onSelectPhoto('camera'),
          },
          {
            title: 'Gallery',
            danger: false,
            icon: 'folder-image',
            onPress: () => onSelectPhoto('library'),
          },
          {
            title: 'View profile picture',
            danger: false,
            icon: 'eye',
            onPress: () => onShowMedia(),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewPfpOverlay: {
    backgroundColor: '#00000040',
    width: 60,
    height: 60,
    position: 'absolute',
    borderRadius: 60 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewEdit: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'white',
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgPfp: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
  btmImgPfp: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    // overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
