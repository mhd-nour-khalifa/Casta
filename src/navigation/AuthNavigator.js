import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SelectUserTypeScreen from '../screens/auth/SelectUserTypeScreen';
import PhoneLoginScreen from '../screens/auth/PhoneLoginScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';

// Talent Registration Screens
import TalentRegisterStep1Screen from '../screens/auth/TalentRegisterStep1Screen';
import TalentRegisterStep2Screen from '../screens/auth/TalentRegisterStep2Screen';
import TalentRegisterStep3Screen from '../screens/auth/TalentRegisterStep3Screen';
import TalentRegisterCompleteScreen from '../screens/auth/TalentRegisterCompleteScreen';

// Company Registration Screens
import CompanyRegisterScreen from '../screens/auth/CompanyRegisterScreen';
import CompanyVerificationPendingScreen from '../screens/auth/CompanyVerificationPendingScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SelectUserType" component={SelectUserTypeScreen} />
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />

      {/* Talent Registration Flow */}
      <Stack.Screen name="TalentRegisterStep1" component={TalentRegisterStep1Screen} />
      <Stack.Screen name="TalentRegisterStep2" component={TalentRegisterStep2Screen} />
      <Stack.Screen name="TalentRegisterStep3" component={TalentRegisterStep3Screen} />
      <Stack.Screen name="TalentRegisterComplete" component={TalentRegisterCompleteScreen} />

      {/* Company Registration Flow */}
      <Stack.Screen name="CompanyRegister" component={CompanyRegisterScreen} />
      <Stack.Screen name="CompanyVerificationPending" component={CompanyVerificationPendingScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
