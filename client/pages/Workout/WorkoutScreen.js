import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet ,StatusBar} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const WorkoutScreen = ({navigation}) => {
  const workouts = [
    { id: 1, name: 'Chest - Biceps' },
    { id: 2, name: 'Legs - Abs' },
    { id: 3, name: 'Shoulders - Triceps' },
    ];

  const handleStartWorkout = (workoutId) => {
    console.log('Start workout:', workoutId);

  };

  const handleStartWorkoutPlan=() =>{
    navigation.navigate('StartWorkout');
  }


  return (
    
    <ScrollView style={styles.container}>
      {/* Start Workout Plan */}
      <Text style={styles.sectionTitle}>Quick Start</Text>
      <TouchableOpacity onPress={handleStartWorkoutPlan} style={[styles.button, { backgroundColor: '#2F2F2F', marginBottom: 20 }]}>
        <View style={styles.buttonContent}>
          <AntDesign name="plus" size={24} color="#FF4C0A" />
          <Text style={styles.buttonText}>Start Workout Plan</Text>
        </View>
      </TouchableOpacity>

      {/* Hire a Trainer */}
         <Text style={styles.sectionTitle}>Trainer</Text>
      <TouchableOpacity 
            onPress={() => navigation.navigate('Trainer')}
            style={[styles.button, { backgroundColor: '#2F2F2F' }]}>
        <View style={styles.buttonContent}>
          <AntDesign name="plus" size={24} color="#FF4C0A" />
          <Text style={styles.buttonText}>Hire a Trainer</Text>
        </View>
      </TouchableOpacity>

      {/* Workout Plan */}
   
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
     Workout Plan
        </Text>
        {workouts.map((workout) => (
          <View key={workout.id} style={styles.workoutCard}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <TouchableOpacity onPress={() => handleStartWorkout(workout.id)} style={styles.startButton}>
              <Text style={styles.startButtonText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 20,
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
    bottom:6,
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
  workoutName: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 10,
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
  title:{
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 15,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#2F2F2F',
  },
});

export default WorkoutScreen;
