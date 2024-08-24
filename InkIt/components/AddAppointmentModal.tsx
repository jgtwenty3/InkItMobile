
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Button, SafeAreaView, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createAppointment } from '@/lib/appwrite'; // Ensure the correct path to your API function
import CustomButton from '@/components/CustomButton'; // Ensure the correct path to your CustomButton component
import { useGlobalContext } from '@/app/context/GlobalProvider';

const AddAppointmentModal = ({ visible, onClose }) => {
  const { user } = useGlobalContext();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddAppointment = async () => {
    if (!title || !startTime || !endTime) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const appointmentData = {
        title,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        creator: user.$id
      };

      setLoading(true);
      await createAppointment(appointmentData);
      onClose();
    } catch (error) {
      console.error('Failed to add appointment:', error);
      setError('Failed to add appointment');
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.label}>Type of Appointment:</Text>
          <TextInput
            style={styles.input}
            placeholder="Consultation, tattoo, etc."
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Start Time:</Text>
          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <Text style={styles.input}>{startTime.toLocaleString()}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) {
                  setStartTime(selectedDate);
                }
              }}
            />
          )}

          <Text style={styles.label}>End Time:</Text>
          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <Text style={styles.input}>{endTime.toLocaleString()}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) {
                  setEndTime(selectedDate);
                }
              }}
            />
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

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
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
    fontFamily: 'Courier',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    marginBottom: 10,
    padding: 5,
    color: 'white',
    fontFamily: 'Courier',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
});

export default AddAppointmentModal;
