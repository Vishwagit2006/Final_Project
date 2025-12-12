//Business/Profiles.jsx
import React, { useMemo, useRef } from 'react';
import { View, ScrollView, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Avatar, Card, Text, ProgressBar, Badge, Chip, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const COLORS = {
  primary: '#2E8B57',
  primaryLight: '#4CAF50',
  primaryDark: '#1B5E20',
  primarySoft: '#D7F1E1',
  secondary: '#2196F3',
  secondaryLight: '#64B5F6',
  secondaryDark: '#1E3A8A',
  accentGold: '#FFD166',
  accentOrange: '#FF8C42',
  accentCoral: '#FF6B6B',
  background: '#F6FBF6',
  surface: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  muted: '#E2E8F0',
  gradientPrimary: ['#2E8B57', '#3DA56A', '#4ECDC4'],
  gradientSecondary: ['#5B86E5', '#36D1DC'],
  gradientAccent: ['#FFD166', '#FF8C42', '#FF6B6B'],
};

const HERO_METRICS = [
  {
    icon: 'star-circle',
    label: 'Eco XP',
    value: '1,250',
    helper: '+8% vs last week',
    color: COLORS.accentGold,
  },
  {
    icon: 'fire',
    label: 'Active Streak',
    value: '21 days',
    helper: 'Perfect run for 3 weeks',
    color: COLORS.accentOrange,
  },
  {
    icon: 'leaf',
    label: 'Impact Score',
    value: '92',
    helper: 'Top 5% in your city',
    color: COLORS.primaryLight,
  },
];

const LIVE_CHALLENGES = [
  {
    title: 'Zero Waste Sprint',
    description: 'Complete 5 carbon-saving swaps',
    reward: '+120 XP • Silver badge',
    progress: 0.6,
    color: COLORS.secondary,
    status: 'Live',
  },
  {
    title: 'Community Boost',
    description: 'Invite 3 friends & donate together',
    reward: '+90 XP • Team bonus',
    progress: 0.4,
    color: COLORS.accentCoral,
    status: 'Ends in 2d',
  },
];

const MASTERY_TRACKS = [
  {
    title: 'Reuse Mastery',
    detail: '3 drops to Legend tier',
    progress: 0.78,
    icon: 'recycle',
    color: COLORS.primaryLight,
  },
  {
    title: 'Community Cred',
    detail: 'Earn 2 more kudos to uplift rank',
    progress: 0.64,
    icon: 'account-group',
    color: COLORS.secondary,
  },
  {
    title: 'Impact Analyst',
    detail: 'Log 4 more donations this month',
    progress: 0.52,
    icon: 'chart-areaspline',
    color: COLORS.accentCoral,
  },
];

const REWARD_TRACK = [
  {
    title: 'Eco Scout',
    target: 'Level 5',
    reward: 'Tree NFT airdrop',
    completed: true,
  },
  {
    title: 'Impact Hero',
    target: 'Level 10',
    reward: 'Merch credit + badge',
    completed: true,
  },
  {
    title: 'Emerald Pioneer',
    target: 'Level 15',
    reward: 'Verified profile frame',
    completed: false,
  },
  {
    title: 'Planet Guardian',
    target: 'Level 20',
    reward: 'Invite-only council',
    completed: false,
  },
];

const ACTIVITY_FEED = [
  {
    title: 'Donation drop-off completed',
    timestamp: '12 mins ago',
    detail: 'Handed 6 items to Hope Foundation',
    icon: 'gift',
    color: COLORS.accentGold,
  },
  {
    title: 'Unlocked "Rapid Responder" badge',
    timestamp: '2 hrs ago',
    detail: 'Responded to 5 NGO calls in a day',
    icon: 'lightning-bolt',
    color: COLORS.accentOrange,
  },
  {
    title: 'Leaderboard climb',
    timestamp: 'Yesterday',
    detail: 'Moved from #18 → #9 in local rankings',
    icon: 'chart-line',
    color: COLORS.secondary,
  },
];

const LEADERBOARD = [
  { rank: 7, name: 'Ava Solar', trend: '+2', score: 1380 },
  { rank: 8, name: 'Kai Verde', trend: '+1', score: 1335 },
  { rank: 9, name: 'You', trend: '+9', score: 1312 },
];

const QUICK_ACTIONS = [
  {
    icon: 'trophy-outline',
    title: 'Leaderboard',
    colors: COLORS.gradientAccent,
    route: '/shared/LeaderBoard',
  },
  {
    icon: 'hand-heart',
    title: 'Make Donation',
    colors: COLORS.gradientPrimary,
    route: '/Screens/Individuals/ProvideGoods',
  },
  {
    icon: 'leaf-circle',
    title: 'CSR Impact',
    colors: COLORS.gradientSecondary,
    route: '/Screens/CSR/ImpactDashboard',
  },
];

const GamificationScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const stats = useMemo(
    () => ({
      level: 12,
      tier: 'Emerald Pioneer',
      nextTier: 'Emerald Elite',
      xpPercent: 0.68,
      xpToNext: 420,
      streak: 21,
      carbonSaved: 72,
      donations: 48,
      businessesSupported: 19,
      communityScore: 92,
    }),
    []
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundHeader, { opacity: headerOpacity }]}> 
        <LinearGradient colors={COLORS.gradientPrimary} style={styles.gradientBackground} />
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
      >
        <HeroHeader stats={stats} />
        <MetricStrip />
        <ChallengeCarousel />
        <MasteryGrid />
        <ImpactSummary stats={stats} />
        <RewardTrack />
        <ActivityTimeline />
        <LeaderboardPreview />
        <ActionPanel />
      </Animated.ScrollView>
    </View>
  );
};

const HeroHeader = ({ stats }) => (
  <LinearGradient colors={COLORS.gradientPrimary} style={styles.heroCard}>
    <View style={styles.heroRow}>
      <View style={styles.heroInfo}>
        <Text style={styles.heroSubtitle}>{stats.tier}</Text>
        <Text style={styles.heroTitle}>@EcoWarrior</Text>
        <View style={styles.heroBadgeRow}>
          <MaterialCommunityIcons name="shield-check" size={18} color={COLORS.surface} />
          <Text style={styles.heroBadgeText}>Level {stats.level} • {stats.xpToNext} XP to next tier</Text>
        </View>
      </View>
      <View style={styles.heroAvatarWrapper}>
        <LinearGradient colors={COLORS.gradientAccent} style={styles.heroAvatarBorder}>
          <Avatar.Image size={76} source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.avatar} />
        </LinearGradient>
        <Badge style={styles.heroBadge}>Top 5%</Badge>
      </View>
    </View>
    <View style={styles.heroProgressTrack}>
      <View style={styles.heroProgressHeader}>
        <Text style={styles.heroProgressLabel}>Season Journey</Text>
        <Text style={styles.heroProgressValue}>{Math.round(stats.xpPercent * 100)}%</Text>
      </View>
      <ProgressBar progress={stats.xpPercent} color={COLORS.accentGold} style={styles.heroProgressBar} />
      <Text style={styles.heroProgressHelper}>{stats.xpToNext} XP to reach {stats.nextTier}</Text>
    </View>
  </LinearGradient>
);

const MetricStrip = () => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricStrip}>
    {HERO_METRICS.map(metric => (
      <LinearGradient key={metric.label} colors={[metric.color + '33', '#FFFFFF']} style={styles.metricCard}>
        <View style={[styles.metricIcon, { backgroundColor: metric.color + '22' }]}>
          <MaterialCommunityIcons name={metric.icon} size={22} color={metric.color} />
        </View>
        <Text style={styles.metricLabel}>{metric.label}</Text>
        <Text style={[styles.metricValue, { color: metric.color }]}>{metric.value}</Text>
        <Text style={styles.metricHelper}>{metric.helper}</Text>
      </LinearGradient>
    ))}
  </ScrollView>
);

const ChallengeCarousel = () => (
  <Card style={styles.sectionCard}>
    <Card.Title
      title="Live Challenges"
      titleStyle={styles.sectionTitle}
      subtitle="Real-time quests curated for you"
      subtitleStyle={styles.sectionSubtitle}
      left={props => <MaterialCommunityIcons {...props} name="flag-checkered" color={COLORS.secondary} size={24} />}
    />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.challengeRow}>
      {LIVE_CHALLENGES.map(challenge => (
        <LinearGradient key={challenge.title} colors={[challenge.color + '33', '#FFFFFF']} style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Chip style={styles.challengeChip} textStyle={styles.challengeChipText}>{challenge.status}</Chip>
            <Badge style={styles.challengeReward}>Reward</Badge>
          </View>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengeDescription}>{challenge.description}</Text>
          <Text style={styles.challengeRewardText}>{challenge.reward}</Text>
          <ProgressBar progress={challenge.progress} color={challenge.color} style={styles.challengeProgress} />
          <Text style={styles.challengeProgressText}>{Math.round(challenge.progress * 100)}% done</Text>
        </LinearGradient>
      ))}
    </ScrollView>
  </Card>
);

const MasteryGrid = () => (
  <Card style={styles.sectionCard}>
    <Card.Title
      title="Mastery Tracks"
      subtitle="Focus areas to unlock next"
      titleStyle={styles.sectionTitle}
      subtitleStyle={styles.sectionSubtitle}
      left={props => <MaterialCommunityIcons {...props} name="leaf-circle" color={COLORS.primaryLight} size={24} />}
    />
    {MASTERY_TRACKS.map(track => (
      <View key={track.title} style={styles.masteryItem}>
        <View style={[styles.masteryIcon, { backgroundColor: track.color + '22' }]}>
          <MaterialCommunityIcons name={track.icon} size={20} color={track.color} />
        </View>
        <View style={styles.masteryBody}>
          <View style={styles.masteryHeader}>
            <Text style={styles.masteryTitle}>{track.title}</Text>
            <Text style={styles.masteryPercent}>{Math.round(track.progress * 100)}%</Text>
          </View>
          <Text style={styles.masteryDetail}>{track.detail}</Text>
          <ProgressBar progress={track.progress} color={track.color} style={styles.masteryProgress} />
        </View>
      </View>
    ))}
  </Card>
);

const ImpactSummary = ({ stats }) => {
  const items = [
    { label: 'Carbon Saved', value: `${stats.carbonSaved}kg`, icon: 'cloud', color: COLORS.primaryLight },
    { label: 'Items Donated', value: stats.donations, icon: 'gift', color: COLORS.accentGold },
    { label: 'Businesses Supported', value: stats.businessesSupported, icon: 'storefront', color: COLORS.secondary },
  ];

  return (
    <Card style={styles.sectionCard}>
      <Card.Title
        title="Impact Overview"
        subtitle="Live sustainability footprint"
        titleStyle={styles.sectionTitle}
        subtitleStyle={styles.sectionSubtitle}
        left={props => <MaterialCommunityIcons {...props} name="earth" color={COLORS.primary} size={24} />}
      />
      <View style={styles.impactRow}>
        {items.map(item => (
          <View key={item.label} style={styles.impactItem}>
            <View style={[styles.impactIcon, { backgroundColor: item.color + '22' }]}>
              <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
            </View>
            <Text style={styles.impactValue}>{item.value}</Text>
            <Text style={styles.impactLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const RewardTrack = () => (
  <Card style={styles.sectionCard}>
    <Card.Title
      title="Reward Path"
      subtitle="Stay on track for high-tier perks"
      titleStyle={styles.sectionTitle}
      subtitleStyle={styles.sectionSubtitle}
      left={props => <MaterialCommunityIcons {...props} name="medal" color={COLORS.accentGold} size={24} />}
    />
    {REWARD_TRACK.map((step, index) => (
      <View key={step.title} style={styles.rewardRow}>
        <View style={styles.rewardTimeline}>
          <View style={[styles.rewardNode, step.completed && styles.rewardNodeActive]}>
            <MaterialCommunityIcons
              name={step.completed ? 'check-bold' : 'lock-outline'}
              size={14}
              color={step.completed ? COLORS.primaryDark : COLORS.textSecondary}
            />
          </View>
          {index < REWARD_TRACK.length - 1 && (
            <View style={[styles.rewardConnector, step.completed && styles.rewardConnectorActive]} />
          )}
        </View>
        <View style={styles.rewardBody}>
          <View style={styles.rewardHeader}>
            <Text style={styles.rewardTitle}>{step.title}</Text>
            <Chip mode="outlined" style={styles.rewardChip} textStyle={styles.rewardChipText}>
              {step.target}
            </Chip>
          </View>
          <Text style={styles.rewardDetail}>{step.reward}</Text>
        </View>
      </View>
    ))}
  </Card>
);

const ActivityTimeline = () => (
  <Card style={styles.sectionCard}>
    <Card.Title
      title="Activity Timeline"
      subtitle="A snapshot of your latest moves"
      titleStyle={styles.sectionTitle}
      subtitleStyle={styles.sectionSubtitle}
      left={props => <MaterialCommunityIcons {...props} name="clock-outline" color={COLORS.secondaryDark} size={24} />}
    />
    {ACTIVITY_FEED.map((item, index) => (
      <View key={item.title}>
        <View style={styles.activityRow}>
          <View style={[styles.activityIcon, { backgroundColor: item.color + '22' }]}>
            <MaterialCommunityIcons name={item.icon} size={18} color={item.color} />
          </View>
          <View style={styles.activityBody}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityDetail}>{item.detail}</Text>
          </View>
          <Text style={styles.activityTime}>{item.timestamp}</Text>
        </View>
        {index < ACTIVITY_FEED.length - 1 && <Divider style={styles.activityDivider} />}
      </View>
    ))}
  </Card>
);

const LeaderboardPreview = () => (
  <Card style={styles.sectionCard}>
    <Card.Title
      title="Leaderboard Snapshot"
      subtitle="You are trending upward"
      titleStyle={styles.sectionTitle}
      subtitleStyle={styles.sectionSubtitle}
      left={props => <MaterialCommunityIcons {...props} name="podium-gold" color={COLORS.accentGold} size={24} />}
      right={() => (
        <Chip onPress={() => router.push('/shared/Gamification')} style={styles.viewAllChip} textStyle={styles.viewAllChipText}>
          View all
        </Chip>
      )}
    />
    {LEADERBOARD.map(entry => (
      <View key={entry.rank} style={styles.leaderboardRow}>
        <Text style={styles.leaderboardRank}>#{entry.rank}</Text>
        <View style={styles.leaderboardBody}>
          <Text style={styles.leaderboardName}>{entry.name}</Text>
          <Text style={styles.leaderboardTrend}>{entry.trend} today</Text>
        </View>
        <Text style={styles.leaderboardScore}>{entry.score} pts</Text>
      </View>
    ))}
  </Card>
);

const ActionPanel = () => (
  <View style={styles.actionRow}>
    {QUICK_ACTIONS.map(action => (
      <TouchableOpacity key={action.title} style={styles.actionButton} onPress={() => router.push(action.route)}>
        <LinearGradient colors={action.colors} style={styles.actionGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <MaterialCommunityIcons name={action.icon} size={22} color={COLORS.surface} />
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text style={styles.actionHelper}>{action.helper}</Text>
        </LinearGradient>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroInfo: {
    flex: 1,
    marginRight: 12,
  },
  heroSubtitle: {
    color: '#E0FFE5',
    fontSize: 13,
  },
  heroTitle: {
    color: COLORS.surface,
    fontSize: 26,
    fontWeight: 'bold',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  heroBadgeText: {
    color: COLORS.surface,
    marginLeft: 6,
    fontSize: 13,
  },
  heroAvatarWrapper: {
    alignItems: 'center',
  },
  heroAvatarBorder: {
    padding: 3,
    borderRadius: 999,
  },
  avatar: {
    backgroundColor: COLORS.surface,
  },
  heroBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: COLORS.surface,
  },
  heroProgressTrack: {
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    padding: 14,
  },
  heroProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heroProgressLabel: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  heroProgressValue: {
    color: COLORS.accentGold,
    fontWeight: 'bold',
  },
  heroProgressBar: {
    height: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  heroProgressHelper: {
    color: '#E2FBE2',
    marginTop: 6,
    fontSize: 12,
  },
  metricStrip: {
    paddingVertical: 4,
  },
  metricCard: {
    width: 160,
    borderRadius: 20,
    padding: 14,
    marginRight: 12,
    backgroundColor: COLORS.surface,
  },
  metricIcon: {
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  metricHelper: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  sectionCard: {
    borderRadius: 26,
    paddingBottom: 12,
    marginBottom: 16,
    backgroundColor: COLORS.surface,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  challengeRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  challengeCard: {
    width: 240,
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    backgroundColor: COLORS.surface,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeChip: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  challengeChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  challengeReward: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    color: COLORS.textPrimary,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  challengeDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  challengeRewardText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  challengeProgress: {
    height: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  challengeProgressText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  masteryItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  masteryIcon: {
    padding: 12,
    borderRadius: 14,
    marginRight: 12,
  },
  masteryBody: {
    flex: 1,
  },
  masteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masteryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  masteryPercent: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  masteryDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginVertical: 4,
  },
  masteryProgress: {
    height: 6,
    borderRadius: 4,
    backgroundColor: COLORS.muted,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  impactItem: {
    alignItems: 'center',
    flex: 1,
  },
  impactIcon: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  impactLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  rewardRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  rewardTimeline: {
    alignItems: 'center',
    marginRight: 16,
  },
  rewardNode: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.muted,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  rewardNodeActive: {
    borderColor: COLORS.accentGold,
    backgroundColor: COLORS.accentGold + '33',
  },
  rewardConnector: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.muted,
    marginVertical: 4,
  },
  rewardConnectorActive: {
    backgroundColor: COLORS.accentGold,
  },
  rewardBody: {
    flex: 1,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  rewardChip: {
    borderColor: COLORS.muted,
    height: 28,
  },
  rewardChipText: {
    fontSize: 12,
  },
  rewardDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  activityIcon: {
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  activityBody: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  activityDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  activityDivider: {
    marginHorizontal: 20,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  leaderboardRank: {
    fontSize: 16,
    fontWeight: '700',
    width: 36,
    color: COLORS.textPrimary,
  },
  leaderboardBody: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  leaderboardTrend: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  leaderboardScore: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  viewAllChip: {
    backgroundColor: COLORS.primary,
  },
  viewAllChipText: {
    color: COLORS.surface,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  actionGradient: {
    borderRadius: 20,
    padding: 16,
  },
  actionTitle: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  actionHelper: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
});

export default GamificationScreen;
