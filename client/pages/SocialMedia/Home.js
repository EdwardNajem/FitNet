import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { FontAwesome, Entypo,Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const staticPosts = [
  {
    id: 1,
    userImage: require('../../assets/images/logo.png'), 
    userName: 'Ahmad Zaarour',
    timeAgo: '1 hr ago',
    image: require('../../assets/images/logo.png'), 
    description: 'Great workout  today!',
    likes: 25,
    comments: 10,
  },
  {
    id: 2,
    userImage: require('../../assets/images/logo.png'), 
    userName: 'Edward Najem',
    timeAgo: '2 hrs ago',
    image: require('../../assets/images/logo.png'), 
    description: 'Really enjoyed the trainer’s instructions.',
    likes: 15,
    comments: 5,
  },
  {
    id: 3,
    userImage: require('../../assets/images/logo.png'), 
    userName: 'Alex Johnson',
    timeAgo: '3 hrs ago',
    image: require('../../assets/images/logo.png'), 
    description: 'Good workout but the environment could be better.',
    likes: 8,
    comments: 2,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    
    <ScrollView style={styles.container}>
     <StatusBar backgroundColor="#2F2F2F" />
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
       
        <TouchableOpacity  onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications" size={25} color="#FF4C0A" />
        </TouchableOpacity>
      </View>

      {staticPosts.map((post) => (
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
            <Text style={styles.comments}>{post.comments} comments</Text>
          </View>
          <View style={styles.actionIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="thumbs-o-up" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="comment-o" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Entypo name="share" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
         
        </View>
      ))}
    </ScrollView>
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
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#2F2F2F',
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
    width:'100%',
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
});

export default HomeScreen;
