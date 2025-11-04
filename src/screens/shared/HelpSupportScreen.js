import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import colors from '../../constants/colors';

const HelpSupportScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const isCompany = user?.role === 'company';
  const primaryColor = isCompany ? colors.company.primary : colors.talent.primary;

  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });

  const faqs = [
    {
      question: 'How do I create a casting call?',
      answer: 'Go to your dashboard and click "Create Casting Call". Fill in all the required details including project type, requirements, dates, and compensation. Once submitted, talents will be able to see and apply to your casting.',
    },
    {
      question: 'How long does verification take?',
      answer: 'Account verification typically takes 24-48 hours. We review your submitted documents to ensure legitimacy. You\'ll receive a notification once your account is verified.',
    },
    {
      question: 'What documents are required for verification?',
      answer: 'Companies need to provide: Commercial Registration (Sijil Tejary), Zakat Certificate, and Legal Documents. Talents need to provide a valid ID and professional portfolio.',
    },
    {
      question: 'How do I edit my profile?',
      answer: 'Go to your Profile tab and click "Edit Profile". You can update your information, add photos, and modify your details. Remember to save your changes.',
    },
    {
      question: 'How do payments work?',
      answer: 'Payments are processed securely through our platform. Companies can set up payment terms in project details. All transactions are protected and tracked.',
    },
    {
      question: 'Can I cancel a booking?',
      answer: 'Yes, but cancellation policies apply. Review the terms in your project agreement. Late cancellations may incur fees as per the agreement.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can reach us via email at support@casta.sa, call +966 XX XXX XXXX, or use the contact form below. We respond within 24 hours.',
    },
  ];

  const contactOptions = [
    {
      icon: 'mail',
      title: 'Email Support',
      subtitle: 'support@casta.sa',
      action: () => Linking.openURL('mailto:support@casta.sa'),
    },
    {
      icon: 'call',
      title: 'Phone Support',
      subtitle: '+966 XX XXX XXXX',
      action: () => Linking.openURL('tel:+966XXXXXXXXX'),
    },
    {
      icon: 'logo-whatsapp',
      title: 'WhatsApp',
      subtitle: 'Chat with us',
      action: () => Linking.openURL('whatsapp://send?phone=966XXXXXXXXX'),
    },
    {
      icon: 'chatbubbles',
      title: 'Live Chat',
      subtitle: 'Available 9 AM - 6 PM',
      action: () => Alert.alert('Live Chat', 'Live chat feature coming soon!'),
    },
  ];

  const handleSubmitContact = () => {
    if (!contactForm.subject || !contactForm.message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Message Sent',
      'Thank you for contacting us! We\'ll get back to you within 24 hours.',
      [
        {
          text: 'OK',
          onPress: () => {
            setContactForm({ subject: '', message: '' });
            navigation.goBack();
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactGrid}>
            {contactOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactCard}
                onPress={option.action}
              >
                <View style={[styles.contactIconContainer, { backgroundColor: primaryColor }]}>
                  <Ionicons name={option.icon} size={24} color={colors.common.white} />
                </View>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Ionicons
                    name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={primaryColor}
                  />
                </TouchableOpacity>
                {expandedFaq === index && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Us a Message</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="What can we help you with?"
                placeholderTextColor={colors.common.gray}
                value={contactForm.subject}
                onChangeText={(text) => setContactForm({ ...contactForm, subject: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your issue or question in detail..."
                placeholderTextColor={colors.common.gray}
                value={contactForm.message}
                onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: primaryColor }]}
              onPress={handleSubmitContact}
            >
              <Text style={styles.submitButtonText}>Send Message</Text>
              <Ionicons name="send" size={20} color={colors.common.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Helpful Resources</Text>
          <View style={styles.resourcesContainer}>
            <TouchableOpacity style={styles.resourceItem}>
              <Ionicons name="book" size={20} color={primaryColor} />
              <Text style={styles.resourceText}>User Guide</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.resourceItem}>
              <Ionicons name="play-circle" size={20} color={primaryColor} />
              <Text style={styles.resourceText}>Video Tutorials</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.resourceItem}>
              <Ionicons name="document-text" size={20} color={primaryColor} />
              <Text style={styles.resourceText}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.resourceItem, { borderBottomWidth: 0 }]}>
              <Ionicons name="shield" size={20} color={primaryColor} />
              <Text style={styles.resourceText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.common.gray} />
            </TouchableOpacity>
          </View>
        </View>

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
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactCard: {
    width: '48%',
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  contactIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.common.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: 12,
    color: colors.common.darkGray,
    textAlign: 'center',
  },
  faqContainer: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 4,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.common.text,
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    color: colors.common.darkGray,
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 20,
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
    backgroundColor: colors.common.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: colors.common.text,
    borderWidth: 1,
    borderColor: colors.common.border,
  },
  textArea: {
    minHeight: 120,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.common.white,
  },
  resourcesContainer: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 16,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  resourceText: {
    fontSize: 15,
    color: colors.common.text,
    marginLeft: 12,
    flex: 1,
  },
});

export default HelpSupportScreen;
