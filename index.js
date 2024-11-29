/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {displayNotification} from './src/features/chat/services/notifee';

notifee.onBackgroundEvent(async ({detail, type}) => {
  const notificationData = detail.notification.data;

  switch (type) {
    case EventType.DELIVERED:
      if (detail.notification.id == 'chat-message') {
        console.log('background delivered', notificationData);
      }
      break;
    case EventType.ACTION_PRESS:
      if (
        detail.notification.id == 'chat-message' &&
        detail.pressAction.id == 'reply'
      ) {
        console.log('background action press', {
          id: detail.notification.id,
          message: detail.input,
        });
      }
      break;
  }
});

async function onMessageRecieved(message) {
  try {
    if (message.data.notifee) {
      const parsedNotifee = JSON.parse(message.data.notifee);
      const data = parsedNotifee.data;
      if (parsedNotifee.id == 'chat-message') {
        displayNotification({
          sender_name: data.sender_name,
          sender_uid: data.sender_uid,
          sender_pfp: data.sender_pfp,
          message: data.message,
        });
      }
    }
  } catch (error) {
    console.log('Error FCM Notification:', error);
  }
}

messaging().onMessage(onMessageRecieved);
messaging().setBackgroundMessageHandler(onMessageRecieved);

AppRegistry.registerComponent(appName, () => App);
