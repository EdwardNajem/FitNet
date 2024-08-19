import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../../Components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../Components/Config';
import { AuthContext } from '../../Context/authContext';

const BookTrainer = ({ route }) => {
  const { trainer } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const navigation = useNavigation();
  const [state] = useContext(AuthContext);
  const { user } = state;
  
  const handleDateSelect = (date) => {
    const currentDate = new Date().toISOString().split('T')[0];
    if (date < currentDate) {
      setAlertMessage('Cannot book an appointment on a past date.');
      setAlertVisible(true);
      return;
    }
    setSelectedDate(date);
  };

  const handleBookAppointment = async () => {
    setAlertMessage('');  // Clear previous alert messages
    try {
      // First, check if there's already a booking for the trainer on the selected date
      const checkResponse = await api.post('fitnet/checkBooking', {
        trainerId: trainer._id,
        trainingDate: selectedDate,
      });

      if (checkResponse.status === 200 && checkResponse.data.isBooked) {
        setAlertMessage(`This trainer is already booked on ${selectedDate}. Please choose another date.`);
        setAlertVisible(true);
        return;  // Prevent further booking process
      }

      // If no booking exists for the selected date, proceed with the booking
      const data = {
        trainerId: trainer._id,
        traineeId: user._id,
        trainingDate: selectedDate,
      };

      const response = await api.post('fitnet/bookTrainer', data);
      

      if (response.status === 200) {
        console.log(`Appointment booked with ${trainer.username} on ${selectedDate}`);
        setAlertMessage(`Appointment booked with ${trainer.username} on ${selectedDate}.`);
        setIsBookingSuccess(true);
        await AsyncStorage.setItem('@booking', JSON.stringify(response.data));
      } else {
        setAlertMessage(response.data?.message || 'Failed to book the appointment. Please try again.');
        console.error(error);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setAlertMessage(error.response.data?.message || 'Internal Server Error');
      } else if (error.response && error.response.status === 400) {
        setAlertMessage(error.response.data?.message || 'Invalid request. Please check the details and try again.');
      } else {
        setAlertMessage('Failed to book the appointment. Please try again.');
        console.error(error);
      }
    }

    setAlertVisible(true);
    console.log('Trainer ID:', trainer._id);
    console.log('Trainee ID:', user._id);
    console.log('Selected Date:', selectedDate);
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
        style={styles.calendar}
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
    marginTop: 5,
  },
  calendar: {
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
