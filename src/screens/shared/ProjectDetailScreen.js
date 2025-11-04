import React from 'react';
import PlaceholderScreen from '../../components/common/PlaceholderScreen';

export default ({ navigation }) => (
  <PlaceholderScreen
    title="Project Details"
    description="Project information"
    icon="briefcase"
    onBack={() => navigation.goBack()}
  />
);
