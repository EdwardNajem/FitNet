import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import api from '../../Components/Config';
import GreyCircle from '../../Components/GreyCircle';
import LoadingAlert from '../../Components/LoadingAlert';
import { AuthContext } from '../../Context/authContext';

const TrainerRegister = ({ navigation }) => {
  const storage = getStorage();
  const [state, setState] = useContext(AuthContext);
  const user = state?.user || {}; // Ensure user is defined

  const [certificateImage, setCertificateImage] = useState('');
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
  ];

  const openImageLibrary = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Changed to Images only
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      if (selectedAsset && selectedAsset.uri) {
        setImage(selectedAsset.uri);
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
  
    // Validate inputs
    if (!user.username) {
      setErrorMessage('Please fill in the username field');
      return;
    }
    if (!type) {
      setErrorMessage('Please select a type');
      return;
    }
    
    try {
      setLoading(true);
  
      // Upload certificate if needed
      const uploadedCertificate = certificateImage
        ? await uploadImage(certificateImage)
        : user.certificate;
  
      // Prepare data for the API request
      const data = {
        username: user.username,
        certificate: uploadedCertificate,
        type,
        userId: user._id
      };
  
      console.log('Sending data to API:', JSON.stringify(data, null, 2));
  
      // API request
      const response = await api.post('fitnet/registerTrainer', data);
  
      setLoading(false);
  
      if (response.status === 201) {
        console.log('Trainer request submitted successfully\n', response.data);
        navigation.navigate('profile-tab');
      } else {
        console.error('Unexpected status:', response.status, response.data);
        setErrorMessage('An error occurred while submitting the trainer request.');
      }
    } catch (error) {
      console.error('Error occurred during trainer registration:', error);
      setErrorMessage('Error occurred during trainer registration');
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
            <Text style={styles.label}>Username</Text>
            <Text style={styles.uneditableInput}>{user.username || 'N/A'}</Text>

            <Text style={styles.label}>Type</Text>
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

            <Text style={styles.label}>Trainer Certificate</Text>
            <TouchableOpacity onPress={() => openImageLibrary(setCertificateImage)} style={styles.centered}>
              {certificateImage ? (
                <Image source={{ uri: certificateImage }} style={styles.avatar} />
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
              onPress={saveChangesClick}
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
  label: {
    color: '#FFF',
    marginBottom: 5,
    fontWeight: '600',
  },
  uneditableInput: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingHorizontal: 1,
    color: '#fff',
    textAlignVertical: 'center',
    textAlign: 'left',
    paddingTop: 10,
    marginBottom: 15,
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
    marginBottom: 15,
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
