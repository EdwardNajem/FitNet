import { createStackNavigator } from '@react-navigation/stack';
import { Text, TouchableOpacity, View } from 'react-native';
import ClockModal from '../Components/ClockModal';
import BookTrainerScreen from '../pages/Workout/BookTrainer';
import FinishWorkoutScreen from '../pages/Workout/FinishWorkout';
import StartWorkoutScreen from '../pages/Workout/StartWorkout';
import TrainerScreen from '../pages/Workout/Trainer';
import TrainerInformationScreen from '../pages/Workout/TrainerInformation';
import WorkoutListScreen from '../pages/Workout/WorkoutList';
import WorkoutScreen from '../pages/Workout/WorkoutScreen';

const Stack = createStackNavigator();

const WorkoutNav = ({ setLoggedin }) => {
  return (
    <Stack.Navigator screenOptions={{ presentation: 'transparentModal' }}>
      <Stack.Screen
        name="Workout-Screen"
        component={WorkoutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Trainer"
        component={TrainerScreen}
        options={{
          headerTitle: 'Hire trainer',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="StartWorkout"
        component={StartWorkoutScreen}
        initialParams={{ selectedExercises: [] }}
        options={({ navigation }) => ({
          headerTitle: 'Workout',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 10,
              }}
            >
              <ClockModal />
              <TouchableOpacity
                onPress={() => navigation.navigate('FinishWorkout')}
                style={{
                  marginLeft: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{ color: '#FF4C0A', fontSize: 18, fontWeight: 'bold' }}
                >
                  Finish
                </Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="FinishWorkout"
        component={FinishWorkoutScreen}
        options={({ navigation }) => ({
          headerTitle: 'Finish Workout',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
                paddingVertical: 8,
                paddingHorizontal: 8,
                borderRadius: 4,
              }}
            >
              <Text
                style={{ color: '#FF4C0A', fontSize: 18, fontWeight: 'bold' }}
              >
                Skip
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="WorkoutList"
        component={WorkoutListScreen}
        options={{
          headerTitle: 'Workout List',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="TrainerInformation"
        component={TrainerInformationScreen}
        options={{
          headerTitle: 'Trainer Information',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="BookTrainer"
        component={BookTrainerScreen}
        options={{
          headerTitle: 'Book Trainer',
          headerStyle: { backgroundColor: '#2F2F2F' },
          headerTintColor: '#DFE7EB',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default WorkoutNav;
