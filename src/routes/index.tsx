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
} from '../screens';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: {backgroundColor: 'transparent'},
        statusBarTranslucent: true,
        statusBarColor: 'transparent',
        statusBarStyle: 'light',
      }}
      initialRouteName="Splash">
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Authentication" component={Authentication} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="Demo" component={Demo} />
      <Stack.Screen name="Task" component={Task} />

      <Stack.Screen name="Social" component={Social} />
      <Stack.Group screenOptions={{animation: 'slide_from_right'}}>
        <Stack.Screen name="SocialPersonal" component={SocialPersonal} />
        <Stack.Screen name="PostCreate" component={PostCreate} />
        <Stack.Screen name="PostUpdate" component={PostUpdate} />
        <Stack.Screen name="PostDetail" component={PostDetail} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
