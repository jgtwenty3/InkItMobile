
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
          <Text style={styles.label}>type of appointment:</Text>
          <TextInput
            style={styles.input}
            placeholder="consultation, tattoo, etc."
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>start time:</Text>
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

          <Text style={styles.label}>end time:</Text>
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
          <Text style={styles.label}>location:</Text>
          <TextInput
            style={styles.input}
            placeholder="shop name"
            placeholderTextColor="#aaa"
           
            onChangeText={setTitle}
          />
          <Text style={styles.label}>client:</Text>
          <TextInput
            style={styles.input}
            placeholder="client name"
            placeholderTextColor="#aaa"
            
            onChangeText={setTitle}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style = {styles.buttonContainer}>
          <CustomButton title="add appointment" onPress={handleAddAppointment} />
          <CustomButton  title="cancel" onPress={onClose}  />
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
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
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
