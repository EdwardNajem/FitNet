import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const reviews = [
  {
    id: 1,
    reviewerName: 'Ahmad Zaarour',
    rating: '5.0',
    reviewText: 'Great trainer! Helped me achieve my fitness goals.',
    reviewerImage: require('../../assets/images/logo.png'), 
  },
  {
    id: 2,
    reviewerName: 'Edward Najem',
    rating: '4.5',
    reviewText: 'Very knowledgeable and professional.',
    reviewerImage: require('../../assets/images/logo.png'), 
  },
];

const TrainerInformation = ({ route }) => {
  const { trainer } = route.params;
  const navigation = useNavigation();

  const handleBookPress = () => {
    navigation.navigate('BookTrainer', { trainer });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: trainer.avatar }} style={styles.trainerImage} />
      <View style={styles.infoContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{trainer.username}</Text>
          <TouchableOpacity style={styles.messageButton}>
            <FontAwesome name="comment" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.role}>{trainer.type}</Text>
        <Text style={styles.sectionTitle}>Reviews</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewSlider}>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={review.reviewerImage} style={styles.reviewerImage} />
                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerInfoHeader}>
                    <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                    <View style={styles.reviewRatingContainer}>
                      <Text style={styles.reviewRating}>{review.rating}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>{review.reviewText}</Text>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookPress}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  trainerImage: {
    width: '100%',
    height: 300,
  },
  infoContainer: {
    backgroundColor: '#2F2F2F',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: -20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 24,
  },
  messageButton: {
    backgroundColor: '#FF4C0A',
    padding: 10,
    borderRadius: 20,
  },
  role: {
    color: '#FFFFFF',
    fontSize: 18,
    marginVertical: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  reviewSlider: {
    marginVertical: 10,
  },
  reviewCard: {
    backgroundColor: '#3A3A3A',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    width: 250,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 10,
  },
  reviewRatingContainer: {
    backgroundColor: '#FF4C0A',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    width: 'auto',
  },
  reviewRating: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  reviewText: {
    color: '#FFFFFF',
    fontSize: 14,
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

export default TrainerInformation;
