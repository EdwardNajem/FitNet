import React, { useState, useEffect,useRef, useContext, useCallback } from 'react'
import api from '../../Components/Config'
import userimg from '../../assets/images/user.png'
import { RefreshControl } from 'react-native-gesture-handler';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Image, View, StatusBar } from 'react-native';
import { database } from '../../firebaseConfig';
import { collection, query, where, getDocs, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { AuthContext } from '../../Context/authContext'
import { useHeaderHeight } from '@react-navigation/elements';;
import { GiftedChat } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Chat({route, navigation}) {

    const insets = useSafeAreaInsets();

    const { receivingUser } = route.params;
    // console.log(receivingUser);
    const [state] = useContext(AuthContext);
    const cameraCutoutHeight = insets.top;
    const [messages, setMessages] = useState([])
    const headerHeight = useHeaderHeight();

    useEffect(() => {
        const collectionRef = collection(database, 'chats');

        const receivingUserId = receivingUser._id; // Example receiving user ID
        const currentUserID = state.user._id; // Example current user ID
        // console.log("receivingUserId: " + receivingUserId);
        // console.log("currentUserID: " + currentUserID);

        if (state.user._id) {
            // const q = query(collectionRef, ref => ref.orderBy('createdAt', 'desc'));
            const q = query(
                collectionRef,
                where('receivingUser', 'in', [receivingUserId, currentUserID]), // Filter by receiving user
                where('user._id', 'in', [receivingUserId, currentUserID]), // Filter by current user
                orderBy('createdAt', 'desc')
            );


            const unsubscribe = onSnapshot(q, snapshot => {
                setMessages(
                    snapshot.docs.map(doc => ({
                        _id: doc.id,
                        createdAt: doc.data().createdAt.toDate(),
                        text: doc.data().text,
                        user: doc.data().user
                    }))
                )
            })
            return () => unsubscribe();
        }
    }, []);

    // Create a ref for the FlatList inside GiftedChat
    const messageContainerRef = useRef(null);

    const flatList = messageContainerRef.current;
    // Check if the FlatList exists
    if (flatList) {
        flatList.setNativeProps({
            style: {
                marginTop: headerHeight + cameraCutoutHeight,
                marginBottom: 30,
                paddingHorizontal: 10
            },
            fadingEdgeLength: 100
        });
    };

    const onSend = useCallback(async (messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        )
        const { _id, createdAt, text, user } = messages[0];
        addDoc(collection(database, 'chats'), {
            _id,
            createdAt,
            text,
            user,
            receivingUser: receivingUser._id
        });
    }, [])

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <AntDesign name="arrowleft" size={20} color="white"  onPress={() => navigation.goBack()} padding={5} />
            <Image source={receivingUser.avatar?{ uri: receivingUser.avatar }: require('../../assets/images/user.png')} style={styles.userImage} />
            <Text style={styles.title}>{receivingUser.username}</Text>
        </View>

        <View style={{ flex: 1 }}>
            <GiftedChat
                messages={messages.sort((a, b) => b.createdAt - a.createdAt)}
                onSend={messages => onSend(messages)}
                user={{
                    _id: state.user._id,
                }}
                messageContainerRef={messageContainerRef}
                renderAvatar={null}
                scrollToBottom={true}
            />
        </View>
    </View>
  )
}

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
