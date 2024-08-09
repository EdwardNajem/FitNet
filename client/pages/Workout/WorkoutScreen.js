import { AntDesign } from '@expo/vector-icons';
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
} from 'react-native';
import api from '../../Components/Config';
import { useIsFocused } from '@react-navigation/native';

const WorkoutScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const [workouts, setWorkouts] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused)
      getAllWorkoutPlansByUser();
  }, [navigation,isFocused]);

  const getAllWorkoutPlansByUser = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('@auth'));

      const response = await api.get(`/fitnet/getAllWorkoutPlansByUser/${user.user._id}`);

      if(response){
        setWorkouts(response.data.workoutPlans);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // const workouts = [
  //   { id: 1, name: 'Chest - Biceps' },
  //   { id: 2, name: 'Legs - Abs' },
  //   { id: 3, name: 'Shoulders - Triceps' },
  // ];

  const handleStartWorkout = async (workout) => {
    console.log('Start workout:', workout);

    // set startTime to the current time
    try {
      const data = {
        workoutId: workout._id,
        startTime: new Date(),
      }

      const response = await api.post('/fitnet/startWorkout', data);

      if(response){
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
    // console.log('Edit workout:', selectedWorkout);
    navigation.navigate('EditWorkout', {
      selectedWorkoutPlan: selectedWorkout
    });
    setModalVisible(false);
  };

  const handleDeleteWorkout = async () => {
    console.log('Delete workout:', selectedWorkout);
    setWorkouts((prevWorkouts) => prevWorkouts.filter(workout => workout !== selectedWorkout));
    try {
      const response = await api.delete(`/fitnet/deleteWorkoutPlanById/${selectedWorkout._id}`);

      if(response){
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
        <TouchableOpacity
          onPress={() => navigation.navigate('Trainer')}
          style={[styles.button, { backgroundColor: '#2F2F2F' }]}
        >
          <View style={styles.buttonContent}>
            <AntDesign name="plus" size={24} color="#FF4C0A" />
            <Text style={styles.buttonText}>Hire a Trainer</Text>
          </View>
        </TouchableOpacity>

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
    backgroundColor: '#2F2F2F',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalButton: {
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#FF4C0A',
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  cancelButton: {
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#2F2F2F',
    width: '80%',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
  },
  deleteButtonText: {
    color: '#FFFFFF',
  },
});

export default WorkoutScreen;
