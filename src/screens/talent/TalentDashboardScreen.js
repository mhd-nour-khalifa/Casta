import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { mockRequests } from '../../data/mockData';
import colors from '../../constants/colors';

const TalentDashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const stats = {
    totalProjects: user?.totalProjects || 18,
    activeRequests: mockRequests.length,
    rating: user?.rating || 4.8,
    earnings: 45000, // Mock earnings
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Welcome back,</Text>
          <Text style={styles.headerName}>{user?.fullName || 'Talent'}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications" size={24} color={colors.common.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Messages')}
          >
            <Ionicons name="mail" size={24} color={colors.common.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <LinearGradient
              colors={[colors.talent.primary, colors.talent.secondary]}
              style={styles.statCard}
            >
              <Ionicons name="briefcase" size={32} color={colors.common.white} />
              <Text style={styles.statNumber}>{stats.totalProjects}</Text>
              <Text style={styles.statLabel}>Projects Done</Text>
            </LinearGradient>

            <LinearGradient
              colors={[colors.status.success, '#34D399']}
              style={styles.statCard}
            >
              <Ionicons name="mail-unread" size={32} color={colors.common.white} />
              <Text style={styles.statNumber}>{stats.activeRequests}</Text>
              <Text style={styles.statLabel}>Active Requests</Text>
            </LinearGradient>
          </View>

          <View style={styles.statsRow}>
            <LinearGradient
              colors={[colors.rating.star, '#FCD34D']}
              style={styles.statCard}
            >
              <Ionicons name="star" size={32} color={colors.common.white} />
              <Text style={styles.statNumber}>{stats.rating}</Text>
              <Text style={styles.statLabel}>Average Rating</Text>
            </LinearGradient>

            <LinearGradient
              colors={[colors.company.primary, colors.company.secondary]}
              style={styles.statCard}
            >
              <Ionicons name="cash" size={32} color={colors.common.white} />
              <Text style={styles.statNumber}>{stats.earnings.toLocaleString()}</Text>
              <Text style={styles.statLabel}>SAR This Month</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('RequestsTab')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.talent.light }]}>
                <Ionicons name="mail" size={28} color={colors.talent.primary} />
              </View>
              <Text style={styles.actionText}>View Requests</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('CalendarTab')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.company.light }]}>
                <Ionicons name="calendar" size={28} color={colors.company.primary} />
              </View>
              <Text style={styles.actionText}>My Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('ProfileTab')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.status.warning + '20' }]}>
                <Ionicons name="person" size={28} color={colors.status.warning} />
              </View>
              <Text style={styles.actionText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Messages')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.status.success + '20' }]}>
                <Ionicons name="chatbubbles" size={28} color={colors.status.success} />
              </View>
              <Text style={styles.actionText}>Messages</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="checkmark-circle" size={24} color={colors.status.success} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Request Accepted</Text>
              <Text style={styles.activityDescription}>
                Summer Fashion Campaign 2025
              </Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="star" size={24} color={colors.rating.star} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New Review</Text>
              <Text style={styles.activityDescription}>
                Elite Productions rated you 5.0 stars
              </Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>

        {/* Logout Button (for demo) */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.status.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  headerGreeting: {
    fontSize: 14,
    color: colors.common.textLight,
  },
  headerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.common.text,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.status.error,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.common.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.common.white,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.common.white,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.common.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.common.text,
    textAlign: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: colors.common.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  activityIcon: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.common.text,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.common.textLight,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: colors.common.textLight,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.status.error,
    borderRadius: 8,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.status.error,
  },
});

export default TalentDashboardScreen;
