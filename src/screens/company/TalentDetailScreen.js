import React from 'react';
import PlaceholderScreen from '../../components/common/PlaceholderScreen';

export default ({ navigation }) => (
  <PlaceholderScreen
    title="Talent Profile"
    description="View talent details"
    icon="person"
    onBack={() => navigation.goBack()}
  />
);
