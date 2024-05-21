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

const ChangeEmail = () => {
  const [state, setState] = useContext(AuthContext);
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [oldEmailError, setOldEmailError] = useState('');
  const [newEmailError, setNewEmailError] = useState('');
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

  const handleChangeEmail = async () => {
    setOldEmailError('');
    setNewEmailError('');
    setGeneralError('');

    try {
      const response = await api.put('fitnet/updateUserEmail', {
        _id: state.user._id,
        oldEmail,
        newEmail,
      });

      if (response.data.success) {
        console.log(response.data.message);
        let UD = JSON.stringify(response.data);
        setState({ ...state, user: response.data.user });
        openAlert(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;

        if (errorMessage.includes('old email')) {
          setOldEmailError(errorMessage);
        } else if (errorMessage.includes('new email')) {
          setNewEmailError(errorMessage);
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
      <Text style={styles.header1}>Change Email</Text>
      {generalError ? (
        <Text style={styles.errorText}>{generalError}</Text>
      ) : null}
      {oldEmailError ? (
        <Text style={styles.errorText}>{oldEmailError}</Text>
      ) : null}
      <TextInput
        style={[styles.input, oldEmailError && styles.inputError]}
        placeholder="Enter Old Email"
        placeholderTextColor="#FFFFFF"
        value={oldEmail}
        onChangeText={(text) => setOldEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {newEmailError ? (
        <Text style={styles.errorText}>{newEmailError}</Text>
      ) : null}
      <TextInput
        style={[styles.input, newEmailError && styles.inputError]}
        placeholder="Enter New Email"
        placeholderTextColor="#FFFFFF"
        value={newEmail}
        onChangeText={(text) => setNewEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleChangeEmail}
      >
        <Text style={styles.buttonText}>Change Email</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangeEmail;

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
