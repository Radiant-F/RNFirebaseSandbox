import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
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
const windowWidth = Dimensions.get('window').width - 10;

type RenderPostType = {
  item: PostType;
};
export default function RenderPostDetail({item}: RenderPostType) {
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            <Text style={{color: 'white'}}>
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

        <Text style={styles.textTitle}>{item.title}</Text>
        {item.description && (
          <Text style={{color: 'white'}}>{item.description}</Text>
        )}
      </View>

      {/* post media */}
      {mediaLength != 0 && (
        <RenderPostMedia mediaSource={item.mediaUrl} mediaHeight={350} />
      )}

      <Gap height={mediaLength == 0 ? 0 : 10} />

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewPostHeader: {
    margin: 15,
    marginBottom: 5,
  },
  textEdited: {
    fontStyle: 'italic',
    color: 'grey',
  },
  btnOption: {
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  textTitle: {
    fontSize: 17,
    color: 'white',
    marginVertical: 10,
  },
  container: {
    marginBottom: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ffffff40',
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
});
