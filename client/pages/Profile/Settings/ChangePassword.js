import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../../Components/Config';
import CustomAlert from '../../../Components/CustomAlert';
import { AuthContext } from '../../../Context/authContext';

const ChangePassword = () => {
  const [state] = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassError, setOldPassError] = useState('');
  const [newPassError, setNewPassError] = useState('');
  const [generalError, setGeneralError] = useState('');
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
    navigation.goBack();
  };

  const handleChangePassword = async () => {
    setOldPassError('');
    setNewPassError('');
    setGeneralError('');

    try {
      const response = await api.put('fitnet/updateUserPassword', {
        _id: state.user._id,
        oldPassword,
        newPassword,
      });

      if (response.data.success) {
        console.log(response.data.message);
        openAlert(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;

        if (errorMessage.includes('old password')) {
          setOldPassError(errorMessage);
        } else if (errorMessage.includes('new password')) {
          setNewPassError(errorMessage);
        } else {
          setGeneralError(errorMessage);
        }
      } else {
        setGeneralError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={closeAlert}
      />
      <StatusBar backgroundColor="#2F2F2F" />
      <Text style={styles.header1}>Change Password</Text>
      {generalError ? (
        <Text style={styles.errorText}>{generalError}</Text>
      ) : null}
      {oldPassError ? (
        <Text style={styles.errorText}>{oldPassError}</Text>
      ) : null}
      <TextInput
        style={[styles.input, oldPassError && styles.inputError]}
        placeholder="Enter Old Password"
        placeholderTextColor="#FFFFFF"
        value={oldPassword}
        onChangeText={(text) => setOldPassword(text)}
        secureTextEntry
        autoCapitalize="none"
      />
      {newPassError ? (
        <Text style={styles.errorText}>{newPassError}</Text>
      ) : null}
      <TextInput
        style={[styles.input, newPassError && styles.inputError]}
        placeholder="Enter New Password"
        placeholderTextColor="#FFFFFF"
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleChangePassword}
      >
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 54,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
    color: '#FFFFFF',
  },
  buttonContainer: {
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    width: '100%',
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
    marginBottom: 30,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
});
