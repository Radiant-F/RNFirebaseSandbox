import firestore from '@react-native-firebase/firestore';
import {UserType} from '../features/authentication';

export async function useGetCurrentUser(uid: string): Promise<UserType> {
  try {
    const userData = await firestore().collection('users').doc(uid).get();
    if (userData) return {...userData.data(), uid: userData.id} as UserType;
    else return Promise.reject(`user data is not available: ${userData}`);
  } catch (error) {
    return Promise.reject(error);
  }
}
