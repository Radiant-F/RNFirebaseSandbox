import {useEffect, useState} from 'react';
import {localStorage} from '../../../utils';
import {ModalBottomAction} from '../../../components';
import {
  useCompareFcmToken,
  useInitializeNotification,
} from '../services/chatApi';
import {useAppSelector, useUserSnapshot} from '../../../hooks';
import {Button} from 'react-native';
import {
  displayNotification,
  listenToForegroundNotificationEvent,
} from '../services/notifee';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/type';

export default function NotificationPermission() {
  const storedUser = useAppSelector(state => state.auth.user);
  const [visibleBottomAction, setVisibleBottomAction] = useState(false);
  const closeBottomAction = () => setVisibleBottomAction(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const hasInitPermission = localStorage.getBoolean(
    'init-permission-notification',
  );

  const {compareFcmToken} = useCompareFcmToken();

  useEffect(() => {
    if (!hasInitPermission) setVisibleBottomAction(true);
    else compareFcmToken();
  }, []);

  const {initializeNotification} = useInitializeNotification();
  async function onInitializeNotification() {
    await initializeNotification();
    closeBottomAction();
  }

  return (
    <>
      <Button
        title="listen to foreground notification"
        onPress={() =>
          listenToForegroundNotificationEvent(navigation, storedUser)
        }
      />
      <Button
        title="display notification"
        onPress={() =>
          displayNotification({
            message: 'hello koi?',
            sender_name: 'Yae',
            sender_uid: 'yaeUid123123123',
            sender_pfp:
              'https://firebasestorage.googleapis.com/v0/b/fauthdemo-4d043.appspot.com/o/users%2FK77sxHV9bUPZ0DPla2uajseYpd23%2Fpfp%2F1732587946581_1146768146876?alt=media&token=bb3e774c-3ee9-4395-9d1d-eed4764314e7',
          })
        }
      />
    </>
  );
  return (
    <ModalBottomAction
      onRequestClose={closeBottomAction}
      visible={visibleBottomAction}
      title="Do you want to recieve notification for incoming chat?"
      buttons={[
        {
          icon: 'bell-check-outline',
          title: 'Yes',
          onPress: () => onInitializeNotification(),
        },
        {
          icon: 'bell-cancel-outline',
          title: 'No',
          onPress: () => closeBottomAction(),
        },
      ]}
    />
  );
}
