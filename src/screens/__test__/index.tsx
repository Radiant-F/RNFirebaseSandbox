import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useRef, useState, useMemo} from 'react';
import Video, {VideoRef} from 'react-native-video';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useFormatTime from '../../hooks/useFormatTime';

type ControlsType = {
  currentTime: number;
  playableDuration: number;
};

export default function Demo() {
  const videoRef = useRef<VideoRef>(null);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [controls, setControls] = useState<ControlsType>({
    currentTime: 0,
    playableDuration: 0,
  });
  const formattedTime = useFormatTime(
    Number(controls.currentTime.toFixed(0)) * 1000,
  );
  const [paused, setPaused] = useState<boolean>(true);
  const [muted, setMuted] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState(false);

  const marginLeft: any =
    (100 / controls.playableDuration) * controls.currentTime - 100 + '%';

  return (
    <ScrollView
      contentContainerStyle={{marginVertical: 30, marginHorizontal: 20}}>
      <View style={styles.containerVideo}>
        <Text style={styles.title}>Video 1</Text>
        <Pressable
          onPress={() => setShowControls(!showControls)}
          style={{height: 300}}>
          <Video
            ref={videoRef}
            source={require('../../assets/videos/jeek_mgQeV.mp4')}
            onEnd={() => {
              setShowControls(true);
              setPaused(true);
            }}
            currentPlaybackTime={1.001}
            style={styles.video}
            controls={false}
            paused={paused}
            onProgress={event => {
              setControls({
                currentTime: event.currentTime,
                playableDuration: event.playableDuration,
              });
            }}
            muted={muted}
            fullscreen={fullscreen}
            onFullscreenPlayerDidDismiss={() => setFullscreen(false)}
          />
        </Pressable>
        {showControls && (
          <Pressable
            // animation={showControls ? 'fadeIn' : 'fadeOut'}
            // useNativeDriver
            // duration={200}
            style={styles.containerControls}
            onPress={() => setShowControls(!showControls)}>
            <TouchableOpacity
              style={styles.btnPlay}
              activeOpacity={0.75}
              onPress={() => {
                setPaused(paused => {
                  const hideControls = setTimeout(
                    () => setShowControls(false),
                    1000,
                  );
                  if (showControls && !paused) clearTimeout(hideControls);
                  return !paused;
                });
              }}>
              <Icon
                name={paused ? 'play' : 'pause'}
                color={'white'}
                size={35}
                style={{textAlign: 'center'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFullscreen(true)}
              style={styles.btnToggleFullscreen}>
              <Icon
                name={'fullscreen'}
                size={25}
                color={'white'}
                style={{textAlign: 'center'}}
              />
            </TouchableOpacity>
            <View style={styles.viewBottomControl}>
              <Text style={styles.textDuration}>{formattedTime}</Text>
              <View style={styles.containerSeek}>
                <View style={[styles.seekCurrent, {marginLeft}]} />
              </View>
              <TouchableOpacity
                onPress={() => setMuted(!muted)}
                style={styles.btnToggleVolume}>
                <Icon
                  name={muted ? 'volume-variant-off' : 'volume-high'}
                  size={20}
                  color={'white'}
                  style={{textAlign: 'center'}}
                />
              </TouchableOpacity>
            </View>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  btnToggleFullscreen: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  btnToggleVolume: {
    width: 25,
    height: 25,
    justifyContent: 'center',
  },
  textDuration: {
    color: 'white',
    minWidth: 20,
    textAlign: 'center',
  },
  seekCurrent: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  containerSeek: {
    height: 5,
    flex: 1,
    backgroundColor: '#00000040',
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
  viewBottomControl: {
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  btnPlay: {
    width: 55,
    height: 55,
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 55 / 2,
    justifyContent: 'center',
  },
  containerControls: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#00000040',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  video: {
    height: '100%',
    width: '100%',
    // overflow: 'hidden',
  },
  containerVideo: {
    // height: 300,
    // margin: 20,
    backgroundColor: 'dodgerblue',
  },
});
