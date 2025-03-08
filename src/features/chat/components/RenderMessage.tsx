import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useAppSelector} from '../../../hooks';
type RenderMessageType = {
  item: {
    createdAt: FirebaseFirestoreTypes.Timestamp;
    id: string;
    senderId: string;
    text: string;
  };
};
export default function RenderMessage({item}: RenderMessageType) {
  const storedUser = useAppSelector(state => state.auth.user);
  const isSender = storedUser.uid == item.senderId;

  const styleSender: ViewStyle = {
    alignSelf: storedUser.uid == item.senderId ? 'flex-end' : 'flex-start',
  };

  return (
    <View
      style={{
        ...styles.viewMessage,
        alignSelf: isSender ? 'flex-end' : 'flex-start',
      }}>
      <Text style={{color: 'black'}}>{item.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  viewMessage: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 39 / 2,
    margin: 5,
    marginVertical: 2.5,
    paddingHorizontal: 15,
    elevation: 3,
    maxWidth: '70%',
  },
});
