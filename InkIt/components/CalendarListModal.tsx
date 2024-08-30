import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarListModal = ({ visible, onClose, onSelectDate }) => {
  const handleDateSelect = (day) => {
    onSelectDate(day.dateString); // Pass the selected date back to the parent
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Calendar
            onDayPress={handleDateSelect}
            markingType={'period'}
            style={styles.calendar}
            theme={{
              calendarBackground: 'black',
              dayTextColor: 'white',
              todayTextColor: 'gray',
              selectedDayBackgroundColor: 'white',
              selectedDayTextColor: 'white',
              monthTextColor: 'white',
              arrowColor: 'white',
            }}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>close</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'black',
    borderRadius: 10,
    width: '80%',
    padding: 20,
    alignItems: 'center',
    
  },
  calendar: {
    width: '100%',
    height: 350,
    
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'courier',
    textAlign: 'center',
  },
});

export default CalendarListModal;
