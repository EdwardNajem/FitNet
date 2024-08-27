import React, { useState, useEffect,useRef, useContext } from 'react'
import api from '../../Components/Config'
import userimg from '../../assets/images/user.png'
import { RefreshControl } from 'react-native-gesture-handler';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Image, View, StatusBar, Text } from 'react-native';
import { database } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { AuthContext } from '../../Context/authContext';

const Messages = ({ navigation }) => {
    const [state] = useContext(AuthContext);
    const [refreshing, setRefreshing] = React.useState(false);
    const [chats, setChats] = useState([]);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        setChats([]);
        setTimeout(() => {
            setRefreshing(false);
        }, await getUserIdsWithMessages(state.user._id));
    }, []);

    const getUserIdsWithMessages = async (currentUserId) => {
    try {
        // Query to find chats where the current user is the sender
        const sentChatsQuery = query(
        collection(database, 'chats'),
        where('user._id', '==', currentUserId)
        );
        const sentChatsSnapshot = await getDocs(sentChatsQuery);

        // Query to find chats where the current user is the receiver
        const receivedChatsQuery = query(
        collection(database, 'chats'),
        where('receivingUser', '==', currentUserId)
        );
        const receivedChatsSnapshot = await getDocs(receivedChatsQuery);

        const userIds = new Set();

        // Extract user IDs from the sent messages
        sentChatsSnapshot.forEach(doc => {
        const chatData = doc.data();
        userIds.add(chatData.receivingUser);
        });

        // Extract user IDs from the received messages
        receivedChatsSnapshot.forEach(doc => {
        const chatData = doc.data();
        userIds.add(chatData.user._id);
        });

        // Convert the Set to an array to return
        console.log(Array.from(userIds))

        try {
            const response = await api.post('/fitnet/getUserDetails', { userIds: Array.from(userIds) });

            if(response){
                console.log(response.data);
                setChats(response.data.users);
            }
        } catch (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error getting user IDs with messages: ', error);
        return [];
    }
    };

      useEffect(() => {
        getUserIdsWithMessages(state.user._id);
      }, [state])

      return (
          <View style={{ flex: 1 }}>
              <ScrollView style={styles.container} refreshControl={<RefreshControl colors={["#FF4C0A"]} refreshing={refreshing} onRefresh={onRefresh} />}>
                  <StatusBar backgroundColor="#2F2F2F" />
          
                  <View style={styles.header}>
                      <Text style={styles.title}>Messages</Text>
                  </View>

                  {chats && chats.length >= 1 ? 
                  <ScrollView>
                      {chats.map((chat, index) => {
                          return(
                              <View key={index}>
                                  <TouchableOpacity style={styles.chatContainer} onPress={() => navigation.push('Chat',
                                    {
                                      receivingUser: chat,
                                    }
                                  )}>
                                      <View style={styles.userItem}>
                                          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                              <Image source={chat.avatar?{ uri: chat.avatar }: require('../../assets/images/user.png')} style={styles.userImage} />
                                              <Text style={styles.userName}>{chat.username}</Text>
                                          </View>
                                          
                                          <View style={styles.arrowContainer}>
                                              <MaterialIcons name="arrow-forward-ios" size={24} color="#FFFFFF" />
                                          </View>
                                      </View>
                                  </TouchableOpacity>
                              </View>
                          )
                      })}
                  </ScrollView>
                  :
                  <>
                  <Text style={styles.titleNoUsers}>
                      <Text style={styles.orangeText}>No Bitches Available!</Text>
                  </Text>
                      
                  </>
                  }
              </ScrollView>
          </View>
      )
    }

export default Messages;

const styles = StyleSheet.create({
    chatContainer: {
        display: 'flex',
        flexDirection: 'row'
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
    titleNoUsers: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 30,
        flex: 1,
    },
    orangeText: {
        color: '#FF4C0A',
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
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "100%",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3A3A',
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    arrowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
  });
  