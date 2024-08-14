import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const PostExercises = ({ post }) => {
  const [showAll, setShowAll] = useState(false);

  const exercisesToShow = showAll ? post.workoutPlan : post.workoutPlan.slice(0, 3);

  return (
    <View>
      {exercisesToShow.map((exercise, index) => (
        <View key={index} style={styles.exerciseContainer}>
          <Image source={{ uri: exercise.photo }} style={styles.exerciseImage} />
          <Text style={styles.exerciseText}>{exercise.sets}</Text>
          <Text style={styles.exerciseText}>{exercise.exerciseName}</Text>
        </View>
      ))}

      {post.workoutPlan.length > 3 && !showAll && (
        <TouchableOpacity onPress={() => setShowAll(true)}>
          <Text style={styles.showMoreText}>Show More</Text>
        </TouchableOpacity>
      )}

      {showAll && (
        <TouchableOpacity onPress={() => setShowAll(false)}>
          <Text style={styles.showMoreText}>Show Less</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PostExercises;

const styles = StyleSheet.create({
    exerciseText: {
      color: 'white',
      fontSize: 18
    },
    exerciseContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: 5,
      marginVertical: 5,
      alignItems: 'center',
    },
    exerciseImage: {
        width: 60,
        height: 60,
        borderRadius: 20,
        marginRight: 10,
    },
    showMoreText: {
        color: '#FF4C0A',
        marginTop: 10,
        textAlign: 'center',
    },
});