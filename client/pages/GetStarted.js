import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const GetStarted = () => {
  const navigation = useNavigation();
  const handleGetStarted = () => {
    navigation.navigate('Login');
  };
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image source={require('../assets/images/logo.png')} style={styles.logoImage} />
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Text style={styles.fitNetText}>FitNet</Text>
      <Text style={styles.guideText}>
        The <Text style={{ color: '#FF4C0A' }}>ultimate</Text> guide to your
      </Text>
      <Text style={styles.guideText}>fitness journey</Text>
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={handleGetStarted}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fitNetText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FF4C0A',
    marginBottom: 50,
  },
  logoImage: {
    width: 258,
    height: 263,
    marginBottom: 15,
  },
  guideText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    top: 2,
    marginBottom: 10,
  },
  getStartedButton: {
    width: 272,
    height: 52,
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 17,
    color: '#FFFFFF',
  },
});

export default GetStarted;
