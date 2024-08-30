import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import moment from 'moment-timezone';
import CustomButton from '@/components/CustomButton';
import { getUserAppointments } from '@/lib/appwrite';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import { router } from 'expo-router';
import AddAppointmentModal from '@/components/AddAppointmentModal';
import CalendarListModal from '@/components/CalendarListModal';
import { Calendar } from 'react-native-big-calendar';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CalendarScreen = () => {
  const { user } = useGlobalContext();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarMode, setCalendarMode] = useState('3days'); // Default mode
  const [currentDate, setCurrentDate] = useState(moment().startOf('month').toDate());
  const [calendarListModalVisible, setCalendarListModalVisible] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (user?.$id) {
          const appointmentsData = await getUserAppointments(user.$id);
          const formattedAppointments = appointmentsData.map((appointment) => ({
            id: appointment.$id,
            title: `${appointment.title} w/ ${appointment.client?.fullName || 'Unknown Client'}`,
            start: moment.utc(appointment.startTime).local().toDate(),
            end: moment.utc(appointment.endTime).local().toDate(),
          }));

          setAppointments(formattedAppointments);
        } else {
          setError('No user ID available');
        }
      } catch (error) {
        setError('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }

  const handleAddAppointment = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const toggleCalendarMode = () => {
    const modes = ['week', '3days', 'day'];
    const nextModeIndex = (modes.indexOf(calendarMode) + 1) % modes.length;
    setCalendarMode(modes[nextModeIndex]);
  };

  const changeMonth = (direction) => {
    const newDate = moment(currentDate).add(direction, 'month').toDate();
    setCurrentDate(newDate);
  };

  const handleSelectDate = (selectedDate) => {
    setCurrentDate(moment(selectedDate).toDate());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCalendarListModalVisible(true)} style={styles.selectDateButton}>
          <Text style={styles.selectDateText}>
            {moment(currentDate).format('MMMM YYYY')}
          </Text>
          <Icon name="arrow-drop-down" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Calendar
        ampm={true}
        events={appointments}
        height={600}
        mode={calendarMode}
        style={styles.calendar}
        eventCellStyle={styles.eventItem}
        onPressEvent={(event) => router.push(`/calendar/${event.id}`)}
        headerContainerStyle={{ backgroundColor: 'black' }}
        theme={{
          palette: {
            primary: {
              main: '#fff',
            },
            secondary: {
              main: '#000',
            },
          },
          typography: {
            fontFamily: 'courier',
          },
        }}
        // Update this if necessary to fit your `Calendar` component's API
        date={currentDate} 
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleAddAppointment} style={styles.button}>
          <Text style={styles.buttonText}>add appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCalendarMode} style={[styles.button, { marginLeft: 10 }]}>
          <Text style={styles.buttonText}>view: {calendarMode}</Text>
        </TouchableOpacity>
      </View>
      <AddAppointmentModal visible={modalVisible} onClose={closeModal} />
      <CalendarListModal
        visible={calendarListModalVisible}
        onClose={() => setCalendarListModalVisible(false)}
        onSelectDate={handleSelectDate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-between', // Pushes buttonContainer to the bottom
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  navButton: {
    padding: 10,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'courier',
  },
  eventItem: {
    backgroundColor: '#3b3b3b',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row', // Align buttons horizontally
    justifyContent: 'center', // Center buttons horizontally
    paddingBottom: 20,
    marginTop:10
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'black',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'courier',
    textAlign: 'center',
  },
  selectDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    backgroundColor: 'black',
  },
  selectDateText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'courier',
    marginRight: 10,
  },
  calendar: {
    backgroundColor: 'black',
  },
  eventText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default CalendarScreen;
