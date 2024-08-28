import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, Switch, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { getAppointmentById, updateAppointment, deleteAppointment, getUserClients } from '@/lib/appwrite';
import moment from 'moment';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import { formatDateString, multiFormatDateString } from '@/utils/utils';
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
      });
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
        <ActivityIndicator size="large" color="#0000ff" />
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
      <Text style={styles.location}>Location: {appointment.location}</Text>
      <Text style={styles.client}>Client: {appointment.client?.fullName || 'Unknown'}</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Deposit Paid: {depositPaid ? 'Yes' : 'No'}</Text>
        <Switch
          value={depositPaid}
          onValueChange={handleToggle}
          thumbColor={depositPaid ? 'black' : 'white'}
          trackColor={{ false: 'black', true: 'white' }}
        />
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
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
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
              onPress={() => setIsModalVisible(false)}
              buttonStyle={styles.modalButton}
            />
          </View>
        </SafeAreaView>
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
  
  image: {
    width: 200,
    height: 200,
  },
});
