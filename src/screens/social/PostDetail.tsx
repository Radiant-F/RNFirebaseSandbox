import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Header} from '../../components';
import {PostDetailScreenProps, RenderPostDetail} from '../../features/social';

export default function PostDetail({navigation, route}: PostDetailScreenProps) {
  const post = route.params;
  return (
    <View style={{flex: 1}}>
      <Header
        title={`Post from ${post.creator.displayName}`}
        buttonLeft={{icon: 'chevron-left', onPress: () => navigation.goBack()}}
      />
      <RenderPostDetail item={post} />
    </View>
  );
}

const styles = StyleSheet.create({});
