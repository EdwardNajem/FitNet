import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button
} from 'react-native';
import api from '../../Components/Config';
import { useIsFocused } from '@react-navigation/native';

const WorkoutScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [nearestSession, setNearestSession] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getAllWorkoutPlansByUser();
      getNearestTrainingSession();
    }
  }, [navigation, isFocused]);

  const getAllWorkoutPlansByUser = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('@auth'));

      const response = await api.get(`/fitnet/getAllWorkoutPlansByUser/${user.user._id}`);

      if (response) {
        setWorkouts(response.data.workoutPlans);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getNearestTrainingSession = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('@auth'));
      
      const response = await api.get(`/fitnet/getNearestTrainingSession/${user.user._id}`);
  
      if (response.status === 200) {
        if (response.data.message) {
          setNearestSession(null); 
          console.log(response.data.message); 
        } else {
          setNearestSession(response.data.nearestSession);
          console.log('sessions found');

        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setNearestSession(null); 
        console.log('No upcoming sessions found');
      } else {
        console.log(error);
        console.log('Error fetching nearest training session');
      }
    }
  };
  
  

  const handleDeleteSession = async (sessionId) => {
    try {
      const response = await api.delete(`/fitnet/deleteTrainingSession/${sessionId}`);
  
      if (response) {
        setNearestSession(null); 
      }
    } catch (error) {
      console.log(error);
    }
    setSessionModalVisible(false); 
  };

  const handleStartWorkout = async (workout) => {
    console.log('Start workout:', workout);

    try {
      const data = {
        workoutId: workout._id,
        startTime: new Date(),
      };

      const response = await api.post('/fitnet/startWorkout', data);

      if (response) {
        navigation.navigate('StartWorkout', {
          selectedWorkoutPlan: workout
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleWorkoutOptions = (workout) => {
    setSelectedWorkout(workout);
    setModalVisible(true);
  };

  const handleEditWorkout = () => {
    navigation.navigate('EditWorkout', {
      selectedWorkoutPlan: selectedWorkout
    });
    setModalVisible(false);
  };

  const handleDeleteWorkout = async () => {
    setWorkouts((prevWorkouts) => prevWorkouts.filter(workout => workout !== selectedWorkout));
    try {
      const response = await api.delete(`/fitnet/deleteWorkoutPlanById/${selectedWorkout._id}`);

      if (response) {
        const data = await response.json();
        console.log(data);
        console.log('Deleted the workout with ID: ', selectedWorkout._id);
      }
    } catch (error) {
      console.log(error);
    }
    setModalVisible(false);
  };

  return (
    <>
    <TouchableOpacity 
      onPress={() => navigation.push('AIChat',
          {
            receivingUser: {
              _id: 'ai_helper',
              username: 'AI Assistant',
              avatar: 'https://firebasestorage.googleapis.com/v0/b/chatfuze-e6658.appspot.com/o/ChatFuze%2FProfile%2Fd4d8df1645a4f1e243b37cb00b857db4_t.jpeg?alt=media&token=0d616e33-1017-4ff9-8430-a38cbc17a7f3',
            },
          }
        )} 
      style={{ zIndex: 100, borderColor: '#FF4C0A', borderWidth: 1, borderRadius: 30 ,backgroundColor: '#2f2f2f', padding: 10, width: 80, margin: 10, right:0, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0 }}
    >
      <MaterialCommunityIcons name='robot-excited-outline' color={'#FF4C0A'} size={40} />
    </TouchableOpacity>
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#2f2f2f" />

      <View style={styles.header}>
        <Text style={styles.title}>Workout</Text>
      </View>

      <View style={styles.content}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={handleEditWorkout}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteWorkout}
                style={[styles.modalButton, styles.deleteButton]}
              >
                <Text style={[styles.modalButtonText, styles.deleteButtonText]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={sessionModalVisible}
          onRequestClose={() => {
            setSessionModalVisible(!sessionModalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalButtonText}>Are you sure you want to cancel the session?</Text>
              <TouchableOpacity
                onPress={() => handleDeleteSession(nearestSession._id)}
                style={[styles.modalButton, styles.deleteButton]}
              >
                <Text style={[styles.modalButtonText, styles.deleteButtonText]}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSessionModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.sectionTitle}>Quick Start</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateWorkout')}
          style={[
            styles.button,
            { backgroundColor: '#2F2F2F', marginBottom: 20 },
          ]}
        >
          <View style={styles.buttonContent}>
            <AntDesign name="plus" size={24} color="#FF4C0A" />
            <Text style={styles.buttonText}>Start Workout Plan</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Trainer</Text>
        {nearestSession ? (
          <View style={styles.trainerBar}>
            <Image source={{ uri: nearestSession.Trainer.avatar }} style={styles.trainerAvatar} />
            <View style={styles.trainerInfo}>
              <Text style={styles.trainerName}>{nearestSession.Trainer.username}</Text>
              <Text style={styles.trainerDate}>{new Date(nearestSession.TrainingDate).toDateString()}</Text>
            </View>
            <TouchableOpacity onPress={() => setSessionModalVisible(true)}>
              <AntDesign name="close" size={24} color="#FF4C0A" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('Trainer')}
            style={[styles.button, { backgroundColor: '#2F2F2F' }]}
          >
            <View style={styles.buttonContent}>
              <AntDesign name="plus" size={24} color="#FF4C0A" />
              <Text style={styles.buttonText}>Hire a Trainer</Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Plan</Text>
          {workouts.map((workout) => (
            <View key={workout._id} style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutName}>{workout.title}</Text>
                <TouchableOpacity onPress={() => handleWorkoutOptions(workout)}>
                  <AntDesign
                    name="ellipsis1"
                    size={24}
                    color="#FFFFFF"
                    style={{ transform: [{ rotate: '90deg' }] }}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => handleStartWorkout(workout)}
                style={styles.startButton}
              >
                <Text style={styles.startButtonText}>Start Workout</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 30,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'flex-start',
    bottom: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 30,
    marginLeft: 10,
  },
  workoutCard: {
    backgroundColor: '#2F2F2F',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  workoutName: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 30,
  },
  startButton: {
    backgroundColor: '#FF4C0A',
    borderRadius: 24,
    paddingVertical: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 23,
    textAlign: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#2F2F2F',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#2F2F2F',
    borderRadius: 10,
    padding: 20,
  },
  modalButton: {
    backgroundColor: '#FF4C0A',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  deleteButton: {
    top: 10,
    backgroundColor: '#FF4C0A',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  deleteButtonText: {
    color: '#FFFFFF',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 2,          
    borderColor: '#FF4C0A', 
    borderRadius: 5,        
    paddingVertical: 10,    
    paddingHorizontal: 20,  
  },
  cancelButtonText: {
    color: '#FF4C0A',
    fontSize: 18,
  },
  trainerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2F2F2F',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  trainerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  trainerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  trainerName: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 18,
  },
  trainerDate: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});


export default WorkoutScreen;
