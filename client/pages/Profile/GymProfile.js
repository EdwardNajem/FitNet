import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Animated, FlatList, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import api from '../../Components/Config'; 
import { AuthContext } from '../../Context/authContext';
import { CommentContext } from '../Profile/Settings/CommentContext';
import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import PostExercises from '../../Components/PostExercises';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GymProfile = ({ navigation }) => {
  const route = useRoute();
  const { user } = route.params;
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [postCount, setPostCount] = useState(0);

  // const { commentVisible, setCommentVisible, currentPostId, setCurrentPostId, posts, setPosts } = useContext(CommentContext);
  // const slideAnim = new Animated.Value(0); // Assuming you have this in your existing code
  // const [comment, setComment] = useState(''); // Local state for the comment input
  // const slideAnim = useState(new Animated.Value(500))[0];
  const [comment, setComment] = useState('');
  const { commentVisible, setCommentVisible, currentPostId, setCurrentPostId, posts, setPosts, slideAnim } = useContext(CommentContext);

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

useEffect(() => {
    getPostsByUser();
  }, [])

  // useEffect(() => {
  //   console.log(posts[0])
  // }, [posts])

  const getPostsByUser = async () => {
    const data = {
      currentUserId: state.user._id,
      userId: user._id,
    }
    try {
      const response = await api.post(`/fitnet/getPostsByUser`, data);

      if(response){
        setPosts(response.data);
        console.log(response.date);
        // console.log(response.data)
      }
    } catch (error) {
      console.log(error);
    } 
  };

  useEffect(() => {
    checkGymSubscription();
  }, [])

  const checkGymSubscription = async () => {
    try {
        const data = {
            userId: state.user._id,
            gymId: user._id,
        } 

        const response = await api.post('/fitnet/checkGymSubscription', data);

        if(response){
            console.log(response.data);
            setSubscription(response.data);
        }
    } catch (error) {
        console.log(error);
        alert('There was an error');
    }
  }

  const handleSubscribePress = async () => {
    try {
        const data = {
            userId: state.user._id,
            gymId: user._id,
        }

        const response = await api.post('/fitnet/sendSubscriptionRequest', data);

        if(response){
            if(response.status==201){
                alert('Subscription request sent succesfully');
                setSubscription({ status: 'pending'});
            }
        }
    } catch (error) {
        console.log(error);
        alert('There was an error');
    }
  }

  const handleUnsubscribePress = async () => {
    try {
        const data = {
            userId: state.user._id,
            gymId: user._id,
        }

        const response = await api.post('/fitnet/removeSubscriptionRequest', data);

        if(response){
            alert('Successfully Unsubscribed');
            setSubscription(null);
        }
    } catch (error) {
        console.log(error);
    }
  }



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

  const handleLikePost = async (post) => {
    const user = JSON.parse(await AsyncStorage.getItem('@auth'));

    const data = {
      userId: user.user._id,
      postId: post._id,
    }

    try {
      const response = await api.post('/fitnet/addLikeToPost', data);

      if(response){
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === post._id
              ? { ...p, isLikedByCurrentUser: true, likes: [...p.likes, state.user._id] }
              : p
          )
        );
        // console.log(response);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUnlikePost = async (post) => {
    const user = JSON.parse(await AsyncStorage.getItem('@auth'));

    const data = {
      userId: user.user._id,
      postId: post._id,
    }

    try {
      const response = await api.post('/fitnet/removeLikeFromPost', data);

      if(response){
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === post._id
              ? { ...p, isLikedByCurrentUser: false, likes: p.likes.filter(id => id !== state.user._id) }
              : p
          )
        );
      }
    } catch (error) {
      console.log(error)
    }
  }

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
            <Text style={styles.statNumber}>{postCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
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
      <View style={styles.buttonsContainer}>
        {!subscription&&<TouchableOpacity
            style={[
            styles.followButton,
            subscription && styles.followingButton,
            ]}
            onPress={handleSubscribePress}
        >
            <Text
            style={[
                styles.followButtonText,
                subscription && styles.followingButtonText,
            ]}
            >
            {/* {subscription&&subscription.status=='pending'?'Pending':subscription.status=='accepted'?'Unsubscribe':'Subscribe'} */}
            Subscribe
            </Text>
        </TouchableOpacity>}
        {subscription&&subscription.status=="pending"&&<TouchableOpacity
            style={[
            styles.followButton,
            subscription && styles.followingButton,
            ]}
            onPress={handleUnsubscribePress}
        >
            <Text
            style={[
                styles.followButtonText,
                subscription && styles.followingButtonText,
            ]}
            >
            Pending
            </Text>
        </TouchableOpacity>}
        {subscription&&subscription.status=="active"&&<TouchableOpacity
            style={[
            styles.followButton,
            subscription && styles.followingButton,
            ]}
            onPress={handleUnsubscribePress}
        >
            <Text
            style={[
                styles.followButtonText,
                subscription && styles.followingButtonText,
            ]}
            >
            Unsubscribe
            </Text>
        </TouchableOpacity>}
        <TouchableOpacity
            style={[
            styles.followButton,
            ]}
            onPress={() => navigation.push('Chat',
              {
                receivingUser: user,
              }
            )}
        >
            <Text
            style={[
                styles.followButtonText,
            ]}
            >
            Message
            </Text>
        </TouchableOpacity>
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
      <ScrollView fadingEdgeLength={100}>
        {posts.map((post) => (
          <View key={post._id} style={styles.postCard}>
            <View style={styles.userInfo}>
              {post.createdBy.avatar&&<Image source={{ uri: post.createdBy.avatar }} style={styles.userImagePost} />}
              {!post.createdBy.avatar&&<Image source={require('../../assets/images/user.png')} style={styles.userImagePost} />}
              <View>
                <Text style={styles.userNamePost}>{post.createdBy.username}</Text>
                <Text style={styles.timeAgo}>{formatTimeAgo(post.createdAt)}</Text>
              </View>
            </View>
            <Text style={styles.postText}>{post.description}</Text>
            {post.postType!="text"&&post.postType!="image-gym"&&<View style={styles.workoutStatistics}>
              <View style={styles.workoutStatisticsContainer}>
                <Text style={styles.workoutStatisticsHeaderText}>Duration</Text>
                <Text style={styles.workoutStatisticsText}>{formatTime(post.workoutData.duration)}</Text>
              </View>
              <View style={styles.workoutStatisticsContainer}>
                <Text style={styles.workoutStatisticsHeaderText}>Volume</Text>
                <Text style={styles.workoutStatisticsText}>{formatWeight(post.workoutData.volume)} KG</Text>
              </View>
            </View>}
            {(post.postType=="image"||post.postType=="image-gym")&&<Image source={{ uri: post.photo }} style={styles.postImage} resizeMode="cover" />}
            {post.postType=="workout"&&<PostExercises post={post}/>}
            <View style={styles.postStats}>
              <Text style={styles.likes}>{post.likes.length} likes</Text>
              <Text style={styles.comments}>{post.comments.length} comments</Text>
            </View>
            <View style={styles.actionIcons}>
              {(!post.isLikedByCurrentUser) && (
                  <TouchableOpacity style={styles.iconButton} onPress={() => { 
                    handleLikePost(post);
                  }}>
                    <FontAwesome name="thumbs-o-up" size={24} color="#FF4C0A" />
                  </TouchableOpacity>
              )}
              {(post.isLikedByCurrentUser) && (
                <TouchableOpacity style={styles.iconButton} onPress={() => { handleUnlikePost(post) }}>
                  <FontAwesome name="thumbs-up" size={24} color="#FF4C0A" />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.iconButton} onPress={() => handleCommentPress(post._id)}>
                <FontAwesome name="comment-o" size={24} color="#FF4C0A" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Entypo name="share" size={24} color="#FF4C0A" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      {commentVisible && (
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
      )}
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center'
    },
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
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#FF4C0A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
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
  postContainer: {
    marginTop: 10,
  },
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
  exerciseText: {
    color: 'white',
    fontSize: 18
  },
  exerciseContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  workoutStatistics: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20
  },
  workoutStatisticsHeaderText: {
    color: '#cccccc',
  },
  workoutStatisticsText: {
    color: 'white',
    fontSize: 18
  },
  workoutStatisticsContainer: {
    margin: 5
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: '#1C1C1E',
  // },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     gap: 15,
//     width: '100%',
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     backgroundColor: '#2F2F2F',
//   },
  // title: {
  //   color: '#FFFFFF',
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   flex: 1,
  // },
  postCard: {
    backgroundColor: '#2F2F2F',
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderRadius: 20,

  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImagePost: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginRight: 10,
  },
  userNamePost: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeAgo: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  postText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  iconButton: {
    padding: 5,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  likes: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  comments: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  commentSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2F2F2F',
    height: '60%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  commentTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  commentUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUserName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3A',
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    color: '#FFF',
  },
  commentButton: {
    marginLeft: 10,
    backgroundColor: '#FF4C0A',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  commentButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GymProfile;