import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';

const UserNotifications = [
  {
    id: 1,
    type: 'like',
    user: 'Ahmad Zaarour',
    action: 'liked your post',
    image: require('../../assets/images/logo.png'),
  },
  {
    id: 2,
    type: 'comment',
    user: 'Ahmad Zaarour',
    action: 'commented on your post',
    image: require('../../assets/images/logo.png'),
  },
  {
    id: 3,
    type: 'request',
    user: 'Edward Najem',
    action: 'requested to follow you',
    image: require('../../assets/images/logo.png'),
  },
];

const Notifications = () => {
  const handlePress = (notification) => {
    console.log('Notification:', notification);
  };

  const handleAccept = (notification) => {
    console.log('Accepted:', notification);
  };

  const handleDecline = (notification) => {
    console.log('Declined:', notification);
  };

  const renderRightActions = (notification) => (
    <TouchableOpacity style={[styles.action, styles.accept]} onPress={() => handleAccept(notification)}>
      <AntDesign name="check" size={24} color="#FFF" />
    </TouchableOpacity>
  );

  const renderLeftActions = (notification) => (
    <TouchableOpacity style={[styles.action, styles.decline]} onPress={() => handleDecline(notification)}>
      <AntDesign name="close" size={24} color="#FFF" />
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {UserNotifications.map((notification) => (
          <Swipeable
            key={notification.id}
            renderRightActions={() => notification.type === 'request' && renderRightActions(notification)}
            renderLeftActions={() => notification.type === 'request' && renderLeftActions(notification)}
          >
            <TouchableOpacity style={styles.card} onPress={() => handlePress(notification)}>
              <Image source={notification.image} style={styles.image} />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>
                  {notification.user} <Text style={styles.actionText}>{notification.action}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#2F2F2F',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 18,
  },
  actionText: {
    color: '#AAAAAA',
    fontWeight: '400',
    fontSize: 16,
  },
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 80,
  },
  accept: {
    backgroundColor: 'green',
    borderRadius: 10,
  
  },
  decline: {
    backgroundColor: 'red',
    borderRadius: 10,
  },
});

export default Notifications;
