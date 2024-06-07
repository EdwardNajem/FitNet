import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const StartWorkout = ({navigation}) => {
  const [sets, setSets] = useState([{ id: 1, kg: 0, reps: 0 }]);

  const addSet = () => {
    setSets([...sets, { id: sets.length + 1, kg: 0, reps: 0 }]);
  };

  const addExercise = () => {
  navigation.navigate('WorkoutList')
  };

  const renderSet = ({ item, index }) => (
    <View style={styles.setRow}>
      <Text style={styles.setText}>{item.id}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={item.kg.toString()}
        onChangeText={(text) => {
          const newSets = [...sets];
          newSets[index].kg = text ? parseInt(text) : 0;
          setSets(newSets);
        }}
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={item.reps.toString()}
        onChangeText={(text) => {
          const newSets = [...sets];
          newSets[index].reps = text ? parseInt(text) : 0;
          setSets(newSets);
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/logo.png')} style={styles.exerciseImage} />
        <Text style={styles.exerciseName}>Exercise</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.columnHeader}>Set</Text>
          <Text style={styles.columnHeader}>KG</Text>
          <Text style={styles.columnHeader}>Reps</Text>
        </View>
        <FlatList
          data={sets}
          renderItem={renderSet}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={addSet}>
        <Text style={styles.addButtonText}>Add Set</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addExerciseButton} onPress={addExercise}>
      
        <Text style={styles.addButtonText}>Add Exercise</Text>
      </TouchableOpacity>
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
    width: 60,
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
  setText: {
    width: 60,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  input: {
    width: 60,
    height: 40,
    color: 'white',
    textAlign: 'center',
    marginLeft: 'auto',
  },
  addButton: {
    marginTop: 5,
    borderWidth: 3,
    borderColor: '#FF4C0A',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    bottom:25,
    top:15,

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
    top:25,
  },
});

export default StartWorkout;