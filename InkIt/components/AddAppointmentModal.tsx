import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import DatePicker from 'react-native-date-picker'
import { createAppointment } from '@/lib/appwrite';
import CustomButton from '@/components/CustomButton';

const AddAppointmentModal = ({ visible, onClose }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleAddAppointment = async () => {
    try {
      const appointmentData = {
        title,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      };
      await createAppointment(appointmentData); // Ensure createAppointment is correctly imported
      onClose(); // Close the modal after successful creation
    } catch (error) {
      console.error('Failed to add appointment:', error);
    }
  };

  const showStartTimePicker = () => {
    setShowStartPicker(true);
  };

  const showEndTimePicker = () => {
    setShowEndPicker(true);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          

          
          <Text style={styles.label}>type of appointment:</Text>
          <TextInput
            style={styles.input}
            placeholder="consultation, tattoo, etc."
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
          />

          
          <Text style={styles.label}>start time:</Text>
          <TouchableOpacity onPress={showStartTimePicker}>
            <Text style={styles.timeText}>
              {startTime.toLocaleString()}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DatePicker
              value={startTime}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) {
                  setStartTime(selectedDate);
                }
              }}
            />
          )}

         
          <Text style={styles.label}>end time:</Text>
          <TouchableOpacity onPress={showEndTimePicker}>
            <Text style={styles.timeText}>
              {endTime.toLocaleString()}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) {
                  setEndTime(selectedDate);
                }
              }}
            />
          )}

          {/* Add Appointment Button */}
          <CustomButton title="Add Appointment" onPress={handleAddAppointment} />
          <Button title="Cancel" onPress={onClose} color="#aaa" />
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
    width: '90%', // Adjusted for a better fit
    maxWidth: 400, // Max width to avoid too large on wider screens
    backgroundColor: 'black', // Align with app background
    borderRadius: 10,
    padding: 20,
    borderWidth:2,
    borderColor:'white'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // Matching the app's color scheme
    marginBottom: 15,
    fontFamily: 'Courier', // Matching font family
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white', // Matching the app's color scheme
    fontFamily: 'Courier', // Matching font family
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#444', // Darker border color
    marginBottom: 10,
    padding: 5,
    color: 'white', // Matching the app's color scheme
    fontFamily: 'Courier', // Matching font family
  },
  timeText: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#444', // Darker border color
    borderRadius: 5,
    marginBottom: 10,
    color: 'white', // Matching the app's color scheme
    fontFamily: 'Courier', // Matching font family
  },
});

export default AddAppointmentModal;
