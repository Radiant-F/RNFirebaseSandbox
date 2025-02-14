import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ButtonStyledType = {
  title?: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
  icon?: string;
  disabled?: boolean;
  fontSizeTitle?: number;
  iconSize?: number;
  textColor?: string;
};

export default function ButtonStyled({
  title,
  onPress,
  loading = false,
  style,
  icon,
  disabled,
  fontSizeTitle = 17,
  iconSize = 25,
  textColor = 'white',
}: ButtonStyledType) {
  return (
    <TouchableNativeFeedback
      useForeground
      background={TouchableNativeFeedback.Ripple('#ffffff26', false)}
      onPress={onPress}
      disabled={disabled}>
      <View style={{...styles.container, ...style}}>
        {loading ? (
          <ActivityIndicator color={'white'} size={'small'} />
        ) : (
          <>
            {icon && (
              <Icon
                name={icon}
                size={iconSize}
                color={disabled ? 'grey' : textColor ? textColor : 'white'}
              />
            )}
            {title && (
              <Text
                style={{
                  ...styles.title,
                  color: disabled ? 'grey' : textColor ? textColor : 'white',
                  fontSize: fontSizeTitle,
                  marginLeft: icon ? 5 : 0,
                  marginRight: 5,
                }}>
                {title}
              </Text>
            )}
          </>
        )}
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    borderRadius: 50 / 2,
    borderWidth: 4,
    borderColor: 'white',
    backgroundColor: '#00000080',
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
  },
});
