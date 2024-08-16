import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from 'expo-image-picker';
import ImageWithDelete from '../Workout/ImageWithDelete';
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../Components/Config";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

export default function CreatePostGymScreen({ navigation}) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');
    const storage = getStorage();

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
        const storageRef = ref(storage, 'FitNet/GymPosts/' + Date.now() + '-' + userId + '.jpg');
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        return downloadUrl;
    };

    const handlePost = async () => {

        const user = JSON.parse(await AsyncStorage.getItem('@auth'));
    
        let data;
    
        if(!selectedImage){
          data = {
            postType: "text",
            description: description,
            createdBy: user.user._id,
          }
        }else{
          savedImage = await uploadImage(selectedImage, user.user._id);
          data = {
            postType: "image-gym",
            description: description,
            createdBy: user.user._id,
            imageURL: savedImage,
          }
        }
    
        try {
          const response = await api.post('/fitnet/uploadPost', data);
    
          if(response){
            // console.log(response);
            navigation.goBack();
          }
        } catch (error) {
          console.log(error)
        }
    
    }

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <TextInput
                style={styles.descriptionInput}
                placeholder="Write a description..."
                placeholderTextColor="#999"
                multiline
                value={description}
                onChangeText={setDescription}
            />
            {!selectedImage &&<TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                <AntDesign name="plus" size={30} color="#FF4C0A" />
            </TouchableOpacity>}
            {selectedImage &&
            <ImageWithDelete
                selectedImage={selectedImage}
                onDelete={() => setSelectedImage(null)}
            />
            }
            <TouchableOpacity style={styles.submitButton} onPress={() => {handlePost()}}>
                <Text style={styles.submitButtonText}>Post</Text>
            </TouchableOpacity>
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
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
      width: '100%',
      height: 200,
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
      height:'11%',
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