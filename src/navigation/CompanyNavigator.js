import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

// Company Screens
import CompanyDashboardScreen from '../screens/company/CompanyDashboardScreen';
import CreateProjectScreen from '../screens/company/CreateProjectScreen';
import CompanyProjectsScreen from '../screens/company/CompanyProjectsScreen';
import TalentPoolScreen from '../screens/company/TalentPoolScreen';
import CompanyProfileScreen from '../screens/company/CompanyProfileScreen';

// Shared Screens
import ProjectDetailScreen from '../screens/shared/ProjectDetailScreen';
import TalentDetailScreen from '../screens/company/TalentDetailScreen';
import ProjectResponsesScreen from '../screens/company/ProjectResponsesScreen';
import MessagesScreen from '../screens/shared/MessagesScreen';
import ChatScreen from '../screens/shared/ChatScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import ReportsScreen from '../screens/company/ReportsScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';
import HelpSupportScreen from '../screens/shared/HelpSupportScreen';
import EditCompanyProfileScreen from '../screens/company/EditCompanyProfileScreen';
import VerifyAccountScreen from '../screens/shared/VerifyAccountScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard Stack
const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Dashboard"
      component={CompanyDashboardScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CreateProject"
      component={CreateProjectScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CompanyProjects"
      component={CompanyProjectsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="TalentPool"
      component={TalentPoolScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{ title: 'Notifications' }}
    />
    <Stack.Screen
      name="ProjectDetail"
      component={ProjectDetailScreen}
      options={{ title: 'Project Details' }}
    />
    <Stack.Screen
      name="ProjectResponses"
      component={ProjectResponsesScreen}
      options={{ title: 'Responses' }}
    />
    <Stack.Screen
      name="TalentDetail"
      component={TalentDetailScreen}
      options={{ title: 'Talent Profile' }}
    />
    <Stack.Screen
      name="Messages"
      component={MessagesScreen}
      options={{ title: 'Messages' }}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({ route }) => ({ title: route.params?.name || 'Chat' })}
    />
  </Stack.Navigator>
);

// Create Project Stack
const CreateProjectStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CreateProject"
      component={CreateProjectScreen}
      options={{ title: 'Create New Project' }}
    />
  </Stack.Navigator>
);

// Projects Stack
const ProjectsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Projects"
      component={CompanyProjectsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ProjectDetail"
      component={ProjectDetailScreen}
      options={{ title: 'Project Details' }}
    />
    <Stack.Screen
      name="ProjectResponses"
      component={ProjectResponsesScreen}
      options={{ title: 'Responses' }}
    />
    <Stack.Screen
      name="TalentDetail"
      component={TalentDetailScreen}
      options={{ title: 'Talent Profile' }}
    />
    <Stack.Screen
      name="Reports"
      component={ReportsScreen}
      options={{ title: 'Project Report' }}
    />
  </Stack.Navigator>
);

// Talent Pool Stack
const TalentPoolStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TalentPool"
      component={TalentPoolScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="TalentDetail"
      component={TalentDetailScreen}
      options={{ title: 'Talent Profile' }}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({ route }) => ({ title: route.params?.name || 'Chat' })}
    />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={CompanyProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EditCompanyProfile"
      component={EditCompanyProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="VerifyAccount"
      component={VerifyAccountScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="HelpSupport"
      component={HelpSupportScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Messages"
      component={MessagesScreen}
      options={{ title: 'Messages' }}
    />
  </Stack.Navigator>
);

const CompanyNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CreateProjectTab') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'ProjectsTab') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'TalentPoolTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'business' : 'business-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.company.primary,
        tabBarInactiveTintColor: colors.common.textLight,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="CreateProjectTab"
        component={CreateProjectStack}
        options={{ title: 'Create' }}
      />
      <Tab.Screen
        name="ProjectsTab"
        component={ProjectsStack}
        options={{
          title: 'Projects',
        }}
      />
      <Tab.Screen
        name="TalentPoolTab"
        component={TalentPoolStack}
        options={{ title: 'Talents' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default CompanyNavigator;
