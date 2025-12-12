import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';

const TopNavBar = () => {
  const router = useRouter();

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => router.push('/')} style={styles.logoContainer}>
        <Image
          source={require('../assets/images/ReShare-Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNotificationPress} style={styles.iconContainer}>
        <IconButton
          icon="bell"
          size={24}
          color="#333"
          style={styles.iconButton}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    width: '100%',
    backgroundColor: '#fff', // Solid background color
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Light border for a minimal look
  },
  logoContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  logo: {
    width: 120,
    height: 150, // Adjusted height
  },
  iconContainer: {
    paddingRight: 10, // Slight padding for spacing
  },
  iconButton: {
    padding: 5, // Slight padding around the icon
  },
});

export default TopNavBar;
