import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  ButtonStyled,
  Gap,
  Header,
  ModalComponent,
  SuchEmpty,
} from '../../components';
import {
  RenderTask,
  TaskScreenProps,
  TaskType,
  useCreateTask,
  useTaskSnapsot,
  useUpdateTask,
} from '../../features/task';
import FormInput from '../../components/FormInput';
import {useForm} from 'react-hook-form';

const defaultValues = {
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  description: '',
  title: '',
};

export default function Task({navigation}: TaskScreenProps) {
  const tasks = useTaskSnapsot();
  const {control, handleSubmit, reset} = useForm<TaskType>({
    defaultValues,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [isModalForCreate, setIsModalForCreate] = useState(true);
  const closeModal = () => setModalVisible(false);

  const {updateTask} = useUpdateTask();
  const {createTask} = useCreateTask();
  const onWriteTask = async (data: TaskType) => {
    isModalForCreate ? await createTask(data) : updateTask(data);
    setModalVisible(false);
  };

  return (
    <View style={{flex: 1}}>
      {tasks.length == 0 && <SuchEmpty />}

      <FlatList
        ListHeaderComponent={
          <Header
            title="Task"
            buttonLeft={{
              icon: 'chevron-left',
              onPress: () => navigation.goBack(),
            }}
          />
        }
        stickyHeaderHiddenOnScroll
        stickyHeaderIndices={[0]}
        ListFooterComponent={<Gap height={70} />}
        contentContainerStyle={styles.container}
        data={tasks}
        renderItem={({item, index}) => {
          return (
            <RenderTask
              index={index}
              item={item}
              onPressEdit={() => {
                reset(item);
                setModalVisible(true);
                setIsModalForCreate(false);
              }}
            />
          );
        }}
      />
      <ButtonStyled
        onPress={() => {
          reset(defaultValues);
          setIsModalForCreate(true);
          setModalVisible(true);
        }}
        title="Create Task"
        icon="notebook-plus-outline"
        style={styles.btnFloating}
      />

      <ModalComponent
        visible={modalVisible}
        iconLeft={
          isModalForCreate ? 'notebook-plus-outline' : 'notebook-edit-outline'
        }
        title={`${isModalForCreate ? 'Create' : 'Update'} Task`}
        onRequestClose={closeModal}
        childern={
          <View>
            <Gap height={20} />
            <FormInput
              control={control}
              fieldName="title"
              fieldIcon="text"
              fieldTitle="Title"
              placeholder="Your task title..."
              rules={{required: true, minLength: 3}}
            />
            <FormInput
              control={control}
              fieldName="description"
              fieldIcon="text-long"
              fieldTitle="Description"
              placeholder="Your task description..."
              rules={{required: true, minLength: 3}}
            />
            <ButtonStyled
              title={`${isModalForCreate ? 'Create' : 'Update'}`}
              onPress={handleSubmit(onWriteTask)}
              style={styles.btnAdd}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btnAdd: {
    alignSelf: 'center',
    paddingHorizontal: 25,
    width: 120,
  },
  btnFloating: {
    position: 'absolute',
    bottom: 35,
    right: 25,
    paddingHorizontal: 20,
  },
  textEmpty: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
    opacity: 0.5,
    fontStyle: 'italic',
  },
  container: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
});
