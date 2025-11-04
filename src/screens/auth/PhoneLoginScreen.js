import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const PhoneLoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (text) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');

    // Format as: 5XX XXX XXX
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}`;
    }
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const handleContinue = () => {
    const cleanedPhone = phoneNumber.replace(/\s/g, '');

    if (cleanedPhone.length !== 9) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid Saudi mobile number');
      return;
    }

    if (!cleanedPhone.startsWith('5')) {
      Alert.alert('Invalid Phone Number', 'Saudi mobile numbers start with 5');
      return;
    }

    const fullPhone = `+966${cleanedPhone}`;
    navigation.navigate('OTPVerification', { phone: fullPhone });
  };

  const isValidPhone = phoneNumber.replace(/\s/g, '').length === 9;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.common.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign In</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="phone-portrait" size={64} color={colors.talent.primary} />
          </View>

          <Text style={styles.title}>Enter Your Phone Number</Text>
          <Text style={styles.subtitle}>
            We'll send you a verification code
          </Text>

          {/* Phone Input */}
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+966</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="5XX XXX XXX"
              placeholderTextColor={colors.common.textLight}
              keyboardType="phone-pad"
              maxLength={11} // 9 digits + 2 spaces
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              !isValidPhone && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isValidPhone || loading}
          >
            <Text style={styles.continueButtonText}>
              {loading ? 'Sending...' : 'Continue'}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={colors.status.info} />
            <Text style={styles.infoText}>
              By continuing, you agree to Casta's Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SelectUserType')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.background,
  },
  keyboardView: {
    flex: 1,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.common.textLight,
    marginBottom: 40,
    textAlign: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.common.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  countryCode: {
    backgroundColor: colors.common.borderLight,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.common.text,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 18,
    color: colors.common.text,
  },
  continueButton: {
    backgroundColor: colors.talent.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: colors.common.textLight,
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.white,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.company.light,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.common.textLight,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
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

export default PhoneLoginScreen;
