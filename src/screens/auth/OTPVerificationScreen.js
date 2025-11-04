import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { mockTalents, mockCompanies } from '../../data/mockData';
import colors from '../../constants/colors';

const OTPVerificationScreen = ({ navigation, route }) => {
  const { phone } = route.params;
  const { verifyOTP, login } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }

    // Auto-submit when all fields are filled
    if (index === 3 && text) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async (code) => {
    setLoading(true);
    const otpCode = code || otp.join('');

    const result = await verifyOTP(phone, otpCode);

    if (result.success) {
      // Check if user exists in mock data (for demo)
      const existingTalent = mockTalents.find((t) => t.phone === phone);
      const existingCompany = mockCompanies.find((c) => c.phone === phone);

      if (existingTalent) {
        await login(existingTalent, 'talent');
      } else if (existingCompany) {
        await login(existingCompany, 'company');
      } else {
        // New user - redirect to registration
        Alert.alert(
          'Account Not Found',
          'Please complete registration',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('SelectUserType'),
            },
          ]
        );
      }
    } else {
      Alert.alert('Invalid OTP', 'Please check the code and try again');
    }

    setLoading(false);
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(60);
      Alert.alert('OTP Sent', 'A new code has been sent to your phone');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.common.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Phone</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail-open" size={64} color={colors.talent.primary} />
        </View>

        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We sent a 4-digit code to{'\n'}
          <Text style={styles.phone}>{phone}</Text>
        </Text>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            otp.join('').length !== 4 && styles.verifyButtonDisabled,
          ]}
          onPress={() => handleVerify()}
          disabled={otp.join('').length !== 4 || loading}
        >
          <Text style={styles.verifyButtonText}>
            {loading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={resendTimer > 0}
          >
            <Text
              style={[
                styles.resendLink,
                resendTimer > 0 && styles.resendLinkDisabled,
              ]}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo Hint */}
        <View style={styles.demoHint}>
          <Ionicons name="information-circle" size={20} color={colors.status.info} />
          <Text style={styles.demoHintText}>
            Demo: Use any 4-digit code to continue
          </Text>
        </View>
      </View>
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
    lineHeight: 24,
  },
  phone: {
    fontWeight: 'bold',
    color: colors.common.text,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: colors.common.border,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.common.text,
  },
  verifyButton: {
    backgroundColor: colors.talent.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    backgroundColor: colors.common.textLight,
    opacity: 0.5,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.white,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  resendText: {
    fontSize: 14,
    color: colors.common.textLight,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.talent.primary,
  },
  resendLinkDisabled: {
    color: colors.common.textLight,
  },
  demoHint: {
    flexDirection: 'row',
    backgroundColor: colors.company.light,
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 32,
  },
  demoHintText: {
    flex: 1,
    fontSize: 12,
    color: colors.common.textLight,
    lineHeight: 18,
  },
});

export default OTPVerificationScreen;
