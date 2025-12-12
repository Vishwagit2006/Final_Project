//shared->Community
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  StatusBar,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  PanResponder,
} from 'react-native';
import {
  Card,
  Avatar,
  IconButton,
  TextInput,
  Button,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Enhanced Color Palette
const COLOR_PALETTE = {
  PRIMARY: '#31DABD',
  PRIMARY_DARK: '#25B89F',
  SECONDARY: '#B34523',
  SECONDARY_LIGHT: '#D45A32',
  BACKGROUND: '#FFFFFF',
  SURFACE: '#F8F9FA',
  TEXT_PRIMARY: '#2D3748',
  TEXT_SECONDARY: '#718096',
  TEXT_TERTIARY: '#A0AEC0',
  BORDER: '#E2E8F0',
  BORDER_LIGHT: '#EDF2F7',
  ERROR: '#E53E3E',
  SUCCESS: '#38A169',
  WARNING: '#DD6B20',
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Enhanced stories with multiple stories per user
const initialStories = [
  { 
    id: '1', 
    userName: 'Ruffles', 
    avatar: 'https://img.freepik.com/premium-vector/young-man-avatar-character-due-avatar-man-vector-icon-cartoon-illustration_1186924-4438.jpg', 
    stories: [
      {
        id: '1-1',
        image: 'https://plus.unsplash.com/premium_photo-1663076321823-7ba8f3c6a75c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xlYW4lMjBlbnZpcm9ubWVudHxlbnwwfHwwfHx8MA%3D%3D',
        content: 'Just finished cleaning up the local park! 🌳 So rewarding to see the difference we can make together. #CleanEnvironment #CommunityLove',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'image',
        duration: 5000,
      },
      {
        id: '1-2',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29tbXVuaXR5JTIwY2xlYW51cHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
        content: 'Before and after of our community cleanup! The transformation is incredible! ✨',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        type: 'image',
        duration: 5000,
      }
    ],
    hasNewStory: true 
  },
  { 
    id: '2', 
    userName: 'sabenok', 
    avatar: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg', 
    stories: [
      {
        id: '2-1',
        image: 'https://c0.wallpaperflare.com/preview/35/970/433/active-cleaning-daylight-environment.jpg',
        content: 'Morning beach cleanup session! 🏖️ Every piece of trash removed makes our oceans happier. #BeachCleanup #SaveOurOceans',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        type: 'image',
        duration: 5000,
      }
    ],
    hasNewStory: false 
  },
  { 
    id: '3', 
    userName: 'Mufa', 
    avatar:  'https://static.vecteezy.com/system/resources/previews/024/183/525/non_2x/avatar-of-a-man-portrait-of-a-young-guy-illustration-of-male-character-in-modern-color-style-vector.jpg',
    stories: [
      {
        id: '3-1',
        image: 'https://thumbs.dreamstime.com/b/volunteers-activists-picking-up-litter-park-father-his-toddler-son-cleaning-forest-to-save-environment-pollution-155621441.jpg',
        content: 'Family cleanup day in the forest! Teaching the next generation to care for our planet. 🌲👨‍👩‍👧‍👦 #FamilyGoals #EcoFriendly',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        type: 'image',
        duration: 5000,
      },
      {
        id: '3-2',
        image: 'https://media.istockphoto.com/id/1369153285/photo/volunteers-collecting-garbage-from-park.jpg?s=612x612&w=0&k=20&c=3XG1VxXKGHxwVxHjC4lSfCk6L8Q7Q9Z8Q9Z8Q9Z8Q9Z8=',
        content: 'Our little environmental warriors! Kids learning the importance of keeping nature clean. 🌍💚',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        type: 'image',
        duration: 5000,
      }
    ],
    hasNewStory: true 
  },
  { 
    id: '4', 
    userName:  'Sue',
    avatar: 'https://img.freepik.com/premium-vector/business-woman-character-vector-illustration_1133257-2432.jpg?semt=ais_hybrid&w=740',
    stories: [
      {
        id: '4-1',
        image: 'https://media.istockphoto.com/id/1077156290/photo/people-cleaning-the-environment.jpg?s=612x612&w=0&k=20&c=XnZ7DdZ9Xo8r4rfCWicAXnSrF3QqGm58MFMidM-2z9A=',
        content: 'Community garden project coming along beautifully! 🌻 Growing food and friendships together. #UrbanGardening #SustainableLiving',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        type: 'image',
        duration: 5000,
      }
    ],
    hasNewStory: false 
  }
];

const initialPosts = [
  {
    id: '1',
    userName: 'Thanh Pham',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvwl41G5GDw9Bpy-kOzdtugBj9s4W3GJVIDqjAjUKvQI7TctWaZDBUAwsSWbbHYqASuF0&usqp=CAU',
    content: 'Exploring the city today! The architecture is amazing and the environment is so clean. Let\'s keep our cities green! 🌿',
    image: 'https://media.istockphoto.com/id/1130655067/photo/volunteers-planting-a-tree.jpg?s=612x612&w=0&k=20&c=LN2OT16Fg46ghQ3xjGh8-95awNIpLkoHXJ8ADRIVLnU=',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 125,
    comments: 2,
    likedByUser: false,
    commentsList: [
      { id: '1', user: 'User1', text: 'Nice post! Love the view!', avatar: 'https://static.vecteezy.com/system/resources/previews/002/002/257/non_2x/beautiful-woman-avatar-character-icon-free-vector.jpg' },
      { id: '2', user: 'User2', text: 'Great view! Where is this?', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhnJ8ohO113eX3thYt_EViTew3NXN3xwKxi4DzqigRhpA0GY6OWlgY5yZCOqPLda4y5fk&usqp=CAU' },
    ],
  },
  {
    id: '2',
    userName: 'Minh Nguyen',
    avatar: 'https://static.vecteezy.com/system/resources/previews/002/002/257/non_2x/beautiful-woman-avatar-character-icon-free-vector.jpg',
    content: 'Spent the afternoon cleaning up the beach 🌳💪. It feels so good to give back to the community!',
    image: 'https://plus.unsplash.com/premium_photo-1663039947303-0fad26f737b8?fm=jpg&q=60&w=3000',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    likes: 87,
    comments: 1,
    likedByUser: true,
    commentsList: [
      { id: '1', user: 'EcoFan', text: 'Much respect! 👏', avatar: 'https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740' },
    ],
  }
];

// Progress Bar Component
const StoryProgressBar = ({ progress, isActive }) => (
  <View style={styles.progressBarContainer}>
    <View style={styles.progressBarBackground}>
      <Animated.View 
        style={[
          styles.progressBarFill,
          {
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  </View>
);

// Story Progress Bars for multiple stories
const StoryProgressBars = ({ stories, currentStoryIndex, progress }) => (
  <View style={styles.progressBarsContainer}>
    {stories.map((_, index) => (
      <View key={index} style={styles.progressBarWrapper}>
        <View style={styles.progressBarBackground}>
          <Animated.View 
            style={[
              styles.progressBarFill,
              {
                width: index === currentStoryIndex 
                  ? progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    })
                  : index < currentStoryIndex ? '100%' : '0%',
              },
            ]}
          />
        </View>
      </View>
    ))}
  </View>
);

// Story View Modal Component with full functionality
const StoryViewModal = ({ userStories, isVisible, onClose, initialUserIndex = 0 }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const [isPaused, setIsPaused] = useState(false);

  const currentUser = userStories[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];

  // Reset when modal opens
  useEffect(() => {
    if (isVisible) {
      setCurrentUserIndex(initialUserIndex);
      setCurrentStoryIndex(0);
      progress.setValue(0);
      startProgress();
    }
  }, [isVisible, initialUserIndex]);

  const startProgress = () => {
    if (!currentStory) return;
    
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: currentStory.duration || 5000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !isPaused) {
        nextStory();
      }
    });
  };

  const nextStory = () => {
    if (currentStoryIndex < currentUser.stories.length - 1) {
      // Next story in same user
      setCurrentStoryIndex(prev => prev + 1);
      progress.setValue(0);
      startProgress();
    } else if (currentUserIndex < userStories.length - 1) {
      // Next user
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
      progress.setValue(0);
      startProgress();
    } else {
      // End of all stories
      onClose();
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      // Previous story in same user
      setCurrentStoryIndex(prev => prev - 1);
      progress.setValue(0);
      startProgress();
    } else if (currentUserIndex > 0) {
      // Previous user
      setCurrentUserIndex(prev => prev - 1);
      const prevUserStories = userStories[currentUserIndex - 1].stories;
      setCurrentStoryIndex(prevUserStories.length - 1);
      progress.setValue(0);
      startProgress();
    }
  };

  const handleTap = (event) => {
    const { locationX } = event.nativeEvent;
    const screenMiddle = SCREEN_WIDTH / 2;
    
    if (locationX < screenMiddle) {
      previousStory();
    } else {
      nextStory();
    }
  };

  const handleLongPress = () => {
    setIsPaused(true);
    progress.stopAnimation();
  };

  const handlePressOut = () => {
    setIsPaused(false);
    startProgress();
  };

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;
        
        // Swipe down to close
        if (dy > 50 && Math.abs(dx) < 50) {
          onClose();
          return;
        }
        
        // Swipe left for next
        if (dx < -50 && Math.abs(dy) < 50) {
          nextStory();
          return;
        }
        
        // Swipe right for previous
        if (dx > 50 && Math.abs(dy) < 50) {
          previousStory();
          return;
        }
      },
    })
  ).current;

  if (!isVisible || !currentStory) return null;

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.storyModalOverlay} {...panResponder.panHandlers}>
        <Image 
          source={{ uri: currentStory.image }} 
          style={styles.storyBackgroundImage}
          resizeMode="cover"
        />
        
        {/* Progress Bars */}
        <View style={styles.storyProgressContainer}>
          <StoryProgressBars 
            stories={currentUser.stories}
            currentStoryIndex={currentStoryIndex}
            progress={progress}
          />
        </View>

        {/* Story Header */}
        <View style={styles.storyHeader}>
          <View style={styles.storyUserInfo}>
            <Avatar.Image source={{ uri: currentUser.avatar }} size={40} />
            <View style={styles.storyUserDetails}>
              <Text style={styles.storyUserName}>{currentUser.userName}</Text>
              <Text style={styles.storyTime}>
                {new Date(currentStory.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.storyCloseButton}>
            <Ionicons name="close" size={24} color={COLOR_PALETTE.BACKGROUND} />
          </TouchableOpacity>
        </View>

        {/* Story Content */}
        <TouchableOpacity 
          style={styles.storyContentArea}
          activeOpacity={1}
          onPress={handleTap}
          onLongPress={handleLongPress}
          onPressOut={handlePressOut}
          delayLongPress={200}
        >
          <View style={styles.storyTextContainer}>
            <Text style={styles.storyContentText}>{currentStory.content}</Text>
          </View>
        </TouchableOpacity>

        {/* Story Actions */}
        <View style={styles.storyActions}>
          <TouchableOpacity style={styles.storyActionButton}>
            <Ionicons name="heart" size={24} color={COLOR_PALETTE.BACKGROUND} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.storyActionButton}>
            <Ionicons name="chatbubble" size={24} color={COLOR_PALETTE.BACKGROUND} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.storyActionButton}>
            <Ionicons name="send" size={24} color={COLOR_PALETTE.BACKGROUND} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Rest of the components remain the same (CreatePostModal, ProfileViewModal, etc.)
const CreatePostModal = ({ onSubmit, onCancel, onPickImage, imageUri, setImageUri, isSubmitting }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!content.trim()) {
      return;
    }
    const result = await onSubmit(content);
    if (result !== false) {
      setContent('');
      setImageUri(null);
    }
  };

  return (
    <Modal visible={true} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalKeyboardAvoiding}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Button 
                mode="text" 
                onPress={onCancel} 
                textColor={COLOR_PALETTE.TEXT_SECONDARY}
                style={styles.cancelButton}
                labelStyle={styles.cancelButtonLabel}
              >
                Cancel
              </Button>
              <Text style={styles.modalTitle}>Create Post</Text>
              <Button 
                mode="contained" 
                onPress={handleSubmit} 
                style={styles.postButton}
                labelStyle={styles.postButtonLabel}
                buttonColor={COLOR_PALETTE.PRIMARY}
                disabled={!content.trim() || isSubmitting}
                loading={isSubmitting}
              >
                Post
              </Button>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.userInfoRow}>
                <Avatar.Image 
                  source={{ uri: 'https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740' }} 
                  size={44} 
                />
                <View style={styles.userInfoText}>
                  <Text style={styles.userName}>You</Text>
                  <View style={styles.privacySelector}>
                    <Ionicons name="earth" size={14} color={COLOR_PALETTE.TEXT_TERTIARY} />
                    <Text style={styles.postPrivacy}>Public</Text>
                    <Ionicons name="chevron-down" size={14} color={COLOR_PALETTE.TEXT_TERTIARY} />
                  </View>
                </View>
              </View>
              
              <TextInput
                placeholder="What's on your mind about environmental responsibility?"
                value={content}
                onChangeText={setContent}
                multiline
                style={styles.textInput}
                placeholderTextColor={COLOR_PALETTE.TEXT_TERTIARY}
                theme={{ 
                  colors: { 
                    primary: COLOR_PALETTE.PRIMARY,
                    background: 'transparent'
                  } 
                }}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
              
              {imageUri && (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: imageUri }} style={styles.previewImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setImageUri(null)}
                  >
                    <Ionicons name="close-circle" size={24} color={COLOR_PALETTE.BACKGROUND} />
                  </TouchableOpacity>
                </View>
              )}
              
              <View style={styles.modalActions}>
                <Text style={styles.actionsTitle}>Add to your post</Text>
                <View style={styles.attachmentButtons}>
                  <TouchableOpacity onPress={onPickImage} style={styles.attachmentButton}>
                    <View style={[styles.attachmentIconContainer, { backgroundColor: '#E8F8F5' }]}>
                      <Ionicons name="image" size={22} color={COLOR_PALETTE.PRIMARY} />
                    </View>
                    <Text style={styles.attachmentText}>Photo</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.attachmentButton}>
                    <View style={[styles.attachmentIconContainer, { backgroundColor: '#FCE8E4' }]}>
                      <Ionicons name="people" size={22} color={COLOR_PALETTE.SECONDARY} />
                    </View>
                    <Text style={styles.attachmentText}>Tag</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.attachmentButton}>
                    <View style={[styles.attachmentIconContainer, { backgroundColor: '#E8F0FE' }]}>
                      <Ionicons name="location" size={22} color="#4285F4" />
                    </View>
                    <Text style={styles.attachmentText}>Location</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const CommunityScreen = () => {
  const [stories, setStories] = useState(initialStories);
  const [posts, setPosts] = useState(initialPosts);
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);
  const [postImageUri, setPostImageUri] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  const flatListRef = useRef(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredStories = useMemo(() => {
    if (!normalizedQuery) return stories;
    return stories.filter(story => {
      const inUser = story.userName.toLowerCase().includes(normalizedQuery);
      const inStory = story.stories.some(s => s.content.toLowerCase().includes(normalizedQuery));
      return inUser || inStory;
    });
  }, [stories, normalizedQuery]);

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return posts;
    return posts.filter(post => {
      const base = `${post.userName} ${post.content}`.toLowerCase();
      const commentsText = (post.commentsList || [])
        .map(comment => `${comment.user} ${comment.text}`.toLowerCase())
        .join(' ');
      return base.includes(normalizedQuery) || commentsText.includes(normalizedQuery);
    });
  }, [posts, normalizedQuery]);

  const showEmptyResults = normalizedQuery.length > 0 && filteredPosts.length === 0 && filteredStories.length === 0;

  const pickImageForPost = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera roll permissions are required to pick images.');
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPostImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to pick image: ${error.message}`);
    }
  };

  const handleCreatePost = useCallback(
    async (content) => {
      const trimmedContent = content.trim();
      if (!trimmedContent) {
        return false;
      }

      setIsPosting(true);
      try {
        const newPost = {
          id: Date.now().toString(),
          userName: 'You',
          avatar:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLTj9cCWiISzWoiMWMBOWDTql2-YysoeA9RRkSLTUDkyTR2FCx0-LT0IEKvLcbyHsKTcQ&usqp=CAU',
          content: trimmedContent,
          image: postImageUri,
          timestamp: new Date().toISOString(),
          likes: 0,
          comments: 0,
          likedByUser: false,
          commentsList: [],
        };

        setPosts(prevPosts => [newPost, ...prevPosts]);
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        });
        setPostImageUri(null);
        setIsCreatePostVisible(false);
        return true;
      } catch (error) {
        Alert.alert('Error', 'Unable to create post. Please try again.');
        return false;
      } finally {
        setIsPosting(false);
      }
    },
    [postImageUri]
  );

  const handleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { 
              ...post, 
              likedByUser: !post.likedByUser, 
              likes: post.likedByUser ? post.likes - 1 : post.likes + 1 
            }
          : post
      )
    );
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = (postId) => {
    const commentText = commentTexts[postId] || '';
    if (commentText.trim()) {
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: (post.comments || 0) + 1,
                commentsList: post.commentsList ? [
                  ...post.commentsList,
                  {
                    id: Date.now().toString(),
                    user: 'You',
                    text: commentText,
                    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwLkwYOYvCNBnft5B86IBz8AN_7SmAeF_B3fHQy6x0IIzVbkBxAVeZJNSGCV-xhfPMzBI&usqp=CAU',
                  },
                ] : [{
                  id: Date.now().toString(),
                  user: 'You',
                  text: commentText,
                  avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwLkwYOYvCNBnft5B86IBz8AN_7SmAeF_B3fHQy6x0IIzVbkBxAVeZJNSGCV-xhfPMzBI&usqp=CAU',
                }],
              }
            : post
        )
      );
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const handleCommentTextChange = (postId, text) => {
    setCommentTexts(prev => ({ ...prev, [postId]: text }));
  };

  const handleProfilePress = (profile) => {
    setSelectedProfile(profile);
    setIsProfileModalVisible(true);
  };

  const handleCloseProfile = () => {
    setIsProfileModalVisible(false);
    setSelectedProfile(null);
  };

  const handleStoryPress = (userIndex) => {
    setSelectedUserIndex(userIndex);
    setIsStoryModalVisible(true);
  };

  const handleCloseStory = () => {
    setIsStoryModalVisible(false);
    setSelectedUserIndex(0);
  };

  const renderStorySection = () => (
    <View style={styles.storySection}>
      <Text style={styles.sectionTitle}>Stories</Text>
      <FlatList
        horizontal
        data={[...[{ id: 'create', isCreate: true }], ...filteredStories]}
        renderItem={({ item, index }) =>
          item.isCreate ? (
            <TouchableOpacity 
              onPress={() => setIsCreatePostVisible(true)} 
              style={styles.createStoryItem}
              activeOpacity={0.7}
            >
              <View style={styles.createStoryAvatarContainer}>
                <Avatar.Image 
                  source={{ uri: 'https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740' }} 
                  size={70} 
                  style={styles.createStoryAvatar}
                />
                <View style={styles.plusBadge}>
                  <Ionicons name="add" size={20} color={COLOR_PALETTE.BACKGROUND} />
                </View>
              </View>
              <Text style={styles.createStoryText}>Your Story</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              key={item.id} 
              style={styles.storyItem}
              activeOpacity={0.7}
              onPress={() => {
                const originalIndex = stories.findIndex(story => story.id === item.id);
                if (originalIndex >= 0) {
                  handleStoryPress(originalIndex);
                }
              }}
            >
              <View style={styles.storyImageContainer}>
                <Image source={{ uri: item.stories[0].image }} style={styles.storyImage} />
                {item.hasNewStory && <View style={styles.newStoryIndicator} />}
              </View>
              <Avatar.Image 
                source={{ uri: item.avatar }} 
                size={42} 
                style={styles.storyAvatar} 
              />
              <Text style={styles.storyUserName} numberOfLines={1}>
                {item.userName}
              </Text>
            </TouchableOpacity>
          )
        }
        keyExtractor={item => item.id || 'create'}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesListContent}
      />
    </View>
  );

  // Rest of the component remains the same...
  const renderCreatePostSection = () => (
    <Card style={styles.createPostCard}>
      <View style={styles.createPostSection}>
        <Avatar.Image 
          source={{ uri: 'https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740' }} 
          size={48} 
          style={styles.createPostAvatar}
        />
        <TouchableOpacity 
          style={styles.createPostInput} 
          onPress={() => setIsCreatePostVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.createPostText}>Share your environmental responsibility...</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setIsCreatePostVisible(true)}
          style={styles.createPostImageButton}
        >
          <Ionicons name="image" size={24} color={COLOR_PALETTE.PRIMARY} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderPostItem = ({ item }) => (
    <Card style={styles.postCard} elevation={2}>
      <Card.Content style={styles.postHeader}>
        <TouchableOpacity 
          style={styles.postUserInfo}
          onPress={() => handleProfilePress({
            userName: item.userName,
            avatar: item.avatar,
            image: item.image
          })}
        >
          <Avatar.Image source={{ uri: item.avatar }} size={44} />
          <View style={styles.postUserDetails}>
            <Text style={styles.postUserName}>{item.userName}</Text>
            <View style={styles.postMeta}>
              <Text style={styles.postTime}>
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={styles.postDot}>•</Text>
              <Ionicons name="earth" size={12} color={COLOR_PALETTE.TEXT_TERTIARY} />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={18} color={COLOR_PALETTE.TEXT_TERTIARY} />
        </TouchableOpacity>
      </Card.Content>
      
      <Card.Content style={styles.postContent}>
        <Text style={styles.postContentText}>{item.content}</Text>
        {item.image && (
          <View style={styles.postImageContainer}>
            <Image source={{ uri: item.image }} style={styles.postImage} />
          </View>
        )}
      </Card.Content>
      
      <Card.Content style={styles.postStats}>
        <View style={styles.statsRow}>
          <View style={styles.likesContainer}>
            <View style={styles.likeIcons}>
              <View style={[styles.likeIcon, styles.likeIconPrimary]}>
                <Ionicons name="heart" size={12} color={COLOR_PALETTE.BACKGROUND} />
              </View>
            </View>
            <Text style={styles.statsText}>{item.likes} likes</Text>
          </View>
          <Text style={styles.statsText}>{item.comments} comments</Text>
        </View>
      </Card.Content>
      
      <Card.Actions style={styles.postActions}>
        <TouchableOpacity 
          style={[styles.actionButton, item.likedByUser && styles.actionButtonActive]}
          onPress={() => handleLike(item.id)}
        >
          <Ionicons 
            name={item.likedByUser ? "heart" : "heart-outline"} 
            size={20} 
            color={item.likedByUser ? COLOR_PALETTE.PRIMARY : COLOR_PALETTE.TEXT_SECONDARY} 
          />
          <Text style={[
            styles.actionButtonText,
            item.likedByUser && styles.actionButtonTextActive
          ]}>
            Like
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, expandedComments[item.id] && styles.actionButtonActive]}
          onPress={() => toggleComments(item.id)}
        >
          <Ionicons 
            name="chatbubble-outline" 
            size={18} 
            color={expandedComments[item.id] ? COLOR_PALETTE.PRIMARY : COLOR_PALETTE.TEXT_SECONDARY} 
          />
          <Text style={[
            styles.actionButtonText,
            expandedComments[item.id] && styles.actionButtonTextActive
          ]}>
            Comment
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={18} color={COLOR_PALETTE.TEXT_SECONDARY} />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </Card.Actions>

      {expandedComments[item.id] && (
        <View style={styles.commentSection}>
          <FlatList
            data={item.commentsList || []}
            renderItem={({ item: comment }) => (
              <View style={styles.commentItem}>
                <Avatar.Image source={{ uri: comment.avatar }} size={32} />
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{comment.user}</Text>
                    <Text style={styles.commentTime}>2h</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.commentAction}>
                      <Text style={styles.commentActionText}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.commentAction}>
                      <Text style={styles.commentActionText}>Reply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={comment => comment.id}
            ListEmptyComponent={
              <Text style={styles.emptyCommentText}>No comments yet. Be the first to comment!</Text>
            }
          />
          <View style={styles.commentInputContainer}>
            <Avatar.Image 
              source={{ uri: 'https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740' }} 
              size={32} 
            />
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={commentTexts[item.id] || ''}
              onChangeText={(text) => handleCommentTextChange(item.id, text)}
              onSubmitEditing={() => handleAddComment(item.id)}
              theme={{ 
                colors: { 
                  primary: COLOR_PALETTE.PRIMARY,
                  background: 'transparent'
                } 
              }}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            <TouchableOpacity 
              onPress={() => handleAddComment(item.id)}
              style={[
                styles.sendCommentButton,
                !commentTexts[item.id]?.trim() && styles.sendCommentButtonDisabled
              ]}
              disabled={!commentTexts[item.id]?.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={commentTexts[item.id]?.trim() ? COLOR_PALETTE.PRIMARY : COLOR_PALETTE.TEXT_TERTIARY} 
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLOR_PALETTE.BACKGROUND} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLOR_PALETTE.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
        
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={COLOR_PALETTE.TEXT_TERTIARY} style={styles.searchIcon} />
            <TextInput
              placeholder="Search posts, users, topics..."
              placeholderTextColor={COLOR_PALETTE.TEXT_TERTIARY}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              theme={{ 
                colors: { 
                  primary: COLOR_PALETTE.PRIMARY,
                  background: 'transparent'
                } 
              }}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={18} color={COLOR_PALETTE.TEXT_TERTIARY} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={styles.peopleButton}
            onPress={() => router.push('shared/GroupBuy')}
          >
            <Ionicons name="people" size={20} color={COLOR_PALETTE.BACKGROUND} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={[{ key: 'stories' }, ...filteredPosts]}
          renderItem={({ item }) => {
            if (item.key === 'stories') return renderStorySection();
            return renderPostItem({ item });
          }}
          keyExtractor={(item, index) => item.id || `stories-${index}`}
          contentContainerStyle={styles.contentContainer}
          ListHeaderComponent={renderCreatePostSection}
          ListFooterComponent={showEmptyResults ? (
            <View style={styles.emptyResultContainer}>
              <Ionicons name="search" size={32} color={COLOR_PALETTE.TEXT_TERTIARY} />
              <Text style={styles.emptyResultTitle}>No community matches</Text>
              <Text style={styles.emptyResultText}>Try a different name, topic, or keyword.</Text>
            </View>
          ) : null}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>

      {isCreatePostVisible && (
        <CreatePostModal
          onSubmit={handleCreatePost}
          onCancel={() => {
            setIsCreatePostVisible(false);
            setPostImageUri(null);
          }}
          onPickImage={pickImageForPost}
          imageUri={postImageUri}
          setImageUri={setPostImageUri}
          isSubmitting={isPosting}
        />
      )}

      <StoryViewModal
        userStories={stories}
        isVisible={isStoryModalVisible}
        onClose={handleCloseStory}
        initialUserIndex={selectedUserIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.SURFACE,
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLOR_PALETTE.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.BORDER_LIGHT,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLOR_PALETTE.SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR_PALETTE.TEXT_PRIMARY,
    marginRight:110
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLOR_PALETTE.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Search Bar Styles
  searchContainer: {
    padding: 16,
    backgroundColor: COLOR_PALETTE.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.BORDER_LIGHT,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_PALETTE.BACKGROUND,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.BORDER,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLOR_PALETTE.TEXT_PRIMARY,
    paddingVertical: 0,
    height: 44,
  },
  clearButton: {
    padding: 4,
  },
  peopleButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLOR_PALETTE.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR_PALETTE.TEXT_PRIMARY,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  storySection: {
    marginTop: 8,
    marginBottom: 16,
  },
  storiesListContent: {
    paddingHorizontal: 12,
  },
  createStoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  createStoryAvatarContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  createStoryAvatar: {
    borderWidth: 2,
    borderColor: COLOR_PALETTE.BORDER,
  },
  plusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLOR_PALETTE.PRIMARY,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLOR_PALETTE.BACKGROUND,
  },
  createStoryText: {
    fontSize: 12,
    color: COLOR_PALETTE.TEXT_PRIMARY,
    fontWeight: '500',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  storyImageContainer: {
    position: 'relative',
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginBottom: 6,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  newStoryIndicator: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLOR_PALETTE.PRIMARY,
    borderWidth: 2,
    borderColor: COLOR_PALETTE.BACKGROUND,
  },
  storyAvatar: {
    position: 'absolute',
    top: 4,
    left: 4,
    borderWidth: 2,
    borderColor: COLOR_PALETTE.BACKGROUND,
  },
  storyUserName: {
    fontSize: 12,
    color: COLOR_PALETTE.TEXT_PRIMARY,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Story View Modal Styles
  storyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  storyBackgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  storyProgressContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  progressBarsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  progressBarWrapper: {
    flex: 1,
    marginHorizontal: 2,
  },
  progressBarBackground: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLOR_PALETTE.BACKGROUND,
    borderRadius: 1,
  },
  storyHeader: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    zIndex: 10,
  },
  storyUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyUserDetails: {
    marginLeft: 12,
  },
  storyUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR_PALETTE.BACKGROUND,
  },
  storyTime: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  storyCloseButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  storyContentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyTextContainer: {
    paddingHorizontal: 20,
  },
  storyContentText: {
    fontSize: 18,
    color: COLOR_PALETTE.BACKGROUND,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  storyActions: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    zIndex: 10,
  },
  storyActionButton: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  // Rest of the styles remain the same...
  createPostCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: COLOR_PALETTE.BACKGROUND,
  },
  createPostSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  createPostAvatar: {
    marginRight: 12,
  },
  createPostInput: {
    flex: 1,
    padding: 12,
    backgroundColor: COLOR_PALETTE.SURFACE,
    borderRadius: 20,
    marginRight: 8,
  },
  createPostText: {
    color: COLOR_PALETTE.TEXT_TERTIARY,
    fontSize: 14,
  },
  createPostImageButton: {
    padding: 8,
  },
  postCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: COLOR_PALETTE.BACKGROUND,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  postUserDetails: {
    marginLeft: 12,
    flex: 1,
  },
  postUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLOR_PALETTE.TEXT_PRIMARY,
    marginBottom: 2,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postTime: {
    fontSize: 13,
    color: COLOR_PALETTE.TEXT_TERTIARY,
  },
  postDot: {
    fontSize: 13,
    color: COLOR_PALETTE.TEXT_TERTIARY,
    marginHorizontal: 4,
  },
  postContent: {
    paddingTop: 0,
    paddingBottom: 12,
  },
  postContentText: {
    fontSize: 15,
    color: COLOR_PALETTE.TEXT_PRIMARY,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  postImage: {
    width: '100%',
    height: 240,
  },
  postStats: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLOR_PALETTE.BORDER_LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.BORDER_LIGHT,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcons: {
    flexDirection: 'row',
    marginRight: 6,
  },
  likeIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -4,
  },
  likeIconPrimary: {
    backgroundColor: COLOR_PALETTE.PRIMARY,
  },
  statsText: {
    fontSize: 14,
    color: COLOR_PALETTE.TEXT_TERTIARY,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionButtonActive: {
    backgroundColor: COLOR_PALETTE.SURFACE,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLOR_PALETTE.TEXT_SECONDARY,
    marginLeft: 6,
  },
  actionButtonTextActive: {
    color: COLOR_PALETTE.PRIMARY,
  },
  commentSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLOR_PALETTE.BORDER_LIGHT,
  },
   // Post Styles
  createPostCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: COLOR_PALETTE.BACKGROUND,
  },
  createPostSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  createPostAvatar: {
    marginRight: 12,
  },
  createPostInput: {
    flex: 1,
    padding: 12,
    backgroundColor: COLOR_PALETTE.SURFACE,
    borderRadius: 20,
    marginRight: 8,
  },
  createPostText: {
    color: COLOR_PALETTE.TEXT_TERTIARY,
    fontSize: 14,
  },
  createPostImageButton: {
    padding: 8,
  },
  postCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: COLOR_PALETTE.BACKGROUND,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  postUserDetails: {
    marginLeft: 12,
    flex: 1,
  },
  postUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLOR_PALETTE.TEXT_PRIMARY,
    marginBottom: 2,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postTime: {
    fontSize: 13,
    color: COLOR_PALETTE.TEXT_TERTIARY,
  },
  postDot: {
    fontSize: 13,
    color: COLOR_PALETTE.TEXT_TERTIARY,
    marginHorizontal: 4,
  },
  postContent: {
    paddingTop: 0,
    paddingBottom: 12,
  },
  postContentText: {
    fontSize: 15,
    color: COLOR_PALETTE.TEXT_PRIMARY,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  postImage: {
    width: '100%',
    height: 240,
  },
  postStats: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLOR_PALETTE.BORDER_LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.BORDER_LIGHT,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcons: {
    flexDirection: 'row',
    marginRight: 6,
  },
  likeIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -4,
  },
  likeIconPrimary: {
    backgroundColor: COLOR_PALETTE.PRIMARY,
  },
  statsText: {
    fontSize: 14,
    color: COLOR_PALETTE.TEXT_TERTIARY,
  },
  postActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: COLOR_PALETTE.BORDER_LIGHT,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  actionButtonActive: {
    backgroundColor: COLOR_PALETTE.SURFACE,
  },
  actionDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLOR_PALETTE.BORDER,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR_PALETTE.TEXT_SECONDARY,
    marginLeft: 6,
  },
  actionButtonTextActive: {
    color: COLOR_PALETTE.PRIMARY,
  },
  commentSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLOR_PALETTE.BORDER_LIGHT,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR_PALETTE.TEXT_PRIMARY,
  },
  commentTime: {
    fontSize: 12,
    color: COLOR_PALETTE.TEXT_TERTIARY,
  },
  commentText: {
    fontSize: 14,
    color: COLOR_PALETTE.TEXT_PRIMARY,
    lineHeight: 18,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  commentAction: {
    paddingVertical: 4,
  },
  commentActionText: {
    fontSize: 12,
    color: COLOR_PALETTE.TEXT_TERTIARY,
    fontWeight: '500',
  },
  emptyCommentText: {
    textAlign: 'center',
    color: COLOR_PALETTE.TEXT_TERTIARY,
    fontStyle: 'italic',
    marginVertical: 16,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  commentInput: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 14,
  },
  sendCommentButton: {
    padding: 8,
  },
  sendCommentButtonDisabled: {
    opacity: 0.5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalKeyboardAvoiding: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLOR_PALETTE.BACKGROUND,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.BORDER_LIGHT,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLOR_PALETTE.TEXT_PRIMARY,
  },
  cancelButton: {
    minWidth: 60,
  },
  cancelButtonLabel: {
    fontSize: 16,
  },
  postButton: {
    minWidth: 60,
  },
  postButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    padding: 16,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfoText: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR_PALETTE.TEXT_PRIMARY,
    marginBottom: 2,
  },
  privacySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postPrivacy: {
    fontSize: 14,
    color: COLOR_PALETTE.TEXT_TERTIARY,
    marginHorizontal: 4,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    minHeight: 100,
    padding: 0,
    marginBottom: 16,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
  },
  modalActions: {
    marginTop: 16,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR_PALETTE.TEXT_PRIMARY,
    marginBottom: 12,
  },
  attachmentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attachmentButton: {
    alignItems: 'center',
    padding: 12,
    flex: 1,
  },
  attachmentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentText: {
    fontSize: 14,
    color: COLOR_PALETTE.TEXT_PRIMARY,
    fontWeight: '500',
  },
  emptyResultContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyResultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLOR_PALETTE.TEXT_PRIMARY,
  },
  emptyResultText: {
    fontSize: 13,
    color: COLOR_PALETTE.TEXT_TERTIARY,
    textAlign: 'center',
  },
  // ... (rest of the styles remain the same)
});

export default CommunityScreen;