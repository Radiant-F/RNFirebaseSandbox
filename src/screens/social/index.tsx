import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ButtonStyled, Gap, Header, SuchEmpty} from '../../components';
import {
  RenderPost,
  SocialScreenProps,
  useSocialPosts,
} from '../../features/social';
import {useAppSelector} from '../../hooks';

export default function Social({navigation}: SocialScreenProps) {
  const user = useAppSelector(state => state.auth.user);
  const posts = useSocialPosts();

  return (
    <View style={{flex: 1}}>
      {posts.length == 0 && <SuchEmpty />}

      <Header
        title="Social"
        buttonLeft={{icon: 'chevron-left', onPress: () => navigation.goBack()}}
        buttonRight={{
          onPress: () => navigation.navigate('SocialPersonal'),
          image: {uri: user.photoURL},
        }}
      />

      <FlatList
        contentContainerStyle={styles.container}
        ListFooterComponent={<Gap height={110} />}
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
  btnFloating: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
});
