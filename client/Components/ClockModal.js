import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const ClockModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [clockType, setClockType] = useState(null);
  const [timerValue, setTimerValue] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerValue(prevValue => prevValue + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimerValue(0);
  };

  const handleContinue = () => {
    setIsRunning(true);
  };

  const handleClockType = (type) => {
    setClockType(type);
    setTimerValue(0);
    setIsRunning(false);
  };

  const formatTime = (value) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Entypo name="stopwatch" size={40} color="#FF4C0A" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Choose Clock Type</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, clockType === 'stopwatch' && styles.selectedButton]}
                      onPress={() => handleClockType('stopwatch')}
                    >
                      <Text style={styles.buttonText}>Stopwatch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, clockType === 'timer' && styles.selectedButton]}
                      onPress={() => handleClockType('timer')}
                    >
                      <Text style={styles.buttonText}>Timer</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.timerText}>{formatTime(timerValue)}</Text>
                  <View style={styles.timerControls}>
                    {clockType === 'timer' && (
                      <>
                        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                          <Text style={styles.startButtonText}>Start</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleStop}>
                          <Text style={styles.cancelButtonText}>Stop</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                          <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {clockType === 'stopwatch' && (
                      <>
                        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                          <Text style={styles.startButtonText}>Start</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                          <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
                          <Text style={styles.stopButtonText}>Stop</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: 300,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    color:'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedButton: {
    backgroundColor: '#FF4C0A',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color:'white',
  },
  timerControls: {
    flexDirection: 'row',
    marginTop: 20,
  },
  startButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#4CAF50',
    marginRight: 5,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#F44336',
    marginRight: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resetButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#FFC107',
    marginRight: 5,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stopButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#FFA500',
    marginRight: 5,
  },
  stopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ClockModal;
