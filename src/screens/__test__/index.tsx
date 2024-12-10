import {Button, StyleSheet, Text, View} from 'react-native';
import {useRef} from 'react';
import Video, {VideoRef} from 'react-native-video';

export default function Demo() {
  const videoRef = useRef<VideoRef>(null);

  return (
    <View>
      <Text>Demo</Text>
      <Video
        ref={videoRef}
        source={require('../../assets/videos/La4hXBsBPm.mp4')}
        repeat
        style={{height: 100, width: '100%'}}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
