import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useUserSnapshot, useTimeAgo} from '../../hooks';
import {Gap, Header} from '../../components';
import {
  DeleteMe,
  EditUserEmail,
  EditUserPassword,
  EditUserProfile,
  ProfilePicture,
  UserProfileScreenProps,
} from '../../features/user-profile';

export default function UserProfile({navigation}: UserProfileScreenProps) {
  const user = useUserSnapshot();

  if (user)
    return (
      <View style={{flex: 1}}>
        <Header
          title="Profile"
          buttonLeft={{
            icon: 'chevron-left',
            onPress: () => navigation.goBack(),
          }}
        />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <ProfilePicture />

            <Gap width={15} />

            <View style={{flex: 1}}>
              <Text style={styles.textUsername} numberOfLines={2}>
                {user.displayName}
              </Text>
              <Text style={styles.textUserEmail}>{user.email}</Text>
              <Text style={styles.textUserEmail}>
                Joined {useTimeAgo(new Date(user.createdAt))}
              </Text>
              {/* {user.createdAt != user.updatedAt && (
                <Text style={styles.textUserEmail}>
                  Edited {useTimeAgo(new Date(user.updatedAt))}
                </Text>
              )} */}
            </View>
          </View>

          <Gap height={15} />

          <EditUserProfile />
          <Gap height={15} />
          <EditUserEmail />
          <Gap height={15} />
          <EditUserPassword />
          <View style={styles.viewDanger}>
            <View style={styles.line} />
            <Text style={styles.textDanger}>Danger</Text>
            <View style={styles.line} />
          </View>
          <DeleteMe />
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  viewDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  textDanger: {
    color: 'grey',
    textAlign: 'center',
    marginHorizontal: 20,
    fontStyle: 'italic',
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'grey',
  },
  container: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    padding: 20,
  },
  textUserEmail: {
    color: 'white',
    opacity: 0.5,
    fontStyle: 'italic',
  },
  textUsername: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
  },
});
