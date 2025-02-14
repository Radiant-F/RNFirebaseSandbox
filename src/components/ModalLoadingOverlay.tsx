import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ModalLoadingOverlay({
  visible = false,
  onRequestClose,
}: {
  visible: boolean;
  onRequestClose?: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Pressable style={styles.backdrop} />
        <View style={styles.box}>
          <ActivityIndicator color={'black'} size={'large'} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 120,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
  },
  backdrop: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'black',
    opacity: 0.5,
  },
});
