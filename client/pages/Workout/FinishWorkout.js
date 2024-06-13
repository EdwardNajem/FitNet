import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const FinishWorkout = () => {
  const [rating, setRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.exerciseName}>Exercise</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Time</Text>
            <Text style={styles.statValue}>45 mins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Reps</Text>
            <Text style={styles.statValue}>15</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Sets</Text>
            <Text style={styles.statValue}>3</Text>
          </View>
        </View>

        <Text style={styles.trainerTitle}>Trainer</Text>
        <Text style={styles.trainerFeedback}>How was Trainer ?</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Image source={selectedImage ? { uri: selectedImage } : require('../../assets/images/logo.png')} style={styles.trainerImage} />
            <Text style={styles.trainerName}>Trainer Name</Text>
          </View>

          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
                <FontAwesome
                  name={index < rating ? 'star' : 'star-o'}
                  size={24}
                  color="#FFD700"
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <AntDesign name="plus" size={30} color="#FF4C0A" />
        </TouchableOpacity>

        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}

        <TextInput
          style={styles.descriptionInput}
          placeholder="Write a description..."
          placeholderTextColor="#999"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Post</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FinishWorkout;

const styles = StyleSheet.create({
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
    marginBottom: 20,
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
