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

  if (false) {
    return (
      <>
        <Button
          title="listen to foreground notification"
          onPress={() =>
            listenToForegroundNotificationEvent(navigation, storedUser)
          }
        />
      </>
    );
  } else
    return (
      <ModalBottomAction
        onRequestClose={closeBottomAction}
        visible={visibleBottomAction}
        title="Do you want to recieve notification for incoming chat? This is a Work in Progress feature."
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
