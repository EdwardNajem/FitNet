import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useContext, useState } from 'react';
import {
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
import api from '../../Components/Config';
import GreyCircle from '../../Components/GreyCircle';
import WhiteLine from '../../Components/WhiteLine';
import { AuthContext } from '../../Context/authContext';
import { app } from '../../firebaseConfig';

const EditProfile = ({ navigation }) => {
  const storage = getStorage();
  const [state, setState] = useContext(AuthContext);
  const user = state?.user || {};

  const [image, setImage] = useState(user.avatar || '');
  const [username, setUsername] = useState(user.username || '');
  const [height, setHeight] = useState(user.height || 0);
  const [weight, setWeight] = useState(user.weight || 0);
  const [gender, setGender] = useState(user.gender || '');
  const [birthdate, setBirthDate] = useState(user.birthdate || '');

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
    const { email } = state.user;

    try {
      const savedImage = await uploadImage(image);

      const data = { email, username, avatar: savedImage };

      console.log('State:', state);
      setLoading(true);

      let response;
      if (state.type === 'Entrepreneur') {
        response = await api.put('api/v1/auth/updatenameentrep', data);
      } else {
        response = await api.put('api/v1/auth/updatenameinvestor', data);
      }
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
              />
              <Text style={styles.inputText}>Height (cm)</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.input2]}
                value={weight}
                onChangeText={(text) => setWeight(text)}
                keyboardType="numeric"
              />
              <Text style={styles.inputText}>Weight (kg)</Text>
            </View>
            <WhiteLine title={'Private Data'} />
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.input2]}
                value={gender}
                onChangeText={(text) => setGender(text)}
              />
              <Text style={styles.inputText}>Gender</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.input2]}
                value={weight}
                onChangeText={(text) => setWeight(text)}
                keyboardType="numeric"
              />
              <Text style={styles.inputText}>Weight (kg)</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
    flex: 1,
    //  height: windowHeight,
    backgroundColor: '#1C1C1E',
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
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingHorizontal: 1,
    color: '#fff',
  },
  input2: {
    paddingLeft: 80,
  },
  media: {
    flexDirection: 'row',
    marginBottom: 25,
    gap: 5,
  },
  inputText: {
    color: '#fff',
    position: 'absolute',
  },
});
