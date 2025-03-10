import {useEffect, useState} from 'react';
import {TaskType} from '..';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const user = auth().currentUser;
const collectionRef = firestore()
  .collection('tasks')
  .doc(user?.uid)
  .collection('userTasks');

export function useTaskSnapsot() {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    const unsubscribe = collectionRef
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (!snapshot) return setTasks([]);
        const userTasks: TaskType[] = snapshot.docs.map(doc => {
          return {id: doc.id, ...doc.data()} as TaskType;
        });
        setTasks(userTasks);
      });

    return () => unsubscribe();
  }, []);

  return tasks;
}

export function useCreateTask() {
  async function createTask(data: TaskType): Promise<any> {
    try {
      await collectionRef.add(data);
    } catch (error) {
      console.log('error creating task:', error);
      return Promise.reject(error);
    }
  }

  return {createTask};
}

export function useDeleteTask() {
  async function deleteTask(id: string) {
    try {
      await collectionRef.doc(id).delete();
    } catch (error) {
      console.log('error deleting task:', error);
    }
  }

  return {deleteTask};
}

export function useUpdateTask() {
  async function updateTask(data: TaskType) {
    try {
      await collectionRef.doc(data.id).update(data);
    } catch (error) {
      console.log('error updating task:', error);
    }
  }

  return {updateTask};
}
