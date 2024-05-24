import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ProfileGym = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topLeftLabelContainer}>
        <Text style={styles.topLeftLabel}>Gym</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Find Your <Text style={styles.orangeText}>Gym</Text>
        </Text>
        <Text style={styles.subtitle}>
          Locate and find a gym that{'\n'} best suits your goals
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Select Gym</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileGym;

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingTop: 10,
    height: windowHeight / 2,
  },
  topLeftLabelContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
  },
  topLeftLabel: {
    fontSize: 16,
    color: 'gray',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  orangeText: {
    color: '#FF4C0A',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
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
});
