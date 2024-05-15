import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutScreen from '../pages/Workout/WorkoutScreen';
import TrainerScreen from '../pages/Workout/Trainer';
const WorkoutNav = ({ setLoggedin }) => {
  const Stack = createStackNavigator();

  return ( 
    <Stack.Navigator
    screenOptions={{
     presentation: 'transparentModal',
   }}>
  <Stack.Screen
     options={{ headerShown: false, presentation: 'transparentModal' }}
     name="Workout-Screen"
     component={WorkoutScreen}
   />
   <Stack.Screen
     options={{ headerShown: false, presentation: 'transparentModal' }}
     name="Trainer"
     component={TrainerScreen}
   />
 </Stack.Navigator>
  )
}

export default WorkoutNav

const styles = StyleSheet.create({})