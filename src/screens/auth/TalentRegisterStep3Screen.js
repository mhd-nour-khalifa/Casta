import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { DAYS_OF_WEEK, WORK_PREFERENCES, NOTICE_PERIODS } from '../../constants/data';
import { AuthContext } from '../../contexts/AuthContext';

const TalentRegisterStep3Screen = ({ navigation, route }) => {
  const { step1Data, step2Data } = route.params || {};
  const { completeRegistration } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    availability: {},
    workPreference: '',
    noticePeriod: '',
    willingToTravel: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDay = (day) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: !formData.availability[day],
      },
    });
  };

  const handleComplete = async () => {
    // Check if at least one day is selected
    const selectedDays = Object.values(formData.availability).filter(Boolean).length;

    if (selectedDays === 0) {
      Alert.alert('Validation Error', 'Please select at least one available day');
      return;
    }

    if (!formData.workPreference) {
      Alert.alert('Validation Error', 'Please select your work preference');
      return;
    }

    if (!formData.noticePeriod) {
      Alert.alert('Validation Error', 'Please select your notice period');
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine all form data
      const completeData = {
        ...step1Data,
        ...step2Data,
        ...formData,
        registrationDate: new Date().toISOString(),
        profileComplete: true,
        status: 'active',
        rating: 0,
        projectsCompleted: 0,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Complete registration and login
      await completeRegistration(completeData, 'talent');

      Alert.alert(
        'Registration Complete! 🎉',
        'Welcome to Casta! Your profile has been created successfully.',
        [
          {
            text: 'Get Started',
            onPress: () => {
              // Navigation will be handled by AuthContext
              // User will be automatically navigated to TalentDashboard
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.talent.primary, colors.talent.secondary]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.common.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Talent Registration</Text>
        <View style={styles.headerPlaceholder} />
      </LinearGradient>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
        <Text style={styles.progressText}>Step 3 of 3 - Availability & Preferences</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Weekly Availability</Text>
          <Text style={styles.sectionDescription}>
            Select the days you're typically available for projects
          </Text>

          {/* Days Selection */}
          <View style={styles.daysContainer}>
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  formData.availability[day] && styles.dayButtonSelected,
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    formData.availability[day] && styles.dayButtonTextSelected,
                  ]}
                >
                  {day.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Work Preferences</Text>

          {/* Work Preference */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Preferred Work Type <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionsContainer}>
              {WORK_PREFERENCES.map((preference) => (
                <TouchableOpacity
                  key={preference}
                  style={[
                    styles.optionButton,
                    formData.workPreference === preference && styles.optionButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, workPreference: preference })}
                >
                  <View style={styles.radioButton}>
                    {formData.workPreference === preference && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionButtonText,
                      formData.workPreference === preference && styles.optionButtonTextSelected,
                    ]}
                  >
                    {preference}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notice Period */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Notice Period <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.hint}>
              How much advance notice do you typically need?
            </Text>
            <View style={styles.optionsContainer}>
              {NOTICE_PERIODS.map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.optionButton,
                    formData.noticePeriod === period && styles.optionButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, noticePeriod: period })}
                >
                  <View style={styles.radioButton}>
                    {formData.noticePeriod === period && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionButtonText,
                      formData.noticePeriod === period && styles.optionButtonTextSelected,
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Willing to Travel */}
          <View style={styles.switchContainer}>
            <View style={styles.switchLabel}>
              <Ionicons name="airplane" size={20} color={colors.talent.primary} />
              <View style={styles.switchLabelText}>
                <Text style={styles.switchLabelTitle}>Willing to Travel</Text>
                <Text style={styles.switchLabelDescription}>
                  Work in other cities within Saudi Arabia
                </Text>
              </View>
            </View>
            <Switch
              value={formData.willingToTravel}
              onValueChange={(value) =>
                setFormData({ ...formData, willingToTravel: value })
              }
              trackColor={{ false: colors.common.gray, true: colors.talent.secondary }}
              thumbColor={
                formData.willingToTravel ? colors.talent.primary : colors.common.lightGray
              }
            />
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={colors.talent.primary} />
            <Text style={styles.infoText}>
              Your availability can be updated anytime from your profile settings. Companies
              will see this information when considering you for projects.
            </Text>
          </View>

          <View style={styles.spacer} />
        </View>
      </ScrollView>

      {/* Complete Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.completeButton, isSubmitting && styles.completeButtonDisabled]}
          onPress={handleComplete}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={[colors.talent.primary, colors.talent.secondary]}
            style={styles.completeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isSubmitting ? (
              <Text style={styles.completeButtonText}>Creating Your Profile...</Text>
            ) : (
              <>
                <Text style={styles.completeButtonText}>Complete Registration</Text>
                <Ionicons name="checkmark-circle" size={20} color={colors.common.white} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.common.lightGray,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.common.gray,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.talent.primary,
  },
  progressText: {
    fontSize: 12,
    color: colors.common.darkGray,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.common.black,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.common.darkGray,
    marginBottom: 20,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: colors.common.lightGray,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.common.border,
  },
  dayButtonSelected: {
    backgroundColor: colors.talent.primary,
    borderColor: colors.talent.primary,
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.common.gray,
  },
  dayButtonTextSelected: {
    color: colors.common.white,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.common.black,
    marginBottom: 8,
  },
  required: {
    color: colors.status.error,
  },
  hint: {
    fontSize: 12,
    color: colors.common.gray,
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.common.lightGray,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.common.border,
  },
  optionButtonSelected: {
    backgroundColor: colors.talent.light,
    borderColor: colors.talent.primary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.common.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.talent.primary,
  },
  optionButtonText: {
    fontSize: 15,
    color: colors.common.darkGray,
    fontWeight: '500',
  },
  optionButtonTextSelected: {
    color: colors.talent.primary,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.common.lightGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchLabelText: {
    marginLeft: 12,
    flex: 1,
  },
  switchLabelTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.common.black,
    marginBottom: 2,
  },
  switchLabelDescription: {
    fontSize: 12,
    color: colors.common.gray,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.talent.light,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.common.darkGray,
    marginLeft: 10,
    lineHeight: 18,
  },
  spacer: {
    height: 20,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: colors.common.white,
    borderTopWidth: 1,
    borderTopColor: colors.common.border,
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeButtonDisabled: {
    opacity: 0.6,
  },
  completeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.common.white,
    marginRight: 10,
  },
});

export default TalentRegisterStep3Screen;
