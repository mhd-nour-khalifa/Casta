import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const SelectUserTypeScreen = ({ navigation }) => {
  const handleSelectType = (type) => {
    if (type === 'talent') {
      navigation.navigate('TalentRegisterStep1', { userType: 'talent' });
    } else {
      navigation.navigate('CompanyRegister', { userType: 'company' });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.common.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Join Casta</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>I am a...</Text>
        <Text style={styles.subtitle}>Select how you want to use Casta</Text>

        {/* Talent Option */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handleSelectType('talent')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={colors.talent.gradient}
            style={styles.gradientCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="person" size={40} color={colors.common.white} />
            </View>
            <Text style={styles.cardTitle}>Model / Talent</Text>
            <Text style={styles.cardDescription}>
              Looking for casting opportunities{'\n'}
              in ads, films, TV, and fashion
            </Text>
            <View style={styles.cardBadge}>
              <Text style={styles.badgeText}>FOR TALENTS</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Company Option */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handleSelectType('company')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={colors.company.gradient}
            style={styles.gradientCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="business" size={40} color={colors.common.white} />
            </View>
            <Text style={styles.cardTitle}>Production Company</Text>
            <Text style={styles.cardDescription}>
              Looking to cast talents for{'\n'}
              projects and productions
            </Text>
            <View style={styles.cardBadge}>
              <Text style={styles.badgeText}>FOR COMPANIES</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <SafeAreaView style={styles.footerSafeArea}>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PhoneLogin')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.background,
  },
  safeArea: {
    backgroundColor: colors.common.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.text,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.common.textLight,
    marginBottom: 32,
  },
  optionCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientCard: {
    padding: 20,
    minHeight: 180,
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.common.white,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: colors.common.white,
    opacity: 0.9,
    lineHeight: 22,
    marginBottom: 16,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.common.white,
    letterSpacing: 1,
  },
  footerSafeArea: {
    backgroundColor: colors.common.background,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
    backgroundColor: colors.common.background,
  },
  footerText: {
    fontSize: 14,
    color: colors.common.textLight,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.talent.primary,
  },
});

export default SelectUserTypeScreen;
