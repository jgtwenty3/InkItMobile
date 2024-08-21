import {  StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ToDoList from '@/components/ToDoList';
import UpcomingAppointments from '@/components/UpcomingAppointments';

const Home = () => {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Half: To Do List */}
      <View style={styles.halfContainer}>
        <Text style={styles.headerText}>To Do:</Text>
        <ScrollView style={styles.listContainer} contentContainerStyle={styles.scrollContent}>
          <ToDoList />
        </ScrollView>
      </View>

      {/* Bottom Half: Upcoming Appointments */}
      <View style={styles.halfContainer}>
        <Text style={styles.headerText}>Upcoming Appointments:</Text>
        <UpcomingAppointments/>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  halfContainer: {
    flex: 1, // Takes up half the screen
    justifyContent: 'flex-start', // Align content at the top
    alignItems: 'center',
    paddingTop: 10, // Add a little padding at the top
  },
  headerText: {
    fontFamily: 'courier',
    color: 'white',
    fontSize: 20,
    marginBottom: 10, // Add some space between the header and the list
  },
  listContainer: {
    width: '100%',
    paddingHorizontal: 20,
    flex: 1, // Ensures the ScrollView takes up the entire half
  },
  scrollContent: {
    flexGrow: 1, // Makes sure the content inside ScrollView fills the ScrollView
  },
});
