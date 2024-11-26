import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, Switch, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { getAppointmentById, updateAppointment, deleteAppointment, getUserClients } from '@/lib/appwrite';
import moment from 'moment';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import { formatDateString,  } from '@/utils/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import ReferenceImages from '@/components/ReferenceImages';

const AppointmentDetails = () => {
  const { user } = useGlobalContext();
  const route = useRoute();
  const { appointmentId } = route.params;
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [depositPaid, setDepositPaid] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    title: '',
    location: '',
    depositPaid: false,
    clientId: '',
    notes:[]
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
 

  const fetchAppointment = async () => {
    try {
      const fetchedAppointment = await getAppointmentById(appointmentId);
      setAppointment(fetchedAppointment);
      setDepositPaid(fetchedAppointment.depositPaid);
      setFormData({
        startTime: fetchedAppointment.startTime,
        endTime: fetchedAppointment.endTime,
        title: fetchedAppointment.title,
        location: fetchedAppointment.location || '',
        depositPaid: fetchedAppointment.depositPaid,
        clientId: fetchedAppointment.client?.id || '',
        notes:fetchedAppointment.notes || '',
      });
      console.log(fetchedAppointment.notes)
    } catch (err) {
      setError('Failed to fetch appointment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  

  const handleToggle = async () => {
    try {
      const updatedAppointment = await updateAppointment(appointmentId, { depositPaid: !depositPaid });
      setDepositPaid(updatedAppointment.depositPaid);
      fetchAppointment(); // Refresh data after update
    } catch (err) {
      setError('Failed to update deposit status');
    }
  };

  const handleEdit = () => {
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      console.log('Updating with formData:', formData);
      const updatedAppointment = await updateAppointment(appointmentId, formData);
      console.log('Updated Appointment:', updatedAppointment);
  
    
  
      setAppointment(updatedAppointment);
      setIsModalVisible(false);
  
      // Fetch the updated appointment to ensure the client's name is updated
      const fetchedAppointment = await getAppointmentById(appointmentId);
      console.log('Fetched Updated Appointment:', fetchedAppointment);
  
      setAppointment(fetchedAppointment);
  
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError('Failed to update appointment');
    }
  };
  

  const handleDelete = async () => {
    try {
      await deleteAppointment(appointmentId);
      router.push('/calendar');
    } catch (err) {
      setError('Failed to delete appointment');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const formattedStartTime = formatDateString(appointment.startTime);
  const formattedEndTime = formatDateString(appointment.endTime);



  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{appointment.title}</Text>
      <Text style={styles.time}>
        {formattedStartTime} - {formattedEndTime}
      </Text>
      <Text style={styles.location}>location: {appointment.location}</Text>
      <Text style={styles.client}>client: {appointment.client?.fullName || 'Unknown'}</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>deposit paid: {depositPaid ? 'Yes' : 'No'}</Text>
        <Switch
          value={depositPaid}
          onValueChange={handleToggle}
          thumbColor={depositPaid ? 'black' : 'white'}
          trackColor={{ false: 'black', true: 'white' }}
        />
        
      </View>
      <View style={styles.notesContainer}>
        <Text style={styles.notesTitle}>Notes:</Text>
        {appointment.notes.length > 0 ? (
          appointment.notes.map((note: string, index) => (
            <Text key={index} style={styles.noteItem}>{note}</Text>
          ))
        ) : (
          <Text style={styles.noNotes}>No notes available</Text>
        )}
      </View>

      <ReferenceImages appointmentId={appointmentId} />

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Edit"
          onPress={handleEdit}
          buttonStyle={[styles.button, styles.editButton]}
        />
        <CustomButton
          title="Delete"
          onPress={handleDelete}
          buttonStyle={[styles.button, styles.deleteButton]}
        />
        <CustomButton
          title="Cancel"
          onPress={() => router.push('/calendar')}
          buttonStyle={[styles.button, styles.cancelButton]}
        />
      </View>

      <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
          >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>edit appointment</Text>
              
              <Text style={styles.label}>title:</Text>
              <TextInput
                style={styles.input}
                placeholder="consultation, tattoo"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />

              <Text style={styles.label}>start time:</Text>
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

              <Text style={styles.label}>end time:</Text>
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

              <Text style={styles.label}>location:</Text>
              <TextInput
                style={styles.input}
                placeholder="shop name"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
              />
              <Text style = {styles.label}>notes:</Text>
              <TextInput
                style={styles.input}
                placeholder="notes"
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: [] })}
              />

              <View style={styles.modalButtonContainer}>
                <CustomButton
                  title="update"
                  onPress={handleUpdate}
                  buttonStyle={styles.modalButton}
                />
                <CustomButton
                  title="cancel"
                  onPress={() => setIsModalVisible(false)}
                  buttonStyle={styles.modalButton}
                />
              </View>
            </View>
          </View>
        </Modal>

    </SafeAreaView>
  );
};
export default AppointmentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
    
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"black"
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'courier',
    padding: 5,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
    fontFamily:"courier"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    color: 'white',
  },
  editButton: {
    backgroundColor: 'black',
  },
  deleteButton: {
    backgroundColor: 'black',
  },
  cancelButton: {
    backgroundColor: 'black',
  },
  time: {
    fontSize: 18,
    marginVertical: 10,
    color: 'white',
    fontFamily: 'courier',
    padding: 5,
  },
  location: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white',
    fontFamily: 'courier',
    padding: 5,
  },
  client: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white',
    fontFamily: 'courier',
    padding: 5,
  },
  switchContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'courier',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'courier',
    marginBottom: 20,
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    borderWidth:2,
    borderColor:"white"
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    fontFamily:"courier"
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
    color: 'white',
  },
  notesContainer: {
    marginTop: 20,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'courier',
    marginBottom: 10,
  },
  noteItem: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'courier',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  noNotes: {
    fontSize: 16,
    color: 'grey',
    fontFamily: 'courier',
    paddingHorizontal: 10,
  },
  
  image: {
    width: 200,
    height: 200,
  },
});
