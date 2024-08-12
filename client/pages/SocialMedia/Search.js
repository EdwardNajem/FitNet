import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, StatusBar, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../Components/Config';

const Search = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearchChange = async (query) => {
    setSearchQuery(query);
    setErrorMessage(''); 

    if (query.length > 0) {
      try {
        const response = await api.get(`fitnet/searchUsers?q=${query}`);
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

  const handleUserPress = (user) => {
    navigation.navigate('UserProfile', { user });
  };
  

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2F2F2F" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
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

export default Search;
