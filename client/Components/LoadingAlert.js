import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

const LoadingAlert = ({ visible }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color="#FF4C0A" />
          <Text style={styles.message}>Updating account</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  message: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
});

export default LoadingAlert;
