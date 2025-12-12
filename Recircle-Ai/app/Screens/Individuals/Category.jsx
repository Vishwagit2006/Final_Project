import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import TopNavBar from "../../../components/TopNavBar.jsx";
import BottomNav from "../../../components/BottomNav.jsx";

const SurplusDistribution = () => {
  const router = useRouter();
  const [surplusData, setSurplusData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const data = require('../../../item.json');
    setSurplusData(data);
    extractCategories(data);
  }, []);

  const extractCategories = (data) => {
    const cats = ["All", ...new Set(data.map(item => item.category))];
    setCategories(cats);
  };

  // Optimize filtering with useMemo to reduce unnecessary calculations
  const filteredData = useMemo(() => {
    return selectedCategory === "All"
      ? surplusData
      : surplusData.filter(item => item.category === selectedCategory);
  }, [selectedCategory, surplusData]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopNavBar />

      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.sectionTitle}>More Categorization</Text>

            <View style={styles.searchContainer}>
              <TextInput placeholder="Search Surplus Items" style={styles.searchInput} />
            </View>

            {/* Category Filter */}
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              keyExtractor={(cat) => cat}
              renderItem={({ item: cat }) => (
                <TouchableOpacity
                  onPress={() => setSelectedCategory(cat)}
                  style={[styles.categoryButton, selectedCategory === cat && styles.selectedCategory]}
                >
                  <Text style={[styles.categoryText, selectedCategory === cat && styles.selectedText]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <View style={{ marginBottom: 15 }} />
          </>
        }
        

        
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Ensure proper grid layout
        columnWrapperStyle={styles.rowStyle}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemCard}
            onPress={() =>
              router.push(
                `/Screens/Individuals/pro_details?id=${item.id}&product=${item.product}&category=${item.category}&description2=${item.description2}&image=${item.image}&price=${item.price}&rating=${item.rating}`
              )
            }
          >
            {/* Wrapper around image, name, type, and description */}
            <View style={styles.itemContentWrapper}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode="cover"
              />
              <Text style={styles.itemName}>{item.product}</Text>
              <Text style={styles.itemType}>{item.category}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginHorizontal: 20, marginTop: 20 },
  searchContainer: { marginHorizontal: 20, marginVertical: 10 },
  searchInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 },

  rowStyle: { justifyContent: "space-between", paddingHorizontal: 12 },
  
  categoryButton: { backgroundColor: "#ddd", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginHorizontal: 5 },
  selectedCategory: { backgroundColor: "#2196f3" },
  categoryText: { color: "#333", fontWeight: "500" },
  selectedText: { color: "#fff" },
  itemList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 20, // Increased from 10 to 20 for extra spacing
    padding: 12,
  },
  itemCard: { 
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#e4dfe2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBEAD6',
    elevation: 3,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemContentWrapper: { 
    backgroundColor: "#ffffff", 
    borderRadius: 10, 
    padding: 10, 
    width: "100%", 
    alignItems: "center" 
  },
  itemImage: { 
    width: '100%',
    height: 130,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: "bold", 
    textAlign: "center" 
  },
  itemDescription: { 
    fontSize: 13, 
    color: "#777", 
    textAlign: "center" 
  }
});

export default SurplusDistribution;