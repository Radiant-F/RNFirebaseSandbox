import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {PostType, useDeletePost} from '..';
import {useAppSelector, useTimeAgo} from '../../../hooks';
import {Gap, ModalBottomAction} from '../../../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/type';
import RenderPostMedia from './RenderPostMedia';

type RenderPostType = {
  item: PostType;
};
export default function RenderPost({item}: RenderPostType) {
  const user = useAppSelector(state => state.auth.user);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [visibleModalAction, setVisibleModalAction] = useState<boolean>(false);
  const closeModalAction = () => setVisibleModalAction(false);

  const {deletePost} = useDeletePost();
  async function onDeletePost() {
    Alert.alert('Delete post?', 'This action is not reversible.', [
      {
        text: 'Delete',
        onPress: async () => await deletePost(item),
        style: 'destructive',
      },
      {text: 'Cancel'},
    ]);
  }

  const mediaLength = item.mediaUrl.length;

  [
    {
      fileType: 'image/jpeg',
      url: 'https://firebasestorage.googleapis.com/v0/b/fauthdemo-4d043.appspot.com/o/users%2F3wdF5FguUPWJderl2mAwWbxW5NP2%2Fposts%2F1000005971.jpg_902754195627?alt=media&token=81b0abff-acaa-4ece-91b9-af867378be0e',
    },
    {
      fileType: 'image/jpeg',
      url: 'https://firebasestorage.googleapis.com/v0/b/fauthdemo-4d043.appspot.com/o/users%2F3wdF5FguUPWJderl2mAwWbxW5NP2%2Fposts%2F1000006011.jpg_161959488674?alt=media&token=0a95afb7-d4db-43fe-83e4-38dc576506df',
    },
    {
      fileType: 'video/mp4',
      url: 'https://firebasestorage.googleapis.com/v0/b/fauthdemo-4d043.appspot.com/o/users%2F3wdF5FguUPWJderl2mAwWbxW5NP2%2Fposts%2F1000005982.mp4_1378923533660?alt=media&token=62a4fb8b-8477-4da9-b414-bd1a802e6d0b',
    },
  ];

  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple('#ffffff1a', false)}
      onPress={() => navigation.navigate('PostDetail', item)}>
      <View style={styles.container}>
        {/* post header */}
        <View style={styles.viewPostHeader}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{uri: item.creator.photoURL}}
              style={{width: 45, height: 45, borderRadius: 45 / 2}}
              resizeMethod="resize"
            />
            <Gap width={10} />
            <View style={{flex: 1}}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {item.creator.displayName}
              </Text>
              <Text style={{color: 'grey', fontSize: 12}}>
                {useTimeAgo(new Date(item.createdAt))}
                <Text style={styles.textEdited}>
                  {item.createdAt != item.updatedAt && ' (edited)'}
                </Text>
              </Text>
            </View>

            {item.creator.uid == user.uid && (
              <TouchableNativeFeedback
                onPress={() => setVisibleModalAction(true)}
                useForeground
                background={TouchableNativeFeedback.Ripple(
                  '#ffffff40',
                  false,
                  25 / 1.25,
                )}>
                <View style={styles.btnOption}>
                  <Icon
                    name="dots-horizontal"
                    color={'white'}
                    size={25}
                    style={{textAlign: 'center'}}
                  />
                </View>
              </TouchableNativeFeedback>
            )}
          </View>

          <Gap height={5} />
          <Text
            style={{...styles.textTitle, fontSize: mediaLength == 0 ? 17 : 14}}>
            {item.title}
          </Text>
        </View>
        {/* </TouchableNativeFeedback> */}

        {/* post media */}
        <Gap height={mediaLength != 0 ? 5 : 0} />
        {mediaLength != 0 && <RenderPostMedia mediaSource={item.mediaUrl} />}

        <Gap height={10} />

        <ModalBottomAction
          visible={visibleModalAction}
          onRequestClose={closeModalAction}
          buttons={[
            {
              icon: 'lead-pencil',
              title: 'Update Post',
              onPress: () => {
                closeModalAction();
                navigation.navigate('PostUpdate', item);
              },
            },
            {
              title: 'Delete Post',
              icon: 'trash-can',
              danger: true,
              onPress: () => onDeletePost(),
            },
          ]}
        />
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  viewPostHeader: {
    padding: 20,
    paddingBottom: 0,
    paddingTop: 10,
  },
  textEdited: {
    fontStyle: 'italic',
    color: 'grey',
  },
  btnOption: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    // backgroundColor: '#ffffff1a',
  },
  textTitle: {
    color: 'white',
  },
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ffffff40',
    marginBottom: 15,
  },
});
