import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ClockModal from '../Components/ClockModal';
import BookTrainerScreen from '../pages/Workout/BookTrainer';
import CreateWorkout from '../pages/Workout/CreateWorkout';
import FinishWorkoutScreen from '../pages/Workout/FinishWorkout';
import StartWorkoutScreen from '../pages/Workout/StartWorkout';
import TrainerScreen from '../pages/Workout/Trainer';
import TrainerInformationScreen from '../pages/Workout/TrainerInformation';
import WorkoutListScreen from '../pages/Workout/WorkoutList';
import WorkoutScreen from '../pages/Workout/WorkoutScreen';
import EditWorkout from '../pages/Workout/EditWorkout';
import WorkoutListEdit from '../pages/Workout/WorkoutListEdit'
import WorkoutListStartWorkout from '../pages/Workout/WorkoutListStartWorkout';
import Chat from '../pages/Messages/Chat';
import React from 'react';

const Stack = createStackNavigator();

const WorkoutNav = ({ setLoggedin, navigation }) => {

  
  React.useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      const currentRoute = e.data.state.routes[e.data.state.index];
      const leafRouteName = getCurrentRouteName(currentRoute);


      if (leafRouteName === "Chat") {
        navigation.setOptions({
          tabBarStyle: { display: 'none' }
        });
      } else {

        navigation.setOptions({
          tabBarStyle: { backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },

        });
      }
    });


    return unsubscribe;
  }, [navigation]);

  const getCurrentRouteName = (route) => {
    if (route.state) {
      return getCurrentRouteName(route.state.routes[route.state.index]);
    }
    return route.name;
  };

  return (
    <Stack.Navigator screenOptions={{ presentation: 'transparentModal' }}>
      <Stack.Screen
        name="Workout-Screen"
        component={WorkoutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Trainer"
        component={TrainerScreen}
        options={{
          headerTitle: 'Hire trainer',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="StartWorkout"
        component={StartWorkoutScreen}
        initialParams={{ selectedExercises: [] }}
        options={({ navigation }) => ({
          headerTitle: 'Workout',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
          // headerRight: () => (
          //   <View style={styles.headerView}>
          //     <ClockModal />
          //     <TouchableOpacity
          //       onPress={() => navigation.navigate('FinishWorkout')}
          //       style={styles.headerButton}
          //     >
          //       <Text style={styles.headerButtonText}>Finish</Text>
          //     </TouchableOpacity>
          //   </View>
          // ),
        })}
      />
      <Stack.Screen
        name="CreateWorkout"
        component={CreateWorkout}
        initialParams={{ selectedExercises: [] }}
        options={({ navigation }) => ({
          headerTitle: 'Create Workout',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="FinishWorkout"
        component={FinishWorkoutScreen}
        options={({ navigation }) => ({
          headerTitle: 'Finish Workout',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
          // headerRight: () => (
          //   <TouchableOpacity
          //     onPress={() => navigation.navigate('Workout-Screen')}
          //     style={styles.headerButton}
          //   >
          //     <Text style={styles.headerButtonText}>Skip</Text>
          //   </TouchableOpacity>
          // ),
        })}
      />

      <Stack.Screen
        name="WorkoutList"
        component={WorkoutListScreen}
        options={{
          headerTitle: 'Workout List',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="TrainerInformation"
        component={TrainerInformationScreen}
        options={{
          headerTitle: 'Trainer Information',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="BookTrainer"
        component={BookTrainerScreen}
        options={{
          headerTitle: 'Book Trainer',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="EditWorkout"
        component={EditWorkout}
        options={{
          headerTitle: 'Book Trainer',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="WorkoutListEdit"
        component={WorkoutListEdit}
        options={{
          headerTitle: 'Book Trainer',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="WorkoutListStartWorkout"
        component={WorkoutListStartWorkout}
        options={({ navigation }) => ({
          headerTitle: 'Finish Workout',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        })}
      />

    <Stack.Screen options={{ headerShown: false, presentation: 'transparentModal' }} name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

export default WorkoutNav;

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
});
