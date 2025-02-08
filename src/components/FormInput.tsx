import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardTypeOptions,
} from 'react-native';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useState} from 'react';

type FormInputTypes<T extends FieldValues> = {
  control: Control<T>;
  fieldName: Path<T>;
  fieldTitle?: string;
  fieldIcon?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
  inputType?: 'text' | 'picker';
  keyboardType?: KeyboardTypeOptions | undefined;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  multiline?: boolean;
  numberOfLines?: number;
};

export default function FormInput<T extends FieldValues>({
  control,
  fieldName,
  fieldIcon = 'ab-testing',
  fieldTitle = 'Title',
  placeholder = 'Placeholder...',
  rules,
  secureTextEntry,
  inputType = 'text',
  keyboardType,
  autoCapitalize,
  multiline = false,
  numberOfLines = 1,
}: FormInputTypes<T>) {
  const [password, setPassword] = useState(true);

  return (
    <Controller
      rules={rules}
      control={control}
      name={fieldName}
      render={({field: {onChange, value, onBlur}, fieldState: {error}}) => {
        const fieldErrorMessage = error
          ? error.message
            ? error.message
            : 'Required'
          : '';

        const multilineHeight = multiline ? (50 / 1.75) * numberOfLines : 50;

        return (
          <View style={styles.viewContainer}>
            <Text style={{color: 'white'}}>{fieldTitle}</Text>
            <View style={styles.viewInput}>
              <Icon name={fieldIcon} color={'white'} size={25} />
              {inputType == 'text' && (
                <>
                  <TextInput
                    onChangeText={onChange}
                    value={value}
                    onBlur={onBlur}
                    secureTextEntry={secureTextEntry && password}
                    placeholder={placeholder}
                    placeholderTextColor={'grey'}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    style={{...styles.textInput, height: multilineHeight}}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                  />
                  {secureTextEntry && (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => setPassword(!password)}
                      style={styles.viewBtnEye}>
                      <Icon
                        name={password ? 'eye-off' : 'eye'}
                        color={'white'}
                        size={25}
                      />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
            <Text style={styles.textError}>{fieldErrorMessage}</Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  viewBtnEye: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerLoading: {
    position: 'absolute',
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    right: 7,
    top: 10,
  },
  btnPickerRefresh: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 7,
    top: 10,
    elevation: 3,
  },
  textError: {
    color: 'tomato',
    textAlign: 'right',
  },
  textInput: {
    flex: 1,
    color: 'white',
    minHeight: 50,
    maxHeight: 75,
  },
  viewInput: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  viewContainer: {},
});
