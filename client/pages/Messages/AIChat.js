import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import api from '../../Components/Config';
import userimg from '../../assets/images/user.png';
import { RefreshControl } from 'react-native-gesture-handler';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'react-native';
import { database } from '../../firebaseConfig';
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../../Context/authContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { GiftedChat, Bubble, InputToolbar, Composer, Send } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AIChat({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { receivingUser } = route.params;
  const [state] = useContext(AuthContext);
  const cameraCutoutHeight = insets.top;
  const [messages, setMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const loadedRef = useRef(loaded);
  const [firstSet, setFirstSet] = useState(false);
  const headerHeight = useHeaderHeight();

  // const newMessage = {
  //   _id: uuidv4(),  // Generate a unique ID for the new message
  //   createdAt: new Date(),  // Use current time
  //   text: "Hello, how can I help you today?", // The new message text
  //   user: { _id: "ai_helper", name: "FitnessBot" },  // Example user details
  // };
  // setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessage));
  // li 3abelo ya3mela

  useEffect(() => {
    loadedRef.current = loaded;
  }, [loaded]);

  useEffect(() => {
    const collectionRef = collection(database, 'ai_chats');
    const receivingUserId = receivingUser._id;
    const currentUserID = state.user._id;

    if (state.user._id) {
      const q = query(
        collectionRef,
        where('receivingUser', 'in', [receivingUserId, currentUserID]),
        where('user._id', 'in', [receivingUserId, currentUserID]),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            _id: doc.id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          }))
        );
        setLoaded(true);
      });
      return () => unsubscribe();
    }
  }, []);


  // const useOpenAi = async(message) => {
  //   const response = await api.post(`/fitnet/chat`, {
  //       body: message,
  //   });

  //   console.log(response.data.messages);
  //   setMessages((previousMessages) => GiftedChat.append(previousMessages, response.data.messages));
  //   const { _id, createdAt, text } = messages[0];
  //   addDoc(collection(database, 'ai_chats'), {
  //     _id,
  //     createdAt,
  //     text,
  //     user: 'ai_helper',
  //     receivingUser: receivingUser._id,
  //   });
  //   // const resp = (await data.json()).messages;
  // }
  const useOpenAi = async (message) => {
    try {
      const response = await api.post(`/fitnet/chat`, {
        body: message,
      });
  
      const newMessages = response.data.messages;
  
      if (Array.isArray(newMessages) && newMessages.length > 0) {
        console.log("newMessages: ", newMessages)
        console.log("newMessages: ", messages[1])
  
        // Append the new messages to the existing ones in GiftedChat
        let newMessagesEdited = {
          _id: uuidv4(),
          text: newMessages[0],
          createdAt: Timestamp.fromDate(new Date()),
          user: { _id: "ai_helper", name: "FitnessBot" }
        };

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, newMessagesEdited)
        );

        console.log(newMessagesEdited)
  
        addDoc(collection(database, 'ai_chats'), {
          _id: newMessagesEdited._id,
          createdAt: newMessagesEdited.createdAt,
          text: newMessagesEdited.text,
          user: newMessagesEdited.user,
          receivingUser: state.user._id,
        });

      } else {
        console.warn("Received unexpected message format from the API.");
      }
    } catch (error) {
      console.error("Error sending message or storing in Firestore:", error);
    }
  };

  const messageContainerRef = useRef(null);
  const flatList = messageContainerRef.current;
  if (flatList) {
    flatList.setNativeProps({
      style: {
        marginTop: headerHeight + cameraCutoutHeight,
        marginBottom: 30,
        paddingHorizontal: 10,
      },
      fadingEdgeLength: 100,
    });
  }

  const onSend = useCallback(async (messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    const { _id, createdAt, text, user } = messages[0];
    useOpenAi(text)
    addDoc(collection(database, 'ai_chats'), {
      _id,
      createdAt,
      text,
      user,
      receivingUser: receivingUser._id,
    });
  }, []);

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#FF4C0A',
        },
        left: {
          backgroundColor: '#2F2F2F',
        },
      }}
      textStyle={{
        right: {
          color: '#FFFFFF',
        },
        left: {
          color: '#FFFFFF',
        },
      }}
    />
  );

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbarContainer}
    />
  );

  const renderComposer = (props) => (
    <Composer
      {...props}
      textInputStyle={styles.inputText}
      placeholder="Type a message..."
      placeholderTextColor="#A0A0A0"
    />
  );

  const renderSend = (props) => (
    <Send {...props}>
      <View style={styles.sendButton}>
        <MaterialIcons name="send" size={15} color="#FF4C0A" />
      </View>
    </Send>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesign name="arrowleft" size={20} color="white" onPress={() => navigation.goBack()} padding={5} />
        <Image source={receivingUser.avatar ? { uri: receivingUser.avatar } : require('../../assets/images/user.png')} style={styles.userImage} />
        <Text style={styles.title}>{receivingUser.username}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={messages.sort((a, b) => b.createdAt - a.createdAt)}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: state.user._id,
          }}
          messageContainerRef={messageContainerRef}
          renderAvatar={null}
          scrollToBottom={true}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar} 
          renderComposer={renderComposer} 
          renderSend={renderSend} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
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
    height: 'auto',
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
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
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
    width: '100%',
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
  inputToolbarContainer: {
    backgroundColor: '#2F2F2F', 
    borderTopColor: '#3A3A3A', 
    borderTopWidth: 1,
    padding: 5,
  },
  inputText: {
    backgroundColor: '#1C1C1E', 
    color: '#FFFFFF', 
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '85%',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});


// 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
// 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