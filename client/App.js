import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GetStartedScreen from './pages/GetStarted';
import LoginScreen from './pages/Login/LoginScreen';
import OTPScreen from './pages/Login/OTPScreen';
import SignUpScreen from './pages/Login/SignUp';
import SignUpInfoScreen from './pages/Login/SignUpInformation';
import MainProfileScreen from './pages/Profile/MainProfile';
import { AuthProvider } from './Context/authContext';

const Stack = createStackNavigator();

export default function App() {
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
            {(props) => <OTPScreen {...props}/>}
          </Stack.Screen>
          <Stack.Screen name="SignUpInfo" component={SignUpInfoScreen} />
          <Stack.Screen name="MainProfile" component={MainProfileScreen} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
