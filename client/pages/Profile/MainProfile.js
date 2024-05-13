import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProfilePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../images/logo.png')} 
          style={styles.profileImage}
        />
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Workouts</Text>
            <Text style={styles.infoText}>100</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Followers</Text>
            <Text style={styles.infoText}>500</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Following</Text>
            <Text style={styles.infoText}>200</Text>
          </View>
        </View>
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>John Doe</Text>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bioContainer}>
        <Text style={styles.bioText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 108,
    height: 112,
    borderRadius: 72,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 20,
    color: '#FFFFFF', 
    fontWeight: 'bold',
  },
  infoLabel: {
    
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
  editProfileButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  editProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  bioContainer: {
    marginTop: 20,
  },
  bioText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default ProfilePage;
