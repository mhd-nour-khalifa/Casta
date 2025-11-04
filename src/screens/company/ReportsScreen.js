import React from 'react';
import PlaceholderScreen from '../../components/common/PlaceholderScreen';

export default ({ navigation }) => (
  <PlaceholderScreen
    title="Reports"
    description="Project analytics and reports"
    icon="stats-chart"
    onBack={() => navigation.goBack()}
  />
);
