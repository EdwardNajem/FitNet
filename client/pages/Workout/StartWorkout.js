import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Duration from '../../Components/Duration';
import WeightReps from '../../Components/WeightReps';
import BodyWeight from '../../Components/BodyWeight';  
import WeightedBodyWeight from '../../Components/WeightedBodyWeight';
import WeightDistance from '../../Components/WeightDistance';
import AssistedBodyWeight from '../../Components/AssistedBodyWeight';
import ClockModal from '../../Components/ClockModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../Components/Config';
import CustomAlert from '../../Components/CustomAlert';
import { AuthContext } from '../../Context/authContext';

const StartWorkout = ({ route, navigation }) => {
  const { selectedWorkouts = [] } = route.params || {};
  const { selectedWorkoutPlan } = route.params || {};
const [exercises, setExercises] = useState([]);
const [workoutTitle, setWorkoutTitle] = useState();
const [isEditingTitle, setIsEditingTitle] = useState(false);
const [modalVisible, setModalVisible] = useState(false);
const [state] = useContext(AuthContext);
const [finishedPressed, setFinishedPressed] = useState(false);

console.log(state.user)

const handleCloseModal = () => {
  setModalVisible(false);
}

const handleOpenModal = () => {
  setModalVisible(true);
}

React.useEffect(() => {
  const unsubscribe = navigation.addListener('beforeRemove', (e) => {
    e.preventDefault();

    if(!finishedPressed){
      Alert.alert(
        'Quitting?',
        'Are you sure you want to quit this workout?',
        [
          { text: "No", style: 'cancel', onPress: () => {} },
          {
            text: 'Yes',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    }else{
      navigation.dispatch(e.data.action)
    }
  });

  return unsubscribe;
}, [navigation, finishedPressed]);

React.useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <View style={styles.headerView}>
        <ClockModal />
        <TouchableOpacity
          onPress={async () => {
            console.log(totalSetsRef.current);
            console.log(completedSetsRef.current.length);
            if(totalSetsRef.current==completedSetsRef.current.length){
              await updateWorkoutPlan();
              try {
                // now lets go calculate the total time and volume
                const data = {
                  endTime: new Date(),
                  workoutId: selectedWorkoutPlan._id,
                }

                const response = await api.post('/fitnet/finishWorkout', data);

                if(response){
                  // console.log(response.data);
                  setFinishedPressed(true);
                  navigation.navigate('FinishWorkout', {
                    workoutData: response.data.data,
                    workoutPlanId: selectedWorkoutPlan._id,
                  });
                }
              } catch (error) {
                console.log(error)
              }
            }else{
              handleOpenModal();
            }
            
          }}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    ),
  });
}, [navigation, exercises, workoutTitle]);

const updateWorkoutPlan = async () => {
  try {
    const user = JSON.parse(await AsyncStorage.getItem('@auth'));

    const data  = {
      title: workoutTitle,
      exercises: exercises,
    };

    const response = await api.put(`fitnet/updateWorkoutPlanById/${selectedWorkoutPlan._id}`, data);

    if(response){
      // alert('Workout updated');
    }
  } catch (error) {
    console.log(error)
    alert("There was an error while finishing your workout, make sure you have entered at least 1 set for all the exercices")
  }
};

useEffect(() => {
  if (route.params.selectedWorkoutPlan.exercises.length > 0) {
      if(selectedWorkouts.length>0){
          const combinedArray = route.params.selectedWorkoutPlan.exercises.concat(selectedWorkouts);
          setExercises(combinedArray)
      }else{
          setExercises(route.params.selectedWorkoutPlan.exercises);
      }
  }
  if (route.params.selectedWorkoutPlan.title){
      setWorkoutTitle(route.params.selectedWorkoutPlan.title);
  }
}, [navigation]);

useEffect(() => {
  // console.log("Selected workouts: " + selectedWorkouts)
  const combinedArray = route.params.selectedWorkoutPlan.exercises.concat(selectedWorkouts);
  setExercises(combinedArray)
}, [route.params.selectedWorkouts]);

const [completedSets, setCompletedSets] = useState([]);
const [totalSets, setTotalSets] = useState(0);
const totalSetsRef = useRef(totalSets);
const completedSetsRef = useRef(completedSets);

useEffect(() => {
  // calculate the total amount of sets
  let total = 0;
  for (let index = 0; index < exercises.length; index++) {
    const element = exercises[index];
    total += element.sets?element.sets.length:0;
  }
  setTotalSets(total);
  console.log("Total: " + total)
}, [exercises])

useEffect(() => {
  completedSetsRef.current = completedSets;
}, [completedSets]);

useEffect(() => {
  totalSetsRef.current = totalSets;
}, [totalSets]);

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
      const newSet = { id: (exercise.sets ? (exercise.sets.length>0 ? exercise.sets[exercise.sets.length-1].id : 0): 0) + 1 ,meters:0,kg: 0, reps: 0, time: '00:00' };
      return { ...exercise, sets: exercise.sets ? [...exercise.sets, newSet] : [newSet] };
    }
    return exercise;
  });
  console.log(updatedExercises[0].sets);
  setExercises(updatedExercises);
};

//   const handleTitleChange = (text) => {
//     setWorkoutTitle(text);
//   };

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
        userWeight={state.user.weight}
      />
    </View>
  );
};

return (
  <View style={styles.container}>
    <View style={styles.titleContainer}>
      {isEditingTitle ? (
        <TextInput
          style={styles.titleInputBox}
          value={workoutTitle}
          onChangeText={(value) => {
              setWorkoutTitle(value);
          }}
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
    {exercises.length === 0 ? (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>No exercises selected.</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('WorkoutListStartWorkout', {
            selectedWorkoutPlan: selectedWorkoutPlan,
        })}
        >
          <Text style={styles.addButtonText}>Add Exercise</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('WorkoutListStartWorkout', {
              selectedWorkoutPlan: selectedWorkoutPlan,
          })}
          >
            <Text style={styles.addButtonText}>Add Exercise</Text>
          </TouchableOpacity>
        )}
      />
    )}
    <CustomAlert visible={modalVisible} message={"Make sure you finish all your sets"} onClose={handleCloseModal}/>
  </View>
);
};

const styles = StyleSheet.create({
headerView: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingRight: 10,
},
headerButton: {
  marginLeft: 10,
  paddingVertical: 8,
  paddingHorizontal: 8,
  borderRadius: 4,
},
headerButtonText: {
  color: '#FF4C0A',
  fontSize: 18,
  fontWeight: 'bold',
},
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
  width:'100%',
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
headerButtonText: {
  color: '#FF4C0A',
  fontSize: 18,
  fontWeight: 'bold',
},
headerButton: {
  marginLeft: 10,
  paddingVertical: 8,
  paddingHorizontal: 8,
  borderRadius: 4,
},
});

export default StartWorkout;
