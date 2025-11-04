import React from 'react';
import PlaceholderScreen from '../../components/common/PlaceholderScreen';

export default ({ navigation }) => (
  <PlaceholderScreen
    title="Chat"
    description="Message conversation"
    icon="chatbubble"
    onBack={() => navigation.goBack()}
  />
);
