import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import colors from '../../constants/colors';

const TalentProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { label: 'Full Name', value: user?.fullNameEnglish || 'N/A', icon: 'person' },
        { label: 'Phone Number', value: user?.mobile || 'N/A', icon: 'call' },
        { label: 'Email', value: user?.email || 'Not provided', icon: 'mail' },
        { label: 'City', value: user?.city || 'N/A', icon: 'location' },
      ],
    },
    {
      title: 'Professional Details',
      items: [
        { label: 'Age', value: user?.age || 'N/A', icon: 'calendar' },
        { label: 'Gender', value: user?.gender || 'N/A', icon: 'male-female' },
        { label: 'Nationality', value: user?.nationality || 'N/A', icon: 'flag' },
        { label: 'Work Preference', value: user?.workPreference || 'N/A', icon: 'briefcase' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Profile */}
      <LinearGradient
        colors={[colors.talent.primary, colors.talent.secondary]}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={colors.common.white} />
          </View>
          <Text style={styles.profileName}>
            {user?.fullNameEnglish || 'Talent User'}
          </Text>
          <Text style={styles.profileSubtitle}>
            {user?.city || 'Location'} • {user?.nationality || 'Nationality'}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.projectsCompleted || 0}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.rating || 0}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <View
                  key={itemIndex}
                  style={[
                    styles.infoRow,
                    itemIndex < section.items.length - 1 && styles.infoRowBorder,
                  ]}
                >
                  <View style={styles.infoLeft}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={colors.talent.primary}
                    />
                    <Text style={styles.infoLabel}>{item.label}</Text>
                  </View>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Availability Section */}
        {user?.availability && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.sectionContent}>
              <View style={styles.availabilityContainer}>
                {Object.entries(user.availability).map(([day, available]) => (
                  <View
                    key={day}
                    style={[
                      styles.dayChip,
                      available && styles.dayChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayChipText,
                        available && styles.dayChipTextActive,
                      ]}
                    >
                      {day.substring(0, 3)}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Ionicons
                    name="airplane"
                    size={20}
                    color={colors.talent.primary}
                  />
                  <Text style={styles.infoLabel}>Willing to Travel</Text>
                </View>
                <Text style={styles.infoValue}>
                  {user?.willingToTravel ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionLeft}>
                <Ionicons name="create" size={20} color={colors.common.text} />
                <Text style={styles.actionText}>Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionLeft}>
                <Ionicons name="settings" size={20} color={colors.common.text} />
                <Text style={styles.actionText}>Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionLeft}>
                <Ionicons name="help-circle" size={20} color={colors.common.text} />
                <Text style={styles.actionText}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <View style={styles.actionLeft}>
                <Ionicons name="log-out" size={20} color={colors.status.error} />
                <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Member since {new Date(user?.registrationDate).toLocaleDateString() || 'N/A'}
          </Text>
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
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.common.white,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.common.white,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: colors.common.white,
    opacity: 0.9,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.common.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.common.white,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.common.darkGray,
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.common.text,
  },
  availabilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.common.lightGray,
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  dayChipActive: {
    backgroundColor: colors.talent.light,
    borderColor: colors.talent.primary,
  },
  dayChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.common.gray,
  },
  dayChipTextActive: {
    color: colors.talent.primary,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 15,
    color: colors.common.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: colors.status.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    color: colors.common.gray,
  },
});

export default TalentProfileScreen;
