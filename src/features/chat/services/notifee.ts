import notifee, {EventType} from '@notifee/react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/type';
import {UserType} from '../../authentication';
import firestore from '@react-native-firebase/firestore';
import {localStorage} from '../../../utils';

export async function displayNotification(data: {
  sender_name: string;
  sender_uid: string;
  sender_pfp: string;
  message: string;
  chatId: string;
  sender_fcm: string;
}) {
  try {
    await notifee.displayNotification({
      title: data.sender_name,
      body: data.message,
      id: data.sender_fcm,
      data: {
        sender_uid: data.sender_uid,
        sender_name: data.sender_name,
        sender_pfp: data.sender_name,
        message: data.message,
        chatId: data.chatId,
        sender_fcm: data.sender_fcm,
      },
      android: {
        channelId: 'chat-message',
        showTimestamp: true,
        largeIcon: data.sender_pfp,
        circularLargeIcon: true,
        smallIcon: 'ic_notification',
        pressAction: {id: 'reply'},
        actions: [
          {
            title: 'Reply',
            pressAction: {id: 'reply'},
            input: {
              placeholder: 'Type a message...',
            },
          },
        ],
      },
    });
  } catch (error) {
    console.log('error displaying notification:', error);
  }
}

export async function sendMessage(text: string) {
  try {
    const currentChatScreen = localStorage.getString('current-chat-screen');
    if (!currentChatScreen)
      return Promise.reject('Current chat screen is not found');

    const {
      chatId,
      targetFcmToken,
      currentUid: senderUid,
      currentName: senderName,
      currentPfp: senderPfp,
    } = JSON.parse(currentChatScreen);

    const messageRef = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .doc();

    const chatRef = firestore().collection('chats').doc(chatId);
    const batch = firestore().batch();

    // use a Firestore batch to atomically write both the message and update the chat
    batch.set(messageRef, {
      senderId: senderUid,
      text: text,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    // update chat last message and mesage timestamp
    batch.update(chatRef, {
      lastMessage: text,
      lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
      lastMessageSender: senderName,
    });

    await batch.commit();

    const response = await fetch(
      'https://fcm-test-hinqq0hau-radiants-projects-c6f86e6f.vercel.app/send-fcm',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          device_token: targetFcmToken,
          data: {
            sender_name: senderName,
            sender_uid: senderUid,
            sender_pfp: senderPfp,
            message: text,
            chatId,
            sender_fcm: targetFcmToken,
          },
        }),
      },
    );
    const responseText = await response.text();
    console.log('localhost fcm sent from action press:', responseText);
  } catch (error) {
    console.log('notifee: error sending message from action press:', error);
  }
}

type RootNavigationType = NativeStackNavigationProp<RootStackParamList>;
export function listenToForegroundNotificationEvent(
  navigationRoot: RootNavigationType,
  currentUser: UserType,
) {
  console.log('listening...');
  return notifee.onForegroundEvent(({detail, type}) => {
    const notificationId = detail.notification?.android?.channelId;
    const pressActionId = detail.pressAction?.id;
    const notificationData = detail.notification
      ? detail.notification.data
      : null;

    switch (type) {
      case EventType.DELIVERED:
        if (notificationId == 'chat-message' && notificationData) {
          console.log('delivered:', notificationData);
          localStorage.set(
            'current-chat-screen',
            JSON.stringify({
              chatId: notificationData.chatId,
              targetFcmToken: notificationData.fcmToken,
              currentUid: currentUser.uid,
              currentName: currentUser.displayName,
              currentPfp: currentUser.photoURL,
            }),
          );
        }
        break;
      case EventType.ACTION_PRESS:
        if (notificationId == 'chat-message' && pressActionId == 'reply') {
          console.log('action press:', {
            sender_uid: currentUser.uid,
            sender_name: currentUser.displayName,
            sender_pfp: currentUser.photoURL,
            message: detail.input,
          });
          sendMessage(detail.input as string);
        }
        break;
      case EventType.PRESS:
        if (notificationId == 'chat-message' && navigationRoot) {
          console.log('press:', notificationData);
        }
        break;
      default:
        console.log('what the sigma');
        break;
    }
  });
}
