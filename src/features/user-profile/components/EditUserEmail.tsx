import {Alert, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {
  ButtonStyled,
  ModalComponent,
  ModalLoadingOverlay,
} from '../../../components';
import FormInput from '../../../components/FormInput';
import {useForm} from 'react-hook-form';
import {useUpdateEmail} from '../services/userProfileApi';
import {useAppSelector} from '../../../hooks';

type UserEmailType = {
  newEmail: string;
  currentPassword: string;
};

export default function EditUserEmail() {
  const storedUser = useAppSelector(state => state.auth.user);
  const {control, handleSubmit} = useForm<UserEmailType>();

  const [visibleEditEmail, setVisibleEditEmail] = useState(false);
  const closeModalEditProfile = () => setVisibleEditEmail(false);

  const {loading, updateEmail} = useUpdateEmail();

  const onUpdateEmail = (data: UserEmailType) => {
    Alert.alert(
      'Attention',
      'Verification link will be sent to your new email address and you will be signed out to manually re-authenticate with your new email. Continue?',
      [
        {text: 'Cancel'},
        {
          text: 'Continue',
          onPress: async () => {
            await updateEmail(data.newEmail, data.currentPassword);
          },
        },
      ],
    );
  };

  return (
    <View>
      <ButtonStyled
        onPress={() => setVisibleEditEmail(true)}
        title="Update Email"
        icon="email"
      />

      <ModalComponent
        visible={visibleEditEmail}
        iconLeft="email"
        title="Update Email"
        onRequestClose={closeModalEditProfile}
        childern={
          <View style={{marginTop: 20, marginBottom: 10}}>
            <FormInput
              control={control}
              fieldName="newEmail"
              fieldTitle="New Email"
              fieldIcon="gmail"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Your new email..."
              rules={{
                required: true,
                pattern: {
                  value: /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: 'Invalid format',
                },
                validate: newEmail =>
                  newEmail != storedUser.email || 'Use different email',
              }}
            />
            <FormInput
              control={control}
              secureTextEntry={true}
              fieldName="currentPassword"
              fieldTitle="Current Password"
              fieldIcon="lock-outline"
              autoCapitalize="none"
              placeholder="Your password..."
              rules={{required: true, minLength: 6}}
            />

            <ButtonStyled
              onPress={handleSubmit(onUpdateEmail)}
              style={{width: 120, alignSelf: 'center', marginTop: 10}}
              title="Update"
            />
          </View>
        }
      />
      <ModalLoadingOverlay visible={loading} onRequestClose={() => null} />
    </View>
  );
}

const styles = StyleSheet.create({});
