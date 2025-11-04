import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const TalentRegisterStep1Screen = ({ navigation, route }) => {
  const { phone } = route.params || {};
  const [formData, setFormData] = useState({
    mobile: phone || '',
    email: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validate mobile number (Saudi format)
    if (!formData.mobile || formData.mobile.length < 9) {
      newErrors.mobile = 'Please enter a valid Saudi mobile number';
    } else if (!formData.mobile.startsWith('5')) {
      newErrors.mobile = 'Mobile number must start with 5';
    }

    // Validate email (optional but must be valid if provided)
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Navigate to Step 2 with form data
      navigation.navigate('TalentRegisterStep2', {
        step1Data: formData,
      });
    } else {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
    }
  };

  const formatPhoneNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Limit to 9 digits
    const limited = cleaned.slice(0, 9);
    // Format as XXX XXX XXX
    let formatted = limited;
    if (limited.length > 3 && limited.length <= 6) {
      formatted = `${limited.slice(0, 3)} ${limited.slice(3)}`;
    } else if (limited.length > 6) {
      formatted = `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    }
    return formatted;
  };

  const handleMobileChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setFormData({ ...formData, mobile: text.replace(/\D/g, '') });
    if (errors.mobile) {
      setErrors({ ...errors, mobile: null });
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
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
        <Text style={styles.progressText}>Step 1 of 3 - Contact Information</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <Text style={styles.sectionDescription}>
            Please provide your contact information for verification
          </Text>

          {/* Mobile Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Mobile Number <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+966</Text>
              </View>
              <TextInput
                style={[
                  styles.phoneInput,
                  errors.mobile && styles.inputError,
                ]}
                placeholder="5XX XXX XXX"
                placeholderTextColor={colors.common.gray}
                keyboardType="phone-pad"
                value={formatPhoneNumber(formData.mobile)}
                onChangeText={handleMobileChange}
                maxLength={11} // Includes spaces
              />
            </View>
            {errors.mobile && (
              <Text style={styles.errorText}>{errors.mobile}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email Address <Text style={styles.optional}>(Optional)</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.email && styles.inputError,
              ]}
              placeholder="your.email@example.com"
              placeholderTextColor={colors.common.gray}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => {
                setFormData({ ...formData, email: text });
                if (errors.email) {
                  setErrors({ ...errors, email: null });
                }
              }}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <Text style={styles.hint}>
              We'll use this for important notifications and updates
            </Text>
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => {
                setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms });
                if (errors.terms) {
                  setErrors({ ...errors, terms: null });
                }
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  formData.agreeToTerms && styles.checkboxChecked,
                  errors.terms && styles.checkboxError,
                ]}
              >
                {formData.agreeToTerms && (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={colors.common.white}
                  />
                )}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms and Conditions</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && (
              <Text style={styles.errorText}>{errors.terms}</Text>
            )}
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle"
              size={20}
              color={colors.talent.primary}
            />
            <Text style={styles.infoText}>
              Your mobile number will be verified via OTP. Make sure it's active
              and can receive SMS messages.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.talent.primary, colors.talent.secondary]}
            style={styles.continueGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueButtonText}>Continue to Next Step</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.common.white} />
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
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
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
  optional: {
    color: colors.common.gray,
    fontSize: 12,
    fontWeight: '400',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    backgroundColor: colors.common.lightGray,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.common.black,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.common.lightGray,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    color: colors.common.black,
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  input: {
    backgroundColor: colors.common.lightGray,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    color: colors.common.black,
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  inputError: {
    borderColor: colors.status.error,
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 12,
    color: colors.status.error,
    marginTop: 5,
  },
  hint: {
    fontSize: 12,
    color: colors.common.gray,
    marginTop: 5,
  },
  termsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.common.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.talent.primary,
    borderColor: colors.talent.primary,
  },
  checkboxError: {
    borderColor: colors.status.error,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.common.darkGray,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.talent.primary,
    fontWeight: '600',
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
  bottomContainer: {
    padding: 20,
    backgroundColor: colors.common.white,
    borderTopWidth: 1,
    borderTopColor: colors.common.border,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.common.white,
    marginRight: 10,
  },
});

export default TalentRegisterStep1Screen;
