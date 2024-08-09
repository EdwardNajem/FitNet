import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../pages/SocialMedia/Home';
import SearchScreen from '../pages/SocialMedia/Search';
import NotificationScreen from '../pages/SocialMedia/Notifications';
import UserProfileScreen from '../pages/SocialMedia/UserProfile';
import { Ionicons } from '@expo/vector-icons';
const HomeNav = ({ setLoggedin })=> {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
       screenOptions={{
        presentation: 'transparentModal',
      }}>
     <Stack.Screen
        name="Home-Screen"
        component={HomeScreen}
        options={{ headerShown: false, presentation: 'transparentModal' }}
      
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          headerTitle: 'Notifications',
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
       <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
        <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  )
}

export default HomeNav

const styles=StyleSheet.create({
  Button: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
})