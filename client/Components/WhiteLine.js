import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const WhiteLine = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    width: '100%',
    marginVertical: 25,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default WhiteLine;
