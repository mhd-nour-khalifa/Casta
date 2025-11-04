import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../contexts/AuthContext';
import colors from '../../constants/colors';

const CompanyProjectsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, completed

  const loadProjects = async () => {
    try {
      const projectsData = await AsyncStorage.getItem('@casta_projects');
      if (projectsData) {
        const allProjects = JSON.parse(projectsData);
        // Filter projects by current company
        const myProjects = allProjects.filter((p) => p.companyId === user?.id);
        setProjects(myProjects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  useEffect(() => {
    loadProjects();

    const unsubscribe = navigation.addListener('focus', () => {
      loadProjects();
    });

    return unsubscribe;
  }, [navigation, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
  };

  const getFilteredProjects = () => {
    if (filter === 'all') return projects;
    return projects.filter((p) => p.status === filter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return colors.status.success;
      case 'completed':
        return colors.common.darkGray;
      case 'cancelled':
        return colors.status.error;
      default:
        return colors.common.gray;
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'active':
        return colors.status.successLight;
      case 'completed':
        return colors.common.borderLight;
      case 'cancelled':
        return colors.status.errorLight;
      default:
        return colors.common.background;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'TBD') return 'TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const renderProjectCard = (project) => (
    <TouchableOpacity
      key={project.id}
      style={styles.projectCard}
      onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
      activeOpacity={0.7}
    >
      <View style={styles.projectHeader}>
        <View style={styles.projectTypeContainer}>
          <Ionicons name="film" size={16} color={colors.company.primary} />
          <Text style={styles.projectType}>{project.projectType}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusBgColor(project.status) },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(project.status) }]}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.projectTitle} numberOfLines={2}>
        {project.title}
      </Text>

      <Text style={styles.projectDescription} numberOfLines={2}>
        {project.description}
      </Text>

      <View style={styles.projectDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={14} color={colors.common.darkGray} />
          <Text style={styles.detailText}>{project.city}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={14} color={colors.common.darkGray} />
          <Text style={styles.detailText}>
            {formatDate(project.startDate)}
            {project.endDate && ` - ${formatDate(project.endDate)}`}
          </Text>
        </View>
      </View>

      <View style={styles.projectFooter}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={16} color={colors.common.darkGray} />
            <Text style={styles.statText}>{project.views || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="people" size={16} color={colors.company.primary} />
            <Text style={styles.statText}>{project.responses?.length || 0} responses</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
      </View>
    </TouchableOpacity>
  );

  const filteredProjects = getFilteredProjects();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Projects</Text>
          <Text style={styles.headerSubtitle}>
            {projects.length} total project{projects.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateProject')}
        >
          <Ionicons name="add-circle" size={32} color={colors.company.primary} />
        </TouchableOpacity>
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
              All ({projects.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'active' && styles.filterTabActive]}
            onPress={() => setFilter('active')}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === 'active' && styles.filterTabTextActive,
              ]}
            >
              Active ({projects.filter((p) => p.status === 'active').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'completed' && styles.filterTabActive]}
            onPress={() => setFilter('completed')}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === 'completed' && styles.filterTabTextActive,
              ]}
            >
              Completed ({projects.filter((p) => p.status === 'completed').length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Projects List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.company.primary}
            colors={[colors.company.primary]}
          />
        }
      >
        {filteredProjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={64} color={colors.common.gray} />
            <Text style={styles.emptyStateTitle}>
              {filter === 'all' ? 'No Projects Yet' : `No ${filter} projects`}
            </Text>
            <Text style={styles.emptyStateText}>
              {filter === 'all'
                ? 'Start by creating your first casting call'
                : `You don't have any ${filter} projects`}
            </Text>
            {filter === 'all' && (
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreateProject')}
              >
                <Text style={styles.createButtonText}>Create Project</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.projectsList}>
            {filteredProjects.map(renderProjectCard)}
            <View style={{ height: 20 }} />
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.common.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.common.darkGray,
    marginTop: 2,
  },
  addButton: {
    padding: 4,
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
    backgroundColor: colors.company.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.common.darkGray,
  },
  filterTabTextActive: {
    color: colors.common.white,
  },
  scrollView: {
    flex: 1,
  },
  projectsList: {
    padding: 16,
  },
  projectCard: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  projectType: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.company.primary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    color: colors.common.darkGray,
    lineHeight: 20,
    marginBottom: 12,
  },
  projectDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: colors.common.darkGray,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.common.border,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: colors.common.darkGray,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.common.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.common.darkGray,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: colors.company.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.common.white,
  },
});

export default CompanyProjectsScreen;
