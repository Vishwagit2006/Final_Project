import React from "react";
import { View, StyleSheet, SectionList } from "react-native";
import { Searchbar, Card, Avatar, Badge, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import BussinessBottomNav from '../../../components/BussinessBottomNav';

const IMAGES = {
  BOOKS: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500",
  MEDICAL: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500",
  FOOD: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500",
  CLOTHING: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=500",
};

const requestsData = {
  active: [
    {
      id: "1",
      type: "NGO",
      name: "Education for All",
      location: "Near PSNA College, Dindigul",
      status: "Pending",
      rating: 4.5,
      image: IMAGES.BOOKS,
      date: "2h ago",
      category: "Books",
      itemsNeeded: 125,
    },
    {
      id: "2",
      type: "People",
      name: "Community Health Group",
      location: "Gandhi Nagar, Dindigul",
      status: "Group Buying",
      rating: 4.8,
      image: IMAGES.MEDICAL,
      date: "5h ago",
      category: "Medical Supplies",
      itemsNeeded: 42,
    },
  ],
  past: [
    {
      id: "3",
      type: "NGO",
      name: "Food Relief Foundation",
      location: "Main Road, Dindigul",
      status: "Fulfilled",
      rating: 4.7,
      image: IMAGES.FOOD,
      date: "3 days ago",
      category: "Food Supplies",
      itemsNeeded: 200,
    },
    {
      id: "4",
      type: "People",
      name: "Local Residents Collective",
      location: "Subramaniapuram",
      status: "Expired",
      rating: 4.2,
      image: IMAGES.CLOTHING,
      date: "1 week ago",
      category: "Clothing",
      itemsNeeded: 80,
    },
  ],
};

const RequestCard = ({ item }) => {
  const { colors } = useTheme();

  const statusConfig = {
    Pending: { color: colors.error, icon: "clock-alert-outline" },
    Fulfilled: { color: colors.success, icon: "check-circle-outline" },
    Expired: { color: colors.onSurfaceDisabled, icon: "clock-remove-outline" },
    "Group Buying": { color: colors.info, icon: "account-group-outline" },
  };

  const categoryIcons = {
    Books: "book-open-page-variant",
    "Medical Supplies": "medical-bag",
    "Food Supplies": "food-apple",
    Clothing: "tshirt-crew",
  };

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Avatar.Image source={{ uri: item.image }} size={60} style={styles.avatar} />
          <View style={styles.headerContent}>
            <Text variant="titleMedium" style={styles.name}>
              {item.name}
            </Text>
            <View style={styles.metaContainer}>
              <Badge style={[styles.statusBadge, { backgroundColor: statusConfig[item.status].color }]}>
                <MaterialCommunityIcons
                  name={statusConfig[item.status].icon}
                  size={14}
                  color={colors.surface}
                />
                <Text variant="labelSmall" style={[styles.statusText, { color: colors.surface }]}>
                  {" "}
                  {item.status}
                </Text>
              </Badge>
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={16} color={colors.star} />
                <Text variant="bodySmall" style={[styles.rating, { color: colors.onSurface }]}>
                  {item.rating}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name={categoryIcons[item.category]}
              size={20}
              color={colors.primary}
            />
            <Text variant="bodyMedium" style={[styles.category, { color: colors.onSurface }]}>
              {" "}
              {item.category}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color={colors.secondary} />
            <Text
              variant="bodyMedium"
              style={[styles.location, { color: colors.onSurfaceVariant }]}
            >
              {" "}
              {item.location}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text variant="bodySmall" style={[styles.date, { color: colors.outline }]}>
            {item.date}
          </Text>
          <View style={styles.itemsNeeded}>
            <Text variant="bodySmall" style={[styles.itemsText, { color: colors.primary }]}>
              {item.itemsNeeded}+ items needed
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

RequestCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    itemsNeeded: PropTypes.number.isRequired,
  }).isRequired,
};

const Request = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { colors } = useTheme();

  const filterRequests = (data) => {
    if (!searchQuery) return data;
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredSections = [
    { title: "Active Requests", data: filterRequests(requestsData.active) },
    { title: "Completed History", data: filterRequests(requestsData.past) },
  ];

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search requests..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[styles.searchBar, { backgroundColor: colors.surface }]}
        iconColor={colors.primary}
        inputStyle={[styles.searchInput, { color: colors.onSurface }]}
        elevation={2}
      />

      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeader, { borderColor: colors.primary }]}>
            <Text
              variant="titleLarge"
              style={[styles.sectionTitle, { color: title === "Active Requests" ? "green" : "darkgreen" }]}
            >
              {title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => <RequestCard item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
        stickySectionHeadersEnabled={false}
      />

      <View style={styles.bottomNavContainer}>
        <BussinessBottomNav />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  searchBar: {
    marginVertical: 16,
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 16,
  },
  sectionHeader: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 22,
  },
  card: {
    borderRadius: 16,
    elevation: 2,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    marginRight: 16,
    borderRadius: 100,
  },
  headerContent: {
    flex: 1,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 0,
    paddingHorizontal: 10,
    gap: 6,
  },
  statusText: {
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontWeight: "600",
  },
  cardBody: {
    gap: 12,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  category: {
    fontWeight: "500",
  },
  location: {
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  date: {
    fontWeight: "400",
  },
  itemsNeeded: {
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  itemsText: {
    fontWeight: "500",
  },
  separator: {
    height: 16,
  },
  sectionSeparator: {
    height: 24,
  },
  listContent: {
    paddingBottom: 80, // Ensure space for bottom navigation
  },
});

export default Request;
