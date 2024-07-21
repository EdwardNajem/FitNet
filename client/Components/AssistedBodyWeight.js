import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import WeightModal from './WeightModal';

const AssistedBodyWeight = ({ exercise, exercises, setExercises, completedSets, toggleSetCompletion, addSet }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleWeightSubmit = (weight) => {
    setModalVisible(false);
    console.log('Submitted weight:', weight);
  };

  const renderSet = (exerciseId, { item, index }) => {
    if (!item) {
      return null;
    }
    const isCompleted = completedSets.includes(`${exerciseId}-${item.id}`);
    return (
      <View style={[styles.setRow, isCompleted && styles.completedSetRow]}>
        <Text style={styles.setText}>{item.id}</Text>
        <Text style={styles.previousText}>0</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={item.kg.toString()}
          onChangeText={(text) => {
            const newExercises = exercises.map(ex => {
              if (ex._id === exerciseId) {
                const updatedSets = ex.sets.map((set, idx) => (idx === index ? { ...set, kg: text } : set));
                return { ...ex, sets: updatedSets };
              }
              return ex;
            });
            setExercises(newExercises);
          }}
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={item.reps.toString()}
          onChangeText={(text) => {
            const newExercises = exercises.map(ex => {
              if (ex._id === exerciseId) {
                const updatedSets = ex.sets.map((set, idx) => (idx === index ? { ...set, reps: text } : set));
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
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconContainer}>
          <FontAwesome6 name="weight-scale" size={30} color="#FF4C0A" />
        </TouchableOpacity>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.columnHeader}>Set</Text>
        <Text style={styles.columnHeader}>Previous</Text>
        <Text style={styles.columnHeader}>-KG</Text>
        <Text style={styles.columnHeader}>Reps</Text>
        <Text style={styles.columnHeader}><FontAwesome name="check" size={24} color="white" /></Text>
      </View>
      <FlatList
        data={exercise.sets || []}
        renderItem={({ item, index }) => renderSet(exercise._id, { item, index })}
        keyExtractor={(set, index) => `${exercise._id}-${index}`}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addSet(exercise._id, { kg: '0', reps: '0', previous: '0' })}
      >
        <Text style={styles.addButtonText}>Add Set</Text>
      </TouchableOpacity>
      <WeightModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleWeightSubmit}
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
    justifyContent: 'space-between',
  },
  exerciseImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    flexShrink: 1, 
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  muscleName: {
    fontSize: 16,
    color: '#CCC',
  },
  iconContainer: {
    padding: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 8,
  },
  columnHeader: {
    width: '20%',
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
    width: '20%',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  previousText: {
    width: '20%',
    height: 40,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 40,
  },
  input: {
    width: '20%',
    height: 40,
    color: 'white',
    textAlign: 'center',
    borderRadius: 5,
  },
  tickIcon: {
    width: '20%',
    alignItems: 'center',
  },
  addButton: {
    marginTop: 5,
    borderWidth: 3,
    borderColor: '#FF4C0A',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AssistedBodyWeight;
