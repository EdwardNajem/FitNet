import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutScreen from '../pages/Workout/WorkoutScreen';
import TrainerScreen from '../pages/Workout/Trainer';
import StartWorkoutScreen from '../pages/Workout/StartWorkout';
import FinishWorkoutScreen from '../pages/Workout/FinishWorkout';
import WorkoutListScreen from '../pages/Workout/WorkoutList';
const WorkoutNav = ({ setLoggedin }) => {
  const Stack = createStackNavigator();

  const FinishButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.Button}>
      <Text style={styles.ButtonText}>Finish</Text>
    </TouchableOpacity>
  );

  const PostButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.Button}>
      <Text style={styles.ButtonText}>Post</Text>
    </TouchableOpacity>
  );


  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'transparentModal',
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
        name="Workout-Screen"
        component={WorkoutScreen}
      />
      <Stack.Screen
        name="Trainer"
        component={TrainerScreen}
        options={{
          headerTitle: 'Hire trainer',
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="StartWorkout"
        component={StartWorkoutScreen}
        options={({ navigation }) => ({
          headerTitle: 'Workout',
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
          headerRight: () => (
            <FinishButton onPress={() => navigation.navigate("FinishWorkout")} />
          ),
        })}
      />

      <Stack.Screen
        name="FinishWorkout"
        component={FinishWorkoutScreen}
        options={({ navigation }) => ({
          headerTitle: 'Finish Workout',
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
          headerRight: () => (
            <PostButton onPress={() => navigation.goBack()} />
          ),
        })}
      />


      <Stack.Screen
        name="WorkoutList"
        component={WorkoutListScreen}
        options={{
          headerTitle: 'WorkoutList',
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />


    </Stack.Navigator>
  );
};

export default WorkoutNav;

const styles = StyleSheet.create({
  Button: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  ButtonText: {
    color: '#FF4C0A',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
