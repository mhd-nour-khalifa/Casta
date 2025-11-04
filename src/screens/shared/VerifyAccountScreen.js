import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import colors from '../../constants/colors';

const VerifyAccountScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const isCompany = user?.role === 'company';
  const primaryColor = isCompany ? colors.company.primary : colors.talent.primary;

  const verificationSteps = isCompany
    ? [
        {
          title: 'Commercial Registration',
          description: 'Sijil Tejary document uploaded',
          status: user?.documents?.commercialRegistration ? 'completed' : 'pending',
        },
        {
          title: 'Zakat Certificate',
          description: 'Valid Zakat certificate',
          status: user?.documents?.zakatCertificate ? 'completed' : 'pending',
        },
        {
          title: 'Legal Documents',
          description: 'Company licenses and permits',
          status: user?.documents?.legalDocuments ? 'completed' : 'pending',
        },
        {
          title: 'Manual Review',
          description: 'Admin verification in progress',
          status: user?.verified ? 'completed' : 'in_progress',
        },
      ]
    : [
        {
          title: 'Identity Verification',
          description: 'Valid ID card uploaded',
          status: user?.documents?.id ? 'completed' : 'pending',
        },
        {
          title: 'Professional Portfolio',
          description: 'Photos and experience added',
          status: user?.portfolio?.length > 0 ? 'completed' : 'pending',
        },
        {
          title: 'Manual Review',
          description: 'Admin verification in progress',
          status: user?.verified ? 'completed' : 'in_progress',
        },
      ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'in_progress':
        return 'time';
      case 'pending':
        return 'ellipse-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return colors.status.success;
      case 'in_progress':
        return colors.status.warning;
      case 'pending':
        return colors.common.gray;
      default:
        return colors.common.gray;
    }
  };

  const handleResubmit = () => {
    Alert.alert(
      'Resubmit Documents',
      'Would you like to update your verification documents?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: () => {
            // Navigate to registration or profile edit
            navigation.goBack();
            Alert.alert('Info', 'Please update your documents in Edit Profile section.');
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    navigation.navigate('HelpSupport');
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
        <Text style={styles.headerTitle}>Verify Account</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Verification Status Card */}
        <View style={styles.statusCard}>
          <View style={[styles.statusIconContainer, {
            backgroundColor: user?.verified ? colors.status.successLight : colors.status.warningLight,
          }]}>
            <Ionicons
              name={user?.verified ? 'shield-checkmark' : 'shield-half'}
              size={48}
              color={user?.verified ? colors.status.success : colors.status.warning}
            />
          </View>
          <Text style={styles.statusTitle}>
            {user?.verified ? 'Account Verified' : 'Verification Pending'}
          </Text>
          <Text style={styles.statusDescription}>
            {user?.verified
              ? 'Your account has been successfully verified. You can access all features.'
              : 'Your account is under review. We typically complete verification within 24-48 hours.'}
          </Text>
        </View>

        {/* Verification Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Steps</Text>
          <View style={styles.stepsContainer}>
            {verificationSteps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={[styles.stepIcon, { backgroundColor: getStatusColor(step.status) + '20' }]}>
                  <Ionicons
                    name={getStatusIcon(step.status)}
                    size={24}
                    color={getStatusColor(step.status)}
                  />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
                {index < verificationSteps.length - 1 && (
                  <View style={styles.stepConnector} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Benefits of Verification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits of Verification</Text>
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.status.success} />
              <Text style={styles.benefitText}>Increased trust from {isCompany ? 'talents' : 'companies'}</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.status.success} />
              <Text style={styles.benefitText}>Priority in search results</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.status.success} />
              <Text style={styles.benefitText}>Access to premium features</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.status.success} />
              <Text style={styles.benefitText}>Verified badge on profile</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        {!user?.verified && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: primaryColor }]}
              onPress={handleResubmit}
            >
              <Ionicons name="cloud-upload" size={20} color={colors.common.white} />
              <Text style={styles.buttonText}>Update Documents</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonOutline]}
              onPress={handleContactSupport}
            >
              <Ionicons name="help-circle" size={20} color={primaryColor} />
              <Text style={[styles.buttonText, { color: primaryColor }]}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        )}

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
  statusCard: {
    backgroundColor: colors.common.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: colors.common.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 16,
  },
  stepsContainer: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 20,
  },
  stepItem: {
    position: 'relative',
    paddingBottom: 24,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepContent: {
    marginLeft: 60,
    marginTop: -60,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.common.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.common.darkGray,
  },
  stepConnector: {
    position: 'absolute',
    left: 23,
    top: 48,
    width: 2,
    height: 24,
    backgroundColor: colors.common.border,
  },
  benefitsContainer: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  benefitText: {
    fontSize: 15,
    color: colors.common.text,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.common.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.common.white,
  },
});

export default VerifyAccountScreen;
