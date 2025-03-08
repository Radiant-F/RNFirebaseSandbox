import notifee, {EventType} from '@notifee/react-native';
import {localStorage} from '../../../utils';
import {UserType} from '../../authentication';
import {sendMessage} from './notifee';

notifee.onBackgroundEvent(async ({detail, type}) => {
  const notificationId = detail.notification?.android?.channelId;
  const pressActionId = detail.pressAction?.id;
  const notificationData = detail.notification
    ? detail.notification.data
    : null;
  const currentUser = localStorage.getString('current-user');

  switch (type) {
    case EventType.DELIVERED:
      if (notificationId == 'chat-message' && notificationData && currentUser) {
        const parsedCurrentUser = JSON.parse(currentUser) as UserType;

        console.log('delivered:', notificationData);
        localStorage.set(
          'current-chat-screen',
          JSON.stringify({
            chatId: notificationData.chatId,
            targetFcmToken: notificationData.fcmToken,
            currentUid: parsedCurrentUser.uid,
            currentName: parsedCurrentUser.displayName,
            currentPfp: parsedCurrentUser.photoURL,
          }),
        );
      }
      break;
    case EventType.ACTION_PRESS:
      if (
        notificationId == 'chat-message' &&
        pressActionId == 'reply' &&
        currentUser
      ) {
        const parsedCurrentUser = JSON.parse(currentUser) as UserType;

        console.log('action press:', {
          sender_uid: parsedCurrentUser.uid,
          sender_name: parsedCurrentUser.displayName,
          sender_pfp: parsedCurrentUser.photoURL,
          message: detail.input,
        });
        sendMessage(detail.input as string);
      }
      break;
  }
});
