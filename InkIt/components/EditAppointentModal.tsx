import React, { useState } from 'react';
import { StyleSheet, Text, SafeAreaView, Modal, TextInput, TouchableOpacity, View } from 'react-native';
import CustomButton from '..//components/CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const EditAppointmentModal = ({ isVisible, onClose, appointment, onUpdate }) => {
  const [formData, setFormData] = useState({
    startTime: appointment.startTime || '',
    endTime: appointment.endTime || '',
    title: appointment.title || '',
    location: appointment.location || '',
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleUpdate = () => {
    onUpdate(formData);
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Edit Appointment</Text>
        <Text style={styles.title}>Title:</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />
        <Text style={styles.title}>Start Time:</Text>
        <TouchableOpacity onPress={() => setShowStartPicker(true)}>
          <Text style={styles.input}>{moment(formData.startTime).format('MMMM Do YYYY, h:mm A')}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={new Date(formData.startTime)}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) {
                setFormData({ ...formData, startTime: selectedDate.toISOString() });
              }
            }}
          />
        )}
        <Text style={styles.title}>End Time:</Text>
        <TouchableOpacity onPress={() => setShowEndPicker(true)}>
          <Text style={styles.input}>{moment(formData.endTime).format('MMMM Do YYYY, h:mm A')}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={new Date(formData.endTime)}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) {
                setFormData({ ...formData, endTime: selectedDate.toISOString() });
              }
            }}
          />
        )}
        <Text style={styles.title}>Location:</Text>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />
        <View style={styles.modalButtonContainer}>
          <CustomButton
            title="Update"
            onPress={handleUpdate}
            buttonStyle={styles.modalButton}
          />
          <CustomButton
            title="Cancel"
            onPress={onClose}
            buttonStyle={styles.modalButton}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default EditAppointmentModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'courier',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'courier',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: 'black',
  },
});
