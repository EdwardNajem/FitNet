import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesome,AntDesign } from '@expo/vector-icons';
import WorkoutSettingModal from './WorkoutSettingsModal';
import { Swipeable } from 'react-native-gesture-handler';

const BodyWeight = ({ exercise, exercises, setExercises, completedSets, toggleSetCompletion, addSet }) => {
  const [workoutSettingsVisible, setWorkoutSettingsVisible] = useState(false);

  
  const handleEditWeight = () => {
    console.log('Edit Weight');
    setWorkoutSettingsVisible(false);
  };

  const handleDeleteWorkout = (exerciseToRemove) => {
    setExercises((prevExercises) => prevExercises.filter(exercise => exercise !== exerciseToRemove));
    setWorkoutSettingsVisible(false);
  };

  const handleDeleteSet = (exerciseToRemoveFrom, setIdToRemove) => {
    setExercises((prevExercises) => {
      return prevExercises.map((exercise) => {
        if (exercise === exerciseToRemoveFrom) {
          // Filter out the set to be deleted
          return {
            ...exercise,
            sets: exercise.sets.filter(set => set.id !== setIdToRemove),
          };
        }
        return exercise;
      });
    });
  };

  const renderSet = (exerciseId, { item, index }) => {
    if (!item) {
      return null;
    }
    const isCompleted = completedSets.includes(`${exerciseId}-${item.id}`);

    const renderRightActions = (item) => (
      <TouchableOpacity style={[styles.action, styles.decline]} onPress={()=> handleDeleteSet(exercise, item.id)}>
        <AntDesign name="delete" size={24} color="#fff" />
      </TouchableOpacity>
    );

    return (
      <>
      {!isCompleted&&<Swipeable
        key={index}
        renderRightActions={() => renderRightActions(item)}
      >
        <View style={[styles.setRow, isCompleted && styles.completedSetRow]}>
          <Text style={styles.setText}>{item.id}</Text>
          <Text style={styles.previousText}>{item.reps}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={item.currentReps?item.currentReps:'0'}
            onChangeText={(text) => {
              const newExercises = exercises.map(ex => {
                if (ex._id === exerciseId) {
                  const updatedSets = ex.sets.map((set, idx) => (idx === index ? { ...set, currentReps: text } : set));
                  return { ...ex, sets: updatedSets };
                }
                return ex;
              });
              setExercises(newExercises);
            }}
          />
          <TouchableOpacity style={styles.tickIcon} onPress={() => toggleSetCompletion(exerciseId, item.id)}>
            <FontAwesome name="check" size={24} color={isCompleted ? 'green' : 'white'} />
          </TouchableOpacity>
        </View>
      </Swipeable>}
      {isCompleted&&
        <View style={[styles.setRow, isCompleted && styles.completedSetRow]}>
          <Text style={styles.setText}>{item.id}</Text>
          <Text style={styles.previousText}>{item.reps}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={item.currentReps?item.currentReps:'0'}
            onChangeText={(text) => {
              const newExercises = exercises.map(ex => {
                if (ex._id === exerciseId) {
                  const updatedSets = ex.sets.map((set, idx) => (idx === index ? { ...set, currentReps: text } : set));
                  return { ...ex, sets: updatedSets };
                }
                return ex;
              });
              setExercises(newExercises);
            }}
          />
          <TouchableOpacity style={styles.tickIcon} onPress={() => toggleSetCompletion(exerciseId, item.id)}>
            <FontAwesome name="check" size={24} color={isCompleted ? 'green' : 'white'} />
          </TouchableOpacity>
        </View>}
      </>
    );
  };

  return (
    <View style={styles.table}>
      <View style={styles.header}>
        <Image source={{ uri: exercise.image || '' }} style={styles.exerciseImage} />
        <View style={styles.textContainer}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.muscleName}>{exercise.primary}</Text>
        </View>
        <TouchableOpacity onPress={() => setWorkoutSettingsVisible(true)} style={styles.iconContainer}>
          <AntDesign name="ellipsis1" size={24} color="#FFFFFF" style={{ transform: [{ rotate: '90deg' }] }} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.columnHeader}>Set</Text>
        <Text style={styles.columnHeader}>Previous</Text>
        <Text style={styles.columnHeader}>Reps</Text>
        <Text style={styles.columnHeader}><FontAwesome name="check" size={24} color="white" /></Text>
      </View>
      <FlatList
        data={exercise.sets || []}
        renderItem={({ item, index }) => renderSet(exercise._id, { item, index })}
        keyExtractor={(set, index) => `${exercise._id}-${index}`}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => addSet(exercise._id)}>
        <Text style={styles.addButtonText}>Add Set</Text>
      </TouchableOpacity>
      <WorkoutSettingModal
        visible={workoutSettingsVisible}
        onClose={() => setWorkoutSettingsVisible(false)}
        onEdit={handleEditWeight}
        onDelete={() => handleDeleteWorkout(exercise)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  muscleName: {
    fontSize: 16,
    color: '#CCC',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
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
    backgroundColor: '#333',
    borderRadius: 10,
    height:55,
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
  previousText: {
    width: '25%',
    height: 40,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 40, 
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
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    width: 55
  },
  accept: {
    backgroundColor: 'green',
    borderRadius: 10,
  
  },
  decline: {
    backgroundColor: 'red',
    borderRadius: 10,
  },
});

export default BodyWeight;
