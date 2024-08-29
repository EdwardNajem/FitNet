import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import EditProfile from '../pages/Profile/EditProfile';
import ProfileScreen from '../pages/Profile/ProfileScreen';
import ChangeEmail from '../pages/Profile/Settings/ChangeEmail';
import ChangePassword from '../pages/Profile/Settings/ChangePassword';
import ContactUs from '../pages/Profile/Settings/ContactUs';
import SettingsScreen from '../pages/Profile/SettingsScreen';
import TrainerRegister from '../pages/Profile/TrainerRegister';
import SearchGyms from '../pages/Profile/SearchGyms';
import ProfileGym from '../pages/Profile/ProfileGym';
import GymProfile from '../pages/Profile/GymProfile';
import Chat from '../pages/Messages/Chat';
const ProfileNav = ({ setLoggedin, navigation }) => {
  const Stack = createStackNavigator();

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
    <Stack.Navigator
      screenOptions={{
        presentation: 'transparentModal',
      }}
    >
      <Stack.Screen
        options={{ headerShown: false, presentation: 'transparentModal' }}
        name="profile-tab"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTitle: 'Edit Profile',
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        options={{
          headerTitle: 'Settings',
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      >
        {() => <SettingsScreen setLoggedin={setLoggedin} />}
      </Stack.Screen>
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerTitle: 'Change Password',
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="ChangeEmail"
        component={ChangeEmail}
        options={{
          headerTitle: 'Change Email',
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          headerTitle: 'Contact Us',
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="TrainerRegister"
        component={TrainerRegister}
        options={{
          headerTitle: 'Trainer Registeration',
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="SearchGyms"
        component={SearchGyms}
        options={{
          headerTitle: 'Search Gyms',
          headerStyle: {
            backgroundColor: '#2F2F2F',
          },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="GymProfile"
        component={GymProfile}
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
  );
};

export default ProfileNav;
