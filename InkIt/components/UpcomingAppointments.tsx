import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import { getUserAppointments } from '@/lib/appwrite';

const UpcomingAppointments = () => {
  const { user } = useGlobalContext();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsData = await getUserAppointments(user.$id);
        console.log('Appointment data', appointmentsData);
        // Filter out past appointments
        const upcomingAppointments = appointmentsData.filter((appointment) => {
          const endTime = new Date(appointment.endTime);
          return endTime > new Date(); // Only include appointments that end in the future
        });
        setAppointments(upcomingAppointments);
      } catch (error) {
        setError('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.$id) {
      fetchAppointments();
    }
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    Alert.alert('Error', error);
    return <Text style={styles.errorText}>Failed to load appointments</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.appointmentItem}>
            <Text style={styles.appointmentTitle}>{item.title}</Text>
            <Text style={styles.appointmentTime}>
              {new Date(item.startTime).toLocaleString()} - {new Date(item.endTime).toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No upcoming appointments</Text>}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  appointmentItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: 'white',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  appointmentTitle: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'courier',
    marginBottom: 5,
  },
  appointmentTime: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'courier',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'white',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
});

export default UpcomingAppointments;
