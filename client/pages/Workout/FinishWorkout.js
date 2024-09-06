import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Switch } from 'react-native-gesture-handler';
import ImageWithDelete from './ImageWithDelete';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../Components/Config';

const FinishWorkout = ({ route, navigation }) => {
  const storage = getStorage();
  const {workoutData} = route.params || {};
  const {workoutPlanId} = route.params || {};
  const [rating, setRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const isEnabledRef = useRef(isEnabled);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    isEnabledRef.current = isEnabled;
  }, [isEnabled]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Finish Workout',
      headerStyle: { backgroundColor: '#2F2F2F' },
      headerTintColor: '#DFE7EB',
      headerShadowVisible: false,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Workout-Screen');
            setIsEnabled(true);
            handlePost('private');
          }}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>Skip</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handlePost = async (postVisibility) => {

    const user = JSON.parse(await AsyncStorage.getItem('@auth'));

    let data;

    if(isEnabledRef.current){
      data = {
        postType: "workout",
        description: description.length>0?description:'no desc',
        workoutData: workoutData,
        createdBy: user.user._id,
        workoutPlanId: workoutPlanId,
        postVisibility: postVisibility,
      }
    }else{
      savedImage = await uploadImage(selectedImage, user.user._id);
      data = {
        postType: "image",
        description: description.length>0?description:'no desc',
        workoutData: workoutData,
        createdBy: user.user._id,
        imageURL: savedImage,
        postVisibility: postVisibility,
      }
    }

    try {
      const response = await api.post('/fitnet/uploadPost', data);

      if(response){
        // console.log(response);
        navigation.navigate('Workout-Screen');
      }
    } catch (error) {
      console.log(error)
    }

  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (imageUri, userId) => {
    if (!imageUri) {
      return null;
    }

    const resp = await fetch(imageUri);
    const blob = await resp.blob();
    const storageRef = ref(storage, 'FitNet/Posts/' + Date.now() + '-' + userId + '.jpg');
    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} mins` : `${minutes} mins`;
  };
  
  const formatWeight = (weight) => {
    return weight.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.exerciseName}>Exercise</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Time</Text>
            <Text style={styles.statValue}>{formatTime(workoutData.duration)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Volume</Text>
            <Text style={styles.statValue}>{formatWeight(workoutData.volume)} KG</Text>
          </View>
        </View>


      

        <View style={styles.postTypeContainer}>
          <Text style={styles.postTypeText}>Upload workout plan only</Text>
          <Switch
            trackColor={{false: '#767577', true: '#FF4C0A50'}}
            thumbColor={isEnabled ? '#FF4C0A' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        { !isEnabled&&
        <>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <AntDesign name="plus" size={30} color="#FF4C0A" />
          </TouchableOpacity>

          {/* {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />} */}
          {selectedImage &&
          <ImageWithDelete
            selectedImage={selectedImage}
            onDelete={() => setSelectedImage(null)}
          />
          }
        </>
        }

        <TextInput
          style={styles.descriptionInput}
          placeholder="Write a description..."
          placeholderTextColor="#999"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.submitButton} onPress={() => {handlePost('public')}}>
          <Text style={styles.submitButtonText}>Post</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FinishWorkout;

const styles = StyleSheet.create({
  headerButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  headerButtonText: {
    color: '#FF4C0A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  postTypeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  postTypeText: {
    color: 'white',
    fontSize: 18
  },
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#2F2F2F',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  exerciseName: {
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  trainerTitle: {
    fontSize: 20,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  trainerFeedback: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#2F2F2F',
    borderRadius: 10,
    padding: 10,
    // marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trainerImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 10,
  },
  trainerName: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: {
    marginRight: 5,
    marginLeft: 25,
  },
  timestamp: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  imagePicker: {
    width: 100,
    height: 100,
    backgroundColor: '#2F2F2F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  descriptionInput: {
    backgroundColor: '#2F2F2F',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    height: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF4C0A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: '#2F2F2F',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    height:'17%',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  statValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
