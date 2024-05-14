import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WhiteButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.separator} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.separator} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    gap: 10,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    color: '#eee',
    fontWeight: 'bold',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
});

export default WhiteButton;
