import firestore from '@react-native-firebase/firestore';
import {UserType} from '../features/authentication';

export async function useSetUser(data: UserType): Promise<any> {
  try {
    await firestore().collection('users').doc(data.uid).set(data);
    return;
  } catch (error) {
    return Promise.reject(error);
  }
}
