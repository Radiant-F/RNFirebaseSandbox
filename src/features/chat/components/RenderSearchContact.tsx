import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {UserType} from '../../authentication';
import {ButtonStyled, Gap} from '../../../components';
import {useAppSelector, useTimeAgo} from '../../../hooks';
import {useAddContact} from '../services/chatApi';

type ComponentType = {
  item: UserType;
};

export default function RenderSearchContact({item}: ComponentType) {
  const storedUser = useAppSelector(state => state.auth.user);
  const {addContact, loading} = useAddContact();

  return (
    <View style={styles.viewContact}>
      <Image
        source={{uri: item.photo}}
        style={styles.viewImage}
        resizeMethod="resize"
      />
      <Gap width={10} />
      <View style={{flex: 1}}>
        <Text style={styles.textDisplayName}>{item.displayName}</Text>
        <Text style={{color: 'white'}}>
          Joined {useTimeAgo(new Date(item.createdAt))}
        </Text>
      </View>
      <Gap width={10} />
      <ButtonStyled
        onPress={async () => await addContact(item)}
        icon="plus-thick"
        style={{width: 50, height: 50}}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textDisplayName: {
    color: 'white',
    fontWeight: '500',
    fontSize: 17,
  },
  viewContact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff1a',
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  viewImage: {
    borderRadius: 60 / 2,
    width: 60,
    height: 60,
  },
});
