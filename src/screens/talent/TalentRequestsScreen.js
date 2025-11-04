import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../constants/colors';

const TalentRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Load projects from AsyncStorage
  const loadProjects = async () => {
    try {
      const projectsData = await AsyncStorage.getItem('@casta_projects');
      if (projectsData) {
        const projects = JSON.parse(projectsData);
        // Transform projects to match the expected format
        const transformedRequests = projects
          .filter((p) => p.status === 'active')
          .map((project) => ({
            id: project.id,
            projectName: project.title,
            projectType: project.projectType,
            companyName: project.companyName,
            location: project.city,
            shootingDates: {
              start: project.startDate || 'TBD',
              end: project.endDate || 'TBD',
            },
            compensation: project.compensation,
            requirements: project.requirements.gender
              ? `${project.requirements.gender}${
                  project.requirements.ageMin
                    ? `, ${project.requirements.ageMin}-${project.requirements.ageMax || '+'} years`
                    : ''
                }`
              : 'Open to all',
            description: project.description,
            // Calculate expiry based on response time limit
            expiresAt: new Date(
              new Date(project.createdAt).getTime() +
                project.responseTimeLimit * 60000
            ).toISOString(),
            viewed: false,
          }));
        setRequests(transformedRequests);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  // Load projects on mount
  useEffect(() => {
    loadProjects();

    // Set up listener for when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadProjects();
    });

    return unsubscribe;
  }, [navigation]);

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
  };

  // Calculate remaining time for each request
  const calculateTimeRemaining = (expiresAt) => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;

    if (diff <= 0) return { expired: true, display: 'Expired' };

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return {
      expired: false,
      minutes,
      seconds,
      display: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      urgent: minutes < 5,
    };
  };

  const [, setTick] = useState(0);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAccept = (request) => {
    Alert.alert(
      'Accept Request',
      `Accept casting for "${request.projectName}"?\n\nDates will be blocked in your calendar.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            Alert.alert('Success', 'Request accepted! Company will contact you soon.');
            // Remove from list (in real app, update backend)
            setRequests(requests.filter((r) => r.id !== request.id));
          },
        },
      ]
    );
  };

  const handleDecline = (request) => {
    Alert.alert(
      'Decline Request',
      `Are you sure you want to decline "${request.projectName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            setRequests(requests.filter((r) => r.id !== request.id));
          },
        },
      ]
    );
  };

  const renderRequestCard = (request) => {
    const timeInfo = calculateTimeRemaining(request.expiresAt);

    return (
      <View key={request.id} style={styles.requestCard}>
        {/* Header with Timer */}
        <View style={styles.requestHeader}>
          <View style={styles.projectTypeBadge}>
            <Text style={styles.badgeText}>{request.projectType}</Text>
          </View>
          <View
            style={[
              styles.timerBadge,
              timeInfo.expired && styles.timerExpired,
              timeInfo.urgent && styles.timerUrgent,
            ]}
          >
            <Ionicons
              name="time"
              size={16}
              color={timeInfo.expired || timeInfo.urgent ? colors.common.white : colors.common.text}
            />
            <Text
              style={[
                styles.timerText,
                (timeInfo.expired || timeInfo.urgent) && { color: colors.common.white },
              ]}
            >
              {timeInfo.display}
            </Text>
          </View>
        </View>

        {/* Project Info */}
        <Text style={styles.projectName}>{request.projectName}</Text>
        <Text style={styles.companyName}>{request.companyName}</Text>

        <View style={styles.divider} />

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={colors.common.textLight} />
            <Text style={styles.detailText}>
              {request.shootingDates.start} - {request.shootingDates.end}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={colors.common.textLight} />
            <Text style={styles.detailText}>{request.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="cash" size={16} color={colors.common.textLight} />
            <Text style={styles.detailText}>{request.compensation}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="list" size={16} color={colors.common.textLight} />
            <Text style={styles.detailText}>{request.requirements}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {request.description}
        </Text>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() =>
              navigation.navigate('RequestDetail', { requestId: request.id })
            }
          >
            <Text style={styles.viewDetailsText}>View Full Details</Text>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => handleDecline(request)}
              disabled={timeInfo.expired}
            >
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.acceptButton,
                timeInfo.expired && styles.buttonDisabled,
              ]}
              onPress={() => handleAccept(request)}
              disabled={timeInfo.expired}
            >
              <Text style={styles.acceptButtonText}>
                {timeInfo.expired ? 'Expired' : 'Accept'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {request.viewed && (
          <View style={styles.viewedBadge}>
            <Ionicons name="eye" size={12} color={colors.status.info} />
            <Text style={styles.viewedText}>
              Viewed {Math.floor((Date.now() - request.viewedAt) / 60000)} min ago
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Casting Requests</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{requests.length} Active</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === 'all' && styles.filterTabTextActive,
              ]}
            >
              All ({requests.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'urgent' && styles.filterTabActive]}
            onPress={() => setFilter('urgent')}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === 'urgent' && styles.filterTabTextActive,
              ]}
            >
              Urgent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'viewed' && styles.filterTabActive]}
            onPress={() => setFilter('viewed')}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === 'viewed' && styles.filterTabTextActive,
              ]}
            >
              Viewed
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Requests List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.talent.primary}
            colors={[colors.talent.primary]}
          />
        }
      >
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="mail-open" size={64} color={colors.common.textLight} />
            <Text style={styles.emptyStateTitle}>No Active Requests</Text>
            <Text style={styles.emptyStateText}>
              New casting opportunities will appear here.{'\n'}
              Pull down to refresh.
            </Text>
          </View>
        ) : (
          <View style={styles.requestsList}>
            {requests.map(renderRequestCard)}
            <View style={{ height: 20 }} />
          </View>
        )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.common.text,
  },
  headerBadge: {
    backgroundColor: colors.talent.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.talent.primary,
  },
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.common.background,
  },
  filterTabActive: {
    backgroundColor: colors.talent.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.common.textLight,
  },
  filterTabTextActive: {
    color: colors.common.white,
  },
  scrollView: {
    flex: 1,
  },
  requestsList: {
    padding: 16,
  },
  requestCard: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.common.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectTypeBadge: {
    backgroundColor: colors.projectTypes.advertisement + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.projectTypes.advertisement,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.common.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  timerUrgent: {
    backgroundColor: colors.status.error,
  },
  timerExpired: {
    backgroundColor: colors.common.textLight,
  },
  timerText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.common.text,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: colors.common.textLight,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.common.border,
    marginVertical: 12,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.common.text,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: colors.common.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  viewDetailsButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.talent.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.common.border,
    alignItems: 'center',
  },
  declineButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.common.text,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.talent.primary,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.common.white,
  },
  buttonDisabled: {
    backgroundColor: colors.common.textLight,
    opacity: 0.5,
  },
  viewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.common.border,
  },
  viewedText: {
    fontSize: 11,
    color: colors.common.textLight,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.common.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.common.textLight,
    textAlign: 'center',
  },
});

export default TalentRequestsScreen;
