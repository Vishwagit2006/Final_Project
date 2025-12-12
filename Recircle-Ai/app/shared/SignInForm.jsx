import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { auth, db } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';


const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));
  const router = useRouter();

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleSignIn = async () => {
    try {
      // Basic validation
      if (!email || !password) {
        alert('Please fill in all fields');
        return;
      }
  
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      console.log('Authentication successful:', userCredential.user.uid);
  
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }
  
      const userData = userDoc.data();
      console.log('User data retrieved:', userData);
  
      // Force auth state update
      await auth.currentUser.reload();
      
      // Navigate based on role
      const routeMap = {
        'Business': '../Screens/Business/Home',
        'Individual': '../Screens/Individuals/Home',
        'NGO/Trust': '../Screens/ngo/Home'
      };
  
      const targetRoute = routeMap[userData.role] || '../Screens/Home';
      console.log('Navigating to:', targetRoute);
      router.push({
        pathname: '../Screens/Individuals/Home',
        params: { userData: JSON.stringify(userData) },
      });
  
    } catch (error) {
      console.error('Sign-in error:', error);
      let errorMessage = 'Sign-in failed';
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Try again later';
      } else if (error.message.includes('User document')) {
        errorMessage = 'Account configuration error - please contact support';
      }
      
      alert(errorMessage);
    }
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/ReShare-Logo.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue with ReShare</Text>

      {/* Input Fields */}
      <TextInput
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        placeholder="Enter your email"
        keyboardType="email-address"
        outlineColor="#E0E0E0"
        activeOutlineColor="#31DABD"
        theme={{ colors: { primary: '#31DABD' } }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        mode="outlined"
        placeholder="Enter your password"
        secureTextEntry={!showPassword}
        outlineColor="#E0E0E0"
        activeOutlineColor="#31DABD"
        theme={{ colors: { primary: '#31DABD' } }}
        right={
          <TextInput.Icon 
            icon={showPassword ? "eye-off" : "eye"} 
            onPress={() => setShowPassword(!showPassword)}
            color="#7E7E7E"
          />
        }
      />

      {/* Forgot Password Link */}
      <TouchableOpacity onPress={() => router.push('../Screens/ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <Button
          mode="contained"
          style={styles.signInButton}
          contentStyle={styles.buttonContent}
          onPress={handleSignIn}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={!email || !password}
          theme={{ colors: { primary: '#31DABD' } }}
          labelStyle={styles.buttonLabel}
        >
          Sign In
        </Button>
      </Animated.View>

      {/* Sign Up Link */}
      <Text style={styles.footerText}>
        Don't have an account?{' '}
        <Text
          style={styles.signUpText}
          onPress={() => router.push('/shared/LoginForm')}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 60,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2D3748',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    color: '#718096',
    marginBottom: 32,
    lineHeight: 22,
  },
  input: {
    marginBottom: 18,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  forgotPasswordText: {
    textAlign: 'right',
    color: '#B34523',
    fontSize: 14,
    marginBottom: 24,
    fontWeight: '500',
  },
  signInButton: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#31DABD',
    shadowColor: '#31DABD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#718096',
    fontSize: 14,
  },
  signUpText: {
    color: '#B34523',
    fontWeight: '600',
  },
});

export default SignInForm;