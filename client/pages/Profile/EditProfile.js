import DatePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import api from '../../Components/Config';
import GreyCircle from '../../Components/GreyCircle';
import LoadingAlert from '../../Components/LoadingAlert';
import WhiteLine from '../../Components/WhiteLine';
import { AuthContext } from '../../Context/authContext';
import { app } from '../../firebaseConfig';

const EditProfile = ({ navigation }) => {
  const storage = getStorage();
  const [state, setState] = useContext(AuthContext);
  const user = state?.user || {};

  useEffect(() => {
    console.log(user);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Extract day, month, and year components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();

    // Construct the date string in the desired format
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  };

  const userDateOfBirth = user.dateofbirth;
  const formattedDateOfBirth = formatDate(userDateOfBirth);

  const [image, setImage] = useState(user.avatar || '');
  const [username, setUsername] = useState(user.username || '');
  const [height, setHeight] = useState(user.height.toString() || '');
  const [weight, setWeight] = useState(user.weight.toString() || '');
  const [dateofbirth, setdateofbirth] = useState(formattedDateOfBirth || '');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [gender, setGender] = useState(user.gender || null);
  const [isFocus, setIsFocus] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const data = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate || date;
      hideDatePicker();
      setSelectedDate(currentDate);

      // Extract day, month, and year components
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // Months are zero-indexed
      const year = currentDate.getFullYear();

      // Construct the date string in the desired format
      const formattedDate = `${day}/${month}/${year}`;

      setdateofbirth(formattedDate);
    } else {
      hideDatePicker();
    }
  };

  const openImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      if (selectedAsset && selectedAsset.uri) {
        setImage(selectedAsset.uri);
      } else {
        console.error('Error: Selected asset or its URI is null.');
      }
    }
  };

  const uploadImage = async (imageUri) => {
    const resp = await fetch(imageUri);
    const blob = await resp.blob();
    const storageRef = ref(storage, 'FitNet/Profile/' + Date.now() + '.jpg');
    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  };

  const saveChangesClick = async () => {
    setErrorMessage('');
    const { _id } = state.user;

    // Validation checks
    if (!username) {
      setErrorMessage('Please fill in username field');
      return;
    }

    if (parseInt(height) <= 0) {
      setErrorMessage('Please enter a valid height');
      return;
    }

    if (parseInt(weight) <= 0) {
      setErrorMessage('Please enter a valid weight');
      return;
    }

    const currentDate = new Date();
    const birthdate = new Date(dateofbirth);

    if (birthdate >= currentDate) {
      setErrorMessage('Birthdate should be in the past');
      return;
    }

    try {
      setLoading(true);
      let savedImage = image; // Set savedImage to image by default

      // Check if image is different from user.avatar
      if (image !== user.avatar) {
        savedImage = await uploadImage(image);
      }

      const data = {
        _id,
        username,
        avatar: savedImage,
        height: parseInt(height),
        weight: parseInt(weight),
        dateofbirth,
        gender,
      };

      console.log('State:', state);

      const response = await api.put('fitnet/updateUserInfo', data);

      setLoading(false);

      if (response.status === 200) {
        console.log('Account Updated successfully\n');
        let UD = JSON.stringify(response.data);
        setState({ ...state, user: response.data.user });
        navigation.navigate('profile-tab');
      } else {
        console.error('Unexpected status:', response.status);
        setErrorMessage('Invalid Email or Password');
      }
    } catch (error) {
      console.error('Error occurred during sign up:', error);
      setLoading(false);
      setErrorMessage('Registration Failed');
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
        {loading && (
          <View style={styles.loadingContainer}>
            {loading && <LoadingAlert visible={loading} />}
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.centered}>
            <WhiteLine title={'Profile Picture'} />
            <TouchableOpacity
              onPress={openImageLibrary}
              style={styles.centered}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.avatar} />
              ) : (
                <GreyCircle size={150} />
              )}
              <Text style={styles.edittext}>Edit</Text>
            </TouchableOpacity>
            <WhiteLine title={'Username'} />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#fff"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
            <WhiteLine title={'Measurements'} />
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.input2]}
                value={height}
                onChangeText={(text) => setHeight(text)}
                keyboardType="numeric"
                placeholderTextColor="#fff"
              />
              <Text style={[styles.inputText, { color: '#fff' }]}>
                Height (cm)
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.input2]}
                value={weight}
                onChangeText={(text) => setWeight(text)}
                keyboardType="numeric"
                placeholderTextColor="#fff"
              />
              <Text style={[styles.inputText, { color: '#fff' }]}>
                Weight (kg)
              </Text>
            </View>
            <WhiteLine title={'Private Data'} />
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={[styles.datePickerTouchable, { flex: 1 }]}
                onPress={showDatePicker}
              >
                <Text style={styles.inputText}>Date Of Birth</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={[
                      styles.input,
                      {
                        backgroundColor: 'transparent',
                        paddingLeft: 100,
                        paddingTop: 10,
                        color: '#fff',
                      },
                    ]}
                  >
                    {dateofbirth}
                  </Text>
                </View>
              </TouchableOpacity>
              {datePickerVisible && (
                <DatePicker
                  value={selectedDate}
                  mode="date"
                  onChange={handleDateChange}
                />
              )}
            </View>
            <View style={styles.inputContainer}>
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Gender' : '...'}
                value={gender}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setGender(item.value);
                  setIsFocus(false);
                }}
              />
            </View>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            <TouchableOpacity
              style={[styles.Button, loading && styles.disabledButton]}
              onPress={() => saveChangesClick()}
              disabled={loading}
            >
              <Text style={styles.ButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 20,
    position: 'relative',
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 30, 0.5)',
  },
  content: {
    width: '100%',
    paddingHorizontal: 7,
  },
  centered: {
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 10,
  },
  edittext: {
    color: '#FF4C0A',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 40,
    // backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingHorizontal: 1,
    color: '#fff',
  },
  input2: {
    paddingLeft: 80,
  },
  inputText: {
    color: '#fff',
    position: 'absolute',
  },
  Button: {
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    padding: 15,
    marginTop: 24,
    width: 313,
  },
  ButtonText: {
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 23,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  datePickerTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    height: 50,
    borderColor: 'white',
    borderBottomWidth: 1,
    borderBttomRadius: 8,
    paddingRight: 8,
    width: '100%',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
    color: 'white',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
});
