import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  ButtonStyled,
  ModalComponent,
  ModalLoadingOverlay,
} from '../../../components';
import {useDeleteMe} from '../services/userProfileApi';
import FormInput from '../../../components/FormInput';
import {useForm} from 'react-hook-form';

type DeleteMeType = {
  email: string;
  password: string;
};

export default function DeleteMe() {
  const {control, handleSubmit} = useForm<DeleteMeType>();

  const [visibleReauth, setVisibleReauth] = useState<boolean>(false);
  const closeVisibleReauth = () => setVisibleReauth(false);

  const {deleteMe, loading} = useDeleteMe();
  function onDeleteMe() {
    Alert.alert(
      'Caution',
      'This action is irreversible. Do you wish to proceed?',
      [
        {
          text: 'Proceed ...',
          style: 'destructive',
          onPress: () => setVisibleReauth(true),
        },
        {text: 'Cancel'},
      ],
    );
  }

  return (
    <View style={{flex: 1}}>
      <ButtonStyled
        onPress={() => onDeleteMe()}
        title="Delete Me"
        icon="account-alert-outline"
        textColor="tomato"
      />

      <ModalComponent
        visible={visibleReauth}
        iconLeft="account-remove-outline"
        title="Account Deletion"
        onRequestClose={closeVisibleReauth}
        childern={
          <View style={{marginTop: 20, marginBottom: 10}}>
            <FormInput
              control={control}
              fieldName="email"
              fieldTitle="Current Email"
              fieldIcon="gmail"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Your email..."
              rules={{
                required: true,
                pattern: {
                  value: /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: 'Invalid format',
                },
              }}
            />
            <FormInput
              control={control}
              secureTextEntry={true}
              fieldName="password"
              fieldTitle="Current Password"
              fieldIcon="lock-outline"
              autoCapitalize="none"
              placeholder="Your password..."
              rules={{required: true, minLength: 6}}
            />

            <ButtonStyled
              onPress={handleSubmit(credential => deleteMe(credential))}
              style={{width: 120, alignSelf: 'center', marginTop: 10}}
              title="Delete"
              textColor="tomato"
            />
          </View>
        }
      />

      <ModalLoadingOverlay visible={loading} onRequestClose={() => null} />
    </View>
  );
}

const styles = StyleSheet.create({});
