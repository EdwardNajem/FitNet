import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../Context/authContext';
import api from './Config';
import GreyCircle from './GreyCircle';

const ProfileHeader = ({ user, navigation }) => {
  const [state] = useContext(AuthContext);
  const [users, setUsers] = useState(null);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let response;
        if (state.type === 'Entrepreneur') {
          response = await api.get('api/v1/auth/geentreptacceptedconnections', {
            params: { entrepid: state.user._id },
          });
          setUsers(response.data.requests.length);
        } else {
          response = await api.get(
            'api/v1/auth/getinvestoracceptedconnections',
            {
              params: { investorid: state.user._id },
            }
          );
          setUsers(response.data.requests.length);
        }
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    //  fetchUsers();
  }, []);

  if (!user) {
    return <Text>No Profile</Text>;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <GreyCircle size={100} />
            )}
            
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Workouts</Text>
                <Text style={styles.infoText}>{0}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Followers</Text>
                <Text style={styles.infoText}>{0}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Following</Text>
                <Text style={styles.infoText}>{0}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.username}>{user.username}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <FontAwesome5 name="pen" color="white" size={13} />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
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
  bio: {
    fontSize: 16,
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
});
