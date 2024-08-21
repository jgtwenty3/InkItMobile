
import React from 'react';
import { Modal, SafeAreaView, Text, TextInput, Button, StyleSheet, View } from 'react-native';

interface AppointmentEditModalProps {
  isVisible: boolean;
  onClose: () => void;
  appointmentData: {
    startTime: string;
    endTime: string;
    title: string;
    location: string;
  };
  onUpdate: (updatedData: {
    startTime: string;
    endTime: string;
    title: string;
    location: string;
  }) => void;
}

const AppointmentEditModal: React.FC<AppointmentEditModalProps> = ({
  isVisible,
  onClose,
  appointmentData,
  onUpdate,
}) => {
  const [formData, setFormData] = React.useState(appointmentData);

  const handleUpdate = () => {
    onUpdate(formData);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Edit Appointment</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Start Time"
          value={formData.startTime}
          onChangeText={(text) => setFormData({ ...formData, startTime: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="End Time"
          value={formData.endTime}
          onChangeText={(text) => setFormData({ ...formData, endTime: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />
        <View style={styles.buttonContainer}>
          <Button title="Update" onPress={handleUpdate} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default AppointmentEditModal;
