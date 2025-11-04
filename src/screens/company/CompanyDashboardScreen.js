import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');

const CompanyDashboardScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const stats = [
    {
      label: 'Active Projects',
      value: user?.activeProjects || 0,
      icon: 'briefcase',
      color: colors.company.primary,
    },
    {
      label: 'Total Responses',
      value: user?.totalResponses || 0,
      icon: 'people',
      color: colors.status.success,
    },
    {
      label: 'Hired Talents',
      value: user?.hiredTalents || 0,
      icon: 'checkmark-circle',
      color: colors.status.warning,
    },
    {
      label: 'Total Projects',
      value: user?.totalProjects || 0,
      icon: 'star',
      color: colors.talent.primary,
    },
  ];

  const quickActions = [
    {
      title: 'Create Casting Call',
      description: 'Post a new project',
      icon: 'add-circle',
      color: colors.company.primary,
      onPress: () => navigation.navigate('CreateProject'),
    },
    {
      title: 'Browse Talents',
      description: 'Search talent pool',
      icon: 'search',
      color: colors.talent.primary,
      onPress: () => navigation.navigate('TalentPool'),
    },
    {
      title: 'My Projects',
      description: 'View all projects',
      icon: 'folder-open',
      color: colors.status.info,
      onPress: () => navigation.navigate('CompanyProjects'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Company Info */}
      <LinearGradient
        colors={[colors.company.primary, colors.company.secondary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.companyName}>
              {user?.companyName || 'Company'}
            </Text>
            <Text style={styles.companyType}>
              {user?.companyType || 'Production House'}
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="business" size={48} color={colors.common.white} />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View
                  style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}
                >
                  <Ionicons name={stat.icon} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                <Ionicons name={action.icon} size={28} color={action.color} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {user?.totalProjects === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="clipboard-outline" size={64} color={colors.common.gray} />
              <Text style={styles.emptyStateTitle}>No Activity Yet</Text>
              <Text style={styles.emptyStateText}>
                Start by creating your first casting call
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('CreateProject')}
              >
                <LinearGradient
                  colors={[colors.company.primary, colors.company.secondary]}
                  style={styles.emptyStateButtonGradient}
                >
                  <Ionicons name="add-circle" size={20} color={colors.common.white} />
                  <Text style={styles.emptyStateButtonText}>Create Project</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.activityList}>
              <Text style={styles.comingSoonText}>Recent activity will appear here</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: colors.common.white,
    opacity: 0.9,
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.common.white,
    marginTop: 4,
    marginBottom: 4,
  },
  companyType: {
    fontSize: 14,
    color: colors.common.white,
    opacity: 0.85,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.common.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.company.primary,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.common.darkGray,
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.common.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: colors.common.darkGray,
  },
  emptyState: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.common.darkGray,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyStateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.common.white,
  },
  activityList: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 14,
    color: colors.common.darkGray,
  },
});

export default CompanyDashboardScreen;
