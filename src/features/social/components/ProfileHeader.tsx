import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useAppSelector, useTimeAgo} from '../../../hooks';
import {ButtonStyled, Gap} from '../../../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/type';

export default function ProfileHeader() {
  const user = useAppSelector(state => state.auth.user);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={{flexDirection: 'row', margin: 20, alignItems: 'center'}}>
      <View style={styles.btmImgPfp}>
        <Image
          source={{uri: user.photoURL}}
          style={styles.imgPfp}
          resizeMethod="resize"
        />
      </View>

      <Gap width={15} />

      <View style={{flex: 1}}>
        <Text style={styles.textUsername} numberOfLines={2}>
          {user.displayName}
        </Text>
        <Text style={styles.textSecondary} numberOfLines={1}>
          {user.email}
        </Text>
        <Text style={styles.textSecondary}>
          Joined {useTimeAgo(new Date(user.createdAt))}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.btnEdit}
        activeOpacity={0.75}
        onPress={() => navigation.navigate('UserProfile')}>
        <Icon
          name="lead-pencil"
          size={20}
          color={'white'}
          style={{textAlign: 'center'}}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btnEdit: {
    width: 45,
    height: 45,
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 45 / 2,
    justifyContent: 'center',
  },
  textSecondary: {
    color: 'white',
    opacity: 0.5,
    fontStyle: 'italic',
    textAlign: 'left',
  },
  textUsername: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
    textAlign: 'left',
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
