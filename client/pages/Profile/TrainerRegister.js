import DatePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useContext, useState } from 'react';
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

const TrainerRegister = ({ navigation }) => {
  const storage = getStorage();
  const [state, setState] = useContext(AuthContext);
  const user = state?.user || {};

  const [image, setImage] = useState('');
  const [type, setType] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const typeData = [
    { label: 'Strength Conditioning', value: 'Strength Conditioning' },
    { label: 'Cardio Training', value: 'Cardio Training' },
    { label: 'Bodybuilding', value: 'Bodybuilding' },
    { label: 'Weightlifting', value: 'Weightlifting' },
    { label: 'Functional Training', value: 'Functional Training' },
    // Add more types as needed
  ];

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
    if (!imageUri) {
      return null;
    }

    const resp = await fetch(imageUri);
    const blob = await resp.blob();
    const storageRef = ref(storage, 'FitNet/TrainerCertificate/' + Date.now() + '.jpg');
    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  };

  const saveChangesClick = async () => {
    setErrorMessage('');
    const { _id } = state.user;

    // Validation checks
    if (!user.username) {
      setErrorMessage('Please fill in username field');
      return;
    }
    if (!type) {
      setErrorMessage('Please select a type');
      return;
    }

    try {
      setLoading(true);
      let savedImage = image;

      if (image !== user.certificate) {
        savedImage = await uploadImage(image);
      }

      const data = {
        _id,
        username: user.username,
        certificate: savedImage,
        type,
      };

      console.log('Sending data to API:', JSON.stringify(data, null, 2)); // Pretty-print the data

      // Replace the api call with the correct one that matches your backend setup

      setLoading(false);

      if (response.status === 200) {
        console.log('Account Updated successfully\n', response.data);
        setState({ ...state, user: response.data.user });
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
            <WhiteLine title={'Username'} />
            <View style={styles.inputContainer}>
              <Text style={styles.uneditableInput}>{user.username}</Text>
            </View>
            <WhiteLine title={'Type'} />
            <View style={styles.inputContainer}>
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={typeData}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Type' : '...'}
                value={type}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setType(item.value);
                  setIsFocus(false);
                }}
              />
            </View>
            <WhiteLine title={'Trainer Certificate'} />
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
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            <TouchableOpacity
              style={[styles.Button, loading && styles.disabledButton]}
              onPress={() => saveChangesClick()}
              disabled={loading}
            >
              <Text style={styles.ButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default TrainerRegister;

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
  uneditableInput: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingHorizontal: 1,
    color: '#fff',
    textAlignVertical: 'center',
    textAlign: 'left',
    paddingTop: 10,
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
  dropdown: {
    height: 50,
    borderColor: 'white',
    borderBottomWidth: 1,
    paddingRight: 8,
    width: '100%',
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
