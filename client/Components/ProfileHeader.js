import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../Context/authContext';
import GreyCircle from './GreyCircle';

const ProfileHeader = ({ user, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [animation] = useState(new Animated.Value(0)); // Initialize animation value

  useEffect(() => {
    setLoading(true);
    // Simulate fetching user data
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    // Start the loading animation
    startAnimation();
  }, []);

  // Function to start the loading animation
  const startAnimation = () => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1, // Animate to 1 (end value)
        duration: 1500, // Animation duration
        easing: Easing.linear, // Use linear easing
        useNativeDriver: true, // Use native driver for performance
      })
    ).start(); // Start the animation loop
  };

  // Interpolate the animation value for opacity
  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1, 0.5],
  });

  // Function to render shimmer effect
  const renderShimmer = () => <View style={styles.shimmer} />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {loading ? (
            <Animated.View style={[styles.placeholderAvatar, { opacity }]}>
              {renderShimmer()}
            </Animated.View>
          ) : user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <GreyCircle size={100} />
          )}

          <View style={styles.infoContainer}>
            {loading ? (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Workouts</Text>
                <Text style={styles.infoText}>{0}</Text>
              </View>
            ) : (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Workouts</Text>
                <Text style={styles.infoText}>{1}</Text>
              </View>
            )}
            {loading ? (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Followers</Text>
                <Text style={styles.infoText}>{0}</Text>
              </View>
            ) : (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Followers</Text>
                <Text style={styles.infoText}>{2}</Text>
              </View>
            )}
            {loading ? (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Following</Text>
                <Text style={styles.infoText}>{0}</Text>
              </View>
            ) : (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Following</Text>
                <Text style={styles.infoText}>{3}</Text>
              </View>
            )}
          </View>
        </View>
        {loading ? (
          <>
            <Animated.View style={[styles.placeholderText, { opacity }]}>
              {renderShimmer()}
            </Animated.View>
            <TouchableOpacity style={styles.button} disabled>
              <FontAwesome5 name="pen" color="white" size={13} />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        ) : (
          <React.Fragment>
            <Text style={styles.username}>{user.username}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <FontAwesome5 name="pen" color="white" size={13} />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </React.Fragment>
        )}
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: 'relative',
    color: '#1C1C1E',
  },
  content: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 10,
  },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  shimmer: {
    backgroundColor: '#e1e1e1', // Shimmer color
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5, // Adjust opacity to control the intensity of shimmer
    borderRadius: 100,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
    width: '70%',
    overflow: 'hidden',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  infoLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  button: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    width: 125,
    height: 30,
    backgroundColor: '#1C1C1E',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
  },
  placeholderText: {
    width: '50%',
    height: 26,
    backgroundColor: '#ccc', // Placeholder color
    borderRadius: 5,
    marginBottom: 10,
  },
});
