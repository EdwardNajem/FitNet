import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../Components/Config';
import { AuthContext } from '../../Context/authContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');
    try {
      const data = { email, password };
      const response = await api.post('fitnet/loginuser', data);
      if (response.status == 200) {
        console.log('Account logged in successfully:');
        await AsyncStorage.setItem('@auth', JSON.stringify(data));
        navigation.navigate('OTP', { email });
      } else {
        setErrorMessage(response.data?.message || 'Invalid Email or Password');
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setErrorMessage(
          error.response.data?.message
        );
      if(error.response && error.response.status === 400){
         setErrorMessage(
           error.response.data?.message || 'Internal Server Error'
         );
      }
      } else {
        setErrorMessage('Sign in Failed');
      }
    }
       console.log('Email:', email);
       console.log('Password:', password);
  };

  const handleSignUpButton = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../images/screen.png')}
        style={styles.imageContainer}
      >
        <View style={styles.blurOverlay} />

        <View style={styles.logoContainer}>
          <Image
            source={require('../../images/logo.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.formContainer}>
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <TextInput
            style={[styles.input, emailError && styles.inputError]}
            placeholder="Email"
            placeholderTextColor="#FFFFFF"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
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
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.signUpView}>
            <Text style={styles.dontHaveAccount}>Don't have an account?</Text>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUpButton}
            >
              <Text style={styles.signUpText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  formContainer: {
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: 313,
    height: 54,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
    color: '#FFFFFF',
  },
  Emailinput: {
    width: 313,
    height: 54,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
    color: '#FFFFFF',
  },
  loginButton: {
    width: 313,
    height: 54,
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  signUpText: {
    color: '#FF4C0A',
    fontSize: 15,
    fontWeight: '400',
    marginTop: 10,
  },
  dontHaveAccount: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '400',
    marginTop: 10,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  forgotPasswordText: {
    color: '#FF4C0A',
    fontSize: 15,
    fontWeight: '400',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logo: {
    width: 150,
    height: 150,
  },
  signUpView: {
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

export default LoginScreen;
