import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileHeader from '../../Components/ProfileHeader';
import ProfileTabs from '../../Components/ProfileTabs';
import { AuthContext } from '../../Context/authContext';
import { CommentContext } from './Settings/CommentContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../Components/Config';
import { Animated } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  const { commentVisible, setCommentVisible, currentPostId, setCurrentPostId, posts, setPosts, slideAnim } = useContext(CommentContext);
  // const slideAnim = useState(new Animated.Value(500))[0];
  const [comment, setComment] = useState('');
  const [state] = useContext(AuthContext);
  const [rerender, setRerender] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log(commentVisible)
  },[commentVisible])

  useEffect(() => {
    if (isFocused) {
      // Set the state to trigger rerendering
      setRerender((prevState) => !prevState);
    }
  }, [isFocused]);

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
    <View style={{ flex: 1 }}>
    <View key={rerender} style={styles.container}>
      <StatusBar backgroundColor="#2F2F2F" />
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-sharp" color="white" size={30} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader user={state.user} navigation={navigation} />
        <ProfileTabs navigation={navigation}/>
      </ScrollView>
    </View>
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
  timeAgo: {
    color: '#AAAAAA',
    fontSize: 14,
  },
});

export default ProfileScreen;
