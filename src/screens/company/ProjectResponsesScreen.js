import React from 'react';
import PlaceholderScreen from '../../components/common/PlaceholderScreen';

export default ({ navigation }) => (
  <PlaceholderScreen
    title="Project Responses"
    description="View talent responses"
    icon="mail"
    onBack={() => navigation.goBack()}
  />
);
