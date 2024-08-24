import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Button, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Timetable from 'react-native-calendar-timetable';
import moment from 'moment';
import CustomButton from '@/components/CustomButton';
import { getUserAppointments } from '@/lib/appwrite';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import { router, useNavigation } from 'expo-router';
import AddAppointmentModal from '@/components/AddAppointmentModal';

const CalendarComponent = ({ style, item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    router.push(`/calendar/${item.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[style, styles.eventItem]}>
      <Text style={styles.eventTitle}>{item.title} w/{item.client}</Text>
      <Text style={styles.eventTime}>
        {moment(item.startDate).format('h:mm A')} - {moment(item.endDate).format('h:mm A')}
      </Text>
    </TouchableOpacity>
  );
};

const CalendarScreen = () => {
  const { user } = useGlobalContext();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [from] = useState(moment().subtract(3, 'days').toDate());
  const [till] = useState(moment().add(3, 'days').toISOString());

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (user?.$id) {
          const appointmentsData = await getUserAppointments(user.$id);
          const formattedAppointments = appointmentsData.map((appointment) => ({
            id: appointment.$id,
            title: appointment.title,
            startDate: new Date(appointment.startTime),
            endDate: new Date(appointment.endTime),
            client: appointment.client?.fullName || 'Unknown Client'
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
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  const handlePrevDay = () => {
    setCurrentDate(prevDate => moment(prevDate).subtract(1, 'day').toDate());
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => moment(prevDate).add(1, 'day').toDate());
  };

  const handleAddAppointment = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navigationContainer}>
        <Button title="Previous Day" onPress={handlePrevDay} color="transparent" style={styles.navButton} />
        <Text style={styles.currentDate}>
          {moment(currentDate).format('MMMM D, YYYY')}
        </Text>
        <Button title="Next Day" onPress={handleNextDay} color="transparent" style={styles.navButton} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Timetable
          items={appointments}
          renderItem={(props) => <CalendarComponent {...props} />}
          date={currentDate}
          headerContainerStyle={styles.headerContainer}
          headerTextStyle={styles.headerText}
          containerStyle={styles.containerStyle}
          timeContainerStyle={styles.timeContainer}
          timeTextStyle={styles.timeText}
          linesContainerStyle={styles.linesContainer}
          nowLineDotStyle={styles.nowLineDot}
          nowLineLineStyle={styles.nowLineLine}
          fromHour={0}
          toHour={24}
          is12Hour={true}
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton title="Add Appointment" onPress={handleAddAppointment} />
      </View>
      <AddAppointmentModal visible={modalVisible} onClose={closeModal} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
  },
  currentDate: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  buttonContainer: {
    alignItems: 'center',
    margin: 20,
  },
  eventItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    padding: 10,
    color: 'black',
    fontFamily: 'Courier',
  },
  eventTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  eventTime: {
    color: 'black',
    fontSize: 14,
  },
  headerContainer: {
    // Add your styles for header container
  },
  headerText: {
    // Add your styles for header text
  },
  containerStyle: {
    // Add your styles for timetable container
  },
  timeContainer: {
    // Add your styles for time container
  },
  timeText: {
    // Add your styles for time text
  },
  linesContainer: {
    // Add your styles for lines container
  },
  nowLineDot: {
    // Add your styles for 'now' line dot
  },
  nowLineLine: {
    color: 'white',
  },
  navButton: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
    fontFamily: 'Courier',
  },
});

export default CalendarScreen;
