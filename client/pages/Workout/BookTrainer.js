import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../../Components/CustomAlert';

const BookTrainer = ({ route }) => {
  const { trainer } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const navigation = useNavigation();

  const handleDateSelect = (date) => {
    const currentDate = new Date().toISOString().split('T')[0];
    if (date < currentDate) {
      setAlertMessage('Cannot book an appointment on a past date.');
      setAlertVisible(true);
      return;
    }
    setSelectedDate(date);
  };

  const handleBookAppointment = () => {
    if (!selectedDate) {
      setAlertMessage('Please select a date to book an appointment.');
      setAlertVisible(true);
      return;
    }
    setAlertMessage(`Appointment booked with ${trainer.username} on ${selectedDate}.`);
    setAlertVisible(true);
    setIsBookingSuccess(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
    if (isBookingSuccess) {
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: trainer.avatar }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{trainer.username}</Text>
          <Text style={styles.type}>{trainer.type}</Text>
        </View>
      </View>
      <Calendar
        style={styles.Calendar}
        onDayPress={(day) => handleDateSelect(day.dateString)}
        markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#FF4C0A' } } : {}}
        theme={{
          calendarBackground: '#2F2F2F',
          textSectionTitleColor: '#FFFFFF',
          dayTextColor: '#FFFFFF',
          todayTextColor: '#FF4C0A',
          selectedDayTextColor: '#FFFFFF',
          monthTextColor: '#FFFFFF',
          arrowColor: '#FF4C0A',
        }}
      />
      <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>
      <CustomAlert visible={alertVisible} message={alertMessage} onClose={closeAlert} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#2F2F2F',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 18,
  },
  type: {
    color: '#FF4C0A',
    fontSize: 14,
    top:5,
  },
  Calendar: {
    borderRadius: 10,
  },
  bookButton: {
    backgroundColor: '#FF4C0A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookTrainer;
