import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../pages/SocialMedia/Home';
import SearchScreen from '../pages/SocialMedia/Search';
import NotificationScreen from '../pages/SocialMedia/Notifications';
import UserProfileScreen from '../pages/SocialMedia/UserProfile';
import { Ionicons } from '@expo/vector-icons';
import CreatePostGymScreen from '../pages/SocialMedia/CreatePostGymScreen';
import Chat from '../pages/Messages/Chat';
const HomeNavGym = ({ setLoggedin, navigation })=> {
  const Stack = createStackNavigator();

  const tabOptions = {
    activeTintColor: '#FF4C0A',
    inactiveTintColor: '#ADB5B9',
    style: {
      backgroundColor: '#1C1C1E',
      height: 70,
      borderTopWidth: 0,
    },
    labelStyle: {
      fontSize: 12,
    },
  };

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
          tabBarStyle: tabOptions.style ,
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
      <Stack.Screen
        name="Create-Post-Gym"
        component={CreatePostGymScreen}
        options={{
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen options={{ headerShown: false, presentation: 'transparentModal' }} name="Chat" component={Chat} />
    </Stack.Navigator>
  )
}

export default HomeNavGym

const styles=StyleSheet.create({
  Button: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
})