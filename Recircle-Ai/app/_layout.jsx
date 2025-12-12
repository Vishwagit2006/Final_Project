import React from 'react';
import { Stack } from 'expo-router';
import { 
  MD3LightTheme, // 1. Import the LIGHT theme
  PaperProvider 
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native'; 

// 2. This explicitly creates the LIGHT theme
const theme = {
  ...MD3LightTheme,
};

export default function RootLayout() {
  
  return (
    // 3. This <PaperProvider> FORCES the app to use the light theme
    <PaperProvider theme={theme}>
      
      {/* 4. This SafeAreaView fixes the overlap and sets the background to WHITE */}
      <SafeAreaView 
        style={{ 
          flex: 1, 
          backgroundColor: theme.colors.background, // This will be WHITE
        }}
      >
        
        {/* 5. This makes your phone's clock and icons DARK (for the white background) */}
        <StatusBar barStyle="dark-content" />
        
        {/* 6. This single <Stack /> finds all your screens */}
        <Stack screenOptions={{ headerShown: false }} />

      </SafeAreaView>
    </PaperProvider>
  );
}