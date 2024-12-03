/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {displayNotification} from './src/features/chat/services/notifee';
import './src/features/chat/services/notifeeOnBackgroundEvent';

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
          chatId: data.chatId,
          sender_fcm: data.sender_fcm,
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
