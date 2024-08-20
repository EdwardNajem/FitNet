import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Image, StatusBar, View } from 'react-native';
import HomeLogo from '../client/assets/icons/home.png';
import ProfileLogo from '../client/assets/icons/profile.png';
import WorkoutLogo from '../client/assets/icons/workout.png';
import { AuthProvider } from './Context/authContext';
import HomeNav from './Navigation/HomeNav';
import ProfileNav from './Navigation/ProfileNav';
import WorkoutNav from './Navigation/WorkoutNav';
import GetStartedScreen from './pages/GetStarted';
import LoginScreen from './pages/Login/LoginScreen';
import OTPScreen from './pages/Login/OTPScreen';
import SignUpScreen from './pages/Login/SignUp';
import { CommentProvider } from './pages/Profile/Settings/CommentContext';
import HomeNavGym from './Navigation/HomeNavGym';
import ProfileNavGym from './Navigation/ProfileNavGym';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

export default function App() {
  const [loggedin, setLoggedin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // const user = await AsyncStorage.removeItem('@auth');
        const user = JSON.parse(await AsyncStorage.getItem('@auth'));
        if (user) {
          setUserType(user.user.usertype);
          setLoggedin(true);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  if (loading) {
    <View style={{ backgroundColor: '#1C1C1E' }}>
      <StatusBar />
      <Image source={HomeLogo} />
    </View>;
  }

  if (loggedin) {
    return (
      <NavigationContainer>
        <CommentProvider>
          <AuthProvider>
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                presentation: 'transparentModal',
                tabBarActiveTintColor: tabOptions.activeTintColor,
                tabBarInactiveTintColor: tabOptions.inactiveTintColor,
                tabBarStyle: tabOptions.style,
                tabBarLabelStyle: tabOptions.labelStyle,
                tabBarLabel: '',
              }}
            >
              <Tab.Screen
                name="Home"
                options={{
                  tabBarIcon: ({ focused }) => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: 10,
                      }}
                    >
                      <Image
                        source={HomeLogo}
                        style={{
                          width: 35,
                          height: 35,
                          tintColor: focused ? '#FF4C0A' : '#fff',
                        }}
                      />
                    </View>
                  ),
                }}
              >
                {(props) => 
                  userType === "Attendee" ? (
                    <HomeNav {...props} setLoggedin={setLoggedin} />
                  ) : (
                    <HomeNavGym {...props} setLoggedin={setLoggedin} />
                  )
                }
              </Tab.Screen>
              {userType=="Attendee"&&<Tab.Screen
                name="Workout"
                component={WorkoutNav}
                options={{
                  tabBarIcon: ({ focused }) => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: 10,
                      }}
                    >
                      <Image
                        source={WorkoutLogo}
                        style={{
                          width: 36,
                          height: 25.02,
                          tintColor: focused ? '#FF4C0A' : '#fff',
                        }}
                      />
                    </View>
                  ),
                }}
              />}
              <Tab.Screen
                name="Profile"
                options={{
                  tabBarIcon: ({ focused }) => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: 10,
                      }}
                    >
                      <Image
                        source={ProfileLogo}
                        style={{
                          width: 27,
                          height: 34.4,
                          tintColor: focused ? '#FF4C0A' : '#fff',
                        }}
                      />
                    </View>
                  ),
                }}
              >
                {(props) => 
                  userType === "Attendee" ? (
                    <ProfileNav {...props} setLoggedin={setLoggedin} />
                  ) : (
                    <ProfileNavGym {...props} setLoggedin={setLoggedin} />
                  )
                }
              </Tab.Screen>
            </Tab.Navigator>
          </AuthProvider>
        </CommentProvider>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            presentation: 'transparentModal',
          }}
        >
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="OTP">
            {(props) => <OTPScreen {...props} setLoggedin={setLoggedin} />}
          </Stack.Screen>
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
