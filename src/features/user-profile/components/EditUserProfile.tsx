import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {ButtonStyled, ModalComponent} from '../../../components';
import FormInput from '../../../components/FormInput';
import {useForm} from 'react-hook-form';
import {useAppSelector} from '../../../hooks';
import {useUpdateProfile} from '../services/userProfileApi';

type UserProfileType = {
  displayName: string;
};

export default function EditUserProfile() {
  const storedUser = useAppSelector(state => state.auth.user);
  const {control, handleSubmit} = useForm<UserProfileType>({
    defaultValues: {
      displayName: storedUser.displayName,
    },
  });

  const [visibleEditProfile, setVisibleEditProfile] = useState(false);
  const closeModalEditProfile = () => setVisibleEditProfile(false);

  const {updateProfile, loading} = useUpdateProfile();
  const onUpdateProfile = async (data: UserProfileType) => {
    await updateProfile(data);
    setVisibleEditProfile(false);
  };

  return (
    <View>
      <ButtonStyled
        onPress={() => setVisibleEditProfile(true)}
        title="Edit Profile"
        icon="account-edit-outline"
      />

      <ModalComponent
        visible={visibleEditProfile}
        iconLeft="account-edit"
        title="Edit Profile"
        onRequestClose={closeModalEditProfile}
        childern={
          <View style={{marginVertical: 20}}>
            <FormInput
              control={control}
              fieldName="displayName"
              fieldTitle="Name"
              fieldIcon="account"
              autoCapitalize="words"
              placeholder="Your name..."
              rules={{required: true, minLength: 3}}
            />
            <ButtonStyled
              loading={loading}
              onPress={handleSubmit(onUpdateProfile)}
              style={{width: 120, alignSelf: 'center'}}
              title="Edit"
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({});
