import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomButton from '@/components/CustomButton'; // Adjust import if necessary

interface AddNoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ visible, onClose, onSave }) => {
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (note.trim()) {
      onSave(note.trim());
      setNote('');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>add a note</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter note here"
            value={note}
            onChangeText={setNote}
            multiline
          />
          <View style={styles.buttonContainer}>
            <CustomButton title="save" onPress={handleSave} />
            <CustomButton title="cancel" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth:2,
    borderColor:"white"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    fontFamily:'courier'
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color:"white",
    fontFamily:"courier"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default AddNoteModal;
