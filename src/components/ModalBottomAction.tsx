import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import React from 'react';
import Gap from './Gap';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ModalBottomActionType = {
  visible?: boolean;
  onRequestClose?: () => void;
  buttons?: {
    title: string;
    icon: string;
    onPress?: () => void;
    danger?: boolean;
  }[];
  title?: string;
};

export default function ModalBottomAction({
  visible,
  onRequestClose,
  buttons = [
    {
      title: 'Button one',
      icon: 'ab-testing',
      onPress: () => null,
      danger: false,
    },
  ],
  title,
}: ModalBottomActionType) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}>
      <Pressable style={styles.modalBackdrop} onPress={onRequestClose} />
      <Gap flex={1} />
      <Animatable.View
        style={styles.viewOption}
        animation={'slideInUp'}
        duration={250}
        useNativeDriver>
        {title && <Text style={styles.textTitle}>{title}</Text>}

        {buttons.map((v, i) => {
          return (
            <View key={i}>
              <TouchableNativeFeedback
                useForeground
                background={TouchableNativeFeedback.Ripple('#ffffff40', false)}
                onPress={v.onPress}>
                <View style={styles.btnOption}>
                  <Icon
                    name={v.icon}
                    size={20}
                    color={v.danger ? 'tomato' : 'white'}
                  />
                  <Gap width={10} />
                  <Text style={{color: v.danger ? 'tomato' : 'white'}}>
                    {v.title}
                  </Text>
                </View>
              </TouchableNativeFeedback>
              {buttons.length > 1 && <View style={styles.viewLine} />}
            </View>
          );
        })}
      </Animatable.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  textTitle: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
    marginTop: 15,
    marginHorizontal: 25,
  },
  viewLine: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
    alignSelf: 'center',
    width: '50%',
  },
  btnOption: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 20,
  },
  viewOption: {
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 3,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.5,
  },
});
