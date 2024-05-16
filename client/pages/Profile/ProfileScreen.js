import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileHeader from '../../Components/ProfileHeader';
import ProfileTabs from '../../Components/ProfileTabs';
import { AuthContext } from '../../Context/authContext';

const ProfileScreen = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const [rerender, setRerender] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // Set the state to trigger rerendering
      setRerender((prevState) => !prevState);
    }
  }, [isFocused]);

  return (
    <View key={rerender} style={styles.container}>
      <StatusBar backgroundColor="#2F2F2F" />
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.chatButton}>
          <Fontisto name="share" color="white" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-sharp" color="white" size={30} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader user={state.user} navigation={navigation} />
        <ProfileTabs />
      </ScrollView>
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
});

export default ProfileScreen;
