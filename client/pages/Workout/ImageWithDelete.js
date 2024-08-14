import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have expo/vector-icons installed or use any other icon library

const ImageWithDelete = ({ selectedImage, onDelete }) => {
  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
      <TouchableOpacity style={styles.deleteIcon} onPress={onDelete}>
        <Ionicons name="close-circle" size={30} color="#FF4C0A" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  deleteIcon: {
    position: 'absolute',
    top: -15,
    right: -15,
  },
});

export default ImageWithDelete;
