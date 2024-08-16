import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../Components/Config';
import CustomAlert from '../../Components/CustomAlert';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnteredPassword, setReEnteredPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userType, setUserType] = useState('User');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigation = useNavigation();

  // Function to open the custom alert
  const openAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // Function to close the custom alert
  const closeAlert = () => {
    setAlertVisible(false);
    navigation.navigate('Login');
  };

  const handleSignUp = async () => {
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');
    try {
      const data = { username, email, password, userType };
      const response = await api.post('fitnet/registeruser', data);

      if (response.status === 201) {
        console.log('Account created successfully:', data);
        openAlert(response.data.message);
      } else {
        console.log('Unexpected status:', response.status);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        const responseData = error.response.data;
        if (responseData && responseData.message) {
          if (error.response.status === 401)
            setUsernameError(responseData.message);
          if (error.response.status === 402)
            setEmailError(responseData.message);
          if (error.response.status === 403)
            setPasswordError(responseData.message);
          else {
            setErrorMessage(responseData.message);
          }
        } else {
          console.log('Unexpected error:', responseData);
        }
      } else {
        console.log('Error occurred during sign up:', error);
      }
    }
  };

  const handleSignInButton = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={closeAlert}
      />
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.imageContainer}>
        <ImageBackground
          source={require('../../assets/images/workout.jpg')}
          style={styles.backgroundImage}
        >
          <View style={styles.bottomLeft}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.inputContainer}>
        {usernameError ? (
          <Text style={styles.errorText}>{usernameError}</Text>
        ) : null}
        <TextInput
          style={[styles.input, usernameError && styles.inputError]}
          placeholder="Username"
          placeholderTextColor="#FFFFFF"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />

        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Email"
          placeholderTextColor="#FFFFFF"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        <TextInput
          style={[styles.input, passwordError && styles.inputError]}
          placeholder="Password"
          placeholderTextColor="#FFFFFF"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />

        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        <TextInput
          style={[styles.input, passwordError && styles.inputError]}
          placeholder="Re-enter Password"
          placeholderTextColor="#FFFFFF"
          value={reEnteredPassword}
          onChangeText={(text) => setReEnteredPassword(text)}
          secureTextEntry
        />

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => setUserType('User')}
            style={[
              styles.toggleButton,
              userType === 'User' && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                userType === 'User' && styles.activeText,
              ]}
            >
              User
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUserType('Gym')}
            style={[
              styles.toggleButton,
              userType === 'Gym' && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                userType === 'Gym' && styles.activeText,
              ]}
            >
              Gym
            </Text>
          </TouchableOpacity>
        </View>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => handleSignUp()}
      >
        <Text style={styles.signUpText2}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.logInView}>
        <Text style={styles.HaveAccount}>Already have an account?</Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignInButton}
        >
          <Text style={styles.logInText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#1C1C1E',
    height: windowHeight + 100,
  },
  imageContainer: {
    width: '100%',
    height: 250,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginBottom: 20,
    marginLeft: 20,
  },
  signUpText2: {
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 23,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  inputContainer: {
    marginTop: 24,
  },
  input: {
    width: 313,
    height: 54,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#FFFFFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  toggleButton: {
    backgroundColor: '#FF4C0A',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#FFFFFF',
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  activeText: {
    color: '#FF4C0A',
  },
  signUpButton: {
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    padding: 15,
    marginTop: 24,
    width: 313,
  },
  signUpText: {
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 23,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  alreadyHaveAccount: {
    fontSize: 15,
    lineHeight: 43,
    color: '#FFFFFF',
    marginTop: 12,
  },
  logInText: {
    color: '#FF4C0A',
    fontSize: 15,
    fontWeight: '400',
    marginTop: 10,
  },
  HaveAccount: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '400',
    marginTop: 10,
  },
  logInView: {
    flexDirection: 'row',
    gap: 5,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
});
