import {
  Alert,
  Button,
  StyleSheet,
  View,
  AppState,
  AppStateStatus,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ButtonStyled,
  ModalComponent,
  ModalLoadingOverlay,
} from '../../../components';
import FormInput from '../../../components/FormInput';
import {useForm} from 'react-hook-form';
import {useUpdateEmail, useUpdatePassword} from '../services/userProfileApi';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import {useAppSelector} from '../../../hooks';

type UserEmailType = {
  newEmail: string;
  password: string;
};

export default function EditUserEmail() {
  const user = auth().currentUser;
  const storedUser = useAppSelector(state => state.auth.user);
  const {control, handleSubmit, watch, getValues} = useForm<UserEmailType>();
  const [password, setPassword] = useState('');
  const watchPassword = watch('password');

  useEffect(() => {
    console.log(watchPassword);
  }, [watchPassword]);

  const [visibleEditEmail, setVisibleEditEmail] = useState(false);
  const closeModalEditProfile = () => setVisibleEditEmail(false);

  const {loading, updateEmail} = useUpdateEmail();

  const onUpdateEmail = async (data: UserEmailType) => {
    await updateEmail(data.newEmail, data.password);
    setVisibleEditEmail(false);
  };

  async function onReauthenticate(password: string) {
    try {
      if (user && user.email != storedUser.email) {
        const credential = auth.EmailAuthProvider.credential(
          user.email!,
          password,
        );
        await user?.reauthenticateWithCredential(credential);
      }
    } catch (error) {
      console.log('error reauthenticating:', error);
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('focus', () =>
      onReauthenticate(password),
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{marginHorizontal: 20}}>
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
              }}
            />
            <FormInput
              control={control}
              secureTextEntry={true}
              fieldName="password"
              fieldTitle="Confirm Password"
              fieldIcon="lock-outline"
              autoCapitalize="none"
              placeholder="Your password..."
              rules={{required: true, minLength: 6}}
            />

            <ButtonStyled
              loading={loading}
              onPress={handleSubmit(onUpdateEmail)}
              style={{width: 120, alignSelf: 'center', marginTop: 10}}
              title="Update"
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({});
