import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import api from '../../Components/Config'; 
import { AuthContext } from '../../Context/authContext';

const UserProfile = () => {
  const route = useRoute();
  const { user } = route.params;
  const [isFollowing, setIsFollowing] = useState(false);

  const [state] = useContext(AuthContext);
  const userFollowerId = state.user?._id; 

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await api.get('fitnet/followStatus', {
          params: {
            UserFollowerId: userFollowerId,
            UserFollowingId: user._id,
          },
        });
        if (response.status === 200) {
          setIsFollowing(response.data.isFollowing); // Update state based on response
        }
      } catch (error) {
        console.error('Error fetching follow status:', error);
      }
    };

    if (userFollowerId) {
      checkFollowStatus();
    }
  }, [userFollowerId, user._id]);

  const handleFollowPress = async () => {
    if (!userFollowerId) return; 
    try {
      const url = isFollowing ? 'fitnet/unfollowUser' : 'fitnet/followUser';
      const response = await api.post(url, {
        UserFollowerId: userFollowerId,
        UserFollowingId: user._id,
      });

      if (response.status === 200) {
        setIsFollowing(!isFollowing); 
      } else {
        console.log(`Failed to ${isFollowing ? 'unfollow' : 'follow'}`);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: user.avatar }} style={styles.userImage} />
          <Text style={styles.userName}>{user.username}</Text>
        </View>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton,
          isFollowing && styles.followingButton,
        ]}
        onPress={handleFollowPress}
      >
        <Text
          style={[
            styles.followButtonText,
            isFollowing && styles.followingButtonText,
          ]}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: 25,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  followButton: {
    marginTop: 30,
    backgroundColor: '#FF4C0A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    width: '80%',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF4C0A',
  },
  followingButtonText: {
    color: '#FF4C0A',
  },
});

export default UserProfile;
