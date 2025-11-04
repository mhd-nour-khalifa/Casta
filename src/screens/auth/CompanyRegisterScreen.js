import React, { useState, useContext } from 'react';
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
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import colors from '../../constants/colors';
import { SAUDI_CITIES, COMPANY_TYPES } from '../../constants/data';
import { AuthContext } from '../../contexts/AuthContext';

const CompanyRegisterScreen = ({ navigation, route }) => {
  const { completeRegistration } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    companyName: '',
    companyNameArabic: '',
    mobile: '',
    email: '',
    city: '',
    companyType: '',
    crNumber: '',
    agreeToTerms: false,
  });
  const [documents, setDocuments] = useState({
    commercialRegistration: null,
    zakatCertificate: null,
    legalDocuments: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPicker, setShowPicker] = useState({ visible: false, field: null, options: [] });

  const pickDocument = async (documentType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setDocuments(prev => ({
          ...prev,
          [documentType]: {
            name: file.name,
            uri: file.uri,
            type: file.mimeType,
            size: file.size,
          },
        }));
        // Clear error if it exists
        if (errors[documentType]) {
          setErrors(prev => ({ ...prev, [documentType]: '' }));
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document. Please try again.');
      console.error('Document picker error:', error);
    }
  };

  const removeDocument = (documentType) => {
    setDocuments(prev => ({ ...prev, [documentType]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.mobile || formData.mobile.length < 9) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.city) {
      newErrors.city = 'Please select a city';
    }

    if (!formData.companyType) {
      newErrors.companyType = 'Please select company type';
    }

    // Document validation
    if (!documents.commercialRegistration) {
      newErrors.commercialRegistration = 'Commercial Registration (Sijil Tejary) is required';
    }

    if (!documents.zakatCertificate) {
      newErrors.zakatCertificate = 'Zakat Certificate is required';
    }

    if (!documents.legalDocuments) {
      newErrors.legalDocuments = 'Legal Documents are required';
    }

    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const completeData = {
          ...formData,
          documents: {
            commercialRegistration: documents.commercialRegistration,
            zakatCertificate: documents.zakatCertificate,
            legalDocuments: documents.legalDocuments,
            uploadedAt: new Date().toISOString(),
          },
          registrationDate: new Date().toISOString(),
          profileComplete: true,
          status: 'pending_verification', // Changed from 'active'
          verified: false,
          verificationStatus: 'pending', // New field
          rating: 0,
          totalProjects: 0,
        };

        await new Promise((resolve) => setTimeout(resolve, 1500));
        await completeRegistration(completeData, 'company');

        Alert.alert(
          'Registration Submitted! 📄',
          'Your company registration has been submitted for verification. We will review your documents and notify you once approved.',
          [
            {
              text: 'Got it',
              onPress: () => {
                // Navigation will be handled by AuthContext
              },
            },
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again.');
        setIsSubmitting(false);
      }
    } else {
      Alert.alert('Validation Error', 'Please fill in all required fields');
    }
  };

  const openPicker = (field, options) => {
    setShowPicker({ visible: true, field, options });
  };

  const selectOption = (value) => {
    if (showPicker.field) {
      setFormData({ ...formData, [showPicker.field]: value });
      if (errors[showPicker.field]) {
        setErrors({ ...errors, [showPicker.field]: null });
      }
    }
    setShowPicker({ visible: false, field: null, options: [] });
  };

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 9);
    let formatted = limited;
    if (limited.length > 3 && limited.length <= 6) {
      formatted = `${limited.slice(0, 3)} ${limited.slice(3)}`;
    } else if (limited.length > 6) {
      formatted = `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    }
    return formatted;
  };

  const PickerModal = () => (
    <Modal
      visible={showPicker.visible}
      transparent
      animationType="slide"
      onRequestClose={() => setShowPicker({ visible: false, field: null, options: [] })}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowPicker({ visible: false, field: null, options: [] })}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Option</Text>
            <TouchableOpacity
              onPress={() => setShowPicker({ visible: false, field: null, options: [] })}
            >
              <Ionicons name="close" size={24} color={colors.common.black} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.optionsList}>
            {showPicker.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionItem}
                onPress={() => selectOption(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
                {formData[showPicker.field] === option && (
                  <Ionicons name="checkmark" size={20} color={colors.company.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.company.primary, colors.company.secondary]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.common.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Company Registration</Text>
        <View style={styles.headerPlaceholder} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Company Information</Text>
          <Text style={styles.sectionDescription}>
            Tell us about your company
          </Text>

          {/* Company Name English */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Company Name (English) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.companyName && styles.inputError]}
              placeholder="ABC Productions"
              placeholderTextColor={colors.common.gray}
              value={formData.companyName}
              onChangeText={(text) => {
                setFormData({ ...formData, companyName: text });
                if (errors.companyName) {
                  setErrors({ ...errors, companyName: null });
                }
              }}
            />
            {errors.companyName && (
              <Text style={styles.errorText}>{errors.companyName}</Text>
            )}
          </View>

          {/* Company Name Arabic */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Company Name (Arabic) <Text style={styles.optional}>(Optional)</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="اسم الشركة"
              placeholderTextColor={colors.common.gray}
              value={formData.companyNameArabic}
              onChangeText={(text) => setFormData({ ...formData, companyNameArabic: text })}
            />
          </View>

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
                onChangeText={(text) => {
                  setFormData({ ...formData, mobile: text.replace(/\D/g, '') });
                  if (errors.mobile) {
                    setErrors({ ...errors, mobile: null });
                  }
                }}
                maxLength={11}
              />
            </View>
            {errors.mobile && (
              <Text style={styles.errorText}>{errors.mobile}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email Address <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="company@example.com"
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
          </View>

          {/* City */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              City <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.pickerButton, errors.city && styles.inputError]}
              onPress={() => openPicker('city', SAUDI_CITIES)}
            >
              <Text style={[styles.pickerText, !formData.city && styles.placeholderText]}>
                {formData.city || 'Select City'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.common.gray} />
            </TouchableOpacity>
            {errors.city && (
              <Text style={styles.errorText}>{errors.city}</Text>
            )}
          </View>

          {/* Company Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Company Type <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.pickerButton, errors.companyType && styles.inputError]}
              onPress={() => openPicker('companyType', COMPANY_TYPES)}
            >
              <Text style={[styles.pickerText, !formData.companyType && styles.placeholderText]}>
                {formData.companyType || 'Select Company Type'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.common.gray} />
            </TouchableOpacity>
            {errors.companyType && (
              <Text style={styles.errorText}>{errors.companyType}</Text>
            )}
          </View>

          {/* CR Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              CR Number <Text style={styles.optional}>(Optional)</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="1234567890"
              placeholderTextColor={colors.common.gray}
              keyboardType="number-pad"
              value={formData.crNumber}
              onChangeText={(text) => setFormData({ ...formData, crNumber: text })}
            />
            <Text style={styles.hint}>
              Commercial Registration Number for verification
            </Text>
          </View>

          {/* Documents Section */}
          <View style={styles.sectionDivider}>
            <Text style={styles.sectionTitle}>Required Documents</Text>
            <Text style={styles.sectionSubtitle}>
              Upload official documents to verify your company
            </Text>
          </View>

          {/* Commercial Registration (Sijil Tejary) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Commercial Registration (Sijil Tejary){' '}
              <Text style={styles.required}>*</Text>
            </Text>
            {!documents.commercialRegistration ? (
              <TouchableOpacity
                style={[
                  styles.documentButton,
                  errors.commercialRegistration && styles.documentButtonError,
                ]}
                onPress={() => pickDocument('commercialRegistration')}
              >
                <Ionicons name="cloud-upload" size={24} color={colors.company.primary} />
                <Text style={styles.documentButtonText}>Upload Document</Text>
                <Text style={styles.documentButtonHint}>PDF or Image</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.documentUploaded}>
                <View style={styles.documentUploadedLeft}>
                  <Ionicons name="document-text" size={24} color={colors.status.success} />
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentName} numberOfLines={1}>
                      {documents.commercialRegistration.name}
                    </Text>
                    <Text style={styles.documentSize}>
                      {(documents.commercialRegistration.size / 1024).toFixed(0)} KB
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => removeDocument('commercialRegistration')}
                  style={styles.documentRemove}
                >
                  <Ionicons name="close-circle" size={24} color={colors.status.error} />
                </TouchableOpacity>
              </View>
            )}
            {errors.commercialRegistration && (
              <Text style={styles.errorText}>{errors.commercialRegistration}</Text>
            )}
          </View>

          {/* Zakat Certificate */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Zakat Certificate <Text style={styles.required}>*</Text>
            </Text>
            {!documents.zakatCertificate ? (
              <TouchableOpacity
                style={[
                  styles.documentButton,
                  errors.zakatCertificate && styles.documentButtonError,
                ]}
                onPress={() => pickDocument('zakatCertificate')}
              >
                <Ionicons name="cloud-upload" size={24} color={colors.company.primary} />
                <Text style={styles.documentButtonText}>Upload Document</Text>
                <Text style={styles.documentButtonHint}>PDF or Image</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.documentUploaded}>
                <View style={styles.documentUploadedLeft}>
                  <Ionicons name="document-text" size={24} color={colors.status.success} />
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentName} numberOfLines={1}>
                      {documents.zakatCertificate.name}
                    </Text>
                    <Text style={styles.documentSize}>
                      {(documents.zakatCertificate.size / 1024).toFixed(0)} KB
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => removeDocument('zakatCertificate')}
                  style={styles.documentRemove}
                >
                  <Ionicons name="close-circle" size={24} color={colors.status.error} />
                </TouchableOpacity>
              </View>
            )}
            {errors.zakatCertificate && (
              <Text style={styles.errorText}>{errors.zakatCertificate}</Text>
            )}
          </View>

          {/* Legal Documents */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Legal Documents <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.hint}>
              Company license, permits, or other legal documents
            </Text>
            {!documents.legalDocuments ? (
              <TouchableOpacity
                style={[
                  styles.documentButton,
                  errors.legalDocuments && styles.documentButtonError,
                ]}
                onPress={() => pickDocument('legalDocuments')}
              >
                <Ionicons name="cloud-upload" size={24} color={colors.company.primary} />
                <Text style={styles.documentButtonText}>Upload Document</Text>
                <Text style={styles.documentButtonHint}>PDF or Image</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.documentUploaded}>
                <View style={styles.documentUploadedLeft}>
                  <Ionicons name="document-text" size={24} color={colors.status.success} />
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentName} numberOfLines={1}>
                      {documents.legalDocuments.name}
                    </Text>
                    <Text style={styles.documentSize}>
                      {(documents.legalDocuments.size / 1024).toFixed(0)} KB
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => removeDocument('legalDocuments')}
                  style={styles.documentRemove}
                >
                  <Ionicons name="close-circle" size={24} color={colors.status.error} />
                </TouchableOpacity>
              </View>
            )}
            {errors.legalDocuments && (
              <Text style={styles.errorText}>{errors.legalDocuments}</Text>
            )}
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

          <View style={styles.spacer} />
        </View>
      </ScrollView>

      {/* Register Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.registerButton, isSubmitting && styles.registerButtonDisabled]}
          onPress={handleRegister}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={[colors.company.primary, colors.company.secondary]}
            style={styles.registerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isSubmitting ? (
              <Text style={styles.registerButtonText}>Creating Profile...</Text>
            ) : (
              <>
                <Text style={styles.registerButtonText}>Complete Registration</Text>
                <Ionicons name="checkmark-circle" size={20} color={colors.common.white} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <PickerModal />
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
  pickerButton: {
    backgroundColor: colors.common.lightGray,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.common.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: colors.common.black,
  },
  placeholderText: {
    color: colors.common.gray,
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
    backgroundColor: colors.company.primary,
    borderColor: colors.company.primary,
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
    color: colors.company.primary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.common.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.black,
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  optionText: {
    fontSize: 16,
    color: colors.common.black,
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
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.common.white,
    marginRight: 10,
  },
  sectionDivider: {
    marginTop: 32,
    marginBottom: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.common.border,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.common.darkGray,
    marginTop: 4,
  },
  documentButton: {
    backgroundColor: colors.common.white,
    borderWidth: 2,
    borderColor: colors.company.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  documentButtonError: {
    borderColor: colors.status.error,
  },
  documentButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.common.text,
    marginTop: 8,
  },
  documentButtonHint: {
    fontSize: 12,
    color: colors.common.darkGray,
    marginTop: 4,
  },
  documentUploaded: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.status.successLight,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.status.success,
  },
  documentUploadedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  documentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.common.text,
    marginBottom: 4,
  },
  documentSize: {
    fontSize: 12,
    color: colors.common.darkGray,
  },
  documentRemove: {
    padding: 4,
  },
});

export default CompanyRegisterScreen;
