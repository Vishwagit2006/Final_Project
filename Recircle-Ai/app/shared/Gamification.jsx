//shared->Gamification.jsx
import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Enhanced Color Palette with better contrast
const COLORS = {
  primary: "#1A6B54",
  primaryLight: "#2D957A",
  primaryDark: "#0F4F3A",
  surface: "#FFFFFF",
  background: "#F8FAFC",
  border: "#E2E8F0",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textTertiary: "#94A3B8",
  accentGold: "#D97706",
  accentBlue: "#4A90E2",
  accentPurple: "#7C3AED",
  accentEmerald: "#059669",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
};

const GRADIENTS = {
  primary: [COLORS.primary, COLORS.primaryLight],
  premium: ["#1A6B54", "#38B2AC"],
  gold: ["#D97706", "#F59E0B"],
  blue: ["#4A90E2", "#60A5FA"],
  purple: ["#7C3AED", "#8B5CF6"],
  emerald: ["#059669", "#10B981"],
};

// Enhanced Data Structures with real-time elements
const userStats = {
  level: 12,
  xp: 1240,
  nextLevelXp: 2000,
  streak: 21,
  rank: 4,
  progress: 62,
  weeklyProgress: "+18%", // Like Strava weekly comparison
};

const levelMetrics = [
  { 
    icon: "flame", 
    label: "Daily Streak", 
    value: "21 days",
    gradient: GRADIENTS.gold,
    progress: 85,
    trend: "+5" // Like Duolingo streak growth
  },
  { 
    icon: "leaf", 
    label: "Impact Score", 
    value: "1,240 pts",
    gradient: GRADIENTS.emerald,
    progress: 62,
    trend: "+12%" // Like LinkedIn skill progress
  },
  { 
    icon: "gift", 
    label: "Rewards", 
    value: "08 perks",
    gradient: GRADIENTS.purple,
    progress: 45,
    trend: "2 new" // Like Nike achievements
  },
];

const liveChallenges = [
  {
    id: 1,
    title: "Food Rescue Mission",
    detail: "Save 10kg of surplus food from waste",
    reward: "+120 XP",
    progress: 72,
    color: COLORS.accentGold,
    icon: "food-apple",
    timeLeft: "5h 23m",
    participants: 42,
    category: "environment", // Like Strava challenge categories
    difficulty: "medium"
  },
  {
    id: 2,
    title: "Community Builder",
    detail: "Invite friends to join the circular economy",
    reward: "+80 XP",
    progress: 45,
    color: COLORS.accentBlue,
    icon: "people",
    timeLeft: "2d 14h",
    participants: 28,
    category: "social",
    difficulty: "easy"
  },
];

const badgeSummary = {
  totalBadges: 28,
  totalPoints: "5,480",
  weeklyGrowth: "+12%", // Like fitness app weekly stats
  badges: [
    {
      label: "Surplus Rescuer",
      detail: "Recovered 120kg fresh produce",
      points: "+480 pts",
      count: 12,
      icon: "food-apple",
      color: "#FCD34D",
      gradient: GRADIENTS.gold,
      tier: "gold" // Like gaming achievement tiers
    },
    {
      label: "Carbon Offsetter",
      detail: "Prevented 310kg CO₂ emissions",
      points: "+520 pts",
      count: 6,
      icon: "leaf",
      color: "#34D399",
      gradient: GRADIENTS.emerald,
      tier: "platinum"
    },
  ],
};

const quickActions = [
  { 
    icon: "trophy", 
    label: "Leaderboard", 
    helper: "Global rankings", 
    route: "/shared/LeaderBoard",
    gradient: GRADIENTS.gold,
    badge: "3" // Notification badge like social apps
  },
  { 
    icon: "sparkles", 
    label: "Daily Quest", 
    helper: "New challenges", 
    route: "/shared/GroupBuy",
    gradient: GRADIENTS.purple,
    badge: "1"
  },
  { 
    icon: "people", 
    label: "Community", 
    helper: "Join forces", 
    route: "/shared/CommunityScreen",
    gradient: GRADIENTS.blue 
  },
  { 
    icon: "gift", 
    label: "Rewards", 
    helper: "Claim perks", 
    route: "/shared/Rewards",
    gradient: GRADIENTS.emerald 
  },
];

const achievements = [
  { 
    icon: "medal", 
    title: "Circular Hero", 
    detail: "10 verified donations completed",
    color: COLORS.accentGold,
    date: "2 days ago",
    xp: "+250",
    type: "milestone" // Like Duolingo achievement types
  },
  { 
    icon: "ribbon", 
    title: "Impact Analyst", 
    detail: "5 data-backed reports logged",
    color: COLORS.accentBlue,
    date: "1 week ago",
    xp: "+180",
    type: "skill"
  },
];

const leaderboard = [
  { rank: 1, name: "Green Syndicate", points: 1830, trend: "up", change: "+12", avatar: "🌿" },
  { rank: 2, name: "Circular Coop", points: 1714, trend: "down", change: "-8", avatar: "🔄" },
  { rank: 3, name: "Eco Ninjas", points: 1655, trend: "up", change: "+24", avatar: "🥷" },
  { rank: 4, name: "You", points: 1640, trend: "up", change: "+18", highlight: true, avatar: "👤" },
  { rank: 5, name: "Planet Savers", points: 1580, trend: "up", change: "+5", avatar: "🌎" },
];

export default function Gamification() {
  const router = useRouter();

  // Header Component with proper alignment
  const HeaderSection = () => (
    <LinearGradient colors={GRADIENTS.premium} style={styles.hero}>
      <View style={styles.heroContent}>
        <View style={styles.heroHeader}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroLabel}>GAMIFICATION DASHBOARD</Text>
            <Text style={styles.heroTitle}>Level Up Your Impact</Text>
          </View>
          <View style={styles.rankBadge}>
            <FontAwesome5 name="crown" size={14} color="#FFFFFF" />
            <Text style={styles.rankText}>Rank #{userStats.rank}</Text>
          </View>
        </View>
        
        <LevelProgress level={userStats.level} progress={userStats.progress} />
        
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{userStats.xp}</Text>
            <Text style={styles.heroStatLabel}>Total XP</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{userStats.streak}</Text>
            <Text style={styles.heroStatLabel}>Day Streak</Text>
            <Text style={styles.heroStatTrend}>🔥 {userStats.weeklyProgress}</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{badgeSummary.totalBadges}</Text>
            <Text style={styles.heroStatLabel}>Badges</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const LevelProgress = ({ level, progress }) => (
    <View style={styles.levelContainer}>
      <View style={styles.levelHeader}>
        <Text style={styles.levelLabel}>Level {level}</Text>
        <Text style={styles.levelXp}>{progress}% to next level</Text>
      </View>
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={GRADIENTS.premium}
          style={[styles.progressFill, { width: `${progress}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
    </View>
  );

  const StatCard = ({ icon, label, value, gradient, progress, trend }) => (
    <View style={styles.statCardWrapper}>
      <LinearGradient colors={gradient} style={styles.statCard}>
        <View style={styles.statHeader}>
          <View style={styles.statIconContainer}>
            <Ionicons name={icon} size={20} color="#FFFFFF" />
          </View>
          {trend && (
            <View style={styles.trendBadge}>
              <Text style={styles.trendText}>{trend}</Text>
            </View>
          )}
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.miniProgress}>
          <View style={[styles.miniProgressFill, { width: `${progress}%` }]} />
        </View>
      </LinearGradient>
    </View>
  );

  const BadgeCard = ({ badge }) => (
    <View style={styles.badgeCardWrapper}>
      <LinearGradient colors={badge.gradient} style={styles.badgeCard}>
        <View style={styles.badgeHeader}>
          <View style={[styles.badgeIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <MaterialCommunityIcons name={badge.icon} size={20} color="#FFFFFF" />
          </View>
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountText}>{badge.count}</Text>
          </View>
        </View>
        <Text style={styles.badgeTitle}>{badge.label}</Text>
        <Text style={styles.badgeDetail}>{badge.detail}</Text>
        <View style={styles.badgeFooter}>
          <Text style={styles.badgePoints}>{badge.points}</Text>
          <View style={[styles.tierBadge, { backgroundColor: badge.tier === 'platinum' ? '#E5E7EB' : '#FCD34D' }]}>
            <Text style={styles.tierText}>{badge.tier}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const ChallengeCard = ({ challenge }) => (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeTitleSection}>
          <MaterialCommunityIcons name={challenge.icon} size={20} color={challenge.color} />
          <View style={styles.challengeTextContainer}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: challenge.difficulty === 'medium' ? COLORS.warning : COLORS.success }]}>
              <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
            </View>
          </View>
        </View>
        <View style={styles.timeBadge}>
          <Ionicons name="time-outline" size={12} color="#FFFFFF" />
          <Text style={styles.timeText}>{challenge.timeLeft}</Text>
        </View>
      </View>
      
      <Text style={styles.challengeDetail}>{challenge.detail}</Text>
      <Text style={styles.challengeReward}>{challenge.reward}</Text>
      
      <View style={styles.challengeProgress}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>Progress</Text>
          <Text style={styles.progressPercent}>{challenge.progress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={[challenge.color, `${challenge.color}DD`]}
            style={[styles.progressFill, { width: `${challenge.progress}%` }]}
          />
        </View>
        <View style={styles.participants}>
          <Ionicons name="people" size={12} color={COLORS.textTertiary} />
          <Text style={styles.participantsText}>{challenge.participants} participants</Text>
        </View>
      </View>
    </View>
  );

  const AchievementCard = ({ achievement }) => (
    <View style={styles.achievementCard}>
      <View style={styles.achievementMain}>
        <View style={[styles.achievementIcon, { backgroundColor: `${achievement.color}15` }]}>
          <Ionicons name={achievement.icon} size={20} color={achievement.color} />
        </View>
        <View style={styles.achievementContent}>
          <Text style={styles.achievementTitle}>{achievement.title}</Text>
          <Text style={styles.achievementDetail}>{achievement.detail}</Text>
          <Text style={styles.achievementDate}>{achievement.date}</Text>
        </View>
      </View>
      <View style={styles.xpBadge}>
        <Text style={styles.xpText}>{achievement.xp} XP</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <HeaderSection />
        <View style={styles.content}>
        {/* Quick Actions - Inspired by fitness app quick actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionSubtitle}>Jump into activities</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.actionsRow}
          >
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.label}
                style={styles.actionCard}
                onPress={() => router.push(action.route)}
              >
                <LinearGradient colors={action.gradient} style={styles.actionGradient}>
                  {action.badge && (
                    <View style={styles.actionBadge}>
                      <Text style={styles.actionBadgeText}>{action.badge}</Text>
                    </View>
                  )}
                  <Ionicons name={action.icon} size={24} color="#FFFFFF" />
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Text style={styles.actionHelper}>{action.helper}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Overview - Inspired by Duolingo progress tracking */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <Text style={styles.sectionSubtitle}>Weekly performance overview</Text>
          </View>
          <View style={styles.statsRow}>
            {levelMetrics.map((metric, index) => (
              <StatCard key={metric.label} {...metric} />
            ))}
          </View>
        </View>

        {/* Badges Section - Inspired by Nike achievement badges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Your Badges</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              {badgeSummary.totalBadges} badges • {badgeSummary.totalPoints} points
              {badgeSummary.weeklyGrowth && ` • ${badgeSummary.weeklyGrowth} this week`}
            </Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.badgesRow}
          >
            {badgeSummary.badges.map((badge, index) => (
              <BadgeCard key={badge.label} badge={badge} />
            ))}
          </ScrollView>
        </View>

        {/* Live Challenges - Inspired by Strava challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Live Challenges</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>Active missions ending soon</Text>
          </View>
          {liveChallenges.map((challenge, index) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </View>

        {/* Leaderboard Preview - Inspired by gaming leaderboards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            <Text style={styles.sectionSubtitle}>Top performers this week</Text>
          </View>
          <View style={styles.leaderboard}>
            {leaderboard.slice(0, 3).map((entry, index) => (
              <View
                key={entry.rank}
                style={[
                  styles.leaderItem,
                  entry.highlight && styles.leaderItemHighlight
                ]}
              >
                <View style={styles.leaderLeft}>
                  <View style={[
                    styles.rankCircle,
                    entry.rank <= 3 && styles.rankCircleTop
                  ]}>
                    <Text style={styles.rankText}>{entry.rank}</Text>
                  </View>
                  <Text style={styles.leaderAvatar}>{entry.avatar}</Text>
                  <View style={styles.leaderInfo}>
                    <Text style={styles.leaderName}>{entry.name}</Text>
                    <View style={styles.trendIndicator}>
                      <Ionicons 
                        name={entry.trend === "up" ? "trending-up" : "trending-down"} 
                        size={12} 
                        color={entry.trend === "up" ? COLORS.success : COLORS.error} 
                      />
                      <Text style={[
                        styles.trendText,
                        { color: entry.trend === "up" ? COLORS.success : COLORS.error }
                      ]}>
                        {entry.change}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.leaderPoints}>{entry.points}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Achievements - Inspired by LinkedIn accomplishments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
            <Text style={styles.sectionSubtitle}>Your latest accomplishments</Text>
          </View>
          {achievements.map((achievement, index) => (
            <AchievementCard key={achievement.title} achievement={achievement} />
          ))}
        </View>

        {/* CTA Button - Inspired by fitness app CTAs */}
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => router.push("/shared/LeaderBoard")}
        >
          <LinearGradient colors={GRADIENTS.premium} style={styles.ctaGradient}>
            <Text style={styles.ctaText}>View Full Leaderboard</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },
  heroContent: {
    marginTop: 10,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rankText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
    marginLeft: 4,
  },
  levelContainer: {
    marginBottom: 20,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  levelLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  levelXp: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
  },
  progressContainer: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  heroStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
  },
  heroStat: {
    alignItems: "center",
    flex: 1,
  },
  heroStatValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  heroStatLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
  },
  heroStatTrend: {
    color: COLORS.accentGold,
    fontSize: 10,
    fontWeight: "700",
  },
  heroStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  actionsRow: {
    paddingRight: 20,
  },
  actionCard: {
    width: 140,
    height: 140,
    borderRadius: 20,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  actionGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFFFFF",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "800",
  },
  actionLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  actionHelper: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCardWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  trendBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  miniProgress: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  miniProgressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  badgesRow: {
    paddingRight: 20,
  },
  badgeCardWrapper: {
    marginRight: 12,
  },
  badgeCard: {
    width: 160,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  badgeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeCount: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeCountText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  badgeTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  badgeDetail: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  badgeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgePoints: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  tierBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tierText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  challengeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  challengeTitleSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  challengeTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.textTertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 4,
  },
  challengeDetail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
    lineHeight: 18,
  },
  challengeReward: {
    fontSize: 13,
    color: COLORS.accentGold,
    fontWeight: "700",
    marginBottom: 12,
  },
  challengeProgress: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: "600",
  },
  progressPercent: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  participants: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantsText: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginLeft: 4,
  },
  leaderboard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  leaderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  leaderItemHighlight: {
    backgroundColor: "#F1FBF7",
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  leaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rankCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankCircleTop: {
    backgroundColor: COLORS.accentGold,
  },
  leaderAvatar: {
    fontSize: 20,
    marginRight: 8,
  },
  leaderInfo: {
    flex: 1,
  },
  leaderName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  trendIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  leaderPoints: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    minWidth: 50,
    textAlign: "right",
  },
  achievementCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  achievementMain: {
    flexDirection: "row",
    alignItems: "center",
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  achievementDetail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  xpBadge: {
    backgroundColor: COLORS.accentGold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  xpText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  ctaButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    marginTop: 8,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  bottomSpacer: {
    height: 20,
  },
});