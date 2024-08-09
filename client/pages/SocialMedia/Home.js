import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput,Image, StyleSheet, StatusBar, TouchableOpacity, Animated, FlatList } from 'react-native';
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

const staticPosts = [
  {
    id: 1,
    userImage: require('../../assets/images/logo.png'),
    userName: 'Ahmad Zaarour',
    timeAgo: '1 hr ago',
    image: require('../../assets/images/logo.png'),
    description: 'Great workout today!',
    likes: 25,
    comments: [],
  },
  {
    id: 2,
    userImage: require('../../assets/images/logo.png'),
    userName: 'Edward Najem',
    timeAgo: '2 hrs ago',
    image: require('../../assets/images/logo.png'),
    description: 'Really enjoyed the trainer’s instructions.',
    likes: 15,
    comments: [],
  },
  {
    id: 3,
    userImage: require('../../assets/images/logo.png'),
    userName: 'Alex Johnson',
    timeAgo: '3 hrs ago',
    image: require('../../assets/images/logo.png'),
    description: 'Good workout but the environment could be better.',
    likes: 8,
    comments: [],
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [commentVisible, setCommentVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [comment, setComment] = useState('');
  const [posts, setPosts] = useState(staticPosts);
  const slideAnim = useState(new Animated.Value(500))[0];

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

  const handleAddComment = () => {
    if (comment.trim()) {
      setPosts(posts.map(post => {
        if (post.id === currentPostId) {
          return { ...post, comments: [...post.comments, { id: post.comments.length + 1, userImage: require('../../assets/images/logo.png'), userName: 'Current User', text: comment }] };
        }
        return post;
      }));
      setComment('');
    }
  };

  const handleDeleteComment = (postId, commentId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: post.comments.filter(comment => comment.id !== commentId) };
      }
      return post;
    }));
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const renderCommentItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity onPress={() => handleDeleteComment(currentPostId, item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <View style={styles.commentItem}>
        <Image source={item.userImage} style={styles.commentUserImage} />
        <View style={styles.commentTextContainer}>
          <Text style={styles.commentUserName}>{item.userName}</Text>
          <Text style={styles.commentText}>{item.text}</Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
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

        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.userInfo}>
              <Image source={post.userImage} style={styles.userImage} />
              <View>
                <Text style={styles.userName}>{post.userName}</Text>
                <Text style={styles.timeAgo}>{post.timeAgo}</Text>
              </View>
            </View>
            <Text style={styles.postText}>{post.description}</Text>
            <Image source={post.image} style={styles.postImage} resizeMode="cover" />
            <View style={styles.postStats}>
                            <Text style={styles.likes}>{post.likes} likes</Text>
              <Text style={styles.comments}>{post.comments.length} comments</Text>
            </View>
            <View style={styles.actionIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="thumbs-o-up" size={24} color="#FF4C0A" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={() => handleCommentPress(post.id)}>
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
            data={posts.find(post => post.id === currentPostId)?.comments || []}
            keyExtractor={item => item.id.toString()}
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
});

export default HomeScreen;

