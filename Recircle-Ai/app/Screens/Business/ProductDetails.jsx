import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Avatar, Card, Text, Button, useTheme, Badge } from "react-native-paper";

const ProductDetails = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar.Image
          size={64}
          source={{
            uri: "https://via.placeholder.com/64", // Replace with actual profile image URL
          }}
        />
        <View style={styles.profileDetails}>
          <Text variant="titleMedium" style={styles.profileName}>
            Profile 1
          </Text>
          <Text variant="bodySmall" style={styles.profileSubText}>
            Trusted & Consistent Supporter
          </Text>
          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Badge
                key={index}
                size={8}
                style={{
                  backgroundColor: colors.primary,
                  marginRight: 4,
                }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Product Card */}
      <Card style={styles.card}>
        <Card.Cover
          source={{
            uri: "https://via.placeholder.com/400", // Replace with actual product image URL
          }}
          style={styles.cardImage}
        />
        <Card.Content>
          <Text variant="titleMedium" style={styles.productTitle}>
            Western Tops
          </Text>
          <Text style={[styles.productCondition, { color: colors.success }]}>
            The product is Good Condition
          </Text>
          <View style={styles.detailsRow}>
            <Text style={styles.productDetails}>Delivery: self-made</Text>
            <Text style={styles.productDetails}>Quantity: 4</Text>
          </View>
          <Text variant="bodyMedium" style={styles.descriptionHeader}>
            Description
          </Text>
          <Text variant="bodySmall" style={styles.productDescription}>
            Western Tops fuse classic cowboy charm with modern cuts, featuring
            fringe, embroidery, and snap buttons...
            <Text
              style={[styles.readMore, { color: colors.primary }]}
              onPress={() => {
                console.log("Read More");
              }}
            >
              Read
            </Text>
          </Text>

          <View style={styles.sizeContainer}>
            <Text style={styles.sizeLabel}>Size</Text>
            <Badge
              style={[
                styles.sizeBadge,
                { backgroundColor: colors.surfaceVariant },
              ]}
            >
              M
            </Badge>
          </View>
        </Card.Content>

        <Card.Actions>
          <Button
            mode="contained"
            buttonColor={colors.primary}
            style={styles.claimButton}
            onPress={() => console.log("Claim Pressed")}
          >
            Claim
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileDetails: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileSubText: {
    color: "#757575",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
  },
  cardImage: {
    height: 200,
  },
  productTitle: {
    fontWeight: "bold",
    marginTop: 8,
  },
  productCondition: {
    marginTop: 4,
    fontWeight: "500",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  productDetails: {
    fontWeight: "500",
    color: "#757575",
  },
  descriptionHeader: {
    marginTop: 16,
    fontWeight: "600",
  },
  productDescription: {
    marginTop: 4,
    color: "#757575",
  },
  readMore: {
    fontWeight: "bold",
  },
  sizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  sizeLabel: {
    fontWeight: "600",
    marginRight: 8,
  },
  sizeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontWeight: "bold",
  },
  claimButton: {
    margin: 16,
    borderRadius: 8,
    flex: 1,
  },
});

export default ProductDetails;
