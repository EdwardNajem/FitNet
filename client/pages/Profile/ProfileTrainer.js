import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ActivityIndicator, Image, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../Components/Config';
import { AuthContext } from '../../Context/authContext';
import { Ionicons } from '@expo/vector-icons'; 

const ProfileTrainer = () => {
  const navigation = useNavigation();
  const [state] = useContext(AuthContext);
  const user = state?.user || {};
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trainees, setTrainees] = useState([]);
  const [noTrainees, setNoTrainees] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const fetchTrainerStatus = async () => {
      try {
        const response = await api.get(`fitnet/trainerRequestStatus/${user._id}`);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Failed to fetch trainer status:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTrainees = async () => {
      try {
        const response = await api.get(`fitnet/getTrainees/${user._id}`);
        if (response.data.trainees.length === 0) {
          setNoTrainees(true);
        } else {
          setTrainees(response.data.trainees);
          setNoTrainees(false); 
        }
      } catch (error) {
        console.error('Failed to fetch trainees:', error);
        setNoTrainees(true); 
      }
    };

    if (user._id) {
      fetchTrainerStatus();
      if (status === 'Accepted') {
        fetchTrainees();
      }
    }
  }, [user._id, status]);

  const handleDeleteSession = async (trainingDate) => {
    try {
      const response = await api.post('fitnet/deleteTrainingSessionByDate', {
        trainerId: user._id,
        trainingDate
      });
      if (response.status === 200) {
        // Refresh the list or handle successful deletion
        setTrainees(trainees.filter(trainee => new Date(trainee.date).toISOString() !== new Date(trainingDate).toISOString()));
        setIsModalVisible(false);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting training session:', error);
      Alert.alert('Error', 'An error occurred while deleting the training session.');
    }
  };

  const confirmDelete = (trainingDate) => {
    setSelectedSession(trainingDate);
    setIsModalVisible(true);
  };

  const renderTraineeList = () => (
    <View style={styles.traineeListContainer}>
      {noTrainees ? (
        <Text style={styles.noTraineesText}>No current trainees</Text>
      ) : (
        trainees.map(trainee => (
          <View key={trainee.id} style={styles.traineeContainer}>
            <Image source={{ uri: trainee.avatar }} style={styles.avatar} />
            <View style={styles.traineeInfo}>
              <Text style={styles.traineeName}>{trainee.name}</Text>
              <Text style={styles.trainingDate}>{new Date(trainee.date).toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity style={styles.messageIconContainer}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#FF4C0A" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.deleteIconContainer} 
              onPress={() => confirmDelete(trainee.date)}
            >
              <Ionicons name="close-circle-outline" size={24} color="#FF4C0A" />
            </TouchableOpacity>
      

          </View>
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {status === 'Pending' ? (
        <View style={styles.contentContainer}>
          <Text style={styles.pendingText}>
            Your request is currently pending.
          </Text>
        </View>
      ) : status === 'Accepted' ? (
        <>
          {renderTraineeList()}
          <Modal
  transparent={true}
  visible={isModalVisible}
  animationType="slide"
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalText}>Are you sure you want to delete this session?</Text>
      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => handleDeleteSession(selectedSession)}
        >
          <Text style={styles.modalButtonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setIsModalVisible(false)}
        >
          <Text style={styles.cancelButtonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

        </>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            Are you a <Text style={styles.orangeText}>Trainer</Text>?
          </Text>
          <Text style={styles.subtitle}>
            Sign up to start taking{'\n'}in clients
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TrainerRegister')}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProfileTrainer;

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingTop: 10,
    height: windowHeight / 2,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  orangeText: {
    color: '#FF4C0A',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 80,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pendingText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  traineeListContainer: {
    flex: 1,
    marginTop: 20,
  },
  traineeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  traineeInfo: {
    flex: 1,
  },
  traineeName: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  trainingDate: {
    fontSize: 14,
    color: 'gray',
  },
  deleteIconContainer: {
    marginLeft: 'auto',
  },
  noTraineesText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
 modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#2F2F2F',
    borderRadius: 10,
    padding: 20,
  },
  modalButtons: {
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#FF4C0A',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF4C0A',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  cancelButtonText: {
    color: '#FF4C0A',
    fontSize: 18,
  },
  modalText: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
    color:'white',
  },
 messageIconContainer: {
  marginLeft: 'auto',
  right:10,
},
});

