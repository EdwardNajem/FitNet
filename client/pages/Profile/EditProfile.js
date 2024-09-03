import DatePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../Components/Config';
import GreyCircle from '../../Components/GreyCircle';
import LoadingAlert from '../../Components/LoadingAlert';
import WhiteLine from '../../Components/WhiteLine';
import { AuthContext } from '../../Context/authContext';
import { app } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import MapPicker from '../../Components/MapPicker';
import MapView, { Marker } from 'react-native-maps';

const EditProfile = ({ navigation }) => {

  const dataStatus = [
    { label: 'Open', value: 'open' },
    { label: 'Closed', value: 'closed' },
  ];

  const [mapVisible, setMapVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({
      latitude,
      longitude,
    });
    // setMapVisible(false);
  };

  // const [value, setValue] = useState(null);
  // const [isFocusStatus, setIsFocusStatus] = useState(false);
  // const [openingTime, setOpeningTime] = useState(new Date());
  // const [closingTime, setClosingTime] = useState(new Date());

  const [showOpeningTimePickers, setShowOpeningTimePickers] = useState(new Array(7).fill(false));
  const [showClosingTimePickers, setShowClosingTimePickers] = useState(new Array(7).fill(false));
  const [isFocus, setIsFocus] = useState(false);

  const handleStatusChange = (index, newStatus) => {
    const updatedWorkingHours = [...workingHours];
    updatedWorkingHours[index].status = newStatus;
    setWorkingHours(updatedWorkingHours);
  };

  const handleTimeChange = (event, selectedDate, index, isOpeningHour) => {
    if (selectedDate) {
      const updatedWorkingHours = [...workingHours];
      if (isOpeningHour) {
        updatedWorkingHours[index].openingHour = selectedDate;
      } else {
        updatedWorkingHours[index].closingHour = selectedDate;
      }
      setWorkingHours(updatedWorkingHours);
    }
  };

  const toggleTimePicker = (index, isOpeningPicker) => {
    if (isOpeningPicker) {
      const updatedPickers = [...showOpeningTimePickers];
      updatedPickers[index] = !updatedPickers[index];
      setShowOpeningTimePickers(updatedPickers);
    } else {
      const updatedPickers = [...showClosingTimePickers];
      updatedPickers[index] = !updatedPickers[index];
      setShowClosingTimePickers(updatedPickers);
    }
  };

  const storage = getStorage();
  const [state, setState] = useContext(AuthContext);
  const user = state?.user || {};

  // useEffect(() => {
  //   console.log(userDateOfBirth);
  // }, []);

  useEffect(() => {
    if(user.usertype=="Gym"){
      getGymDetails();
    }
  }, [])

  const getGymDetails = async () => {
    try {
      const response = await api.get(`/fitnet/getGymDetails/${user._id}`);
  
      if (response.data.success) {
        const { workingHours, subscriptionFee, gymLocation } = response.data.data;
  
        // Convert date strings to Date objects
        const formattedWorkingHours = workingHours.map(hour => ({
          ...hour,
          openingHour: new Date(hour.openingHour),
          closingHour: new Date(hour.closingHour),
        }));
  
        // Set state with the formatted data
        setWorkingHours(formattedWorkingHours);
        setSubscriptionFees(subscriptionFee);
        setSelectedLocation(gymLocation);
      } else {
        console.error('Failed to fetch gym details:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching gym details:', error);
    }
  };

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
  let formattedDateOfBirth;
  if (userDateOfBirth) {
    formattedDateOfBirth = formatDate(userDateOfBirth);
  } else {
    formattedDateOfBirth = '';
  }
  const [image, setImage] = useState(user.avatar || '');
  const [username, setUsername] = useState(user.username || '');
  
  const [height, setHeight] = useState(user.height?.toString() || '');
  const [weight, setWeight] = useState(user.weight?.toString() || '');
  const [dateofbirth, setdateofbirth] = useState(formattedDateOfBirth || '');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [gender, setGender] = useState(user.gender || null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [workingHours, setWorkingHours] = useState([]);
  const [subscriptionFees, setSubscriptionFees] = useState();
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
      quality: 0.5,
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
    if (!imageUri) {
      return null;
    }

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

    let birthdate = null;
    if (dateofbirth && dateofbirth !== 'NaN/NaN/NaN') {
      const birthdateParts = dateofbirth.split('/');
      birthdate = new Date(
        birthdateParts[2],
        birthdateParts[1] - 1,
        birthdateParts[0]
      );

      if (isNaN(birthdate.getTime())) {
        setErrorMessage('Please enter a valid birthdate');
        return;
      }
    }

    const currentDate = new Date();

    if (birthdate && birthdate >= currentDate) {
      setErrorMessage('Please enter a valid birthdate in the past');
      return;
    }

    try {
      setLoading(true);
      let savedImage = image;

      if (image !== user.avatar) {
        savedImage = await uploadImage(image);
      }

      const data = {
        usertype: user.usertype,
        _id,
        username,
        avatar: savedImage,
        height: parseInt(height),
        weight: parseInt(weight),
        dateofbirth: dateofbirth !== 'NaN/NaN/NaN' ? dateofbirth : null,
        gender,
        subscriptionFees,
        workingHours,
        selectedLocation,
      };

      console.log('Sending data to API:', JSON.stringify(data, null, 2)); // Pretty-print the data

      const response = await api.put('fitnet/updateUserInfo', data);

      setLoading(false);

      if (response.status === 200) {
        console.log('Account Updated successfully\n', response.data);
        setState({ ...state, user: response.data.user });
        updateUserObject(response.data.user);
        // await AsyncStorage.setItem('@auth', JSON.stringify(response.data));
        navigation.navigate('profile-tab');
      } else {
        console.error('Unexpected status:', response.status, response.data);
        setErrorMessage('An error occurred while updating profile.');
      }
    } catch (error) {
      console.error('Error occurred during profile update:', error);

      if (error.response) {
        console.error('Server responded with error:', error.response.data);
        setErrorMessage(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setErrorMessage('No response from server');
      } else {
        console.error('Error in setting up request:', error.message);
        setErrorMessage('Error occurred during request setup');
      }

      setLoading(false);
    }
  };

  const updateUserObject = async (newUserData) => {
    try {
      // Step 1: Retrieve the existing data from AsyncStorage
      const jsonValue = await AsyncStorage.getItem('@auth');
  
      if (jsonValue !== null) {
        // Step 2: Parse the JSON string into an object
        const authData = JSON.parse(jsonValue);
  
        // Step 3: Update the user object with the new data
        authData.user = { ...authData.user, ...newUserData };
  
        // Step 4: Convert the updated object back to a JSON string
        const updatedJsonValue = JSON.stringify(authData);
  
        // Step 5: Store the updated JSON string back into AsyncStorage
        await AsyncStorage.setItem('@auth', updatedJsonValue);
  
        console.log('User object updated successfully!');
      } else {
        console.log('No auth data found');
      }
    } catch (e) {
      console.error('Failed to update user object in AsyncStorage:', e);
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
                placeholderTextColor="#ffffff50"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
            {(state.user.usertype=="Attendee"||state.user.usertype=="trainer")&&<>
            <WhiteLine title={'Measurements'} />
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.input2]}
                value={height}
                onChangeText={(text) => setHeight(text)}
                keyboardType="numeric"
                placeholderTextColor="#ffffff50"
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
                placeholderTextColor="#ffffff50"
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
            </>}
            {state.user.usertype=="Gym"&&<>
              <WhiteLine title={'Working Hours'} />
              {workingHours.map((workingHour, index) => (
                <View key={index} style={{ flexDirection: 'row', display: 'flex', alignSelf: 'flex-start', marginHorizontal: 15 }}>
                  <Text style={styles.label}>{workingHour.day}:</Text>
                  <View style={styles.inputContainer}>
                    <Dropdown
                      style={[styles.statusDropdown, isFocus && { borderColor: 'blue' }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={dataStatus}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Status' : '...'}
                      value={workingHour.status}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={(item) => {
                        handleStatusChange(index, item.value);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                  {workingHour.status === 'open' && (
                    <View style={{ gap: 4, display: 'flex', flexDirection: 'row' }}>
                      <TouchableOpacity onPress={() => toggleTimePicker(index, true)} style={styles.timePicker}>
                        <Text style={styles.timeText}>{workingHour.openingHour.toLocaleTimeString()}</Text>
                      </TouchableOpacity>
                      {showOpeningTimePickers[index] && (
                        <DateTimePicker
                          value={workingHour.openingHour}
                          mode="time"
                          is24Hour={true}
                          display="default"
                          onChange={(event, selectedDate) => {
                            handleTimeChange(event, selectedDate, index, true);
                            toggleTimePicker(index, true);
                          }}
                        />
                      )}
                      <TouchableOpacity onPress={() => toggleTimePicker(index, false)} style={styles.timePicker}>
                        <Text style={styles.timeText}>{workingHour.closingHour.toLocaleTimeString()}</Text>
                      </TouchableOpacity>
                      {showClosingTimePickers[index] && (
                        <DateTimePicker
                          value={workingHour.closingHour}
                          mode="time"
                          is24Hour={true}
                          display="default"
                          onChange={(event, selectedDate) => {
                            handleTimeChange(event, selectedDate, index, false);
                            toggleTimePicker(index, false);
                          }}
                        />
                      )}
                    </View>
                  )}
                </View>
              ))}
            </>}

            {state.user.usertype=="Gym"&&<>
              <WhiteLine title={'Subscription Fees'} />
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Subscription Fees"
                  placeholderTextColor="#ffffff50"
                  value={String(subscriptionFees)}
                  keyboardType='numeric'
                  onChangeText={(text) => setSubscriptionFees(text)}
                />
              </View>
            </>}

            {/* <View style={{ flex: 1 }}> */}
            {state.user.usertype === 'Gym' && (
              <>
                <WhiteLine title={'Gym Location'} />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setMapVisible(true)}
                >
                  <Text style={styles.buttonText}>Select Location</Text>
                </TouchableOpacity>

                {/* Map Modal for Selecting Location */}
                <Modal visible={mapVisible} animationType="slide">
                  <View style={{ flex: 1 }}>
                    <MapView
                      style={{ flex: 1 }}
                      initialRegion={{
                        latitude: 33.888629,
                        longitude: 35.495480,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                      onPress={handleMapPress}
                    >
                      {selectedLocation && (
                        <Marker
                          coordinate={selectedLocation}
                          title="Selected Location"
                        />
                      )}
                    </MapView>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setMapVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>

                {/* Non-interactive Map Below the Select Button */}
                {selectedLocation && (
                  <MapView
                    style={styles.mapPreview}
                    region={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                  >
                    <Marker coordinate={selectedLocation} />
                  </MapView>
                )}
              </>
            )}
          {/* </View> */}

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
  button: {
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 80,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapPreview: {
    marginTop: 10,
    width: '95%',
    height: 200,
    borderRadius: 10,
  },
  WorkingHourscontainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  container: {
    alignItems: 'flex',
    paddingBottom: 20,
    position: 'relative',
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  label: {
    fontSize: 16,
    // marginVertical: 10,
    marginVertical: 'auto',
    color: 'white',
    width: 50,
  },
  timePicker: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 'auto',
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center'
  },
  timeText: {
    fontSize: 16,
    color: '#FF4C0A',
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
    justifyContent: 'space-between',
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
  statusDropdown: {
    height: 50,
    borderColor: 'white',
    borderBottomWidth: 1,
    borderBttomRadius: 8,
    // paddingRight: 8,
    // width: '50%',
    width: 90,
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
    color: 'white'
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
});
