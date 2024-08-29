import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createAppointment, getUserClients } from '@/lib/appwrite'; // Ensure correct paths to your API functions
import CustomButton from '@/components/CustomButton'; // Ensure correct path to your CustomButton component
import { useGlobalContext } from '@/app/context/GlobalProvider';

const AddAppointmentModal = ({ visible, onClose,  }) => {
  const { user } = useGlobalContext();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [fetchingClients, setFetchingClients] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getUserClients(user.$id);
        setClients(clientsData);
        setFetchingClients(false);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        setFetchingClients(false);
        setError('Failed to fetch clients');
      }
    };

    if (user.$id) {
      fetchClients();
    }
  }, [user]);

  const handleAddAppointment = async () => {
    if (!title || !startTime || !endTime || !location || !selectedClient) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const appointmentData = {
        title,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location,
        client: selectedClient.$id, // Pass the selected client ID
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
            placeholder="Consultation, Tattoo, etc."
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

          <Text style={styles.label}>Location:</Text>
          <TextInput
            style={styles.input}
            placeholder="Shop Name"
            placeholderTextColor="#aaa"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Client:</Text>
          <TouchableOpacity onPress={() => setShowClientDropdown(!showClientDropdown)} style={styles.dropdown}>
            <Text style={styles.dropdownText}>{selectedClient ? selectedClient.fullName : 'Select a Client'}</Text>
          </TouchableOpacity>
          {showClientDropdown && (
            <FlatList
              data={clients}
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedClient(item); // Store the entire client object
                    setShowClientDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item.fullName}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}
          {loading && <ActivityIndicator size="small" color="#fff" />}
          <View style={styles.buttonContainer}>
            <CustomButton title="Add Appointment" onPress={handleAddAppointment} />
            <CustomButton title="Cancel" onPress={onClose} />
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
  dropdown: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    marginBottom: 10,
    padding: 5,
    color: 'white',
    fontFamily: 'Courier',
    backgroundColor: 'black',
  },
  dropdownText: {
    color: 'white',
    fontFamily: "Courier"
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: 'black',
    color:"black"
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
});

export default AddAppointmentModal;

