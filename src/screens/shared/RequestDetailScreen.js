import React from 'react';
import PlaceholderScreen from '../../components/common/PlaceholderScreen';

export default ({ navigation }) => (
  <PlaceholderScreen
    title="Request Details"
    description="Full casting request information"
    icon="document-text"
    onBack={() => navigation.goBack()}
  />
);
