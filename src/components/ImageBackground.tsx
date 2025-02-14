import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const screenDimensions = Dimensions.get('screen');

export default function ImageBackground({
  source = require('../assets/images/background.jpg'),
}: {
  source?: ImageSourcePropType | undefined;
}) {
  const [dimensions, setDimensions] = useState({
    width: screenDimensions.width,
    heigth: screenDimensions.height,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({screen}) => {
      setDimensions({width: screen.width, heigth: screen.height});
    });
    return () => subscription?.remove();
  });
  return (
    <View
      style={{
        ...styles.containerImg,
        width: dimensions.width,
        height: dimensions.heigth,
      }}>
      <Image
        source={source}
        resizeMethod="resize"
        blurRadius={20}
        fadeDuration={200}
        style={{
          opacity: 0.5,
          width: dimensions.width,
          height: dimensions.heigth,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerImg: {
    position: 'absolute',
    backgroundColor: 'black',
  },
});
