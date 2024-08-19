import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import api from '../../Components/Config'; 
import { AuthContext } from '../../Context/authContext';
import { CommentContext } from '../Profile/Settings/CommentContext';

const UserProfile = () => {
  const route = useRoute();
  const { user } = route.params;
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  // const { commentVisible, setCommentVisible, currentPostId, setCurrentPostId, posts, setPosts } = useContext(CommentContext);
  // const slideAnim = new Animated.Value(0); // Assuming you have this in your existing code
  // const [comment, setComment] = useState(''); // Local state for the comment input

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
          setIsFollowing(response.data.isFollowing); 
        }
      } catch (error) {
        console.error('Error fetching follow status:', error);
      }
    };

    if (userFollowerId) {
      checkFollowStatus();
    }
  }, [userFollowerId, user._id]);

useEffect(() => {
  const fetchFollowerCount = async () => {
    try {
      const response = await api.get('fitnet/getFollowerCount', {
        params: {
          userId: user._id,
        },
      });
      if (response.status === 200) {
        setFollowerCount(response.data.followerCount);
      }
    } catch (error) {
      console.error('Error fetching follower count:', error);
    }
  };

  if (user._id) {
    fetchFollowerCount();
  }
}, [user._id]);

useEffect(() => {
  const fetchFollowingCount = async () => {
    try {
      const response = await api.get('fitnet/getFollowingCount', {
        params: {
          userId: user._id,
        },
      });
      if (response.status === 200) {
        setFollowingCount(response.data.followingCount);
      }
    } catch (error) {
      console.error('Error fetching following count:', error);
    }
  };

  if (user._id) {
    fetchFollowingCount();
  }
}, [user._id]);



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

  const handleCommentPress = (postId) => {
    setCurrentPostId(postId);
    setCommentVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseComments = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCommentVisible(false);
      setComment('');
    });
  };

  const handleAddComment = async () => {
    if (comment.trim()) {
      const user = JSON.parse(await AsyncStorage.getItem('@auth'));

      const data = {
        userId: user.user._id,
        postId: currentPostId,
        text: comment,
      }

      try {
        const response = await api.post('/fitnet/addCommentToPost', data);

        if(response){
          setPosts((prevPosts) =>
            prevPosts.map((p) =>
              p._id === currentPostId
                ? { ...p, comments: [...p.comments, {user: user.user, text: comment, createdAt: new Date()}] }
                : p
            )
          );
          setComment('');
        }
      } catch (error) {
        console.log(error)
      }
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
        // Send delete request to backend
        const response = await api.post('/fitnet/deleteCommentFromPost', { postId, commentId });

        if (response.data.success) {
            // Update the local state to remove the comment
            setPosts(posts.map(post => {
                if (post._id === postId) {
                    return { ...post, comments: post.comments.filter(comment => comment._id !== commentId) };
                }
                return post;
            }));
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
};

  const renderCommentItem = ({ item }) => (
    <>
      {item.user._id==state.user._id?<Swipeable
        renderRightActions={() => (
          <TouchableOpacity onPress={() => handleDeleteComment(currentPostId, item._id)} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      >
        <View style={styles.commentItem}>
          <Image source={item.user.avatar?{ uri: item.user.avatar }: require('../../assets/images/user.png')} style={styles.commentUserImage} />
          <View style={styles.commentTextContainer}>
            <Text style={styles.commentUserName}>{item.user.username}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
          <Text style={styles.timeAgo}>{formatTimeAgo(item.createdAt)}</Text>
        </View>
      </Swipeable>:
      <View style={styles.commentItem}>
        <Image source={item.user.avatar?{ uri: item.user.avatar }: require('../../assets/images/user.png')} style={styles.commentUserImage} />
        <View style={styles.commentTextContainer}>
          <Text style={styles.commentUserName}>{item.user.username}</Text>
          <Text style={styles.commentText}>{item.text}</Text>
        </View>
        <Text style={styles.timeAgo}>{formatTimeAgo(item.createdAt)}</Text>
      </View>
    }
    </>
  );

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} mins` : `${minutes} mins`;
  };
  
  const formatWeight = (weight) => {
    return weight.toLocaleString();
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffInSeconds = Math.floor((now - createdAt) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // console.log(diffInMinutes)
  
    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      // Return the date without the time
      return createdAt.toLocaleDateString();
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
            <Text style={styles.statNumber}>{followerCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{followingCount}</Text>
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
      {/* {commentVisible && (
        <Animated.View style={[styles.commentSection, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentTitle}>Comments</Text>
            <TouchableOpacity onPress={handleCloseComments}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={posts.find(post => post._id === currentPostId)?.comments || []}
            keyExtractor={item => item._id?item._id.toString():null}
            renderItem={renderCommentItem}
          />
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              placeholderTextColor="#999"
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
              <Text style={styles.commentButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )} */}
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
