import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, Swipeable,RefreshControl } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from '../../Context/authContext';
import api from '../../Components/Config';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [state] = useContext(AuthContext);
  const userId = state.user._id;
  const [refreshing, setRefreshing] = React.useState(false);

 
 

  const getNotifications = async () => {
    try {
      const response = await api.get(`fitnet/getNotifications?userId=${userId}`);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
    }
  };
  
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setNotifications([]);
    await getNotifications(); 
    setRefreshing(false);
  }, [userId]);  
  
  useEffect(() => {
    getNotifications();
  }, [userId]);  
  




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
          <ScrollView style={styles.container} refreshControl={<RefreshControl colors={["#FF4C0A"]} refreshing={refreshing} onRefresh={onRefresh} />}>

      <ScrollView>
        {notifications.map((notification) => (
          <Swipeable
            key={notification._id}
            renderRightActions={() => notification.notificationType === 'request' && renderRightActions(notification)}
            renderLeftActions={() => notification.notificationType === 'request' && renderLeftActions(notification)}
          >
            <TouchableOpacity style={styles.card} onPress={() => handlePress(notification)}>
              <Image source={{ uri: notification.sender.avatar }} style={styles.image} />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>
                  {notification.sender.username} <Text style={styles.actionText}>{notification.message}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        ))}
      </ScrollView>
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
