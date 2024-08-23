import React, { useState, useContext } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, StatusBar, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../Components/Config';
import { AuthContext } from '../../Context/authContext';

const SearchGyms = () => {
  const navigation = useNavigation();
  const [{ user }] = useContext(AuthContext); 
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearchChange = async (query) => {
    setSearchQuery(query);
    setErrorMessage('');

    if (query.length > 0) {
      try {
        const response = await api.get(`fitnet/searchGyms?q=${query}`);
        if (response.status === 200) {
          setUsers(response.data);
        } else {
          setErrorMessage('Failed to fetch users.');
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setErrorMessage('Internal Server Error');
        } else if (error.response && error.response.status === 400) {
          setErrorMessage('Bad Request');
        } else {
          setErrorMessage('Search Failed');
        }
      }
    } else {
      setUsers([]);
    }
  };

  const handleUserPress = (selectedUser) => {
    if (user && selectedUser._id === user._id) {
      navigation.navigate('Profile'); 
    } else {
      navigation.navigate('GymProfile', { user: selectedUser });
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2F2F2F" />
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <FlatList
        data={users}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserPress(item)}>
            <View style={styles.userItem}>
              <Image source={{ uri: item.avatar }} style={styles.userImage} />
              <Text style={styles.userName}>{item.username}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#2F2F2F',
  },
  backButton: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    color: '#FFF',
  },
  errorText: {
    color: '#FF6F61',
    textAlign: 'center',
    marginTop: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
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
  },
});

export default SearchGyms;
