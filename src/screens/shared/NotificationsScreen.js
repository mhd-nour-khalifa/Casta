import React from 'react';
import PlaceholderScreen from '../../components/common/PlaceholderScreen';

export default ({ navigation }) => (
  <PlaceholderScreen
    title="Notifications"
    description="Your notifications"
    icon="notifications"
    onBack={() => navigation.goBack()}
  />
);
