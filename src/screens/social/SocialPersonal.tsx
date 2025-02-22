import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ButtonStyled, Gap, Header, SuchEmpty} from '../../components';
import {
  ProfileHeader,
  RenderPost,
  SocialPersonalScreenProps,
  useSocialPostsPersonal,
} from '../../features/social';

export default function SocialPersonal({
  navigation,
}: SocialPersonalScreenProps) {
  const posts = useSocialPostsPersonal();

  return (
    <View style={{flex: 1}}>
      <Header
        title="Your Post"
        buttonLeft={{icon: 'chevron-left', onPress: () => navigation.goBack()}}
      />

      {posts.length == 0 && <SuchEmpty />}

      <FlatList
        ListHeaderComponent={<ProfileHeader />}
        contentContainerStyle={styles.container}
        ListFooterComponent={<Gap height={90} />}
        data={posts}
        renderItem={({item}) => {
          return <RenderPost item={item} />;
        }}
      />

      <ButtonStyled
        onPress={() => navigation.navigate('PostCreate')}
        title="Create Post"
        icon="notebook-plus-outline"
        style={styles.btnFloating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  btnFloating: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    paddingHorizontal: 20,
  },
});
