import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

// Talent Screens
import TalentDashboardScreen from '../screens/talent/TalentDashboardScreen';
import TalentRequestsScreen from '../screens/talent/TalentRequestsScreen';
import TalentHistoryScreen from '../screens/talent/TalentHistoryScreen';
import TalentCalendarScreen from '../screens/talent/TalentCalendarScreen';
import TalentProfileScreen from '../screens/talent/TalentProfileScreen';

// Shared Screens
import RequestDetailScreen from '../screens/shared/RequestDetailScreen';
import ProjectDetailScreen from '../screens/shared/ProjectDetailScreen';
import MessagesScreen from '../screens/shared/MessagesScreen';
import ChatScreen from '../screens/shared/ChatScreen';
import EditProfileScreen from '../screens/talent/EditProfileScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';
import HelpSupportScreen from '../screens/shared/HelpSupportScreen';
import VerifyAccountScreen from '../screens/shared/VerifyAccountScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard Stack
const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Dashboard"
      component={TalentDashboardScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{ title: 'Notifications' }}
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

// Requests Stack
const RequestsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Requests"
      component={TalentRequestsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="RequestDetail"
      component={RequestDetailScreen}
      options={{ title: 'Request Details' }}
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

// History Stack
const HistoryStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="History"
      component={TalentHistoryScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ProjectDetail"
      component={ProjectDetailScreen}
      options={{ title: 'Project Details' }}
    />
  </Stack.Navigator>
);

// Calendar Stack
const CalendarStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Calendar"
      component={TalentCalendarScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ProjectDetail"
      component={ProjectDetailScreen}
      options={{ title: 'Project Details' }}
    />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={TalentProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
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
  </Stack.Navigator>
);

const TalentNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'RequestsTab') {
            iconName = focused ? 'mail' : 'mail-outline';
          } else if (route.name === 'HistoryTab') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'CalendarTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.talent.primary,
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
        name="RequestsTab"
        component={RequestsStack}
        options={{
          title: 'Requests',
          tabBarBadge: 2, // TODO: Dynamic badge count
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStack}
        options={{ title: 'History' }}
      />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarStack}
        options={{ title: 'Calendar' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default TalentNavigator;
