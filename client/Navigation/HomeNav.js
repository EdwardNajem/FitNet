import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../pages/SocialMedia/Home';

const HomeNav = ({ setLoggedin })=> {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
       screenOptions={{
        presentation: 'transparentModal',
      }}>
     <Stack.Screen
        options={{ headerShown: false, presentation: 'transparentModal' }}
        name="Home-Screen"
        component={HomeScreen}
      />
    </Stack.Navigator>
  )
}

export default HomeNav

const styles = StyleSheet.create({})