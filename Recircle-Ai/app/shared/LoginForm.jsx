import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { auth, db } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const LoginForm = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [fullName, setFullName] = useState('');
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

  const handleContinue = async () => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      // Store user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName,
        email,
        role: selectedRole,
        createdAt: new Date(),
      });

      // Navigate based on role
      handleNavigation(selectedRole);
      
    } catch (error) {
      alert(`Signup failed: ${error.message}`);
    }
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    handleNavigation(role);
  };

  const handleNavigation = (role) => {
    const routes = {
      'Business': '../Screens/Business/Home',
      'Individual': '../Screens/Individuals/Home',
      'NGO/Trust': '../Screens/ngo/Home'
    };
    router.push(routes[role] || '../Screens/Home');
  };

  const roles = [
    { name: 'Individual', emoji: '👤' },
    { name: 'Business', emoji: '🏢' },
    { name: 'NGO/Trust', emoji: '🤝' }
  ];

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/ReShare-Logo.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Let's make surplus redistribution easier</Text>

      {/* Role Selection */}
      <Text style={styles.sectionTitle}>Select Role</Text>
      <View style={styles.roleContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.name}
            style={[
              styles.roleButton,
              selectedRole === role.name && styles.selectedRoleButton,
            ]}
            onPress={() => handleRoleSelection(role.name)}
            activeOpacity={0.7}
          >
            <View style={styles.roleContent}>
              <Text style={styles.roleEmoji}>{role.emoji}</Text>
              <Text style={[
                styles.roleText,
                selectedRole === role.name && styles.selectedRoleText,
              ]}>
                {role.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input Fields */}
      <TextInput
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        mode="outlined"
        placeholder="Enter your full name"
        outlineColor="#E0E0E0"
        activeOutlineColor="#31DABD"
        theme={{ colors: { primary: '#31DABD' } }}
      />
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

      {/* Continue Button */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <Button
          mode="contained"
          style={styles.continueButton}
          contentStyle={styles.buttonContent}
          onPress={handleContinue}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={!selectedRole || !fullName || !email || !password}
          theme={{ colors: { primary: '#31DABD' } }}
          labelStyle={styles.buttonLabel}
        >
          Continue
        </Button>
      </Animated.View>

      {/* Sign In Link */}
      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text
          style={styles.signInText}
          onPress={() => router.push('/Screens/Individuals/Home')}
        >
          Sign in
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
  sectionTitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 12,
    fontWeight: '500',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 10,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#EDF2F7',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    elevation: 0,
  },
  selectedRoleButton: {
    backgroundColor: '#EBF8FF',
    borderColor: '#31DABD',
    shadowColor: '#31DABD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  roleContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  roleText: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedRoleText: {
    color: '#31DABD',
    fontWeight: '600',
  },
  input: {
    marginBottom: 18,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  continueButton: {
    marginTop: 24,
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
  signInText: {
    color: '#B34523',
    fontWeight: '600',
  },
});

export default LoginForm;