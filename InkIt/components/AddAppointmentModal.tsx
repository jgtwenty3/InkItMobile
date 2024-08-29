import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createAppointment, getUserClients, createClient } from '@/lib/appwrite'; // Ensure correct paths to your API functions
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
  const [notes, setNotes] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [fetchingClients, setFetchingClients] = useState(true);
  const [addingNewClient, setAddingNewClient] = useState(false);

  const [showAddClientModal, setShowAddClientModal] = useState(false);

  const [newClientDetails, setNewClientDetails] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    city: '',
    state: '',
    country: '',
    waiverSigned: false,
    notes: [],
  });

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
        notes,
        client: selectedClient.$id,
         // Pass the selected client ID
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
  const handleAddNewClient = async () => {
    const { fullName, email, phoneNumber, city, state, country } = newClientDetails;

    if (!fullName || !email || !phoneNumber || !city || !state || !country) {
      setError('Please fill in all client fields');
      return;
    }

    try {
      setLoading(true);
      const newClient = await createClient(newClientDetails);
      setClients([...clients, newClient]); // Add new client to the list
      setSelectedClient(newClient); // Automatically select the new client
      setAddingNewClient(false); // Close the new client form
    } catch (error) {
      console.error('Failed to add new client:', error);
      setError('Failed to add new client');
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
                    setSelectedClient(item);
                    setShowClientDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item.fullName}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          <TouchableOpacity
            onPress={() => setAddingNewClient(!addingNewClient)}
            style={styles.addNewClientButton}
          >
            <Text style={styles.addNewClientText}>+ new client</Text>
          </TouchableOpacity>

          {addingNewClient && (
            <View style={styles.newClientForm}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                value={newClientDetails.fullName}
                onChangeText={(text) => setNewClientDetails({ ...newClientDetails, fullName: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={newClientDetails.email}
                onChangeText={(text) => setNewClientDetails({ ...newClientDetails, email: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#aaa"
                value={newClientDetails.phoneNumber}
                onChangeText={(text) => setNewClientDetails({ ...newClientDetails, phoneNumber: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#aaa"
                value={newClientDetails.city}
                onChangeText={(text) => setNewClientDetails({ ...newClientDetails, city: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor="#aaa"
                value={newClientDetails.state}
                onChangeText={(text) => setNewClientDetails({ ...newClientDetails, state: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Country"
                placeholderTextColor="#aaa"
                value={newClientDetails.country}
                onChangeText={(text) => setNewClientDetails({ ...newClientDetails, country: text })}
              />
              <TouchableOpacity onPress={handleAddNewClient} style={styles.saveClientButton}>
                <Text style={styles.saveClientText}>Save Client</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>Notes:</Text>
          <TextInput
            style={styles.input}
            placeholder="Notes"
            placeholderTextColor="#aaa"
            value={newClientDetails.notes.join(', ')}
            onChangeText={(text) => setNewClientDetails({ ...newClientDetails, notes: [text] })}
          />

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
  addNewClientButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  addNewClientText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily:"courier"
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    marginBottom: 10,
    padding: 5,
    color: 'white',
    fontFamily: 'Courier',
  },
  saveClientButton: {
    backgroundColor: 'black',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    borderColor:"white",
    borderWidth:2
  },
  saveClientText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily:"courier"
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

