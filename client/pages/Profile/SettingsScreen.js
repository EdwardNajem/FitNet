import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import WhiteButton from '../../Components/WhiteButton';

const SettingsScreen = ({ setLoggedin }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2F2F2F" />
      <View style={styles.content}>
        <View style={styles.centered}>
          <WhiteButton
            title="Change Email"
            onPress={() => navigation.navigate('ChangeEmail')}
          />
          <WhiteButton
            title="Change Password"
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <WhiteButton
            title="Contact Us"
            onPress={() => navigation.navigate('ContactUs')}
          />
          <WhiteButton title="Logout" onPress={() => setLoggedin(false)} />
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
    flex: 1,
    height: '100%',
    backgroundColor: "#1C1C1E"
  },
  content: {
    width: '100%',
    paddingHorizontal: 7,
  },
  centered: {
    alignItems: 'center',
  },
});
