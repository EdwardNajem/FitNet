import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, StatusBar, TouchableOpacity, TextInput, Animated, FlatList } from 'react-native';
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RefreshControl, Swipeable } from 'react-native-gesture-handler';
import api from '../../Components/Config';
import GreyCircle from '../../Components/GreyCircle';
import PostExercises from '../../Components/PostExercises';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Context/authContext';

const HomeScreen = () => {
  const [state] = useContext(AuthContext);
  const navigation = useNavigation();
  const [commentVisible, setCommentVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [comment, setComment] = useState('');
  const [posts, setPosts] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const slideAnim = useState(new Animated.Value(500))[0];
  const [likedPosts, setLikedPosts] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setPosts([]);
    setTimeout(() => {
        setRefreshing(false);
    }, await getAllPosts());
  }, []);

  const handleCreatePost = () => {
    navigation.navigate('Create-Post-Gym');
  }

  useEffect(() => {
    getAllPosts();
  }, [])

  const getAllPosts = async () => {
    setLikedPosts([]);
    const user = JSON.parse(await AsyncStorage.getItem('@auth'));

    const data = {
      userId: user.user._id,
    }

    try {
      const response = await api.post('/fitnet/getAllPosts', data);
      setPosts(response.data);
      response.data.forEach((post) => {
        setLikedPosts((prevLikedPosts) => {
          if (post.isLikedByCurrentUser) {
            return [...prevLikedPosts, post._id];
          }
          return prevLikedPosts;
        });
      });
    } catch (error) {
      console.log(error);
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

  const handleSearchPress = () => {
    navigation.navigate('Search');
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
        console.log(response);
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

    console.log(diffInMinutes)
  
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} refreshControl={<RefreshControl colors={["#FF4C0A"]} refreshing={refreshing} onRefresh={onRefresh} />}>
        <StatusBar backgroundColor="#2F2F2F" />

        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <TouchableOpacity onPress={handleSearchPress}>
            <Ionicons name="search" size={25} color="#FF4C0A" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications" size={25} color="#FF4C0A" />
          </TouchableOpacity>
        </View>

        {state.user&&state.user.usertype=="Gym"&&
          <View style={styles.createPostContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={() => handleCreatePost()}>
              <Text style={styles.submitButtonText}>Create Post</Text>
            </TouchableOpacity>
          </View>
        }

        {posts.map((post) => (
          <View key={post._id} style={styles.postCard}>
            <View style={styles.userInfo}>
              {post.createdBy.avatar&&<Image source={{ uri: post.createdBy.avatar }} style={styles.userImage} />}
              {!post.createdBy.avatar&&<Image source={require('../../assets/images/user.png')} style={styles.userImage} />}
              <View>
                <Text style={styles.userName}>{post.createdBy.username}</Text>
                <Text style={styles.timeAgo}>{formatTimeAgo(post.createdAt)}</Text>
              </View>
            </View>
            <Text style={styles.postText}>{post.description}</Text>
            {post.postType!="text"&&post.postType!="image-gym"&&
            <View style={styles.workoutStatistics}>
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

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 15,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#2F2F2F',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  postCard: {
    backgroundColor: '#2F2F2F',
    width: '100%',
    padding: 15,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
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
  userName: {
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
  submitButton: {
    backgroundColor: '#FF4C0A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  createPostContainer: {
    margin: 10
  },
  // descriptionInput: {
  //   backgroundColor: '#2F2F2F',
  //   color: '#FFFFFF',
  //   borderRadius: 10,
  //   padding: 10,
  //   height: 100,
  //   marginBottom: 20,
  //   textAlignVertical: 'top',
  // },
  // createPostContainer: {
  //   margin: 10
  // },
});

export default HomeScreen;

