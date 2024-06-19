import { Entypo } from '@expo/vector-icons';
import React, { useEffect, useState, useRef } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const ClockModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [clockType, setClockType] = useState('stopwatch');
  const [timerValue, setTimerValue] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval;

    const startTimer = () => {
      interval = setInterval(() => {
        setTimerValue((prevValue) => prevValue - 1);
      }, 1000);
    };

    const startStopwatch = () => {
      interval = setInterval(() => {
        setTimerValue((prevValue) => prevValue + 1);
      }, 1000);
    };

    if (isRunning) {
      clearInterval(interval); // Clear previous interval
      if (clockType === 'timer') {
        startTimer();
      } else {
        startStopwatch();
      }

      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      clearInterval(interval);
      spinValue.stopAnimation();
    }

    return () => clearInterval(interval);
  }, [isRunning, clockType, spinValue]);


  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (clockType === 'stopwatch') {
      setTimerValue(0);
    } else {
      setTimerValue(timerValue); // Reset timer to current value
    }
  };


  const handleClockType = (type) => {
    setClockType(type);
    setTimerValue(0);
    setIsRunning(false);
  };

  const formatTime = (value) => {
    if (clockType === 'timer') {
      const totalSeconds = Math.max(0, timerValue);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes < 10 ? '0' : ''}${minutes}:${
        seconds < 10 ? '0' : ''
      }${seconds}`;
    } else {
      const minutes = Math.floor(value / 60);
      const seconds = value % 60;
      return `${minutes < 10 ? '0' : ''}${minutes}:${
        seconds < 10 ? '0' : ''
      }${seconds}`;
    }
  };


  const handleAddTime = () => {
    setTimerValue((prevValue) => prevValue + 15);
  };

  const handleRemoveTime = () => {
    setTimerValue((prevValue) => Math.max(prevValue - 15, 0));
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Entypo name="stopwatch" size={30} color="#FF4C0A" />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.buttonLeft,
                        clockType === 'stopwatch' && styles.selectedButton,
                      ]}
                      onPress={() => handleClockType('stopwatch')}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          clockType === 'stopwatch' &&
                            styles.selectedButtonText,
                        ]}
                      >
                        Stopwatch
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.buttonRight,
                        clockType === 'timer' && styles.selectedButton,
                      ]}
                      onPress={() => handleClockType('timer')}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          clockType === 'timer' && styles.selectedButtonText,
                        ]}
                      >
                        Timer
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.timerContainer}>
                    <Animated.View
                      style={[
                        styles.spinningCircle,
                        { transform: [{ rotate: spin }] },
                      ]}
                    />
                    <View style={styles.timerTextContainer}>
                      {clockType === 'timer' && (
                        <>
                          <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={handleRemoveTime}
                          >
                            <Text style={styles.adjustButtonText}>-15s</Text>
                          </TouchableOpacity>
                          <Text style={styles.timerText}>
                            {formatTime(timerValue)}
                          </Text>
                          <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={handleAddTime}
                          >
                            <Text style={styles.adjustButtonText}>+15s</Text>
                          </TouchableOpacity>
                        </>
                      )}
                      {clockType === 'stopwatch' && (
                        <Text style={styles.timerText}>
                          {formatTime(timerValue)}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.timerControls}>
                    {clockType === 'timer' && (
                      <View style={styles.buttonContainer}>
                        {!isRunning ? (
                          <TouchableOpacity
                            style={styles.startButton}
                            onPress={handleStart}
                          >
                            <Text style={styles.startButtonText}>Start</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.stopButton}
                            onPress={handleStop}
                          >
                            <Text style={styles.stopButtonText}>Stop</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                    {clockType === 'stopwatch' && (
                      <>
                        <TouchableOpacity
                          style={[styles.buttonLeft, styles.selectedButton]}
                          onPress={handleReset}
                        >
                          <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>

                        {!isRunning ? (
                          <TouchableOpacity
                            style={[styles.buttonRight]}
                            onPress={handleStart}
                          >
                            <Text style={styles.startButtonText}>Start</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={[styles.buttonRight, styles.selectedButton]}
                            onPress={handleStop}
                          >
                            <Text style={styles.stopButtonText}>Stop</Text>
                          </TouchableOpacity>
                        )}
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
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonLeft: {
    flex: 1,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: 'white',
  },
  buttonRight: {
    flex: 1,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: 'white',
  },
  buttonText: {
    color: '#FF4C0A',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedButton: {
    backgroundColor: '#FF4C0A',
  },
  selectedButtonText: {
    color: 'white',
  },
  timerContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  spinningCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    borderColor: '#FF4C0A',
    borderTopColor: 'transparent',
  },
  timerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 10,
  },
  adjustButton: {
    padding: 10,
    backgroundColor: '#FF4C0A',
    borderRadius: 5,
  },
  adjustButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  timerControls: {
    flexDirection: 'row',
    marginTop: 20,
  },
  startButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#fff',
    width: '100%',
  },
  startButtonText: {
    color: '#F44336',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resetButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#FFC107',
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
    backgroundColor: '#F44336',
    width: '100%',
  },
  stopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ClockModal;
