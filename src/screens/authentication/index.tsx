import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import FormInput from '../../components/FormInput';
import {useForm} from 'react-hook-form';
import {ButtonStyled, Gap} from '../../components';
import {useState} from 'react';
import {
  useSignIn,
  useSignInAnonymous,
  useSignInGoogle,
  useSignUp,
} from '../../features/authentication';
import * as Animatable from 'react-native-animatable';
type FieldType = {email: string; password: string; name: string};

export default function Authentication() {
  const {control, handleSubmit} = useForm<FieldType>();

  const [authType, setAuthType] = useState<'Sign In' | 'Sign Up'>('Sign In');
  const switchAuthType = authType == 'Sign In' ? 'Sign Up' : 'Sign In';

  const {signIn, loading: loadingSignIn} = useSignIn();
  const {signUp, loading: loadingSignUp} = useSignUp();
  const {signInAnonymous, loading: loadingAnon} = useSignInAnonymous();
  const {signInGoogle, loading: loadingGoogle} = useSignInGoogle();

  const onAuthenticate = (data: FieldType) =>
    authType == 'Sign In' ? signIn(data) : signUp(data);

  const onSignInAnonymous = () => {
    Alert.alert(
      'Sign In Anonymously?',
      "Certain features won't be available and your account won't be stored once you signed out.",
      [
        {text: 'Cancel'},
        {
          text: 'Continue',
          onPress: () => signInAnonymous(),
        },
      ],
    );
  };

  const disableButton =
    loadingSignIn || loadingSignUp || loadingAnon || loadingGoogle;

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.viewContainer}>
          <Text style={styles.textTitle}>{authType}</Text>

          {authType == 'Sign Up' && (
            <Animatable.View
              animation={'fadeInUp'}
              duration={250}
              useNativeDriver>
              <FormInput
                control={control}
                fieldName="name"
                fieldTitle="Name"
                fieldIcon="account"
                autoCapitalize="words"
                placeholder="Your name..."
                rules={{required: true, minLength: 3}}
              />
            </Animatable.View>
          )}
          <FormInput
            control={control}
            fieldName="email"
            fieldTitle="Email"
            fieldIcon="gmail"
            autoCapitalize="none"
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
            fieldName="password"
            fieldTitle="Password"
            fieldIcon="lock"
            autoCapitalize="none"
            secureTextEntry
            placeholder="Your password..."
            rules={{required: true, minLength: 6}}
          />

          <Gap height={10} />

          <ButtonStyled
            onPress={handleSubmit(onAuthenticate)}
            title={authType}
            style={styles.btnAuth}
            loading={loadingSignIn || loadingSignUp}
            disabled={disableButton}
          />
          <Text style={styles.textOtherAuth}>or</Text>
          <View style={{flexDirection: 'row'}}>
            <ButtonStyled
              onPress={() => setAuthType(switchAuthType)}
              title={switchAuthType}
              icon="arrow-horizontal-lock"
              style={{flex: 1}}
            />
            <Gap width={10} />
            <ButtonStyled
              onPress={signInGoogle}
              style={{width: 50, height: 50}}
              icon="google"
              loading={loadingGoogle}
              disabled={disableButton}
            />
            <Gap width={10} />
            <ButtonStyled
              onPress={onSignInAnonymous}
              style={{width: 50, height: 50}}
              icon="incognito"
              loading={loadingAnon}
              disabled={disableButton}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textOtherAuth: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 5,
    marginTop: 0,
    fontStyle: 'italic',
    opacity: 0.75,
  },
  btnAuth: {
    alignSelf: 'center',
    width: '80%',
    maxWidth: 275,
  },
  textTitle: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  viewContainer: {
    paddingVertical: 70,
    maxWidth: 520,
    width: '85%',
    alignSelf: 'center',
  },
});
