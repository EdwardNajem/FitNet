import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList
} from 'react-native';

const workouts = [
    { id: 1, name: 'Push-Up', muscle: 'Chest', image: require('../../assets/images/logo.png') },
    { id: 2, name: 'Squat', muscle: 'Legs', image: require('../../assets/images/logo.png') },
    { id: 3, name: 'Bicep Curl', muscle: 'Biceps', image: require('../../assets/images/logo.png') },
];

const WorkoutList = () => {
  const [search, setSearch] = useState('');
  const [filteredWorkouts, setFilteredWorkouts] = useState(workouts);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = workouts.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.muscle.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredWorkouts(filtered);
    } else {
      setFilteredWorkouts(workouts);
    }
  };

  const handlePress = (id) => {
    if (selectedWorkouts.includes(id)) {
      setSelectedWorkouts(selectedWorkouts.filter((workoutId) => workoutId !== id));
    } else {
      setSelectedWorkouts([...selectedWorkouts, id]);
    }
  };

  const renderWorkout = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.id)}>
      <View style={[styles.workoutItem, selectedWorkouts.includes(item.id) && styles.selectedWorkoutItem]}>
        {selectedWorkouts.includes(item.id) && <View style={styles.selectedIndicator} />}
        <Image source={item.image} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.muscle}>{item.muscle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search workouts"
        placeholderTextColor="#999"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredWorkouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWorkout}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default WorkoutList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
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
  searchBar: {
    height: 40,
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    color: '#FFF',
    margin: 10,
  },
  listContainer: {
    padding: 10,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#2F2F2F',
    borderRadius: 10,
  },
  selectedWorkoutItem: {
    backgroundColor: '#2F2F2F',
    borderColor: '#FF4C0A',
    borderWidth: 1,
    paddingLeft: 15,
    marginLeft: -10,
  },
  selectedIndicator: {
    width: 5,
    height: '100%',
    backgroundColor: '#FF4C0A',
    position: 'absolute',
    left: 0,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  muscle: {
    color: '#999',
    fontSize: 14,
  },
});
