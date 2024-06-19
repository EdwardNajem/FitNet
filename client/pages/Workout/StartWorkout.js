import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const StartWorkout = ({ route, navigation }) => {
  const { selectedExercises = [] } = route.params || {};

  const [isEditingTitle, setIsEditingTitle] = useState(true);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [exercises, setExercises] = useState(
    selectedExercises.map((ex) => ({
      ...ex,
      sets: ex.sets
        ? ex.sets.map((set) => ({
            ...set,
            kg: set.kg ?? 0,
            reps: set.reps ?? 0,
          }))
        : [{ id: 1, kg: 0, reps: 0 }],
    }))
  );
  const [completedSets, setCompletedSets] = useState([]);

  useEffect(() => {
    if (selectedExercises.length > 0) {
      setExercises(
        selectedExercises.map((ex) => ({
          ...ex,
          sets: ex.sets
            ? ex.sets.map((set) => ({
                ...set,
                kg: set.kg ?? 0,
                reps: set.reps ?? 0,
              }))
            : [{ id: 1, kg: 0, reps: 0 }],
        }))
      );
    }
  }, [selectedExercises]);

  const addSet = (exerciseId) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise._id === exerciseId
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                { id: exercise.sets.length + 1, kg: 0, reps: 0 },
              ],
            }
          : exercise
      )
    );
  };

  const addExercise = () => {
    navigation.navigate('WorkoutList');
  };

  const toggleSetCompletion = (exerciseId, setId) => {
    const setIdentifier = `${exerciseId}-${setId}`;
    if (completedSets.includes(setIdentifier)) {
      setCompletedSets(completedSets.filter((id) => id !== setIdentifier));
    } else {
      setCompletedSets([...completedSets, setIdentifier]);
    }
  };

  const renderSet = (exerciseId, { item, index }) => {
    if (!item) {
      return null; 
    }
    const isCompleted = completedSets.includes(`${exerciseId}-${item.id}`);
    return (
      <View style={[styles.setRow, isCompleted && styles.completedSetRow]}>
        <Text style={styles.setText}>{item.id}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={item.kg.toString()}
          onChangeText={(text) => {
            const newExercises = [...exercises];
            const exercise = newExercises.find((ex) => ex._id === exerciseId);
            exercise.sets[index].kg = text ? parseInt(text, 10) : 0;
            setExercises(newExercises);
          }}
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={item.reps.toString()}
          onChangeText={(text) => {
            const newExercises = [...exercises];
            const exercise = newExercises.find((ex) => ex._id === exerciseId);
            exercise.sets[index].reps = text ? parseInt(text, 10) : 0;
            setExercises(newExercises);
          }}
        />
        <TouchableOpacity
          style={styles.tickIcon}
          onPress={() => toggleSetCompletion(exerciseId, item.id)}
        >
          <FontAwesome
            name="check"
            size={24}
            color={isCompleted ? 'green' : 'white'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderExerciseHeader = (item) => {
    return (
      <View style={styles.header}>
        <Image
          source={{ uri: item.image || '' }}
          style={styles.exerciseImage}
        />
        <View>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.muscleName}>{item.primary}</Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TextInput
          style={styles.workoutTitleInput}
          placeholder="Enter workout title"
          placeholderTextColor="#999"
          value={workoutTitle}
          onChangeText={setWorkoutTitle}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={exercises}
        keyExtractor={(exercise) => (exercise._id ? exercise._id.toString() : '')}
        renderItem={({ item }) => (
          <View style={styles.exerciseContainer}>
            {renderExerciseHeader(item)}
            <View style={styles.table}>
              <View style={styles.headerRow}>
                <Text style={styles.columnHeader}>Set</Text>
                <Text style={styles.columnHeader}>KG</Text>
                <Text style={styles.columnHeader}>Reps</Text>
                <Text style={styles.columnHeader}>
                  <FontAwesome name="check" size={24} color="white" />
                </Text>
              </View>
              <FlatList
                data={item.sets || []}
                renderItem={({ item: set, index }) => renderSet(item._id, { item: set, index })}
                keyExtractor={(set, index) => `${item._id}-${index}`}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addSet(item._id)}
              >
                <Text style={styles.addButtonText}>Add Set</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={(
          <TouchableOpacity
            style={styles.addExerciseButton}
            onPress={addExercise}
          >
            <Text style={styles.addButtonText}>Add Exercise</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1C1C1E',
  },
  header: {
    marginBottom: 10,
  },
  workoutTitleInput: {
    height: 40,
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    color: '#FFF',
    marginBottom: 10,
    width: '100%',
  },
  exerciseContainer: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  muscleName: {
    fontSize: 16,
    color: '#999',
  },
  table: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 8,
  },
  columnHeader: {
    width: '25%',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedSetRow: {
    backgroundColor: '#006400',
  },
  setText: {
    width: '25%',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  input: {
    width: '25%',
    height: 40,
    color: 'white',
    textAlign: 'center',
  },
  tickIcon: {
    width: '25%',
    alignItems: 'center',
  },
  addButton: {
    marginTop: 5,
    borderWidth: 3,
    borderColor: '#FF4C0A',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    bottom: 25,
    top: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  addExerciseButton: {
    backgroundColor: '#FF4C0A',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
});

export default StartWorkout;
