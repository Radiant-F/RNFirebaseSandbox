import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {
  RenderSearchContact,
  SearchUserScreenProps,
  useSearchUser,
} from '../../features/chat';
import {ButtonStyled, Gap, Header} from '../../components';
import {useForm} from 'react-hook-form';
import FormInput from '../../components/FormInput';
import {useTimeAgo} from '../../hooks';

export default function SearchUser({navigation}: SearchUserScreenProps) {
  const {control, handleSubmit} = useForm<{email: string}>();

  const {searchUser, users, loading} = useSearchUser();
  const onSearchUser = async (data: {email: string}) => {
    await searchUser(data.email.toLocaleLowerCase());
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title="Add Contact"
        buttonLeft={{icon: 'chevron-left', onPress: () => navigation.goBack()}}
      />

      <View style={styles.container}>
        <FormInput
          control={control}
          fieldName="email"
          fieldIcon="magnify"
          fieldTitle="Search User by Email"
          placeholder="Input email..."
          rules={{
            required: true,
            pattern: {
              value: /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
              message: 'Invalid format',
            },
          }}
        />

        <ButtonStyled
          onPress={handleSubmit(onSearchUser)}
          title="Search Contact"
          style={{alignSelf: 'center', width: '50%', paddingHorizontal: 25}}
        />

        <FlatList
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator color={'white'} style={{marginVertical: 20}} />
            ) : (
              <Text style={styles.textEmpty}>No contact found</Text>
            )
          }
          data={users}
          renderItem={({item}) => {
            return <RenderSearchContact item={item} />;
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  textEmpty: {
    color: 'grey',
    marginVertical: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
