import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment-timezone';
import CustomButton from '@/components/CustomButton';
import { getUserAppointments } from '@/lib/appwrite';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import { router } from 'expo-router';
import AddAppointmentModal from '@/components/AddAppointmentModal';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

const CalendarScreen = () => {
  const { user } = useGlobalContext();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [markedDates, setMarkedDates] = useState<any>({});
  const [viewType, setViewType] = useState<'calendar' | 'calendarList'>('calendar');
  const [currentMonth, setCurrentMonth] = useState<string>(moment().format('YYYY-MM'));

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (user?.$id) {
          const appointmentsData = await getUserAppointments(user.$id);
          const formattedAppointments = appointmentsData.reduce((acc, appointment) => {
            const startDate = moment.utc(appointment.startTime).local().format('YYYY-MM-DD');
            const event = {
              id: appointment.$id,
              title: appointment.title,
              startTime: moment.utc(appointment.startTime).local().format('h:mm A'),
              endTime: moment.utc(appointment.endTime).local().format('h:mm A'),
              client: appointment.client?.fullName || 'Unknown Client',
              startTimestamp: moment.utc(appointment.startTime).valueOf(),
            };

            if (!acc[startDate]) {
              acc[startDate] = [];
            }
            acc[startDate].push(event);

            acc[startDate].sort((a, b) => a.startTimestamp - b.startTimestamp);

            return acc;
          }, {});

          setAppointments(formattedAppointments);

          const marked = Object.keys(formattedAppointments).reduce((acc, date) => {
            acc[date] = { dots: [{ key: 'appointments', color: 'white' }] };
            return acc;
          }, {});

          setMarkedDates(marked);
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

  const handleAddAppointment = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderAppointment = (item) => (
    <TouchableOpacity style={styles.eventItem} onPress={() => router.push(`/calendar/${item.id}`)}>
      <Text style={styles.eventTitle}>{item.title} w/{item.client}</Text>
      <Text style={styles.eventTime}>{item.startTime} - {item.endTime}</Text>
    </TouchableOpacity>
  );

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setViewType('calendar');
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(`${month.year}-${month.month < 10 ? `0${month.month}` : month.month}`);
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setViewType('calendar');
  };

  const filteredAppointments = { [selectedDate]: appointments[selectedDate] || [] };

  return (
    <SafeAreaView style={styles.container}>
      {viewType === 'calendar' ? (
        <>
          <Calendar
            markedDates={markedDates}
            markingType="multi-dot"
            onDayPress={handleDayPress}
            onMonthChange={handleMonthChange}
            theme={{
              backgroundColor: 'black',
              calendarBackground: 'black',
              textSectionTitleColor: 'white',
              dayTextColor: 'white',
              todayTextColor: 'white',
              selectedDayBackgroundColor: 'white',
              selectedDayTextColor: 'black',
              dotColor: 'white',
              selectedDotColor: 'black',
              monthTextColor: 'white',
              indicatorColor: 'white',
              textDayFontFamily: 'courier',
              textMonthFontFamily: 'courier',
              textDayHeaderFontFamily: 'courier',
              textDayHeaderFontWeight: 'bold',
              arrowColor: 'white'
            }}
            style={styles.calendar}
          />
          <View style={styles.toggleContainer}>
            <TouchableOpacity style={styles.toggleButton} onPress={() => setViewType('calendarList')}>
              <Text style={styles.toggleButtonText}>month list</Text>
            </TouchableOpacity>
          </View>
          <Agenda
            items={filteredAppointments}
            renderItem={renderAppointment}
            selected={selectedDate}
            pastScrollRange={3}
            futureScrollRange={3}
            rowHasChanged={(r1, r2) => r1.id !== r2.id}
            onDayPress={handleDayPress}
            theme={{
              backgroundColor: 'black',
              calendarBackground: 'black',
              textSectionTitleColor: 'black',
              dayTextColor: 'black',
              todayTextColor: 'black',
              selectedDayBackgroundColor: 'black',
              selectedDayTextColor: 'black',
              dotColor: 'white',
              selectedDotColor: 'black',
              agendaDayTextColor: 'white',
              agendaDayNumColor: 'white',
              agendaTodayColor: 'white',
              agendaKnobColor: 'black',
              monthTextColor: 'white',
              indicatorColor: 'white',
              textDayFontFamily: 'courier',
              reservationsBackgroundColor: 'black',
              textMonthFontFamily: 'courier',
              textDayHeaderFontFamily: 'courier',
              textDayHeaderFontWeight: 'bold',
            }}
            style={styles.agenda}
          />
        </>
      ) : (
        <>
          <CalendarList
            current={currentMonth}
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            markingType="multi-dot"
            theme={{
              backgroundColor: 'black',
              calendarBackground: 'black',
              textSectionTitleColor: 'white',
              dayTextColor: 'white',
              todayTextColor: 'white',
              selectedDayBackgroundColor: 'white',
              selectedDayTextColor: 'black',
              dotColor: 'white',
              selectedDotColor: 'black',
              monthTextColor: 'white',
              indicatorColor: 'white',
              textDayFontFamily: 'courier',
              textMonthFontFamily: 'courier',
              textDayHeaderFontFamily: 'courier',
              textDayHeaderFontWeight: 'bold',
              arrowColor: 'white'
            }}
            style={styles.calendarList}
          />
          <View style={styles.toggleContainer}>
            <TouchableOpacity style={styles.toggleButton} onPress={() => setViewType('calendar')}>
              <Text style={styles.toggleButtonText}>back to calendar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

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
  eventItem: {
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  eventTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  eventTime: {
    color: 'white',
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: 'center',
    margin: 20,
  },
  calendar: {
    backgroundColor: 'black',
  },
  calendarList: {
    backgroundColor: 'black',
  },
  toggleContainer: {
    alignItems:"flex-end",
    
    marginBottom:10,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'black',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
    color:"white",
    
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily:"courier"
  },
});

export default CalendarScreen;
