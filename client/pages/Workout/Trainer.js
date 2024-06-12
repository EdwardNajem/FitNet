import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const trainers = [
  {
    id: 1,
    name: 'Richard Will',
    description: 'High Intensity training',
    experience: '5 years experience',
    rating: '4.8',
    image: require('../../assets/images/logo.png'),
  },
  {
    id: 2,
    name: 'Jennifer James',
    description: 'Functional Strength',
    experience: '8 years experience',
    rating: '4.6',
    image: require('../../assets/images/logo.png'),
  },
  {
    id: 3,
    name: 'Brian Edward',
    description: 'Strength training',
    experience: '6 years experience',
    rating: '4.5',
    image: require('../../assets/images/logo.png'),
  },
];

const Trainer = () => {
  const navigation = useNavigation();

  const handlePress = (trainer) => {
    navigation.navigate('TrainerInformation', { trainer });
  };

  return (
    <ScrollView style={styles.container}>
      {trainers.map((trainer) => (
        <TouchableOpacity key={trainer.id} style={styles.card} onPress={() => handlePress(trainer)}>
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
          <AntDesign name="right" size={24} color="#FFFFFF" style={styles.icon} />
        </TouchableOpacity>
      ))}
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
    paddingRight: 35, 
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
    right:'170%',
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
  icon: {
    position: 'absolute',
    right: 10, 
  },
});

export default Trainer;
