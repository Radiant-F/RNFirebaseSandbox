import {
  Animated,
  Dimensions,
  Image,
  ImageStyle,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  ViewStyle,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {ModalMediaViewer} from '../../../components';
import Video, {VideoRef} from 'react-native-video';

export default function RenderPostMedia({
  mediaSource,
  margin = 20,
  mediaHeight = 250,
}: {
  mediaSource: {url: string; fileType: string}[];
  margin?: number;
  mediaHeight?: number;
}) {
  // video handler
  const videoRef = useRef<VideoRef>(null);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);

  const mediaLength = mediaSource.length;
  const [visibleModalMedia, setVisibleModalMedia] = useState<string>('');
  const onShowMedia = useCallback((url: string) => {
    setVisibleModalMedia(url);
  }, []);

  // swipe snap animation for multiple media
  const [windowWidth, setWindowWidth] = useState<number>(
    Dimensions.get('window').width,
  );
  Dimensions.addEventListener('change', ({window}) => {
    setWindowWidth(window.width);
  });
  const scrollValue = useRef(new Animated.Value(0)).current;
  function RenderActiveIndicator() {
    const windowWidthLimit = windowWidth > 520 ? 520 : windowWidth;
    const translateX = scrollValue.interpolate({
      inputRange: [0, windowWidthLimit],
      outputRange: [0, 20],
    });
    const inputRange = [0];
    const scaleOutputRange = [1];
    mediaSource.forEach(
      (_, i) =>
        i != 0 &&
        inputRange.push(
          ...[(windowWidthLimit * (2 * i - 1)) / 2, windowWidthLimit * i],
        ),
    );
    mediaSource.forEach((_, i) => i != 0 && scaleOutputRange.push(...[3, 1]));
    const scaleX = scrollValue.interpolate({
      inputRange,
      outputRange: scaleOutputRange,
    });

    return (
      <View style={styles.containerIndicator} pointerEvents="none">
        {mediaSource.map((v, i) => (
          <View key={i} style={styles.indicator} />
        ))}
        <Animated.View
          style={[
            styles.indicatorActive,
            {position: 'absolute', transform: [{translateX}, {scaleX}]},
          ]}
        />
      </View>
    );
  }
  const styleViewImage: ViewStyle = {
    marginHorizontal: margin,
    width: windowWidth - margin * 2,
    maxWidth: 520 - margin * 2,
    borderRadius: 20,
    overflow: 'hidden',
  };

  return (
    <View style={{...styles.container, marginVertical: margin}}>
      {mediaLength == 1 && (
        <TouchableNativeFeedback
          onPress={() =>
            mediaSource[0].fileType.includes('image') &&
            onShowMedia(mediaSource[0].url)
          }>
          <View>
            {mediaSource[0].fileType.includes('image') && (
              <Image
                resizeMethod="resize"
                source={{uri: mediaSource[0].url}}
                style={{height: mediaHeight, width: '100%'}}
              />
            )}
            {mediaSource[0].fileType.includes('video') && (
              <Video
                ref={videoRef}
                source={{uri: mediaSource[0].url}}
                style={{height: mediaHeight, width: '100%'}}
                controls={true}
                paused={true}
                resizeMode={isVideoFullscreen ? 'contain' : 'cover'}
                onFullscreenPlayerDidPresent={() => setIsVideoFullscreen(true)}
                onFullscreenPlayerDidDismiss={() => setIsVideoFullscreen(false)}
                controlsStyles={{
                  hideForward: true,
                  hideNext: true,
                  hidePrevious: true,
                  hideRewind: true,
                }}
              />
            )}
          </View>
        </TouchableNativeFeedback>
      )}

      {mediaLength > 1 && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            decelerationRate={'fast'}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollValue}}}],
              {useNativeDriver: false},
            )}>
            {mediaSource.map((v, i) => (
              <TouchableNativeFeedback
                key={i}
                onPress={() =>
                  v.fileType.includes('image') && onShowMedia(v.url)
                }>
                <View style={styleViewImage}>
                  {v.fileType.includes('image') && (
                    <Image
                      source={{uri: v.url}}
                      style={{height: mediaHeight, width: '100%'}}
                      resizeMethod="resize"
                    />
                  )}
                  {v.fileType.includes('video') && (
                    <Video
                      ref={videoRef}
                      source={{uri: v.url}}
                      style={{height: mediaHeight, width: '100%'}}
                      controls={true}
                      paused={true}
                      resizeMode={isVideoFullscreen ? 'contain' : 'cover'}
                      onFullscreenPlayerDidPresent={() =>
                        setIsVideoFullscreen(true)
                      }
                      onFullscreenPlayerDidDismiss={() =>
                        setIsVideoFullscreen(false)
                      }
                      controlsStyles={{
                        hideForward: true,
                        hideNext: true,
                        hidePrevious: true,
                        hideRewind: true,
                      }}
                    />
                  )}
                </View>
              </TouchableNativeFeedback>
            ))}
          </ScrollView>
          <RenderActiveIndicator />
        </>
      )}

      {visibleModalMedia && (
        <ModalMediaViewer
          mediaSource={visibleModalMedia}
          onCloseModal={() => setVisibleModalMedia('')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  indicatorActive: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#00000044',
    marginHorizontal: 5,
    borderColor: '#ffffff40',
    borderWidth: StyleSheet.hairlineWidth,
  },
  containerIndicator: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
  },
  container: {
    overflow: 'hidden',
    marginBottom: 0,
    marginTop: 0,
  },
});
