import React from 'react';
import PlaceholderScreen from '../../components/common/PlaceholderScreen';

export default ({ navigation }) => (
  <PlaceholderScreen
    title="Edit Profile"
    description="Update your information"
    icon="create"
    onBack={() => navigation.goBack()}
  />
);
