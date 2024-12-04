import {StyleSheet, Text, View} from 'react-native';
import {HomeScreenProps} from '../../routes/type';
import {useAppSelector} from '../../hooks';
import {ButtonStyled, Header} from '../../components';
import {useSignOut} from '../../features/authentication';
import * as Animatable from 'react-native-animatable';
import {defaultPfp} from '../../utils';

export default function Home({navigation}: HomeScreenProps) {
  const onSignOut = useSignOut().signOut;
  const user = useAppSelector(state => state.auth.user);

  const features = [
    {
      name: 'Task',
      icon: 'format-list-checks',
      onPress: () => navigation.navigate('Task'),
    },
    {
      name: 'Social',
      icon: 'earth',
      onPress: () => navigation.navigate('Social'),
    },
    {
      name: 'Chat',
      icon: 'chat-plus',
      onPress: () => navigation.navigate('Chat'),
    },
  ];

  if (user)
    return (
      <View>
        <Header
          title="Firebase Sandbox"
          buttonLeft={{
            icon: 'logout',
            iconFlip: true,
            onPress: () => onSignOut(),
          }}
          buttonRight={{
            onPress: () => navigation.navigate('UserProfile', user),
            image: {uri: user.photoURL ? user.photoURL : defaultPfp},
          }}
        />
        <Text style={styles.textGreet}>Checkout the available features!</Text>

        <View style={styles.container}>
          {features.map((v, i) => (
            <Animatable.View
              key={i}
              delay={i * 150}
              animation={'fadeInUp'}
              duration={400}>
              <ButtonStyled
                onPress={v.onPress}
                title={v.name}
                icon={v.icon}
                style={{marginVertical: 5}}
              />
            </Animatable.View>
          ))}

          <Animatable.Text
            style={styles.textGreet}
            delay={features.length * 300}
            animation={'fadeIn'}
            duration={400}>
            ... And many more to come!
          </Animatable.Text>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  textGreet: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
});
