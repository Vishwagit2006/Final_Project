//shared->Rewards.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = {
  primary: "#1A6B54",
  primaryLight: "#2D957A",
  primaryDark: "#0F4F3A",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textTertiary: "#94A3B8",
  accentGold: "#D97706",
  accentBlue: "#4A90E2",
  accentPurple: "#7C3AED",
  accentEmerald: "#059669",
};

const GRADIENTS = {
  hero: [COLORS.primary, COLORS.primaryLight],
  gold: ["#D97706", "#F59E0B"],
  purple: ["#7C3AED", "#8B5CF6"],
  blue: ["#4A90E2", "#60A5FA"],
  emerald: ["#059669", "#34D399"],
};

const INITIAL_REWARDS = {
  summary: {
    streakBonus: "+320 XP",
    totalPoints: 5840,
  },
  available: [
    {
      id: "rw1",
      title: "Impact Booster Pack",
      detail: "Unlock premium analytics and +150 XP",
      cost: "750 pts",
      bonus: "+150 XP",
      gradient: GRADIENTS.purple,
      expiresIn: "3 days left",
      tier: "Premium",
      claimColor: COLORS.accentPurple,
    },
    {
      id: "rw2",
      title: "Community Spotlight",
      detail: "Get featured in this week's sustainability spotlight",
      cost: "540 pts",
      bonus: "+80 XP",
      gradient: GRADIENTS.blue,
      expiresIn: "Ends Sunday",
      tier: "Featured",
      claimColor: COLORS.accentBlue,
    },
    {
      id: "rw3",
      title: "Zero-Waste Merchandise",
      detail: "Limited tote made from rescued fabric",
      cost: "1,200 pts",
      bonus: "+120 XP",
      gradient: GRADIENTS.emerald,
      expiresIn: "Low stock",
      tier: "Limited",
      claimColor: COLORS.accentEmerald,
    }
  ],
  claimed: [
    {
      id: "cr1",
      title: "Carbon Offset Badge",
      value: "Saved 300kg CO₂",
      claimedOn: "Nov 28",
      color: COLORS.accentGold
    },
    {
      id: "cr2",
      title: "Community Builder Pass",
      value: "Hosted 2 impact meetups",
      claimedOn: "Nov 18",
      color: COLORS.accentBlue
    },
    {
      id: "cr3",
      title: "Rapid Responder",
      value: "Cleared 5 urgent requests",
      claimedOn: "Oct 30",
      color: COLORS.accentEmerald
    }
  ],
  tiers: [
    {
      id: "tier1",
      name: "Explorer",
      requirement: "0 - 999 pts",
      perks: ["Monthly perks", "Basic analytics"],
      color: COLORS.textSecondary
    },
    {
      id: "tier2",
      name: "Guardian",
      requirement: "1,000 - 2,499 pts",
      perks: ["Priority rewards", "Community highlights"],
      color: COLORS.accentBlue
    },
    {
      id: "tier3",
      name: "Champion",
      requirement: "2,500+ pts",
      perks: ["Limited drops", "Invite-only missions"],
      color: COLORS.accentGold
    }
  ]
};

const formatPoints = (value) => value.toLocaleString();

const parsePointsFromString = (label) => {
  const digits = label.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
};

const formatClaimDate = (date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const RewardCard = ({ reward, onClaim }) => (
  <LinearGradient colors={reward.gradient} style={styles.rewardCard}>
    <View style={styles.rewardHeader}>
      <View style={styles.rewardTag}>
        <Ionicons name="gift" size={12} color="#fff" />
        <Text style={styles.rewardTagText}>{reward.tier}</Text>
      </View>
      <Text style={styles.rewardExpiry}>{reward.expiresIn}</Text>
    </View>
    <Text style={styles.rewardTitle}>{reward.title}</Text>
    <Text style={styles.rewardDetail}>{reward.detail}</Text>
    <View style={styles.rewardMetaRow}>
      <View style={styles.rewardMeta}>
        <Text style={styles.rewardMetaLabel}>Cost</Text>
        <Text style={styles.rewardMetaValue}>{reward.cost}</Text>
      </View>
      <View style={styles.rewardMetaDivider} />
      <View style={styles.rewardMeta}>
        <Text style={styles.rewardMetaLabel}>Bonus</Text>
        <Text style={styles.rewardMetaValue}>{reward.bonus}</Text>
      </View>
    </View>
    <TouchableOpacity
      style={styles.rewardButton}
      activeOpacity={0.9}
      onPress={() => onClaim(reward)}
    >
      <Text style={styles.rewardButtonText}>Claim Reward</Text>
      <Ionicons name="arrow-forward" size={18} color={COLORS.primaryDark} />
    </TouchableOpacity>
  </LinearGradient>
);

const ClaimedReward = ({ reward }) => (
  <View style={styles.claimedRow}>
    <View style={[styles.claimedDot, { backgroundColor: reward.color }]} />
    <View style={styles.claimedInfo}>
      <Text style={styles.claimedTitle}>{reward.title}</Text>
      <Text style={styles.claimedDetail}>{reward.value}</Text>
    </View>
    <Text style={styles.claimedDate}>{reward.claimedOn}</Text>
  </View>
);

const TierCard = ({ tier }) => (
  <View style={styles.tierCard}>
    <View style={styles.tierHeader}>
      <Text style={[styles.tierName, { color: tier.color }]}>{tier.name}</Text>
      <Text style={styles.tierRequirement}>{tier.requirement}</Text>
    </View>
    {tier.perks.map((perk) => (
      <View key={perk} style={styles.perkRow}>
        <Ionicons name="checkmark-circle" size={16} color={tier.color} />
        <Text style={styles.perkText}>{perk}</Text>
      </View>
    ))}
  </View>
);

const ClaimRewardModal = ({
  visible,
  reward,
  claimState,
  onClose,
  onConfirm,
  lifetimePoints,
}) => {
  if (!reward) {
    return null;
  }

  const isSuccess = claimState === "success";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <LinearGradient colors={reward.gradient} style={styles.modalHero}>
            <View style={styles.modalTag}>
              <Ionicons name="gift" size={16} color="#fff" />
              <Text style={styles.modalTagText}>{reward.tier}</Text>
            </View>
            <Text style={styles.modalTitle}>
              {isSuccess ? "Reward Claimed" : reward.title}
            </Text>
            <Text style={styles.modalSubtitle}>
              {isSuccess
                ? "Great work! Points deducted and bonus XP added."
                : reward.detail}
            </Text>
            <View style={styles.modalMetaRow}>
              <View style={styles.modalMeta}>
                <Text style={styles.modalMetaLabel}>Cost</Text>
                <Text style={styles.modalMetaValue}>{reward.cost}</Text>
              </View>
              <View style={styles.modalMetaDivider} />
              <View style={styles.modalMeta}>
                <Text style={styles.modalMetaLabel}>Bonus</Text>
                <Text style={styles.modalMetaValue}>{reward.bonus}</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.modalBody}>
            <View style={styles.modalInfoRow}>
              <MaterialCommunityIcons
                name={isSuccess ? "check-decagram" : "lightning-bolt"}
                size={22}
                color={isSuccess ? COLORS.accentEmerald : COLORS.primary}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.modalInfoTitle}>
                  {isSuccess ? "Perk secured" : "Instant impact"}
                </Text>
                <Text style={styles.modalInfoCopy}>
                  {isSuccess
                    ? "You can view this reward in Claimed Timeline."
                    : "We’ll deduct points immediately and unlock this perk."}
                </Text>
              </View>
            </View>

            {isSuccess && (
              <View style={styles.balancePill}>
                <Text style={styles.balanceLabel}>Updated balance</Text>
                <Text style={styles.balanceValue}>{lifetimePoints} pts</Text>
              </View>
            )}

            <View style={styles.modalActions}>
              {isSuccess ? (
                <TouchableOpacity style={styles.modalPrimaryButton} onPress={onClose}>
                  <Text style={styles.modalPrimaryText}>Close</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity style={styles.modalGhostButton} onPress={onClose}>
                    <Text style={styles.modalGhostText}>Maybe Later</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalPrimaryButton}
                    onPress={onConfirm}
                  >
                    <Text style={styles.modalPrimaryText}>Confirm Claim</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function Rewards() {
  const router = useRouter();
  const timerRef = useRef(null);
  const [summary, setSummary] = useState(INITIAL_REWARDS.summary);
  const [availableRewards, setAvailableRewards] = useState(INITIAL_REWARDS.available);
  const [claimedRewards, setClaimedRewards] = useState(INITIAL_REWARDS.claimed);
  const [selectedReward, setSelectedReward] = useState(null);
  const [claimState, setClaimState] = useState("preview");
  const [modalVisible, setModalVisible] = useState(false);

  const availableCount = availableRewards.length;
  const claimedCount = claimedRewards.length;
  const formattedLifetimePoints = formatPoints(summary.totalPoints);

  const goBack = () => router.back();

  const handleClaimReward = (reward) => {
    setSelectedReward(reward);
    setClaimState("preview");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setClaimState("preview");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const confirmClaim = () => {
    if (!selectedReward) {
      return;
    }

    setAvailableRewards((prev) => prev.filter((item) => item.id !== selectedReward.id));

    setClaimedRewards((prev) => [
      {
        id: `cr-${Date.now()}`,
        title: selectedReward.title,
        value: selectedReward.detail,
        claimedOn: formatClaimDate(new Date()),
        color: selectedReward.claimColor || COLORS.accentGold,
      },
      ...prev,
    ]);

    setSummary((prev) => {
      const costValue = parsePointsFromString(selectedReward.cost);
      const nextPoints = Math.max(prev.totalPoints - costValue, 0);
      return { ...prev, totalPoints: nextPoints };
    });

    setClaimState("success");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setModalVisible(false);
      setClaimState("preview");
      timerRef.current = null;
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={GRADIENTS.hero} style={styles.hero}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroLabel}>Rewards Center</Text>
            <Text style={styles.heroTitle}>Unlock Premium Impact Perks</Text>
            <Text style={styles.heroSubtitle}>Turn circular actions into tangible perks</Text>
          </View>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{availableCount}</Text>
              <Text style={styles.heroStatLabel}>Available</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{claimedCount}</Text>
              <Text style={styles.heroStatLabel}>Claimed</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{summary.streakBonus}</Text>
              <Text style={styles.heroStatLabel}>Streak Bonus</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Rewards</Text>
            <Text style={styles.sectionSubtitle}>{formattedLifetimePoints} lifetime points</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rewardsRow}
          >
            {availableRewards.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <Ionicons name="checkmark-sharp" size={28} color="#fff" />
                <Text style={styles.emptyStateTitle}>All rewards secured</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Start a new mission to unlock fresh drops.
                </Text>
              </View>
            ) : (
              availableRewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} onClaim={handleClaimReward} />
              ))
            )}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Claimed Timeline</Text>
            <Text style={styles.sectionSubtitle}>{claimedCount} rewards unlocked</Text>
          </View>
          <View style={styles.claimedContainer}>
            {claimedRewards.map((reward) => (
              <ClaimedReward key={reward.id} reward={reward} />
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tier Benefits</Text>
            <Text style={styles.sectionSubtitle}>Climb tiers to access premium drops</Text>
          </View>
          <View style={styles.tierGrid}>
            {INITIAL_REWARDS.tiers.map((tier) => (
              <TierCard key={tier.id} tier={tier} />
            ))}
          </View>

          <TouchableOpacity style={styles.ctaButton}>
            <MaterialCommunityIcons name="lightning-bolt" size={18} color="#fff" />
            <Text style={styles.ctaText}>Start a new mission to earn points</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ClaimRewardModal
        visible={modalVisible}
        reward={selectedReward}
        claimState={claimState}
        onClose={closeModal}
        onConfirm={confirmClaim}
        lifetimePoints={formattedLifetimePoints}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 16,
  },
  heroTextBlock: {
    marginBottom: 20,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
  },
  heroStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  heroStat: {
    alignItems: "center",
    flex: 1,
  },
  heroStatValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  heroStatLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 4,
  },
  heroDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rewardsRow: {
    paddingVertical: 8,
  },
  emptyStateCard: {
    width: SCREEN_WIDTH * 0.75,
    borderRadius: 20,
    padding: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    gap: 8,
  },
  emptyStateTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  emptyStateSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    textAlign: "center",
  },
  rewardCard: {
    width: SCREEN_WIDTH * 0.72,
    marginRight: 16,
    borderRadius: 20,
    padding: 18,
  },
  rewardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  rewardTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rewardTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  rewardExpiry: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
  },
  rewardTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  rewardDetail: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
  },
  rewardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  rewardMeta: {
    flex: 1,
    alignItems: "center",
  },
  rewardMetaLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  rewardMetaValue: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },
  rewardMetaDivider: {
    width: 1,
    height: 26,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  rewardButton: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardButtonText: {
    color: COLORS.primaryDark,
    fontWeight: "700",
  },
  claimedContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
  },
  claimedRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  claimedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  claimedInfo: {
    flex: 1,
  },
  claimedTitle: {
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  claimedDetail: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  claimedDate: {
    color: COLORS.textTertiary,
    fontSize: 12,
  },
  tierGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  tierCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  tierHeader: {
    marginBottom: 10,
  },
  tierName: {
    fontSize: 16,
    fontWeight: "800",
  },
  tierRequirement: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  perkText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  ctaButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaText: {
    color: "#fff",
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15,23,42,0.65)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHero: {
    padding: 20,
  },
  modalTag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  modalTagText: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 18,
  },
  modalSubtitle: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  modalMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 14,
  },
  modalMeta: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalMetaLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalMetaValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  modalMetaDivider: {
    width: 1,
    height: "70%",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  modalBody: {
    padding: 20,
    gap: 18,
  },
  modalInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  modalInfoTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  modalInfoCopy: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  balancePill: {
    marginTop: -4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  balanceValue: {
    fontWeight: "800",
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalGhostButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalGhostText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  modalPrimaryButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  modalPrimaryText: {
    color: "#fff",
    fontWeight: "700",
  },
});
