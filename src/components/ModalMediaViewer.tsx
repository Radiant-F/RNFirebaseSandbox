import {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Modal,
  PanResponder,
  StyleProp,
  ViewStyle,
} from 'react-native';

const {height} = Dimensions.get('screen');

type ModalViewType = {
  onCloseModal: () => void;
  mediaSource: string;
};

export default function ModalMediaViewer({
  onCloseModal,
  mediaSource,
}: ModalViewType) {
  const animation = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      setExpanded(true);
    }, 10);
  }, []);

  const onRequestClose = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        150,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
      () => {
        onCloseModal();
      },
    );
    setExpanded(false);
  };

  const reset = (closeModal?: boolean, down?: boolean) => {
    Animated.spring(animation, {
      toValue: {x: 0, y: closeModal ? height * (down ? 1 : -1) : 0},
      bounciness: 0,
      useNativeDriver: true,
    }).start();
    if (closeModal) {
      setTimeout(() => {
        onCloseModal();
      }, 200);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: Animated.event([null, {dy: animation.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, g) => {
        if (Math.abs(g.vy) > 2) {
          reset(true, g.vy > 0);
          return;
        }
        reset();
      },
      onPanResponderTerminate: () => {
        reset();
      },
    }),
  ).current;

  const imageStyles: StyleProp<ViewStyle> = {
    height: '100%',
    width: '100%',
    alignItems: expanded ? 'center' : undefined,
    transform: animation.getTranslateTransform(),
  };

  return (
    <Modal
      visible={true}
      onRequestClose={onRequestClose}
      transparent
      animationType="fade">
      <View style={styles.modalBackdrop} />
      <Animated.View style={imageStyles} {...panResponder.panHandlers}>
        <Image
          source={{uri: mediaSource}}
          resizeMode="contain"
          resizeMethod="resize"
          style={{height: '100%', width: '100%'}}
        />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.5,
  },
});
