import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GetStartedScreen from './pages/GetStarted';
import LoginScreen from './pages/Login/LoginScreen';
import SignUpScreen from './pages/Login/SignUp';
import OTPScreen from './pages/Login/OTP';
import SignUpInfoScreen from './pages/Login/SignUpInformation';
import MainProfileScreen from './pages/Profile/MainProfile'
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, presentation: 'transparentModal' }}
      >
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="SignUpInfo" component={SignUpInfoScreen} />
        <Stack.Screen name="MainProfile" component={MainProfileScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
