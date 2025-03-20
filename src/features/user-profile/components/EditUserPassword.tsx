import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {ButtonStyled, ModalComponent} from '../../../components';
import FormInput from '../../../components/FormInput';
import {useForm} from 'react-hook-form';
import {useUpdatePassword} from '../services/userProfileApi';

type UserPasswordType = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export default function EditUserPassword() {
  const {control, handleSubmit, getValues} = useForm<UserPasswordType>();

  const [visibleEditPassword, setVisibleEditPassword] = useState(false);
  const closeModalEditProfile = () => setVisibleEditPassword(false);

  const {loading, updatePassword} = useUpdatePassword();
  const onUpdatePassword = async (data: UserPasswordType) => {
    await updatePassword(data.currentPassword, data.newPassword);
    setVisibleEditPassword(false);
  };

  return (
    <View>
      <ButtonStyled
        onPress={() => setVisibleEditPassword(true)}
        title="Change Password"
        icon="lock-outline"
      />

      <ModalComponent
        visible={visibleEditPassword}
        iconLeft="lock-reset"
        title="Update Password"
        onRequestClose={closeModalEditProfile}
        childern={
          <View style={{marginTop: 20}}>
            <FormInput
              control={control}
              secureTextEntry={true}
              fieldName="currentPassword"
              fieldTitle="Current Password"
              fieldIcon="lock-outline"
              autoCapitalize="words"
              placeholder="Current password..."
              rules={{required: true, minLength: 6}}
            />
            <FormInput
              control={control}
              secureTextEntry={true}
              fieldName="newPassword"
              fieldTitle="New Password"
              fieldIcon="lock-plus-outline"
              autoCapitalize="none"
              placeholder="New password..."
              rules={{required: true, minLength: 6}}
            />
            <FormInput
              control={control}
              secureTextEntry={true}
              fieldName="newPasswordConfirm"
              fieldTitle="Confirm New Password"
              fieldIcon="lock-plus-outline"
              autoCapitalize="none"
              placeholder="New password..."
              rules={{
                required: true,
                minLength: 6,
                validate: confirmNewPass =>
                  confirmNewPass == getValues('newPassword') ||
                  "Passwords don't match",
              }}
            />

            <ButtonStyled
              loading={loading}
              onPress={handleSubmit(onUpdatePassword)}
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
