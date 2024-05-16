import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
export default function SignUp() {
  const [gender, setGender] = useState('Male'); 
  const[height,setHeight] = useState('');
  const [weight,setWeight] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnteredPassword, setReEnteredPassword] = useState('');
  const [userType, setUserType] = useState('User');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobText, setDobText] = useState('Date of birth');
  const [dob, setDOB] = useState(new Date());
  const navigation=useNavigation()
  const handleSignUp = () => {

    navigation.navigate('OTP');
  };


  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDOB(currentDate);
    setDobText(currentDate.toLocaleDateString());
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/images/workout.jpg')}
        style={styles.backgroundImage}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Height (CM)"
          placeholderTextColor="#FFFFFF"
          value={height}
          onChangeText={(text) => setHeight(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight (KG)"
          placeholderTextColor="#FFFFFF"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#FFFFFF"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <View>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePicker}
          >
            <Text style={styles.dateText}>{dobText}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dob}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.signUpButton}>
        <Text style={styles.signUpText} onPress={handleSignUp}>
          Sign Up
        </Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.alreadyHaveAccount}>
          Already have an account? Sign in
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#1C1C1E',
    paddingTop: 0, 
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
  picker: {
    height: 50, 
    width: '100%', 
    marginBottom: 20,
    backgroundColor: '#f5f5f5', 
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
},
datePicker: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
},
dateText: {
    fontSize: 16,
    color: '#333',
},
});