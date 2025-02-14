import {
  Image,
  ImageSourcePropType,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppSelector} from '../hooks';

type ButtonProps = {
  onPress: () => void;
  icon?: string;
  iconFlip?: boolean;
  image?: ImageSourcePropType | undefined;
};
type HeaderType = {
  title: string;
  buttonRight?: ButtonProps;
  buttonLeft?: ButtonProps;
};

export default function Header({
  title = 'Title',
  buttonLeft = {
    onPress: () => null,
    icon: 'ab-testing',
    iconFlip: false,
  },
  buttonRight,
}: HeaderType) {
  const user = useAppSelector(state => state.auth.user);

  return (
    <View style={styles.container}>
      {buttonLeft && (
        <TouchableNativeFeedback
          onPress={buttonLeft.onPress}
          background={TouchableNativeFeedback.Ripple('#ffffff26', false, 20)}>
          <View
            style={{
              ...styles.btnHeader,
              transform: [{rotate: buttonLeft.iconFlip ? '180deg' : '0deg'}],
            }}>
            {buttonLeft.image && (
              <View style={styles.imgContainer}>
                <Image
                  source={buttonLeft.image}
                  style={styles.img}
                  resizeMethod="resize"
                />
              </View>
            )}
            {buttonLeft.icon && (
              <Icon name={buttonLeft.icon} color={'white'} size={30} />
            )}
          </View>
        </TouchableNativeFeedback>
      )}

      <View style={{flex: 1, marginHorizontal: 10}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.textUserSignedIn}>welcome, {user.displayName}</Text>
      </View>

      {buttonRight && (
        <TouchableNativeFeedback
          onPress={buttonRight.onPress}
          background={TouchableNativeFeedback.Ripple('#ffffff26', false, 20)}>
          <View
            style={{
              ...styles.btnHeader,
              transform: [{rotate: buttonRight.iconFlip ? '180deg' : '0deg'}],
            }}>
            {buttonRight.image && (
              <View style={styles.imgContainer}>
                <Image
                  source={buttonRight.image}
                  style={styles.img}
                  resizeMethod="resize"
                />
              </View>
            )}
            {buttonRight.icon && (
              <Icon name={buttonRight.icon} color={'white'} size={30} />
            )}
          </View>
        </TouchableNativeFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 45 / 2,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 37,
    height: 37,
    borderRadius: 37 / 2,
  },
  textUserSignedIn: {
    color: 'white',
    fontStyle: 'italic',
    opacity: 0.75,
    fontSize: 12,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnHeader: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 0,
  },
});
