import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../routes/type';

export type TaskType = {
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  description: string;
  id: string;
  title: string;
};

export type TaskScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Task'
>;

import {
  useTaskSnapsot,
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
} from './services/taskApi';
export {useTaskSnapsot, useCreateTask, useDeleteTask, useUpdateTask};

import RenderTask from './components/RenderTask';
export {RenderTask};
