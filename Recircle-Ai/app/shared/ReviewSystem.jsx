//shared->ReviewSystem.jsx
import React, { useState, useEffect } from "react";
import { 
 ScrollView, Text, TextInput, TouchableOpacity, 
 StyleSheet, View, Alert, ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
 collection, addDoc, doc, getDoc, setDoc, updateDoc, increment, query, where, getDocs, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ReviewSystem() {
 const [from, setFrom] = useState("");
 const [to, setTo] = useState("");
 const [product, setProduct] = useState("");
 const [review, setReview] = useState("");
 const [rating, setRating] = useState("");
 const [delivery, setDelivery] = useState("");
 const [recommend, setRecommend] = useState("");
 const [loading, setLoading] = useState(false);
 const [backendStatus, setBackendStatus] = useState("unknown");

 // Use useLocalSearchParams to get route parameters in Expo Router
 const params = useLocalSearchParams();
 const router = useRouter();

 const sellerId = params?.sellerId || "";
 const productName = params?.product || "";
 const context = params?.context || "";

 // ⚠️ UPDATE THIS BASE_URL WITH YOUR CURRENT NGROK URL
 const BASE_URL = "https://stephaine-cespitose-rodger.ngrok-free.dev";

 // Initialize fields with params
 useEffect(() => {
  if (sellerId) {
   setTo(sellerId);
  }
  if (productName) {
   setProduct(productName);
  }
 }, [sellerId, productName]);

 const testBackendConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(`${BASE_URL}/`, { 
      method: "GET", 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log("✅ Backend connected successfully");
      return true;
    } else {
      console.log(`❌ Backend returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log("⏰ Backend connection timeout");
    } else {
      console.log("🔌 Backend connection failed:", error.message);
    }
    return false;
  }
 };

 useEffect(() => { 
   checkBackendStatus(); 
 }, []);

 const checkBackendStatus = async () => {
  setBackendStatus("checking");
  const isConnected = await testBackendConnection();
  setBackendStatus(isConnected ? "connected" : "disconnected");
 };

 const checkExistingReview = async (reviewerName, sellerId) => {
  try {
   const reviewsRef = collection(db, 'reviews');
   const q = query(reviewsRef, where('from', '==', reviewerName.trim()), where('to', '==', sellerId));
   const snapshot = await getDocs(q);
   return !snapshot.empty;
  } catch (error) {
   console.error("Error checking existing review:", error);
   return false;
  }
 };

 const ensureSeller = async (sellerIdentifier) => {
  const identifier = sellerIdentifier.trim();
  const normalizedName = identifier.toLowerCase();
  let sellerRef = null;

  // 1️⃣ Search by Normalized Name
  const nameQuery = query(collection(db, 'sellers'), where('normalizedName', '==', normalizedName));
  const nameSnapshot = await getDocs(nameQuery);
  if (!nameSnapshot.empty) {
   sellerRef = nameSnapshot.docs[0].ref;
   setTo(sellerRef.id);
   return sellerRef;
  }

  // 2️⃣ Search by Document ID
  if (identifier.length >= 15) { 
   try {
    const idRef = doc(db, 'sellers', identifier);
    const idSnap = await getDoc(idRef);
    if (idSnap.exists()) {
     sellerRef = idRef;
     setTo(sellerRef.id);
     return sellerRef;
    }
   } catch (e) {
     // Ignore error
   }
  }

  // 3️⃣ Create new seller
  sellerRef = doc(collection(db, 'sellers'));
  await setDoc(sellerRef, {
   name: identifier,
   normalizedName: normalizedName,
   trustScore: 50,
   totalReviews: 0,
   totalRating: 0,
   averageRating: 0,
   recommendedCount: 0,
   recommendRate: 0,
   createdAt: serverTimestamp(),
   updatedAt: serverTimestamp()
  });
  setTo(sellerRef.id);
  return sellerRef;
 };

 const getTrustScoreFromBackend = async (sellerId, reviewData) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    console.log(`🔄 Calling backend: ${BASE_URL}/seller/${sellerId}/review`);
    
    const response = await fetch(`${BASE_URL}/seller/${sellerId}/review`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(reviewData),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend HTTP error: ${response.status}`, errorText);
      throw new Error(`Backend error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Backend response:", data);
    
    const trustScore = data.trustScore || data.seller?.trustScore || data.final_score;
    if (trustScore == null) {
      console.error("❌ Trust score missing in response:", data);
      throw new Error("Trust score not returned by backend");
    }
    
    return parseFloat(trustScore);

  } catch (error) {
    console.error("🔌 Backend request failed:", error);
    throw new Error(`Backend communication failed: ${error.message}`);
  }
 };

 const updateSellerStats = async (sellerRef, newRating, recommend, trustScore) => {
  const recIncrement = recommend.toLowerCase() === "yes" ? 1 : 0;
  
  await updateDoc(sellerRef, {
   totalReviews: increment(1),
   totalRating: increment(newRating),
   recommendedCount: increment(recIncrement),
   updatedAt: serverTimestamp()
  });

  const updatedDoc = await getDoc(sellerRef);
  if (updatedDoc.exists()) {
   const data = updatedDoc.data();
   const avgRating = Math.round((data.totalRating / data.totalReviews) * 10) / 10;
   const recRate = Math.round((data.recommendedCount / data.totalReviews) * 100);
   
   await updateDoc(sellerRef, {
    averageRating: avgRating,
    recommendRate: recRate,
    trustScore,
    updatedAt: serverTimestamp()
   });
  }
 };

 const submitReview = async () => {
  try {
   setLoading(true);

   if (!from || !to || !product || !rating || !delivery || !recommend) {
    Alert.alert("Missing Fields", "Please fill all required fields");
    setLoading(false);
    return;
   }

   const ratingNum = parseInt(rating);
   if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    Alert.alert("Invalid Rating", "Enter 1-5");
    setLoading(false);
    return;
   }

   const backendConnected = await testBackendConnection();
   if (!backendConnected) {
    Alert.alert("Backend Offline", "Cannot connect to backend!");
    setLoading(false);
    return;
   }

   const sellerRef = await ensureSeller(to);

   const duplicate = await checkExistingReview(from, sellerRef.id);
   if (duplicate) {
    Alert.alert("Duplicate Review", "You already reviewed this seller");
    setLoading(false);
    return;
   }
   
   const reviewData = { 
    from, to: sellerRef.id, product, review, rating: ratingNum, delivery, recommend, context
   };
   
   const trustScore = await getTrustScoreFromBackend(sellerRef.id, reviewData);

   await addDoc(collection(db, "reviews"), { 
     ...reviewData, 
     trustScore, 
     createdAt: serverTimestamp(),
     context: context || "general"
   });
   
   await updateSellerStats(sellerRef, ratingNum, recommend, trustScore);

   Alert.alert(
    "Success!",
    `Review submitted!\nTrust Score: ${trustScore.toFixed(2)}`,
    [
     { 
       text: "View Profile", 
       onPress: () => router.push(`/shared/SellerProfile?sellerId=${sellerRef.id}`) 
     },
     { text: "OK", onPress: resetForm }
    ],
    { cancelable: false }
   );

  } catch (err) {
   console.log("Submit error:", err);
   Alert.alert("Error", err.message || "Something went wrong");
  } finally {
   setLoading(false);
  }
 };

 const resetForm = () => {
  setFrom(""); 
  setReview(""); 
  setRating(""); 
  setDelivery(""); 
  setRecommend("");
  // Keep seller and product if they came from params
  if (!sellerId) {
   setTo("");
  }
  if (!productName) {
   setProduct("");
  }
 };

 const goBack = () => {
  router.back();
 };

 return (
  <SafeAreaView style={styles.container}>
   <ScrollView contentContainerStyle={styles.scroll}>
    <View style={styles.header}>
     <TouchableOpacity onPress={goBack} style={styles.backButton}>
      <Text style={styles.backButtonText}>← Back</Text>
     </TouchableOpacity>
     <Text style={styles.title}>📝 Submit Review</Text>
     <View style={styles.headerSpacer} />
    </View>

    {context === "food_donation" && (
     <View style={styles.contextBanner}>
      <Text style={styles.contextText}>🍽️ Food Donation Feedback</Text>
     </View>
    )}

    <View style={[
     styles.statusIndicator, 
     backendStatus === "connected" ? styles.statusConnected : 
     backendStatus === "disconnected" ? styles.statusDisconnected : 
     styles.statusChecking
    ]}>
     <Text style={styles.statusText}>
      {backendStatus === "connected" ? "✅ Backend Connected" : 
       backendStatus === "disconnected" ? "❌ Backend Disconnected" : 
       "🔄 Checking backend..."}
     </Text>
     <TouchableOpacity onPress={checkBackendStatus} style={styles.retryButton}>
      <Text style={styles.retryText}>Retry</Text>
     </TouchableOpacity>
    </View>

    {[
     { label: "Your Name *", value: from, setter: setFrom, placeholder: "Enter your name" },
     { 
       label: "Seller/Donor ID *", 
       value: to, 
       setter: setTo, 
       placeholder: sellerId ? "Auto-filled from donation" : "Enter seller ID or Name",
       editable: !sellerId
     },
     { 
       label: "Product/Service *", 
       value: product, 
       setter: setProduct, 
       placeholder: productName ? "Auto-filled from donation" : "Product or service name",
       editable: !productName
     },
     { label: "Rating (1-5) *", value: rating, setter: setRating, placeholder: "1-5", keyboard: "numeric", maxLength: 1 },
     { label: "Delivery Experience *", value: delivery, setter: setDelivery, placeholder: "Good/Excellent/Poor" },
     { label: "Recommend (Yes/No) *", value: recommend, setter: setRecommend, placeholder: "Yes or No" },
    ].map((field, i) => (
     <View key={i} style={styles.inputGroup}>
      <Text style={styles.label}>{field.label}</Text>
      <TextInput 
       style={[styles.input, !field.editable && styles.disabledInput]} 
       value={field.value} 
       onChangeText={field.setter}
       placeholder={field.placeholder}
       keyboardType={field.keyboard}
       maxLength={field.maxLength}
       editable={field.editable !== false && !loading}
      />
     </View>
    ))}

    <View style={styles.inputGroup}>
     <Text style={styles.label}>Review Comments</Text>
     <TextInput 
      style={[styles.input, styles.textArea]} 
      value={review} 
      onChangeText={setReview} 
      multiline 
      placeholder="Share your experience (optional)"
      editable={!loading}
     />
    </View>

    <TouchableOpacity 
     style={[styles.submitButton, (loading || backendStatus==="disconnected") && styles.disabledButton]} 
     onPress={submitReview} 
     disabled={loading || backendStatus==="disconnected"}
    >
     {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Submit Review</Text>}
    </TouchableOpacity>

    <TouchableOpacity
     style={[styles.profileButton, (loading || !to) && styles.disabledButton]}
     onPress={() => to && router.push(`/shared/SellerProfile?sellerId=${to}`)}
     disabled={loading || !to}
    >
     <Text style={styles.buttonText}>View Seller Profile</Text>
    </TouchableOpacity>

    <Text style={styles.note}>
     Note: Each user can submit only one review per seller. Trust score is calculated by AI backend.
    </Text>
   </ScrollView>
  </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: "#f8f9fa" },
 scroll: { padding: 20 },
 header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
 },
 backButton: {
  padding: 8,
 },
 backButtonText: {
  fontSize: 16,
  color: "#007bff",
  fontWeight: "600",
 },
 title: { 
  fontSize: 20, 
  fontWeight: "bold", 
  textAlign: "center", 
  color: "#2c3e50",
  flex: 1,
 },
 headerSpacer: {
  width: 60,
 },
 contextBanner: {
  backgroundColor: "#e3f2fd",
  padding: 12,
  borderRadius: 8,
  marginBottom: 15,
  borderLeftWidth: 4,
  borderLeftColor: "#2196f3",
 },
 contextText: {
  fontSize: 14,
  fontWeight: "600",
  color: "#1565c0",
  textAlign: "center",
 },
 inputGroup: { marginBottom: 15 },
 label: { fontSize: 14, fontWeight: "600", marginBottom: 5, color: "#2c3e50" },
 input: { 
  backgroundColor: "#fff", 
  padding: 12, 
  borderRadius: 8, 
  borderWidth: 1, 
  borderColor: "#bdc3c7", 
  fontSize: 16,
  minHeight: 50,
 },
 disabledInput: {
  backgroundColor: "#f8f9fa",
  color: "#6c757d",
 },
 textArea: { height: 80, textAlignVertical: "top" },
 submitButton: { backgroundColor: "#27ae60", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
 profileButton: { backgroundColor: "#2980b9", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 15 },
 disabledButton: { backgroundColor: "#95a5a6" },
 buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
 statusIndicator: { 
   padding: 12, 
   borderRadius: 8, 
   marginBottom: 15, 
   borderWidth: 1, 
   flexDirection: 'row', 
   justifyContent: 'space-between', 
   alignItems: 'center' 
 },
 statusConnected: { backgroundColor: '#d4edda', borderColor: '#c3e6cb' },
 statusDisconnected: { backgroundColor: '#f8d7da', borderColor: '#f5c6cb' },
 statusChecking: { backgroundColor: '#e2f0ff', borderColor: '#b3d9ff' },
 statusText: { fontWeight: 'bold', fontSize: 14 },
 retryButton: { paddingHorizontal: 10, paddingVertical: 5 },
 retryText: { color: '#007bff', fontWeight: 'bold' },
 note: { marginTop: 20, fontSize: 12, color: "#7f8c8d", textAlign: "center", fontStyle: "italic" }
});