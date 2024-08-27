import React, { useState, useEffect,useRef, useContext } from 'react'
import api from '../../Components/Config'
import userimg from '../../assets/images/user.png'
import { RefreshControl } from 'react-native-gesture-handler';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Image, View, StatusBar } from 'react-native';
import { database } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { AuthContext } from '../../Context/authContext';

export default function Chat({route, navigation}) {

    const { receivingUser } = route.params;

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Image source={receivingUser.avatar?{ uri: receivingUser.avatar }: require('../../assets/images/user.png')} style={styles.userImage} />
            <Text style={styles.title}>{receivingUser.username}</Text>
        </View>

        <View style={{ flex: 1 }}>
            <GiftedChat
                messages={messages.sort((a, b) => b.createdAt - a.createdAt)}
                onSend={messages => onSend(messages)}
                user={{
                    _id: parseInt(loggedInUserID),
                }}
                messageContainerRef={messageContainerRef}
                renderAvatar={null}
                onInputTextChanged={onInputTextChanged}
                isTyping={receiverTyping}
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
