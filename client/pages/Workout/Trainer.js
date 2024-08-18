import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../Components/Config';

const Trainer = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTrainers = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const response = await api.get('fitnet/getTrainers');
        if (response.status === 200) {
          setTrainers(response.data);
        } else {
          setErrorMessage(response.data?.message || 'Failed to fetch trainers');
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setErrorMessage(error.response.data?.message || 'Internal Server Error');
        } else {
          setErrorMessage('Failed to fetch trainers');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const handlePress = (trainer) => {
    navigation.navigate('TrainerInformation', { trainer });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4C0A" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {trainers.map((trainer) => (
        <TouchableOpacity key={trainer._id} style={styles.card} onPress={() => handlePress(trainer)}>
          <Image source={{ uri: trainer.avatar }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{trainer.username}</Text>
            <Text style={styles.description}>{trainer.type}</Text>
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
  name: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 18,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 5,
  },
  icon: {
    position: 'absolute',
    right: 10, 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  errorText: {
    color: '#FF4C0A',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Trainer;
