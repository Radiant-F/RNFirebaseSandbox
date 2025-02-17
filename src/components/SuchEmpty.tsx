import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SuchEmpty() {
  return (
    <View style={styles.container}>
      <Icon
        name="weather-windy"
        color={'white'}
        size={50}
        style={{textAlign: 'center'}}
      />
      <Text style={styles.text}>Such empty!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
