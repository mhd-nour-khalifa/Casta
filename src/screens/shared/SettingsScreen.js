import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import colors from '../../constants/colors';

const SettingsScreen = ({ navigation, route }) => {
  const { user, logout } = useContext(AuthContext);
  const isCompany = user?.role === 'company';
  const primaryColor = isCompany ? colors.company.primary : colors.talent.primary;

  // Settings state
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    projectUpdates: true,
    messages: true,
    marketing: false,
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: 'English',
  });

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
            logout();
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.common.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionContent}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={notifications.push}
                onValueChange={(val) => setNotifications({ ...notifications, push: val })}
                trackColor={{ false: colors.common.gray, true: primaryColor }}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="mail" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>Email Notifications</Text>
              </View>
              <Switch
                value={notifications.email}
                onValueChange={(val) => setNotifications({ ...notifications, email: val })}
                trackColor={{ false: colors.common.gray, true: primaryColor }}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="chatbubble" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>SMS Notifications</Text>
              </View>
              <Switch
                value={notifications.sms}
                onValueChange={(val) => setNotifications({ ...notifications, sms: val })}
                trackColor={{ false: colors.common.gray, true: primaryColor }}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="briefcase" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>
                  {isCompany ? 'Project Updates' : 'Casting Updates'}
                </Text>
              </View>
              <Switch
                value={notifications.projectUpdates}
                onValueChange={(val) =>
                  setNotifications({ ...notifications, projectUpdates: val })
                }
                trackColor={{ false: colors.common.gray, true: primaryColor }}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="chatbubbles" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>Messages</Text>
              </View>
              <Switch
                value={notifications.messages}
                onValueChange={(val) =>
                  setNotifications({ ...notifications, messages: val })
                }
                trackColor={{ false: colors.common.gray, true: primaryColor }}
              />
            </View>

            <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
              <View style={styles.settingLeft}>
                <Ionicons name="megaphone" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>Marketing & Promotions</Text>
              </View>
              <Switch
                value={notifications.marketing}
                onValueChange={(val) =>
                  setNotifications({ ...notifications, marketing: val })
                }
                trackColor={{ false: colors.common.gray, true: primaryColor }}
              />
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="language" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>Language</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>{preferences.language}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
              </View>
            </TouchableOpacity>

            <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
              <View style={styles.settingLeft}>
                <Ionicons name="moon" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={preferences.darkMode}
                onValueChange={(val) => setPreferences({ ...preferences, darkMode: val })}
                trackColor={{ false: colors.common.gray, true: primaryColor }}
              />
            </View>
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="lock-closed" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="eye-off" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>Privacy Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]}>
              <View style={styles.settingLeft}>
                <Ionicons name="shield-checkmark" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="document-text" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>Terms of Service</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="shield" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]}>
              <View style={styles.settingLeft}>
                <Ionicons name="information-circle" size={20} color={primaryColor} />
                <Text style={styles.settingLabel}>App Version</Text>
              </View>
              <Text style={styles.settingValue}>1.0.0</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
              <View style={styles.settingLeft}>
                <Ionicons name="log-out" size={20} color={colors.status.warning} />
                <Text style={[styles.settingLabel, styles.warningText]}>Logout</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingRow, { borderBottomWidth: 0 }]}
              onPress={handleDeleteAccount}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="trash" size={20} color={colors.status.error} />
                <Text style={[styles.settingLabel, styles.dangerText]}>Delete Account</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
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
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.white,
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    color: colors.common.text,
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: colors.common.darkGray,
    marginRight: 8,
  },
  warningText: {
    color: colors.status.warning,
  },
  dangerText: {
    color: colors.status.error,
  },
});

export default SettingsScreen;
