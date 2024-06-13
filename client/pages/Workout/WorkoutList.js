import React, { useEffect, useState, useRef } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../Components/Config';

const WorkoutList = () => {
  const [search, setSearch] = useState('');
  const [workout, setWorkout] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const fetchExercises = async () => {
      console.log('Fetching');
      const response = await api.get('fitnet/getAllExercises');
      console.log(response.data); // Check the response structure
      setWorkout(response.data.exercises);
      setFilteredWorkouts(response.data.exercises);
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    if (selectedWorkouts.length > 0) {
      showAddButton();
    } else {
      hideAddButton();
    }
  }, [selectedWorkouts]);

  const showAddButton = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideAddButton = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = workout.filter(
        (item) =>
          item.name.toLowerCase().includes(text.toLowerCase()) ||
          item.primary.toLowerCase().includes(text.toLowerCase()) // Assuming 'primary' is correct
      );
      setFilteredWorkouts(filtered);
    } else {
      setFilteredWorkouts(workout);
    }
  };

  const handlePress = (id) => {
    if (selectedWorkouts.includes(id)) {
      setSelectedWorkouts(
        selectedWorkouts.filter((workoutId) => workoutId !== id)
      );
    } else {
      setSelectedWorkouts([...selectedWorkouts, id]);
    }
  };

  const renderWorkout = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item._id)}>
      <View
        style={[
          styles.workoutItem,
          selectedWorkouts.includes(item._id) && styles.selectedWorkoutItem,
        ]}
      >
        {selectedWorkouts.includes(item._id) && (
          <View style={styles.selectedIndicator} />
        )}
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.muscle}>{item.primary}</Text>
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
        keyExtractor={(item) => item._id}
        renderItem={renderWorkout}
        contentContainerStyle={styles.listContainer}
      />
      <Animated.View style={[styles.addButtonContainer, { transform: [{ translateY: slideAnim }] }]}>
        {selectedWorkouts.length > 0 && (
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add {selectedWorkouts.length} Exercise(s)</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

export default WorkoutList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
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
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
