import {useRef, useState} from 'react';
import {FlatList, Text, View, ViewToken} from 'react-native';
import Video, {VideoRef} from 'react-native-video';

export default function Demo() {
  const [viewableItemIndex, setViewableItemIndex] = useState<number | null>(
    null,
  );

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0) {
        setViewableItemIndex(viewableItems[0].index);
      }
    },
  ).current;

  const videoRef = useRef<VideoRef>(null);

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={[...Array(10).keys()]}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
        }}
        renderItem={({index}) => {
          return (
            <View
              style={{
                backgroundColor:
                  viewableItemIndex === index ? 'dodgerblue' : 'aqua',
                // height: 300,
                margin: 20,
              }}>
              <Text style={{fontSize: 20}}>
                {viewableItemIndex === index ? 'Play' : 'Pause'}
              </Text>
              <Video
                ref={videoRef}
                source={require('../../assets/videos/m2-res_7202p.mp4')}
                style={{height: 300}}
                controls
                paused={viewableItemIndex !== index}
              />
            </View>
          );
        }}
      />
    </View>
  );
}
