import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import EditProfile from '../pages/Profile/EditProfile';
import ProfileScreen from '../pages/Profile/ProfileScreen';
import ChangeEmail from '../pages/Profile/Settings/ChangeEmail';
import ChangePassword from '../pages/Profile/Settings/ChangePassword';
import ContactUs from '../pages/Profile/Settings/ContactUs';
import SettingsScreen from '../pages/Profile/SettingsScreen';

const ProfileNav = ({ setLoggedin }) => {
  const Stack = createStackNavigator();

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
    </Stack.Navigator>
  );
};

export default ProfileNav;
