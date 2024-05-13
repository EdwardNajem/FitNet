import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    Alert.alert('Login', 'You have logged in');
  };

  const handleSignUpButton = () => {


    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../images/screen.png')}
        style={styles.imageContainer}
      >
        <View style={styles.blurOverlay} />

        <View style={styles.logoContainer}>
          <Image source={require('../../images/logo.png')} style={styles.logo} />
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.Emailinput}
            placeholder="Email"
            placeholderTextColor="#FFFFFF"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#FFFFFF"
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.dontHaveAccount}>Don't have an account?</Text>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUpButton}
          >
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  formContainer: {
    alignItems: 'center',
    padding: 20,
    bottom: 30,
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
  Emailinput: {
    width: 313,
    height: 54,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#FFFFFF',
    bottom: 20,
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
  signUpButton: {
    width: 313,
    height: 54,
    borderColor: '#FF4C0A',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signUpText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
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
});

export default LoginScreen;
