import {
  Button,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {TaskType} from '..';
import {useDeleteTask, useUpdateTask} from '../services/taskApi';
import CheckBox from '@react-native-community/checkbox';
import {Gap} from '../../../components';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RenderTaskType = {
  item: TaskType;
  onPressEdit: () => void;
  index: number;
};

export default function RenderTask({item, onPressEdit, index}: RenderTaskType) {
  const {updateTask} = useUpdateTask();
  const {deleteTask} = useDeleteTask();

  const [showDetail, setShowDetail] = useState(false);

  return (
    <Animatable.View
      style={styles.container}
      delay={index * 50}
      animation={'fadeInDown'}
      duration={500}
      useNativeDriver>
      <View style={styles.viewTask}>
        <TouchableNativeFeedback
          useForeground
          background={TouchableNativeFeedback.Ripple(
            '#ffffff40',
            false,
            35 / 2,
          )}
          onPress={() => updateTask({...item, completed: !item.completed})}>
          <View style={styles.btnCheckbox}>
            <CheckBox
              value={item.completed}
              disabled
              tintColors={{false: 'white', true: 'white'}}
            />
          </View>
        </TouchableNativeFeedback>
        <Text style={styles.textTitle}>{item.title}</Text>
        <TouchableNativeFeedback
          useForeground
          background={TouchableNativeFeedback.Ripple('#ffffff40', false)}
          onPress={() => setShowDetail(!showDetail)}>
          <Animatable.View
            style={styles.btnExpandTask}
            animation={{
              from: {transform: [{rotate: showDetail ? '0deg' : '-180deg'}]},
              to: {transform: [{rotate: showDetail ? '180deg' : '0deg'}]},
            }}
            duration={400}
            useNativeDriver>
            <Icon name="chevron-down" color={'white'} size={25} />
          </Animatable.View>
        </TouchableNativeFeedback>
      </View>
      {showDetail && (
        <Animatable.View animation={'fadeIn'} duration={250} useNativeDriver>
          <Text style={{color: 'white', marginVertical: 5}}>
            {item.description}
          </Text>
          <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
            <TouchableOpacity
              style={styles.btnOptionDelete}
              activeOpacity={0.5}
              onPress={() => deleteTask(item.id)}>
              <Icon name="trash-can" color={'white'} size={20} />
            </TouchableOpacity>
            <Gap width={10} />
            <TouchableOpacity
              style={styles.btnOptionEdit}
              activeOpacity={0.5}
              onPress={onPressEdit}>
              <Icon name="lead-pencil" color={'white'} size={20} />
              <Gap width={5} />
              <Text style={{color: 'white'}}>Edit</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      )}
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  btnOptionDelete: {
    width: 35,
    height: 35,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 35 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOptionEdit: {
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: 'white',
    height: 35,
    borderRadius: 35 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingRight: 15,
  },
  btnExpandTask: {
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45 / 2,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#00000080',
    overflow: 'hidden',
  },
  textTitle: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 10,
  },
  viewTask: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  container: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    margin: 20,
    padding: 15,
    marginVertical: 10,
    paddingLeft: 10,
  },
  btnCheckbox: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
