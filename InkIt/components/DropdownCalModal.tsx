import { Modal, View } from "react-native";
import CustomButton from "./CustomButton";
import { Calendar } from "react-native-calendars";
import moment from "moment-timezone";

const DropdownCalendar = ({ isVisible, onSelectDate, onClose }) => {
    return (
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <Calendar
            current={moment().format('YYYY-MM-DD')}
            onDayPress={day => {
              onSelectDate(day.dateString);
              onClose();
            }}
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
            }}
          />
          <CustomButton title="Close" onPress={onClose} />
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
  })