import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from 'react-native';
import api from '../../Components/Config';

const OTPScreen = ({ route, setLoggedin }) => {
  const { email } = route.params;
  const [otp, setOTP] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = { email };
        const response = await api.post('fitnet/sendOtp', data);
        if (response.status === 200) {
          console.log('OTP sent successfully');
          setGeneratedOtp(response.data?.otp);
        } else {
          setErrorMessage(response.data?.message || 'Invalid OTP');
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setErrorMessage(
            error.response.data?.message || 'Internal Server Error'
          );
        } else {
          setErrorMessage('Failed to send OTP');
        }
      }
    };

    fetchData();
  }, [email]);

  const handleVerifyOTP = () => {
    if (otp === generatedOtp) {
      console.log('OTP verified successfully');
      setLoggedin(true);
    } else {
      setErrorMessage('Invalid OTP');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1C1C1E" />
      <Text style={styles.header1}>Enter your One-Time Password</Text>
      <Text style={styles.header2}>
        We have sent you an email with the password
      </Text>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TextInput
        style={[styles.input, errorMessage && styles.inputError]}
        placeholder="Enter One-time Password"
        placeholderTextColor="#FFFFFF"
        value={otp}
        onChangeText={(text) => setOTP(text)}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => handleVerifyOTP()}
      >
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonContainer: {
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    padding: 15,
    marginTop: 24,
    width: 313,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 23,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  header1: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  header2: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 10,
  },
});

export default OTPScreen;
