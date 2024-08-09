import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

const ProfileGym = () => {
  const [mapVisible, setMapVisible] = useState(false);
  const [gyms, setGyms] = useState([]);
  const API_KEY = 'AIzaSyBpCCbk0nQVbVQM0lYAE-YqcT3brK4hc-U';

  useEffect(() => {
    fetchAllGyms();
  }, []);

  const gridCells = [
    { latMin: 33.1, latMax: 33.2, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.1, latMax: 33.2, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.1, latMax: 33.2, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.1, latMax: 33.2, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.1, latMax: 33.2, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.2, latMax: 33.3, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.2, latMax: 33.3, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.2, latMax: 33.3, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.2, latMax: 33.3, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.2, latMax: 33.3, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.3, latMax: 33.4, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.3, latMax: 33.4, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.3, latMax: 33.4, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.3, latMax: 33.4, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.3, latMax: 33.4, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.4, latMax: 33.5, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.4, latMax: 33.5, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.4, latMax: 33.5, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.4, latMax: 33.5, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.4, latMax: 33.5, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.5, latMax: 33.6, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.5, latMax: 33.6, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.5, latMax: 33.6, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.5, latMax: 33.6, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.5, latMax: 33.6, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.6, latMax: 33.7, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.6, latMax: 33.7, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.6, latMax: 33.7, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.6, latMax: 33.7, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.6, latMax: 33.7, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.7, latMax: 33.8, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.7, latMax: 33.8, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.7, latMax: 33.8, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.7, latMax: 33.8, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.7, latMax: 33.8, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.8, latMax: 33.9, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.8, latMax: 33.9, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.8, latMax: 33.9, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.8, latMax: 33.9, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.8, latMax: 33.9, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.9, latMax: 34.0, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.9, latMax: 34.0, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.9, latMax: 34.0, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.9, latMax: 34.0, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.9, latMax: 34.0, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 34.0, latMax: 34.1, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 34.0, latMax: 34.1, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 34.0, latMax: 34.1, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 34.0, latMax: 34.1, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 34.0, latMax: 34.1, lonMin: 35.5, lonMax: 35.6 },
  ];

  const fetchGymsFromCell = async (latMin, latMax, lonMin, lonMax) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query: 'gym OR sports club',
          location: `${(latMin + latMax) / 2},${(lonMin + lonMax) / 2}`,
          radius: 50000, // 50 km radius
          key: API_KEY,
        },
      });
      return response.data.results;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchAllGyms = async () => {
    let allGyms = [];
    for (const cell of gridCells) {
      const gymsData = await fetchGymsFromCell(cell.latMin, cell.latMax, cell.lonMin, cell.lonMax);
      allGyms = allGyms.concat(gymsData);
    }
    const uniqueGyms = Array.from(new Map(allGyms.map(gym => [gym.place_id, gym])).values());
    setGyms(uniqueGyms);
  };

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
        <TouchableOpacity
          style={styles.button}
          onPress={() => setMapVisible(true)}
        >
          <Text style={styles.buttonText}>Select Gym</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={mapVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: 33.888629,
              longitude: 35.495480,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {gyms.map((gym) => (
              <Marker
                key={gym.place_id} // Use a unique key
                coordinate={{
                  latitude: gym.geometry.location.lat,
                  longitude: gym.geometry.location.lng,
                }}
                title={gym.name}
              />
            ))}
          </MapView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setMapVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  closeButton: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
