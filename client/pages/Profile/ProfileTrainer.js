import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../Components/Config';
import { AuthContext } from '../../Context/authContext';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package if you haven't already

const ProfileTrainer = () => {
  const navigation = useNavigation();
  const [state] = useContext(AuthContext);
  const user = state?.user || {};
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainerStatus = async () => {
      try {
        const response = await api.get(`fitnet/trainerRequestStatus/${user._id}`);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Failed to fetch trainer status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user._id) {
      fetchTrainerStatus();
    }
  }, [user._id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF4C0A" />
      </View>
    );
  }

  const renderTraineeList = () => (
    <View style={styles.traineeListContainer}>
      {[
        { id: 1, name: 'John Doe', date: '2024-08-20', avatar: require('../../assets/images/logo.png') },
        { id: 2, name: 'Jane Smith', date: '2024-08-21', avatar: require('../../assets/images/logo.png') },
        { id: 3, name: 'Sam Wilson', date: '2024-08-22', avatar: require('../../assets/images/logo.png') },
      ].map((trainee) => (
        <View key={trainee.id} style={styles.traineeContainer}>
          <Image source={trainee.avatar} style={styles.avatar} />
          <View style={styles.traineeInfo}>
            <Text style={styles.traineeName}>{trainee.name}</Text>
            <Text style={styles.trainingDate}>{trainee.date}</Text>
          </View>
          <TouchableOpacity style={styles.messageIconContainer}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#FF4C0A" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {status === 'Pending' ? (
        <View style={styles.contentContainer}>
          <Text style={styles.pendingText}>
            Your request is currently pending.
          </Text>
        </View>
      ) : status === 'Accepted' ? (
        renderTraineeList()
      ) : (
        <>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>
              Are you a <Text style={styles.orangeText}>Trainer</Text>?
            </Text>
            <Text style={styles.subtitle}>
              Sign up to start taking{'\n'}in clients
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('TrainerRegister')}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default ProfileTrainer;

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingTop: 10,
    height: windowHeight / 2,
    justifyContent: 'center',
  },
  topLeftLabelContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
  },
  topLeftLabel: {
    fontSize: 16,
    color: 'gray',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  orangeText: {
    color: '#FF4C0A',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 80,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pendingText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  traineeListContainer: {
    flex: 1,
    marginTop: 20,
  },
  traineeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  traineeInfo: {
    flex: 1,
  },
  traineeName: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  trainingDate: {
    fontSize: 14,
    color: 'gray',
  },
  messageIconContainer: {
    marginLeft: 'auto',
  },
});
