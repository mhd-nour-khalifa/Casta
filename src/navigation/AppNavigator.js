import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';

// Import navigators
import AuthNavigator from './AuthNavigator';
import TalentNavigator from './TalentNavigator';
import CompanyNavigator from './CompanyNavigator';

// Loading Screen
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const Stack = createStackNavigator();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.talent.primary} />
    <Text style={styles.loadingText}>Loading Casta...</Text>
  </View>
);

const AppNavigator = () => {
  const { isAuthenticated, userType, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : userType === 'talent' ? (
          <Stack.Screen name="TalentApp" component={TalentNavigator} />
        ) : (
          <Stack.Screen name="CompanyApp" component={CompanyNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.common.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.common.text,
    fontWeight: '600',
  },
});

export default AppNavigator;
