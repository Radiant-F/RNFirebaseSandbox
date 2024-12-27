import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Splash,
  Authentication,
  Home,
  UserProfile,
  Demo,
  Task,
  Social,
  SocialPersonal,
  PostCreate,
  PostUpdate,
  PostDetail,
  Chat,
  SearchUser,
  ContactList,
  ChatScreen,
} from '../screens';
import {RootStackParamList} from './type';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack({
  user,
}: {
  user: FirebaseAuthTypes.User | null;
}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: {backgroundColor: 'transparent'},
      }}
      // initialRouteName={'Demo'}
      initialRouteName={user ? 'Home' : 'Authentication'}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Demo" component={Demo} />

      <Stack.Screen name="Authentication" component={Authentication} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="Task" component={Task} />

      <Stack.Screen name="Social" component={Social} />
      <Stack.Group screenOptions={{animation: 'slide_from_right'}}>
        <Stack.Screen name="SocialPersonal" component={SocialPersonal} />
        <Stack.Screen name="PostCreate" component={PostCreate} />
        <Stack.Screen name="PostUpdate" component={PostUpdate} />
        <Stack.Screen name="PostDetail" component={PostDetail} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="SearchUser" component={SearchUser} />
        <Stack.Screen name="ContactList" component={ContactList} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
