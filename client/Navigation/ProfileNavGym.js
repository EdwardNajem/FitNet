import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import EditProfile from '../pages/Profile/EditProfile';
import ProfileScreen from '../pages/Profile/ProfileScreen';
import ChangeEmail from '../pages/Profile/Settings/ChangeEmail';
import ChangePassword from '../pages/Profile/Settings/ChangePassword';
import ContactUs from '../pages/Profile/Settings/ContactUs';
import SettingsScreen from '../pages/Profile/SettingsScreen';
import Chat from '../pages/Messages/Chat';

const ProfileNavGym = ({ setLoggedin, navigation }) => {
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

      <Stack.Screen options={{ headerShown: false, presentation: 'transparentModal' }} name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

export default ProfileNavGym;