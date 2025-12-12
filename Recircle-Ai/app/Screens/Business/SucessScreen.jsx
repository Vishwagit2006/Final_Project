// app/screens/SuccessScreen.jsx
import { View, StyleSheet } from 'react-native';
import { Text, Button, Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const SuccessScreen = () => {
  const router = useRouter();

  return (
    <Animated.View 
      entering={FadeIn.duration(500)}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View entering={SlideInUp.delay(200)}>
          <Icon
            source="check-circle"
            color="#31DABD"
            size={80}
          />
        </Animated.View>
        
        <Text style={styles.title}>Success!</Text>
        <Text style={styles.subTitle}>Your product has been listed successfully</Text>
        
        <Button
          mode="contained"
          onPress={() => router.push('/Screens/Business/BusinessProvideGoods')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Return to Provide Goods
        </Button>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6FCFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#B34523',
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#616161',
  },
  button: {
    backgroundColor: '#B34523',
    borderRadius: 8,
    paddingVertical: 8,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SuccessScreen;