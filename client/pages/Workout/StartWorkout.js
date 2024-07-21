import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Duration from '../../Components/Duration';
import WeightReps from '../../Components/WeightReps';
import BodyWeight from '../../Components/BodyWeight';  
import WeightedBodyWeight from '../../Components/WeightedBodyWeight';
import WeightDistance from '../../Components/WeightDistance';
import AssistedBodyWeight from '../../Components/AssistedBodyWeight';

const StartWorkout = ({ route, navigation }) => {
  const { selectedExercises = [] } = route.params || {};
  const [exercises, setExercises] = useState([]);
  const [workoutTitle, setWorkoutTitle] = useState('Workout Plan');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    if (selectedExercises.length > 0) {
      setExercises(selectedExercises);
    }
  }, [selectedExercises]);

  const [completedSets, setCompletedSets] = useState([]);

  const toggleSetCompletion = (exerciseId, setId) => {
    const key = `${exerciseId}-${setId}`;
    if (completedSets.includes(key)) {
      setCompletedSets(completedSets.filter((id) => id !== key));
    } else {
      setCompletedSets([...completedSets, key]);
    }
  };

  const addSet = (exerciseId) => {
    const updatedExercises = exercises.map((exercise) => {
      if (exercise._id === exerciseId) {
        const newSet = { id: (exercise.sets ? exercise.sets.length : 0) + 1 ,meters:0,kg: 0, reps: 0, time: '00:00' };
        return { ...exercise, sets: exercise.sets ? [...exercise.sets, newSet] : [newSet] };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  };

  const handleTitleChange = (text) => {
    setWorkoutTitle(text);
  };

  const toggleEditingTitle = () => {
    setIsEditingTitle(!isEditingTitle);
  };

  const renderItem = ({ item }) => {
    let ExerciseComponent;
    switch (item.type) {
      case 'Duration':
        ExerciseComponent = Duration;
        break;
      case 'Weight & Reps':
        ExerciseComponent = WeightReps;
        break;
      case 'Bodyweight Reps':
        ExerciseComponent = BodyWeight;
        break;
      case 'Weighted Bodyweight':
        ExerciseComponent = WeightedBodyWeight;
        break;
      case 'Weight & Distance':
        ExerciseComponent = WeightDistance;
        break;
      case 'Assisted Bodyweight':
        ExerciseComponent = AssistedBodyWeight;
        break;
      default:
        ExerciseComponent = null;  
    }

    if (!ExerciseComponent) {
      return null;
    }

    return (
      <View style={styles.exerciseContainer}>
        <ExerciseComponent
          exercise={item}
          exercises={exercises}
          setExercises={setExercises}
          completedSets={completedSets}
          toggleSetCompletion={toggleSetCompletion}
          addSet={addSet}
        />
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.titleContainer}>
      {isEditingTitle ? (
        <TextInput
          style={styles.titleInputBox}
          value={workoutTitle}
          onChangeText={handleTitleChange}
          onBlur={toggleEditingTitle}
          autoFocus
        />
      ) : (
        <Text style={styles.titleText}>{workoutTitle}</Text>
      )}
      <TouchableOpacity onPress={toggleEditingTitle}>
        <Ionicons name={isEditingTitle ? 'checkmark' : 'pencil'} size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {exercises.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>No exercises selected.</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('WorkoutList')}
          >
            <Text style={styles.addButtonText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={exercises}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={() => (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('WorkoutList')}
            >
              <Text style={styles.addButtonText}>Add Exercise</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1C1C1E',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  exerciseContainer: {
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#FF4C0A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  titleText: {
    fontSize: 24,
    color: '#FFF',
    flex: 1,
  },
  titleInputBox: {
    fontSize: 24,
    color: '#FFF',
    flex: 1,
    backgroundColor: '#2C2C2E',
    padding: 8,
    borderRadius: 8,
  },
});

export default StartWorkout;
