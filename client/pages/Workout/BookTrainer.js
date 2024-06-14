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
    setAlertMessage(`Appointment booked with ${trainer.name} on ${selectedDate}.`);
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
      <TouchableOpacity style={styles.card}>
        <Image source={trainer.image} style={styles.image} />
        <View style={styles.infoContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{trainer.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{trainer.rating}</Text>
            </View>
          </View>
          <Text style={styles.description}>{trainer.description}</Text>
          <Text style={styles.experience}>{trainer.experience}</Text>
        </View>
      </TouchableOpacity>
      <Calendar  style={styles.Calendar}
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
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  Calendar:{
    borderRadius: 10,
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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 18,
  },
  ratingContainer: {
    backgroundColor: '#FF4C0A',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    right: '65%',
  },
  rating: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 5,
  },
  experience: {
    color: '#FF4C0A',
    fontSize: 14,
    marginTop: 5,
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
