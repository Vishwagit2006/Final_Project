import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const ProvideGoods = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Provide Goods</Text>
      <Text style={styles.subHeading}>Type Of Goods</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/Screens/Business/FoodDonationFormScreen")}
      >
        <Text style={styles.buttonText}>Food</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/Screens/Business/AddProductScreen")}
      >
        <Text style={styles.buttonText}>Other</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    padding: 10,
  },
  backText: {
    fontSize: 18,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 18,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#A64B2A",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProvideGoods;
