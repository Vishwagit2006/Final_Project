//shared->SellerProfile.jsx
import React, { useEffect, useState, useRef } from "react";
import { 
    ScrollView, 
    Text, 
    View, 
    StyleSheet, 
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Dimensions,
    Alert
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

import { db } from '../../config/firebase';

const { width, height } = Dimensions.get('window');

export default function SellerProfile() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const sellerIdentifier = params?.sellerId || params?.id || "";
    
    const [seller, setSeller] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalReviews: 0,
        averageRating: 0,
        positiveReviews: 0,
        recentActivity: 0
    });

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    const fetchSellerData = async (isRefresh = false) => {
        if (!sellerIdentifier) {
            Alert.alert("Error", "No seller ID provided");
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            if (!isRefresh) setLoading(true);

            let sellerDoc = null;
            let sellerId = sellerIdentifier;

            // Try direct document fetch first
            try {
                const docRef = doc(db, 'sellers', sellerIdentifier);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    sellerDoc = docSnap;
                    sellerId = docSnap.id;
                } else {
                    // Fallback: search by normalized name
                    const normalizedName = sellerIdentifier.trim().toLowerCase();
                    const sellersQuery = query(
                        collection(db, 'sellers'),
                        where('normalizedName', '==', normalizedName),
                        limit(1)
                    );
                    const querySnapshot = await getDocs(sellersQuery);
                    
                    if (!querySnapshot.empty) {
                        sellerDoc = querySnapshot.docs[0];
                        sellerId = sellerDoc.id;
                    } else {
                        throw new Error("Seller not found");
                    }
                }
            } catch (error) {
                console.error("Seller fetch error:", error);
                throw new Error("Unable to find seller data");
            }

            const sellerData = sellerDoc.data();

            // Fetch reviews - FIXED: Remove ordering to avoid index requirement
            let reviewsData = [];
            try {
                const reviewsQuery = query(
                    collection(db, 'reviews'),
                    where('to', '==', sellerId),
                    limit(50) // Remove orderBy to avoid index requirement
                );
                const reviewsSnapshot = await getDocs(reviewsQuery);
                
                reviewsData = reviewsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
                    reviewerName: doc.data().from || doc.data().reviewerName || 'Anonymous',
                    rating: doc.data().rating || 0,
                    comment: doc.data().review || doc.data().comment || 'No review text',
                    sentiment: doc.data().sentiment || 'neutral',
                    product: doc.data().product || 'General',
                    purchaseVerified: doc.data().purchaseVerified || false
                }));

                // Sort reviews manually on client side to avoid Firestore index requirement
                reviewsData.sort((a, b) => {
                    const dateA = a.createdAt;
                    const dateB = b.createdAt;
                    return dateB - dateA; // Descending order (newest first)
                });

            } catch (reviewsError) {
                console.error("Error fetching reviews:", reviewsError);
                // Continue without reviews if there's an error
            }

            // Calculate stats
            const totalReviews = reviewsData.length;
            const averageRating = totalReviews > 0 
                ? reviewsData.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews
                : 0;
            const positiveReviews = reviewsData.filter(review => 
                (review.sentiment || 'neutral').toLowerCase() === 'positive'
            ).length;
            
            const recentActivity = reviewsData.filter(review => {
                const reviewDate = review.createdAt;
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return reviewDate > thirtyDaysAgo;
            }).length;

            const processedSeller = {
                id: sellerId,
                ...sellerData,
                name: sellerData.name || 'Unknown Seller',
                trustScore: sellerData.trustScore || 50,
                totalReviews: sellerData.totalReviews || totalReviews,
                averageRating: sellerData.averageRating || averageRating,
                recommendRate: sellerData.recommendRate || 0,
                joinDate: sellerData.createdAt?.toDate?.()?.getFullYear() || sellerData.joinDate || '2024',
                responseTime: sellerData.responseTime || 'Within 24 hours',
                completedOrders: sellerData.completedOrders || '50+',
                satisfactionRate: sellerData.satisfactionRate || Math.round((positiveReviews / Math.max(totalReviews, 1)) * 100)
            };

            setSeller(processedSeller);
            setReviews(reviewsData);
            setStats({
                totalReviews,
                averageRating: parseFloat(averageRating.toFixed(1)),
                positiveReviews,
                recentActivity
            });

            // Animate content in
            Animated.parallel([
                Animated.timing(fadeAnim, { 
                    toValue: 1, 
                    duration: 600, 
                    useNativeDriver: true 
                }),
                Animated.spring(slideAnim, { 
                    toValue: 0, 
                    tension: 50, 
                    friction: 8, 
                    useNativeDriver: true 
                })
            ]).start();

        } catch (error) {
            console.error("Error fetching seller profile:", error);
            Alert.alert(
                "Profile Unavailable", 
                "Unable to load seller profile. Please check the seller ID and try again.",
                [{ text: "OK", onPress: () => router.back() }]
            );
            setSeller(null);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (sellerIdentifier) {
            fetchSellerData();
        }
    }, [sellerIdentifier]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSellerData(true);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return "#10b981";
        if (score >= 60) return "#22c55e";
        if (score >= 40) return "#84cc16";
        return "#ef4444";
    };

    const getScoreStatus = (score) => {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        if (score >= 40) return "Fair";
        return "Needs Improvement";
    };

    const getSentimentColor = (sentiment) => {
        switch((sentiment || 'neutral').toLowerCase()) {
            case 'positive': return '#10b981';
            case 'negative': return '#ef4444';
            case 'neutral': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const getSentimentIcon = (sentiment) => {
        switch((sentiment || 'neutral').toLowerCase()) {
            case 'positive': return 'happy';
            case 'negative': return 'sad';
            case 'neutral': return 'chatbubble-outline';
            default: return 'chatbubble-outline';
        }
    };

    const renderStars = (rating) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= rating ? "star" : "star-outline"}
                        size={16}
                        color="#fbbf24"
                    />
                ))}
            </View>
        );
    };

    const handleWriteReview = () => {
        router.push({
            pathname: '/shared/ReviewSystem',
            params: { 
                sellerId: seller?.id,
                sellerName: seller?.name
            }
        });
    };

    // Function to create the required index (for admin use)
    const showIndexCreationInfo = () => {
        Alert.alert(
            "Firestore Index Required",
            "For better performance, create a Firestore composite index for:\n\nCollection: reviews\nFields: to (Ascending), createdAt (Descending)\n\nClick the link in your console to create it automatically.",
            [{ text: "OK" }]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingScreen}>
                <LinearGradient 
                    colors={['#059669', '#10b981', '#34d399']} 
                    style={styles.gradient}
                >
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingText}>Loading Seller Profile...</Text>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    if (!seller) {
        return (
            <View style={styles.errorScreen}>
                <Ionicons name="person-outline" size={64} color="#9ca3af" />
                <Text style={styles.errorTitle}>Seller Not Found</Text>
                <Text style={styles.errorSubtitle}>
                    The seller profile you're looking for isn't available.
                </Text>
                <TouchableOpacity 
                    style={styles.retryButton} 
                    onPress={() => router.back()}
                >
                    <Text style={styles.retryText}>Go Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.secondaryButton} 
                    onPress={() => fetchSellerData()}
                >
                    <Text style={styles.secondaryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const trustScore = seller.trustScore || 50;
    const displayReviews = reviews.slice(0, 20); // Limit displayed reviews
    const sellerName = seller.name;
    const initial = sellerName.charAt(0).toUpperCase();

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient 
                colors={['#059669', '#10b981', '#34d399']} 
                style={styles.backgroundGradient} 
            />
            
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#fff']}
                        tintColor={'#fff'}
                    />
                }
            >
                {/* Header with Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Seller Profile</Text>
                    <TouchableOpacity onPress={showIndexCreationInfo}>
                        <Ionicons name="information-circle-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Main Profile Card */}
                <Animated.View 
                    style={[
                        styles.topCard,
                        { 
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['#059669', '#10b981']}
                                style={styles.avatarGradient}
                            >
                                <Text style={styles.avatarText}>{initial}</Text>
                            </LinearGradient>
                            <View style={[styles.verifiedBadge, { backgroundColor: getScoreColor(trustScore) }]}>
                                <Ionicons name="shield-checkmark" size={14} color="#fff" />
                            </View>
                        </View>
                        
                        <Text style={styles.sellerName}>{sellerName}</Text>
                        <Text style={styles.sellerSubtitle}>Trusted Seller</Text>
                        
                        <View style={styles.trustScoreContainer}>
                            <Ionicons name="shield-checkmark" size={16} color={getScoreColor(trustScore)} />
                            <Text style={[styles.trustScoreText, { color: getScoreColor(trustScore) }]}>
                                Trust Score: {trustScore}/100 • {getScoreStatus(trustScore)}
                            </Text>
                        </View>
                    </View>

                    {/* Quick Stats */}
                    <View style={styles.statsSection}>
                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{stats.totalReviews}</Text>
                                <Text style={styles.statLabel}>Reviews</Text>
                            </View>
                            
                            <View style={styles.statDivider} />
                            
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{stats.averageRating}</Text>
                                <Text style={styles.statLabel}>Rating</Text>
                            </View>
                            
                            <View style={styles.statDivider} />
                            
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{stats.recentActivity}</Text>
                                <Text style={styles.statLabel}>30d Activity</Text>
                            </View>
                        </View>
                    </View>

                    {/* Write Review Button */}
                    <TouchableOpacity 
                        style={styles.writeReviewButton}
                        onPress={handleWriteReview}
                    >
                        <Ionicons name="create-outline" size={20} color="#fff" />
                        <Text style={styles.writeReviewText}>Write a Review</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Rest of the component remains the same */}
                {/* Trust Score Progress */}
                <Animated.View 
                    style={[
                        styles.trustCard,
                        { 
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.trustHeader}>
                        <Text style={styles.trustTitle}>Trust Breakdown</Text>
                        <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(trustScore) }]}>
                            <Text style={styles.scoreBadgeText}>{trustScore}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBackground}>
                            <Animated.View 
                                style={[
                                    styles.progressFill,
                                    { 
                                        width: `${trustScore}%`,
                                        backgroundColor: getScoreColor(trustScore)
                                    }
                                ]}
                            />
                        </View>
                        <View style={styles.progressLabels}>
                            <Text style={styles.progressLabel}>0</Text>
                            <Text style={styles.progressLabel}>50</Text>
                            <Text style={styles.progressLabel}>100</Text>
                        </View>
                    </View>
                    
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusLabel}>Status:</Text>
                        <View style={[styles.statusPill, { backgroundColor: getScoreColor(trustScore) + '20' }]}>
                            <Ionicons name="trending-up" size={14} color={getScoreColor(trustScore)} />
                            <Text style={[styles.statusText, { color: getScoreColor(trustScore) }]}>
                                {getScoreStatus(trustScore)}
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Tabs Navigation */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
                        onPress={() => setActiveTab('overview')}
                    >
                        <Ionicons 
                            name="information-circle-outline" 
                            size={20} 
                            color={activeTab === 'overview' ? '#059669' : '#9ca3af'} 
                        />
                        <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
                            Overview
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
                        onPress={() => setActiveTab('reviews')}
                    >
                        <Ionicons 
                            name="chatbubble-ellipses-outline" 
                            size={20} 
                            color={activeTab === 'reviews' ? '#059669' : '#9ca3af'} 
                        />
                        <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
                            Reviews ({displayReviews.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                {activeTab === 'overview' ? (
                    <Animated.View style={[styles.overviewContent, { opacity: fadeAnim }]}>
                        <View style={styles.overviewCard}>
                            <Text style={styles.sectionTitle}>Seller Information</Text>
                            
                            <View style={styles.infoGrid}>
                                <View style={styles.infoCard}>
                                    <Ionicons name="time-outline" size={24} color="#059669" />
                                    <Text style={styles.infoCardValue}>{seller.responseTime}</Text>
                                    <Text style={styles.infoCardLabel}>Response Time</Text>
                                </View>
                                
                                <View style={styles.infoCard}>
                                    <Ionicons name="calendar-outline" size={24} color="#059669" />
                                    <Text style={styles.infoCardValue}>{seller.joinDate}</Text>
                                    <Text style={styles.infoCardLabel}>Member Since</Text>
                                </View>
                                
                                <View style={styles.infoCard}>
                                    <Ionicons name="checkmark-done-outline" size={24} color="#059669" />
                                    <Text style={styles.infoCardValue}>{seller.completedOrders}</Text>
                                    <Text style={styles.infoCardLabel}>Orders Completed</Text>
                                </View>
                                
                                <View style={styles.infoCard}>
                                    <Ionicons name="heart-outline" size={24} color="#059669" />
                                    <Text style={styles.infoCardValue}>{seller.satisfactionRate}%</Text>
                                    <Text style={styles.infoCardLabel}>Satisfaction</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                ) : (
                    <Animated.View style={[styles.reviewsContent, { opacity: fadeAnim }]}>
                        {displayReviews.length > 0 ? (
                            displayReviews.map((review, index) => (
                                <View key={review.id || `review-${index}`} style={styles.reviewCard}>
                                    <View style={styles.reviewHeader}>
                                        <View style={styles.reviewerInfo}>
                                            <Text style={styles.reviewerName}>
                                                {review.reviewerName}
                                            </Text>
                                            <View style={styles.ratingContainer}>
                                                {renderStars(review.rating)}
                                                <Text style={styles.ratingText}>({review.rating})</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.reviewDate}>
                                            {review.createdAt.toLocaleDateString()}
                                        </Text>
                                    </View>

                                    {review.product && review.product !== 'General' && (
                                        <View style={styles.productInfo}>
                                            <Ionicons name="cube-outline" size={14} color="#6b7280" />
                                            <Text style={styles.productText}>{review.product}</Text>
                                        </View>
                                    )}
                                    
                                    <Text style={styles.reviewComment}>
                                        {review.comment}
                                    </Text>
                                    
                                    <View style={styles.reviewFooter}>
                                        <View style={[styles.sentimentTag, { backgroundColor: getSentimentColor(review.sentiment) + '20' }]}>
                                            <Ionicons 
                                                name={getSentimentIcon(review.sentiment)} 
                                                size={14} 
                                                color={getSentimentColor(review.sentiment)} 
                                            />
                                            <Text style={[styles.sentimentText, { color: getSentimentColor(review.sentiment) }]}>
                                                {review.sentiment?.charAt(0).toUpperCase() + review.sentiment?.slice(1)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="chatbubble-ellipses-outline" size={64} color="#d1d5db" />
                                <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                                <Text style={styles.emptyText}>
                                    This seller hasn't received any reviews yet. Be the first to share your experience!
                                </Text>
                                <TouchableOpacity 
                                    style={styles.writeReviewButton}
                                    onPress={handleWriteReview}
                                >
                                    <Ionicons name="create-outline" size={20} color="#fff" />
                                    <Text style={styles.writeReviewText}>Write First Review</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Animated.View>
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ... (keep all the styles from the previous version)
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f8fafc' 
    },
    backgroundGradient: { 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: height * 0.25, 
        zIndex: -1 
    },
    scrollContent: { 
        paddingBottom: 20 
    },
    bottomSpacer: { 
        height: 20 
    },
    
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 8,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.18)'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    
    // Top Card
    topCard: {
        backgroundColor: '#fff',
        margin: 20,
        marginTop: 10,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    
    // Profile Section
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '700',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    sellerName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
        textAlign: 'center',
    },
    sellerSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 12,
        textAlign: 'center',
    },
    trustScoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    trustScoreText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    
    // Stats Section
    statsSection: {
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 20,
        marginBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#059669',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#f1f5f9',
    },
    
    // Write Review Button
    writeReviewButton: {
        backgroundColor: '#059669',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
    },
    writeReviewText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    
    // Trust Card
    trustCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    trustHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    trustTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
    },
    scoreBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreBadgeText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressBackground: {
        height: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabel: {
        fontSize: 12,
        color: '#9ca3af',
        fontWeight: '500',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusLabel: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    
    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    activeTab: {
        backgroundColor: '#f0fdf4',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9ca3af',
    },
    activeTabText: {
        color: '#059669',
    },
    
    // Overview Content
    overviewContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    overviewCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 16,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    infoCard: {
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    infoCardValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        textAlign: 'center',
    },
    infoCardLabel: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
    },
    
    // Reviews Content
    reviewsContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    reviewCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    reviewerInfo: {
        flex: 1,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ratingText: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    reviewDate: {
        fontSize: 12,
        color: '#9ca3af',
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
        gap: 4,
        alignSelf: 'flex-start',
    },
    productText: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    reviewComment: {
        fontSize: 14,
        color: '#4b5563',
        lineHeight: 20,
        marginBottom: 12,
    },
    reviewFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    sentimentTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    sentimentText: {
        fontSize: 11,
        fontWeight: '600',
    },
    
    // Empty State
    emptyState: {
        backgroundColor: '#fff',
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 8,
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    
    // Loading & Error Screens
    loadingScreen: { 
        flex: 1 
    },
    gradient: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    loadingContainer: { 
        alignItems: 'center' 
    },
    loadingText: { 
        marginTop: 16, 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '600' 
    },
    errorScreen: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#f8fafc', 
        padding: 32 
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#374151',
        marginTop: 16,
        marginBottom: 8,
    },
    errorSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    retryButton: { 
        backgroundColor: '#059669', 
        paddingHorizontal: 32, 
        paddingVertical: 12, 
        borderRadius: 8,
        marginBottom: 12,
        width: '80%',
        alignItems: 'center',
    },
    retryText: { 
        color: '#fff', 
        fontWeight: '600', 
        fontSize: 16 
    },
    secondaryButton: {
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#059669',
        width: '80%',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#059669',
        fontWeight: '600',
        fontSize: 16,
    },
});