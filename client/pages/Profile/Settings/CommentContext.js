import React, { createContext, useState } from 'react';
import { Animated } from 'react-native';

// Create the context
export const CommentContext = createContext();

// Create the provider component
export const CommentProvider = ({ children }) => {
  const [commentVisible, setCommentVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null); // Manage the current post ID
  const [posts, setPosts] = useState([]); // Manage posts
  const slideAnim = useState(new Animated.Value(500))[0];

  return (
    <CommentContext.Provider value={{ commentVisible, setCommentVisible, currentPostId, setCurrentPostId, posts, setPosts, slideAnim }}>
      {children}
    </CommentContext.Provider>
  );
};
