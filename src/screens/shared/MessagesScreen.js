import React from 'react';
import PlaceholderScreen from '../../components/common/PlaceholderScreen';

export default ({ navigation }) => (
  <PlaceholderScreen
    title="Messages"
    description="Your conversations"
    icon="chatbubbles"
    onBack={() => navigation.goBack()}
  />
);
