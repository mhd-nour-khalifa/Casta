import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import colors from '../../constants/colors';
import { SAUDI_CITIES, COMPANY_TYPES } from '../../constants/data';

const EditCompanyProfileScreen = ({ navigation }) => {
  const { user, updateUserProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    companyNameArabic: user?.companyNameArabic || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    city: user?.city || '',
    companyType: user?.companyType || '',
    crNumber: user?.crNumber || '',
  });

  const [showPicker, setShowPicker] = useState({ visible: false, field: null, options: [] });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update context (you'll need to implement updateUserProfile in AuthContext)
      if (updateUserProfile) {
        await updateUserProfile(formData);
      }

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const openPicker = (field, options) => {
    setShowPicker({ visible: true, field, options });
  };

  const selectOption = (value) => {
    if (showPicker.field) {
      setFormData({ ...formData, [showPicker.field]: value });
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Select {showPicker.field === 'city' ? 'City' : 'Company Type'}
            </Text>
            <TouchableOpacity
              onPress={() => setShowPicker({ visible: false, field: null, options: [] })}
            >
              <Ionicons name="close" size={24} color={colors.common.gray} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {showPicker.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalOption}
                onPress={() => selectOption(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
                {formData[showPicker.field] === option && (
                  <Ionicons name="checkmark" size={20} color={colors.company.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.common.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Company Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company Name (English)</Text>
            <TextInput
              style={styles.input}
              value={formData.companyName}
              onChangeText={(text) => setFormData({ ...formData, companyName: text })}
              placeholder="ABC Productions"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company Name (Arabic)</Text>
            <TextInput
              style={styles.input}
              value={formData.companyNameArabic}
              onChangeText={(text) => setFormData({ ...formData, companyNameArabic: text })}
              placeholder="اسم الشركة"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company Type</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => openPicker('companyType', COMPANY_TYPES)}
            >
              <Text style={[styles.pickerText, !formData.companyType && styles.placeholderText]}>
                {formData.companyType || 'Select Company Type'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.common.gray} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CR Number</Text>
            <TextInput
              style={styles.input}
              value={formData.crNumber}
              onChangeText={(text) => setFormData({ ...formData, crNumber: text })}
              placeholder="1234567890"
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+966</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                value={formData.mobile}
                onChangeText={(text) => setFormData({ ...formData, mobile: text.replace(/\D/g, '') })}
                placeholder="5XX XXX XXX"
                keyboardType="phone-pad"
                maxLength={9}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="company@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => openPicker('city', SAUDI_CITIES)}
            >
              <Text style={[styles.pickerText, !formData.city && styles.placeholderText]}>
                {formData.city || 'Select City'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.common.gray} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <PickerModal />
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
    backgroundColor: colors.company.primary,
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.common.white,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.common.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.common.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: colors.common.text,
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    backgroundColor: colors.common.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.common.text,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.common.white,
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    color: colors.common.text,
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  pickerButton: {
    backgroundColor: colors.common.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.common.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 15,
    color: colors.common.text,
  },
  placeholderText: {
    color: colors.common.gray,
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
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.text,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.common.text,
  },
});

export default EditCompanyProfileScreen;
