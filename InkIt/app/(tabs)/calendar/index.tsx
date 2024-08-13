import { StyleSheet, View, Dimensions, Text } from 'react-native';
import React, {  useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Agenda } from 'react-native-calendars';
import CustomButton from '@/components/CustomButton';
import { getUserAppointments } from '@/lib/appwrite';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import useAppwrite from '@/lib/useAppwrite';
import { useNavigation } from 'expo-router';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const CalendarScreen = () => {
  const {user, setUser, setIsLogged} = useGlobalContext();
  const [items, setItems] = useState({});
  const navigation = useNavigation();
  const {data:appointments} = useAppwrite(()=>getUserAppointments(user.$id))
  
  useEffect(() => {
    if (appointments) {
      // Transform appointments into the format expected by Agenda
      const transformedItems = appointments.reduce((acc, appointment) => {
        const date = new Date(appointment.startTime).toISOString().split('T')[0]; // Extract date in YYYY-MM-DD format
        if (!acc[date]) acc[date] = [];
        acc[date].push({
          name: appointment.title,
          height: 50, // Adjust height as needed
        });
        return acc;
      }, {});

      setItems(transformedItems);
    }
  }, [appointments]);
  const renderItem = (item) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.name}</Text>
      {/* Add more item details here if needed */}
    </View>
  );

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Agenda
        
          items={items}
          renderItem={renderItem}
          theme={{
            backgroundColor: '#000000',
            calendarBackground: '#000000',
            textSectionTitleColor: '#ffffff',
            selectedDayBackgroundColor: '#ffffff',
            selectedDayTextColor: '#000000',
            todayTextColor: 'red',
            dayTextColor: '#ffffff',
            textDisabledColor: '#444444',
            monthTextColor: '#ffffff',
            indicatorColor: '#ffffff',
            textDayFontFamily: 'Courier',
            textMonthFontFamily: 'Courier',
            textDayHeaderFontFamily: 'Courier',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            height: height * 0.8, // Adjusted height for better visibility
          }}
        />
        <View style={styles.buttonContainer}>
          <CustomButton title="Add Appointment" onPress={() => navigation.navigate('AddAppointment')} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    alignItems: 'center',
    margin: 20,
  },
  itemContainer: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  itemTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'courier'
  },
});

export default CalendarScreen;
