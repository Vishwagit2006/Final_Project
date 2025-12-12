// //LeaderBoard.js
// import React, { useState, useCallback, useEffect } from 'react';
// import {
//     View,
//     ScrollView,
//     StyleSheet,
//     TouchableOpacity,
//     LayoutAnimation,
//     Platform,
//     UIManager,
//     Animated,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import {
//     Text,
//     Avatar,
//     Card,
//     Divider,
//     useTheme,
//     Badge,
//     Searchbar,
// } from 'react-native-paper';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import TopNavBar from '../../components/TopNavBar';

// if (Platform.OS === 'android') {
//     UIManager.setLayoutAnimationEnabledExperimental?.(true);
// }

// const initialUsers = [
//     {
//         name: 'Davis Curtis',
//         points: 2569,
//         flag: '🇵🇹',
//         badge: 'Top Performer',
//         movement: 'up',
//         image: 'https://randomuser.me/api/portraits/men/32.jpg',
//     },
//     {
//         name: 'Alena Donin',
//         points: 1469,
//         flag: '🇫🇷',
//         badge: 'Rising Star',
//         movement: 'down',
//         image: 'https://randomuser.me/api/portraits/women/44.jpg',
//     },
//     {
//         name: 'Craig Gouse',
//         points: 1053,
//         flag: '🇨🇦',
//         badge: 'Consistent',
//         movement: 'up',
//         image: 'https://randomuser.me/api/portraits/men/18.jpg',
//     },
//     {
//         name: 'Madelyn Dias',
//         points: 590,
//         flag: '🇮🇳',
//         badge: 'You',
//         movement: 'up',
//         image: 'https://randomuser.me/api/portraits/women/65.jpg',
//     },
//     {
//         name: 'Zain Vaccaro',
//         points: 448,
//         flag: '🇮🇹',
//         badge: 'Active',
//         image: 'https://randomuser.me/api/portraits/men/79.jpg',
//     },
//     {
//         name: 'Skylar Geidt',
//         points: 448,
//         flag: '🇺🇸',
//         badge: 'Newbie',
//         image: 'https://randomuser.me/api/portraits/women/30.jpg',
//     },
// ];

// const LeaderboardScreen = () => {
//     const { colors } = useTheme();
//     const [searchQuery, setSearchQuery] = useState('');
//     const [tab, setTab] = useState('Weekly');
//     const [users] = useState(initialUsers);

//     const onChangeSearch = useCallback((query) => {
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         setSearchQuery(query);
//     }, []);

//     const filteredUsers = users.filter((user) =>
//         user.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const topThree = filteredUsers.slice(0, 3);
//     const remainingUsers = filteredUsers.slice(3);

//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
//             <TopNavBar />
//             <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>

//             <View style={styles.headerContainer}>
//                 <Text style={[styles.headerTitle, { color: colors.text }]}>Leaderboard</Text>
//                 <Text style={[styles.headerSubtitle, { color: colors.secondary }]}>
//                     Track your weekly & all-time rank
//                 </Text>
//             </View>

//             {/* Tabs */}
//             <View style={styles.tabRow}>
//                 {['Weekly', 'All Time'].map((label) => (
//                     <TouchableOpacity key={label} onPress={() => setTab(label)} style={styles.tabButton}>
//                         <Text style={[styles.tabText, tab === label && styles.tabTextActive]}>
//                             {label}
//                         </Text>
//                         {tab === label && <View style={styles.activeUnderline} />}
//                     </TouchableOpacity>
//                 ))}
//             </View>

//             {/* Search Bar */}
//             <Searchbar
//                 placeholder="Search players"
//                 onChangeText={onChangeSearch}
//                 value={searchQuery}
//                 style={styles.searchBar}
//             />

//             {/* Podium */}
//             {topThree.length > 0 && (
//                 <View style={styles.podium}>
//                     {topThree[1] && <PodiumPosition position={2} user={topThree[1]} />}
//                     {topThree[0] && <PodiumPosition position={1} user={topThree[0]} />}
//                     {topThree[2] && <PodiumPosition position={3} user={topThree[2]} />}
//                 </View>
//             )}

//             {/* Full List */}
//             <Card style={[styles.listCard, { backgroundColor: colors.surface }]}>
//                 <Card.Content>
//                     {remainingUsers.map((user, index) => (
//                         <TouchableOpacity key={index} onPress={() => console.log(`Tapped ${user.name}`)}>
//                             <View>
//                                 <UserRow
//                                     user={user}
//                                     rank={index + 4}
//                                     highlight={user.badge === 'You' && searchQuery === ''}
//                                 />
//                                 {index !== remainingUsers.length - 1 && <Divider style={styles.divider} />}
//                             </View>
//                         </TouchableOpacity>
//                     ))}
//                     {filteredUsers.length === 0 && (
//                         <View style={styles.emptySearchContainer}>
//                             <MaterialCommunityIcons name="account-search-outline" size={48} color={colors.disabled} />
//                             <Text style={[styles.emptySearchText, { color: colors.text }]}>
//                                 No players found matching "{searchQuery}".
//                             </Text>
//                             <Text style={[styles.emptySearchSubText, { color: colors.secondary }]}>
//                                 Try a different name.
//                             </Text>
//                         </View>
//                     )}
//                 </Card.Content>
//             </Card>
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const PodiumPosition = ({ position, user }) => {
//     const sizeMap = { 1: 90, 2: 70, 3: 65 };
//     const bgColor = { 1: '#FFE17B', 2: '#C8D6FF', 3: '#FFD1B2' };

//     return (
//         <View style={[styles.podiumPosition, { backgroundColor: bgColor[position] }]}>
//             <MaterialCommunityIcons
//                 name="medal"
//                 size={24}
//                 color={position === 1 ? '#FFD700' : position === 2 ? '#BFC9CA' : '#CD7F32'}
//             />
//             <Avatar.Image
//                 source={{ uri: user.image }}
//                 size={sizeMap[position]}
//                 style={styles.podiumAvatar}
//             />
//             <Text style={styles.podiumName}>{user.name.split(' ')[0]}</Text>
//             <Text style={styles.podiumPoints}>{user.points} pts</Text>
//         </View>
//     );
// };

// const UserRow = ({ user, rank, highlight }) => {
//     const { colors } = useTheme();
//     const progress = useState(new Animated.Value(0))[0];
//     const animationDuration = 500; // milliseconds

//     useEffect(() => {
//         Animated.timing(progress, {
//             toValue: user.points / Math.max(...initialUsers.map(u => u.points)), // Normalize points
//             duration: animationDuration,
//             useNativeDriver: false,
//         }).start();
//     }, [user.points, progress]);

//     const progressBarWidth = progress.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0%', '70%'], // Adjust the maximum width as needed
//     });

//     const youHighlightStyle = highlight ? {
//         backgroundColor: '#FCE4EC',
//         borderRadius: 10,
//         shadowColor: '#E1BEE7',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.5,
//         shadowRadius: 3,
//         elevation: 3,
//     } : {};

//     const youTextStyle = highlight ? { color: '#7B1FA2', fontWeight: 'bold' } : {};

//     return (
//         <View style={[styles.userRow, youHighlightStyle]}>
//             <Text style={[styles.rankNumber, youTextStyle]}>#{rank}</Text>

//             <View style={styles.avatarContainer}>
//                 <Avatar.Image
//                     source={{ uri: user.image }}
//                     size={40}
//                     style={{ backgroundColor: highlight ? '#E1BEE7' : '#E0E0E0' }}
//                 />
//                 {user.movement && (
//                     <MaterialCommunityIcons
//                         name={user.movement === 'up' ? 'arrow-up-bold' : 'arrow-down-bold'}
//                         size={16}
//                         color={user.movement === 'up' ? 'green' : 'red'}
//                         style={styles.movementIcon}
//                     />
//                 )}
//             </View>

//             <View style={styles.userInfo}>
//                 <Text style={[styles.userName, youTextStyle]}>
//                     {user.name} {user.flag}
//                 </Text>
//                 <View style={styles.badgeAndProgress}>
//                     <View style={styles.badgeRow}>
//                         <Badge style={styles.badge}>{user.badge}</Badge>
//                         <Text style={styles.pointsTextSmall}>{user.points} points</Text>
//                     </View>
//                     <Animated.View
//                         style={[
//                             styles.progressBarBackground,
//                             { width: '70%', backgroundColor: colors.border },
//                         ]}
//                     >
//                         <Animated.View
//                             style={[
//                                 styles.progressBarFill,
//                                 { width: progressBarWidth, backgroundColor: colors.primary },
//                             ]}
//                         />
//                     </Animated.View>
//                 </View>
//             </View>
//             <MaterialCommunityIcons name="chevron-right" size={20} color="#757575" style={styles.chevronIcon} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingHorizontal: 16,
//         paddingTop: 16,
//     },
//     headerContainer: {
//         marginBottom: 16,
//         marginTop: 10,
//     },
//     headerTitle: {
//         fontSize: 26,
//         fontWeight: 'bold',
//         textAlign: 'left',
//         alignSelf: 'flex-start',
//     },
//     headerSubtitle: {
//         fontSize: 14,
//         marginTop: 2,
//         color: '#888',
//         textAlign: 'left',
//         alignSelf: 'flex-start',
//     },
//     tabRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//         marginVertical: 16,
//     },
//     tabButton: {
//         alignItems: 'center',
//     },
//     tabText: {
//         fontSize: 16,
//         color: '#777',
//     },
//     tabTextActive: {
//         color: '#000',
//         fontWeight: 'bold',
//     },
//     activeUnderline: {
//         height: 3,
//         width: 30,
//         backgroundColor: '#6200ee',
//         borderRadius: 2,
//         marginTop: 4,
//     },
//     searchBar: {
//         marginBottom: 16,
//         borderRadius: 10,
//         elevation: 2,
//     },
//     podium: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         alignItems: 'flex-end',
//         marginVertical: 24,
//     },
//     podiumPosition: {
//         alignItems: 'center',
//         padding: 10,
//         borderRadius: 12,
//         width: 100,
//         elevation: 2,
//     },
//     podiumAvatar: {
//         backgroundColor: '#fff',
//         marginVertical: 8,
//     },
//     podiumName: {
//         fontSize: 15,
//         fontWeight: '600',
//         textAlign: 'center',
//     },
//     podiumPoints: {
//         fontSize: 11,
//         color: '#555',
//     },
//     listCard: {
//         borderRadius: 12,
//         marginBottom: 30,
//         elevation: 1,
//     },
//     userRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 12,
//     },
//     rankNumber: {
//         fontSize: 16,
//         width: 40,
//         fontWeight: 'bold',
//     },
//     avatarContainer: {
//         position: 'relative',
//         marginRight: 10,
//     },
//     userInfo: {
//         flex: 1,
//         marginLeft: 5,
//     },
//     userName: {
//         fontSize: 15,
//         fontWeight: '500',
//     },
//     badgeRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 6,
//     },
//     badge: {
//         backgroundColor: '#FFD700',
//         color: '#333',
//         fontSize: 9,
//         borderRadius: 6,
//         paddingHorizontal: 6,
//         paddingVertical: 2,
//     },
//     pointsTextSmall: {
//         fontSize: 11,
//         color: '#777',
//     },
//     movementIcon: {
//         position: 'absolute',
//         top: -5,
//         right: -5,
//     },
//     divider: {
//         backgroundColor: '#e0e0e0',
//         marginVertical: 6,
//     },
//     chevronIcon: {
//         marginLeft: 8,
//     },
//     progressBarBackground: {
//         height: 5,
//         borderRadius: 2.5,
//         marginTop: 4,
//         overflow: 'hidden',
//     },
//     progressBarFill: {
//         height: 5,
//         borderRadius: 2.5,
//     },
//     badgeAndProgress: {
//         gap: 4,
//     },
//     emptySearchContainer: {
//         paddingVertical: 32,
//         alignItems: 'center',
//     },
//     emptySearchText: {
//         marginTop: 16,
//         fontSize: 16,
//         fontWeight: '500',
//         textAlign: 'center',
//     },
//     emptySearchSubText: {
//         marginTop: 4,
//         fontSize: 14,
//         color: '#888',
//         textAlign: 'center',
//     },
// });

// export default LeaderboardScreen;



//LeaderBoard.js
import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Text,
    Avatar,
    Card,
    Divider,
    useTheme,
    Badge,
    Searchbar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopNavBar from '../../components/TopNavBar';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const initialUsers = [
    {
        name: 'Davis Curtis',
        points: 2569,
        flag: '🇵🇹',
        badge: 'Top Performer',
        movement: 'up',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
        name: 'Alena Donin',
        points: 1469,
        flag: '🇫🇷',
        badge: 'Rising Star',
        movement: 'down',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
        name: 'Craig Gouse',
        points: 1053,
        flag: '🇨🇦',
        badge: 'Consistent',
        movement: 'up',
        image: 'https://randomuser.me/api/portraits/men/18.jpg',
    },
    {
        name: 'Madelyn Dias',
        points: 590,
        flag: '🇮🇳',
        badge: 'You',
        movement: 'up',
        image: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
        name: 'Zain Vaccaro',
        points: 448,
        flag: '🇮🇹',
        badge: 'Active',
        image: 'https://randomuser.me/api/portraits/men/79.jpg',
    },
    {
        name: 'Skylar Geidt',
        points: 448,
        flag: '🇺🇸',
        badge: 'Newbie',
        image: 'https://randomuser.me/api/portraits/women/30.jpg',
    },
];

const LeaderboardScreen = () => {
    const { colors } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [tab, setTab] = useState('Weekly');
    const [users] = useState(initialUsers);

    const onChangeSearch = useCallback((query) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSearchQuery(query);
    }, []);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const topThree = filteredUsers.slice(0, 3);
    const remainingUsers = filteredUsers.slice(3);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <TopNavBar />
            <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>

            <View style={styles.headerContainer}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Leaderboard</Text>
                <Text style={[styles.headerSubtitle, { color: colors.secondary }]}>
                    Track your weekly & all-time rank
                </Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {['Weekly', 'All Time'].map((label) => (
                    <TouchableOpacity key={label} onPress={() => setTab(label)} style={styles.tabButton}>
                        <Text style={[styles.tabText, tab === label && styles.tabTextActive]}>
                            {label}
                        </Text>
                        {tab === label && <View style={styles.activeUnderline} />}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Search Bar */}
            <Searchbar
                placeholder="Search players"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={styles.searchBar}
            />

            {/* Podium */}
            {topThree.length > 0 && (
                <View style={styles.podium}>
                    {topThree[1] && <PodiumPosition position={2} user={topThree[1]} />}
                    {topThree[0] && <PodiumPosition position={1} user={topThree[0]} />}
                    {topThree[2] && <PodiumPosition position={3} user={topThree[2]} />}
                </View>
            )}

            {/* Full List */}
            <Card style={[styles.listCard, { backgroundColor: colors.surface }]}>
                <Card.Content>
                    {remainingUsers.map((user, index) => (
                        <TouchableOpacity key={index} onPress={() => console.log(`Tapped ${user.name}`)}>
                            <View>
                                <UserRow
                                    user={user}
                                    rank={index + 4}
                                    highlight={user.badge === 'You' && searchQuery === ''}
                                />
                                {index !== remainingUsers.length - 1 && <Divider style={styles.divider} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                    {filteredUsers.length === 0 && (
                        <View style={styles.emptySearchContainer}>
                            <MaterialCommunityIcons name="account-search-outline" size={48} color={colors.disabled} />
                            <Text style={[styles.emptySearchText, { color: colors.text }]}>
                                No players found matching "{searchQuery}".
                            </Text>
                            <Text style={[styles.emptySearchSubText, { color: colors.secondary }]}>
                                Try a different name.
                            </Text>
                        </View>
                    )}
                </Card.Content>
            </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

const PodiumPosition = ({ position, user }) => {
    const sizeMap = { 1: 90, 2: 70, 3: 65 };
    const bgColor = { 1: '#FFE17B', 2: '#C8D6FF', 3: '#FFD1B2' };

    return (
        <View style={[styles.podiumPosition, { backgroundColor: bgColor[position] }]}>
            <MaterialCommunityIcons
                name="medal"
                size={24}
                color={position === 1 ? '#FFD700' : position === 2 ? '#BFC9CA' : '#CD7F32'}
            />
            <Avatar.Image
                source={{ uri: user.image }}
                size={sizeMap[position]}
                style={styles.podiumAvatar}
            />
            <Text style={styles.podiumName}>{user.name.split(' ')[0]}</Text>
            <Text style={styles.podiumPoints}>{user.points} pts</Text>
        </View>
    );
};

const UserRow = ({ user, rank, highlight }) => {
    const { colors } = useTheme();
    const progress = useState(new Animated.Value(0))[0];
    const animationDuration = 500; // milliseconds

    useEffect(() => {
        Animated.timing(progress, {
            toValue: user.points / Math.max(...initialUsers.map(u => u.points)), // Normalize points
            duration: animationDuration,
            useNativeDriver: false,
        }).start();
    }, [user.points, progress]);

    const progressBarWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '70%'], // Adjust the maximum width as needed
    });

    const youHighlightStyle = highlight ? {
        backgroundColor: '#FCE4EC',
        borderRadius: 10,
        shadowColor: '#E1BEE7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 3,
    } : {};

    const youTextStyle = highlight ? { color: '#7B1FA2', fontWeight: 'bold' } : {};

    return (
        <View style={[styles.userRow, youHighlightStyle]}>
            <Text style={[styles.rankNumber, youTextStyle]}>#{rank}</Text>

            <View style={styles.avatarContainer}>
                <Avatar.Image
                    source={{ uri: user.image }}
                    size={40}
                    style={{ backgroundColor: highlight ? '#E1BEE7' : '#E0E0E0' }}
                />
                {user.movement && (
                    <MaterialCommunityIcons
                        name={user.movement === 'up' ? 'arrow-up-bold' : 'arrow-down-bold'}
                        size={16}
                        color={user.movement === 'up' ? 'green' : 'red'}
                        style={styles.movementIcon}
                    />
                )}
            </View>

            <View style={styles.userInfo}>
                <Text style={[styles.userName, youTextStyle]}>
                    {user.name} {user.flag}
                </Text>
                <View style={styles.badgeAndProgress}>
                    <View style={styles.badgeRow}>
                        <Badge style={styles.badge}>{user.badge}</Badge>
                        <Text style={styles.pointsTextSmall}>{user.points} points</Text>
                    </View>
                    <Animated.View
                        style={[
                            styles.progressBarBackground,
                            { width: '70%', backgroundColor: colors.border },
                        ]}
                    >
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                { width: progressBarWidth, backgroundColor: colors.primary },
                            ]}
                        />
                    </Animated.View>
                </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#757575" style={styles.chevronIcon} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    headerContainer: {
        marginBottom: 16,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    headerSubtitle: {
        fontSize: 14,
        marginTop: 2,
        color: '#888',
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 16,
    },
    tabButton: {
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        color: '#777',
    },
    tabTextActive: {
        color: '#000',
        fontWeight: 'bold',
    },
    activeUnderline: {
        height: 3,
        width: 30,
        backgroundColor: '#6200ee',
        borderRadius: 2,
        marginTop: 4,
    },
    searchBar: {
        marginBottom: 16,
        borderRadius: 10,
        elevation: 2,
    },
    podium: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        marginVertical: 24,
    },
    podiumPosition: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 12,
        width: 100,
        elevation: 2,
    },
    podiumAvatar: {
        backgroundColor: '#fff',
        marginVertical: 8,
    },
    podiumName: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    podiumPoints: {
        fontSize: 11,
        color: '#555',
    },
    listCard: {
        borderRadius: 12,
        marginBottom: 30,
        elevation: 1,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    rankNumber: {
        fontSize: 16,
        width: 40,
        fontWeight: 'bold',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
        marginLeft: 5,
    },
    userName: {
        fontSize: 15,
        fontWeight: '500',
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    badge: {
        backgroundColor: '#FFD700',
        color: '#333',
        fontSize: 9,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    pointsTextSmall: {
        fontSize: 11,
        color: '#777',
    },
    movementIcon: {
        position: 'absolute',
        top: -5,
        right: -5,
    },
    divider: {
        backgroundColor: '#e0e0e0',
        marginVertical: 6,
    },
    chevronIcon: {
        marginLeft: 8,
    },
    progressBarBackground: {
        height: 5,
        borderRadius: 2.5,
        marginTop: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 5,
        borderRadius: 2.5,
    },
    badgeAndProgress: {
        gap: 4,
    },
    emptySearchContainer: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    emptySearchText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    emptySearchSubText: {
        marginTop: 4,
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
});

export default LeaderboardScreen;



