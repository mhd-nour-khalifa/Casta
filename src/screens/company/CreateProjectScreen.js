import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../contexts/AuthContext';
import colors from '../../constants/colors';
import {
  PROJECT_TYPES,
  SAUDI_CITIES,
  RESPONSE_TIME_OPTIONS,
  PAYMENT_TYPES,
} from '../../constants/data';

const CreateProjectScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    projectType: '',
    description: '',
    city: '',
    startDate: '',
    endDate: '',
    compensation: '',
    paymentType: '',
    responseTimeLimit: 1440, // 24 hours default
    requirements: {
      gender: '',
      ageMin: '',
      ageMax: '',
      heightMin: '',
      heightMax: '',
      specificRequirements: '',
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState('');
  const [pickerOptions, setPickerOptions] = useState([]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateRequirements = (field, value) => {
    setFormData(prev => ({
      ...prev,
      requirements: { ...prev.requirements, [field]: value },
    }));
  };

  const openPicker = (type, options) => {
    setPickerType(type);
    setPickerOptions(options);
    setShowPicker(true);
  };

  const handlePickerSelect = (value) => {
    if (pickerType === 'gender') {
      updateRequirements('gender', value);
    } else if (pickerType === 'responseTime') {
      const selected = RESPONSE_TIME_OPTIONS.find(opt => opt.label === value);
      updateFormData('responseTimeLimit', selected.value);
    } else {
      updateFormData(pickerType, value);
    }
    setShowPicker(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.projectType) {
      newErrors.projectType = 'Please select a project type';
    }

    if (!formData.description.trim() || formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.city) {
      newErrors.city = 'Please select a city';
    }

    if (!formData.compensation.trim()) {
      newErrors.compensation = 'Please specify compensation';
    }

    if (!formData.paymentType) {
      newErrors.paymentType = 'Please select payment type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProject = async () => {
    if (!validateForm()) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the project/casting request
      const newProject = {
        id: `P${Date.now()}`,
        companyId: user.id,
        companyName: user.companyName,
        ...formData,
        status: 'active',
        createdAt: new Date().toISOString(),
        responses: [],
        views: 0,
      };

      // Save to AsyncStorage (shared requests store)
      const existingProjects = await AsyncStorage.getItem('@casta_projects');
      const projects = existingProjects ? JSON.parse(existingProjects) : [];
      projects.push(newProject);
      await AsyncStorage.setItem('@casta_projects', JSON.stringify(projects));

      Alert.alert(
        'Success! 🎉',
        'Your casting call has been posted successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating project:', error);
      Alert.alert('Error', 'Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResponseTimeLabel = (value) => {
    const option = RESPONSE_TIME_OPTIONS.find(opt => opt.value === value);
    return option ? option.label : '24 hours';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
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
        <Text style={styles.headerTitle}>Create Casting Call</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Project Title */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Project Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="e.g., Fashion Campaign for New Collection"
            placeholderTextColor={colors.common.gray}
            value={formData.title}
            onChangeText={(text) => updateFormData('title', text)}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Project Type */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Project Type <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.picker, errors.projectType && styles.inputError]}
            onPress={() => openPicker('projectType', PROJECT_TYPES)}
          >
            <Text style={formData.projectType ? styles.pickerText : styles.pickerPlaceholder}>
              {formData.projectType || 'Select project type'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.common.gray} />
          </TouchableOpacity>
          {errors.projectType && (
            <Text style={styles.errorText}>{errors.projectType}</Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            placeholder="Describe the project, what you're looking for, and any specific details..."
            placeholderTextColor={colors.common.gray}
            value={formData.description}
            onChangeText={(text) => updateFormData('description', text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{formData.description.length} characters</Text>
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        {/* City/Location */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Location <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.picker, errors.city && styles.inputError]}
            onPress={() => openPicker('city', SAUDI_CITIES)}
          >
            <Ionicons name="location" size={20} color={colors.company.primary} />
            <Text style={formData.city ? styles.pickerText : styles.pickerPlaceholder}>
              {formData.city || 'Select city'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.common.gray} />
          </TouchableOpacity>
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>

        {/* Dates */}
        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Start Date</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor={colors.common.gray}
              value={formData.startDate}
              onChangeText={(text) => updateFormData('startDate', text)}
            />
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>End Date</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor={colors.common.gray}
              value={formData.endDate}
              onChangeText={(text) => updateFormData('endDate', text)}
            />
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Payment Type <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.picker, errors.paymentType && styles.inputError]}
              onPress={() => openPicker('paymentType', PAYMENT_TYPES)}
            >
              <Ionicons name="cash" size={20} color={colors.company.primary} />
              <Text style={formData.paymentType ? styles.pickerText : styles.pickerPlaceholder}>
                {formData.paymentType || 'Select payment type'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.common.gray} />
            </TouchableOpacity>
            {errors.paymentType && (
              <Text style={styles.errorText}>{errors.paymentType}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Compensation <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.compensation && styles.inputError]}
              placeholder="e.g., 5,000 SAR or Negotiable"
              placeholderTextColor={colors.common.gray}
              value={formData.compensation}
              onChangeText={(text) => updateFormData('compensation', text)}
            />
            {errors.compensation && (
              <Text style={styles.errorText}>{errors.compensation}</Text>
            )}
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Talent Requirements</Text>

          {/* Gender */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderButtons}>
              {['Any', 'Male', 'Female'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    formData.requirements.gender === gender && styles.genderButtonActive,
                  ]}
                  onPress={() => updateRequirements('gender', gender)}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      formData.requirements.gender === gender &&
                        styles.genderButtonTextActive,
                    ]}
                  >
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Age Range */}
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Min Age</Text>
              <TextInput
                style={styles.input}
                placeholder="18"
                placeholderTextColor={colors.common.gray}
                value={formData.requirements.ageMin}
                onChangeText={(text) => updateRequirements('ageMin', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Max Age</Text>
              <TextInput
                style={styles.input}
                placeholder="35"
                placeholderTextColor={colors.common.gray}
                value={formData.requirements.ageMax}
                onChangeText={(text) => updateRequirements('ageMax', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Height Range (Optional) */}
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Min Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="160"
                placeholderTextColor={colors.common.gray}
                value={formData.requirements.heightMin}
                onChangeText={(text) => updateRequirements('heightMin', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Max Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="180"
                placeholderTextColor={colors.common.gray}
                value={formData.requirements.heightMax}
                onChangeText={(text) => updateRequirements('heightMax', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Specific Requirements */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Specific Requirements</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Any specific skills, experience, or characteristics needed..."
              placeholderTextColor={colors.common.gray}
              value={formData.requirements.specificRequirements}
              onChangeText={(text) => updateRequirements('specificRequirements', text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Response Time Limit */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Response Time Limit</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => openPicker('responseTime', RESPONSE_TIME_OPTIONS.map(opt => opt.label))}
          >
            <Ionicons name="time" size={20} color={colors.company.primary} />
            <Text style={styles.pickerText}>
              {getResponseTimeLabel(formData.responseTimeLimit)}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.common.gray} />
          </TouchableOpacity>
          <Text style={styles.helperText}>
            How long talents have to respond to your request
          </Text>
        </View>
      </ScrollView>

      {/* Create Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateProject}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={[colors.company.primary, colors.company.secondary]}
            style={styles.createButtonGradient}
          >
            <Ionicons name="add-circle" size={24} color={colors.common.white} />
            <Text style={styles.createButtonText}>
              {isSubmitting ? 'Creating...' : 'Create Casting Call'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Picker Modal */}
      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {pickerType === 'projectType' && 'Select Project Type'}
                {pickerType === 'city' && 'Select City'}
                {pickerType === 'paymentType' && 'Select Payment Type'}
                {pickerType === 'responseTime' && 'Select Response Time'}
              </Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Ionicons name="close" size={24} color={colors.common.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {pickerOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => handlePickerSelect(option)}
                >
                  <Text style={styles.modalItemText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
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
    color: colors.common.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.common.text,
    marginBottom: 8,
  },
  required: {
    color: colors.status.error,
  },
  input: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.common.text,
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  textArea: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.common.text,
    borderWidth: 1,
    borderColor: colors.common.border,
    minHeight: 100,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.common.border,
    gap: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 15,
    color: colors.common.text,
  },
  pickerPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: colors.common.gray,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.common.border,
    alignItems: 'center',
  },
  genderButtonActive: {
    borderColor: colors.company.primary,
    backgroundColor: colors.company.light,
  },
  genderButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.common.darkGray,
  },
  genderButtonTextActive: {
    color: colors.company.primary,
  },
  charCount: {
    fontSize: 12,
    color: colors.common.gray,
    marginTop: 4,
    textAlign: 'right',
  },
  helperText: {
    fontSize: 12,
    color: colors.common.darkGray,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.status.error,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.common.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.common.border,
  },
  createButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    color: colors.common.text,
  },
  modalList: {
    padding: 8,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.common.text,
  },
});

export default CreateProjectScreen;
