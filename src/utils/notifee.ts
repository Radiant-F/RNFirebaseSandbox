import notifee, {AuthorizationStatus} from '@notifee/react-native';
import {Alert, Linking} from 'react-native';

export async function notificationRequest() {
  try {
    const settings = await notifee.requestPermission();
    switch (settings.authorizationStatus) {
      case AuthorizationStatus.DENIED:
        console.log('notifee: notification denied');
        Alert.alert(
          'Notification Denied',
          'If you changed your mind, go to app settings to enable notification manually.',
          [
            {
              text: 'Open App Settings',
              onPress: async () => await Linking.openSettings(),
            },
            {text: 'Ok'},
          ],
        );
        break;
      case AuthorizationStatus.AUTHORIZED:
        console.log('notifee: notification authorized');
        break;
      case AuthorizationStatus.PROVISIONAL:
        console.log('notifee: provisional notification');
        break;
      default:
        console.log('notifee: permission retrieve something else:', settings);
        break;
    }
  } catch (error) {
    console.log('notifee: error requesting notification:', error);
  }
}

export async function notificationCreateChannel(id: string, name: string) {
  try {
    await notifee.createChannel({id, name});
    console.log('notifee: channel created');
  } catch (error) {
    console.log('notifee: error creating message channel:', error);
  }
}
