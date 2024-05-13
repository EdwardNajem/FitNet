import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnteredPassword, setReEnteredPassword] = useState('');
  const [userType, setUserType] = useState('User');
  const navigation=useNavigation()
  const handleSignUp = () => {
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Re-entered Password:', reEnteredPassword);
    console.log('User Type:', userType);
    navigation.navigate('OTP');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../images/workout.jpg')} style={styles.backgroundImage} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#FFFFFF"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#FFFFFF"
          value={email}
          onChangeText={text => setEmail(text)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#FFFFFF"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Re-enter Password"
          placeholderTextColor="#FFFFFF"
          value={reEnteredPassword}
          onChangeText={text => setReEnteredPassword(text)}
          secureTextEntry
        />
        <View style={styles.toggleContainer}>
          <TouchableOpacity onPress={() => setUserType('User')} style={[styles.toggleButton, userType === 'User' && styles.activeButton]}>
            <Text style={[styles.toggleText, userType === 'User' && styles.activeText]}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setUserType('Gym')} style={[styles.toggleButton, userType === 'Gym' && styles.activeButton]}>
            <Text style={[styles.toggleText, userType === 'Gym' && styles.activeText]}>Gym</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity>
      <Text style={styles.alreadyHaveAccount}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start', 
    backgroundColor: '#1C1C1E',
    paddingTop: 35, 
  },
  backgroundImage: {
    width: '100%',
    height: 220, 
  },
  signUpTitle: {
    fontWeight: '600',
    fontSize: 32,
    lineHeight: 43,
    color: '#FFFFFF',
    marginTop: 6,
  },
  knowYouBetter: {
    fontSize: 20,
    lineHeight: 43,
    color: '#FFFFFF',
    marginTop: 6,
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
});
