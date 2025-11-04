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
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import {
  NATIONALITIES,
  SAUDI_CITIES,
  CLOTHING_SIZES,
  HAIR_COLORS,
  EYE_COLORS,
  SKIN_TONES,
} from '../../constants/data';

const TalentRegisterStep2Screen = ({ navigation, route }) => {
  const { step1Data } = route.params || {};
  const [formData, setFormData] = useState({
    fullNameArabic: '',
    fullNameEnglish: '',
    age: '',
    dateOfBirth: '',
    nationality: '',
    gender: '',
    city: '',
    weight: '',
    height: '',
    clothingSize: '',
    hairColor: '',
    eyeColor: '',
    skinTone: '',
  });
  const [errors, setErrors] = useState({});
  const [showPicker, setShowPicker] = useState({ visible: false, field: null, options: [] });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullNameEnglish.trim()) {
      newErrors.fullNameEnglish = 'Full name in English is required';
    }

    if (!formData.age || formData.age < 16 || formData.age > 70) {
      newErrors.age = 'Please enter a valid age (16-70)';
    }

    if (!formData.nationality) {
      newErrors.nationality = 'Please select your nationality';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!formData.city) {
      newErrors.city = 'Please select your city';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      navigation.navigate('TalentRegisterStep3', {
        step1Data,
        step2Data: formData,
      });
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
                  <Ionicons name="checkmark" size={20} color={colors.talent.primary} />
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
          <View style={[styles.progressFill, { width: '66%' }]} />
        </View>
        <Text style={styles.progressText}>Step 2 of 3 - Personal & Physical Details</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {/* Full Name English */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Full Name (English) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.fullNameEnglish && styles.inputError]}
              placeholder="John Doe"
              placeholderTextColor={colors.common.gray}
              value={formData.fullNameEnglish}
              onChangeText={(text) => {
                setFormData({ ...formData, fullNameEnglish: text });
                if (errors.fullNameEnglish) {
                  setErrors({ ...errors, fullNameEnglish: null });
                }
              }}
            />
            {errors.fullNameEnglish && (
              <Text style={styles.errorText}>{errors.fullNameEnglish}</Text>
            )}
          </View>

          {/* Full Name Arabic */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Full Name (Arabic) <Text style={styles.optional}>(Optional)</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="الاسم الكامل"
              placeholderTextColor={colors.common.gray}
              value={formData.fullNameArabic}
              onChangeText={(text) => setFormData({ ...formData, fullNameArabic: text })}
            />
          </View>

          {/* Age and Date of Birth Row */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>
                Age <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                placeholder="25"
                placeholderTextColor={colors.common.gray}
                keyboardType="number-pad"
                value={formData.age}
                onChangeText={(text) => {
                  setFormData({ ...formData, age: text });
                  if (errors.age) {
                    setErrors({ ...errors, age: null });
                  }
                }}
                maxLength={2}
              />
              {errors.age && (
                <Text style={styles.errorText}>{errors.age}</Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>
                Date of Birth <Text style={styles.optional}>(Optional)</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.common.gray}
                value={formData.dateOfBirth}
                onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
              />
            </View>
          </View>

          {/* Nationality */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nationality <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.pickerButton, errors.nationality && styles.inputError]}
              onPress={() => openPicker('nationality', NATIONALITIES)}
            >
              <Text style={[styles.pickerText, !formData.nationality && styles.placeholderText]}>
                {formData.nationality || 'Select Nationality'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.common.gray} />
            </TouchableOpacity>
            {errors.nationality && (
              <Text style={styles.errorText}>{errors.nationality}</Text>
            )}
          </View>

          {/* Gender */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Gender <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.genderContainer}>
              {['Male', 'Female'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    formData.gender === gender && styles.genderButtonSelected,
                    errors.gender && styles.inputError,
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, gender });
                    if (errors.gender) {
                      setErrors({ ...errors, gender: null });
                    }
                  }}
                >
                  <Ionicons
                    name={gender === 'Male' ? 'male' : 'female'}
                    size={20}
                    color={formData.gender === gender ? colors.common.white : colors.common.gray}
                  />
                  <Text
                    style={[
                      styles.genderButtonText,
                      formData.gender === gender && styles.genderButtonTextSelected,
                    ]}
                  >
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.gender && (
              <Text style={styles.errorText}>{errors.gender}</Text>
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

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Physical Details</Text>
          <Text style={styles.sectionDescription}>
            Help companies find the perfect match
          </Text>

          {/* Weight and Height Row */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="70"
                placeholderTextColor={colors.common.gray}
                keyboardType="number-pad"
                value={formData.weight}
                onChangeText={(text) => setFormData({ ...formData, weight: text })}
                maxLength={3}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="175"
                placeholderTextColor={colors.common.gray}
                keyboardType="number-pad"
                value={formData.height}
                onChangeText={(text) => setFormData({ ...formData, height: text })}
                maxLength={3}
              />
            </View>
          </View>

          {/* Clothing Size */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Clothing Size</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => openPicker('clothingSize', CLOTHING_SIZES)}
            >
              <Text style={[styles.pickerText, !formData.clothingSize && styles.placeholderText]}>
                {formData.clothingSize || 'Select Size'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.common.gray} />
            </TouchableOpacity>
          </View>

          {/* Hair Color */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hair Color</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => openPicker('hairColor', HAIR_COLORS)}
            >
              <Text style={[styles.pickerText, !formData.hairColor && styles.placeholderText]}>
                {formData.hairColor || 'Select Hair Color'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.common.gray} />
            </TouchableOpacity>
          </View>

          {/* Eye Color */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Eye Color</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => openPicker('eyeColor', EYE_COLORS)}
            >
              <Text style={[styles.pickerText, !formData.eyeColor && styles.placeholderText]}>
                {formData.eyeColor || 'Select Eye Color'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.common.gray} />
            </TouchableOpacity>
          </View>

          {/* Skin Tone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Skin Tone</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => openPicker('skinTone', SKIN_TONES)}
            >
              <Text style={[styles.pickerText, !formData.skinTone && styles.placeholderText]}>
                {formData.skinTone || 'Select Skin Tone'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.common.gray} />
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
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
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.common.lightGray,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  genderButtonSelected: {
    backgroundColor: colors.talent.primary,
    borderColor: colors.talent.primary,
  },
  genderButtonText: {
    fontSize: 16,
    color: colors.common.gray,
    marginLeft: 8,
    fontWeight: '500',
  },
  genderButtonTextSelected: {
    color: colors.common.white,
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

export default TalentRegisterStep2Screen;
