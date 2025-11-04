import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const PlaceholderScreen = ({ title, description, icon = 'construct', onBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={80} color={colors.common.textLight} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description || 'Coming soon...'}</Text>
      {onBack && (
        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.common.background,
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.common.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.common.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.talent.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlaceholderScreen;
