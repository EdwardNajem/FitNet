import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import api from '../../Components/Config';

const PAGE_SIZE = 10;

const WorkoutList = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [workout, setWorkout] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      // Simulating fetching exercises from an API
      const response = await api.get('fitnet/getAllExercises');
      const allExercises = response.data.exercises;
      setWorkout(allExercises);
      setFilteredWorkouts(allExercises.slice(0, PAGE_SIZE));
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && filteredWorkouts.length < workout.length) {
      const nextPage = page + 1;
      const nextExercises = workout.slice(
        nextPage * PAGE_SIZE - PAGE_SIZE,
        nextPage * PAGE_SIZE
      );
      setPage(nextPage);
      setFilteredWorkouts((prevWorkouts) => [
        ...prevWorkouts,
        ...nextExercises,
      ]);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    filterWorkouts(text, selectedMuscleGroup);
  };

  const clearSearch = () => {
    setSearch('');
    filterWorkouts('', selectedMuscleGroup);
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

  const handleAddExercises = () => {
    const selectedExercises = workout.filter((ex) =>
      selectedWorkouts.includes(ex._id)
    );
    navigation.navigate('StartWorkout', { selectedExercises });
  };

  const handleMuscleGroupSelect = (muscle) => {
    setSelectedMuscleGroup(muscle);
    filterWorkouts(search, muscle);
  };

  const clearMuscleGroup = () => {
    setSelectedMuscleGroup(null);
    filterWorkouts(search, null);
  };

  const filterWorkouts = (searchText, muscleGroup) => {
    let filtered = workout;

    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.primary.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (muscleGroup) {
      filtered = filtered.filter((item) => item.primary === muscleGroup);
    }

    setFilteredWorkouts(filtered.slice(0, page * PAGE_SIZE));
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search workouts"
          placeholderTextColor="#999"
          value={search}
          onChangeText={handleSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>X</Text>
          </TouchableOpacity>
        )}
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={muscleGroups} // Assuming you have fetched muscle groups separately
          maxHeight={300}
          labelField="name" // Assuming the field name for muscle group in database is 'name'
          valueField="_id" // Assuming the field name for ID in database is '_id'
          placeholder="Select Muscle"
          value={selectedMuscleGroup}
          onChange={(item) => handleMuscleGroupSelect(item._id)}
        />
        {selectedMuscleGroup && (
          <TouchableOpacity
            onPress={clearMuscleGroup}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>X</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={filteredWorkouts}
        keyExtractor={(item) => item._id}
        renderItem={renderWorkout}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && <Text style={styles.loadingText}>Loading...</Text>
        }
      />
      {selectedWorkouts.length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddExercises}
        >
          <Text style={styles.addButtonText}>
            Add {selectedWorkouts.length} Exercise(s)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    color: '#FFF',
  },
  clearButton: {
    padding: 10,
  },
  clearButtonText: {
    color: '#FFF',
    fontSize: 16,
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
  addButton: {
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 3,
    marginBottom: 20,
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#FFF',
    textAlign: 'center',
    padding: 10,
  },
  dropdown: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  placeholderStyle: {
    fontSize: 14,
    color: 'white',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: 'white',
  },
});

export default WorkoutList;
