// Casta App Color Scheme
// Purple gradient for models/talents, Blue gradient for companies

export default {
  // Talent (Model) Theme - Purple Gradient
  talent: {
    primary: '#8B5CF6', // Purple
    secondary: '#A78BFA', // Light Purple
    gradient: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
    dark: '#6D28D9',
    light: '#DDD6FE',
  },

  // Company Theme - Blue Gradient
  company: {
    primary: '#3B82F6', // Blue
    secondary: '#60A5FA', // Light Blue
    gradient: ['#3B82F6', '#60A5FA', '#93C5FD'],
    dark: '#1E40AF',
    light: '#DBEAFE',
  },

  // Common Colors
  common: {
    black: '#000000',
    white: '#FFFFFF',
    background: '#F9FAFB',
    backgroundDark: '#111827',
    text: '#1F2937',
    textLight: '#6B7280',
    textDark: '#111827',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
  },

  // Status Colors
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    pending: '#F59E0B',
  },

  // Project Type Colors
  projectTypes: {
    advertisement: '#3B82F6', // Blue
    film: '#8B5CF6', // Purple
    tvShow: '#10B981', // Green
    fashion: '#EC4899', // Pink
    photoShoot: '#F59E0B', // Orange
    musicVideo: '#EF4444', // Red
    documentary: '#6366F1', // Indigo
  },

  // Calendar Colors
  calendar: {
    booked: '#8B5CF6', // Purple - Confirmed bookings
    pending: '#F59E0B', // Yellow - Pending confirmation
    available: '#10B981', // Green - Available
    blocked: '#EF4444', // Red - Blocked by user
    past: '#9CA3AF', // Gray - Past dates
    audition: '#3B82F6', // Blue - Auditions/meetings
  },

  // Rating Colors
  rating: {
    star: '#FBBF24', // Gold
    starEmpty: '#E5E7EB', // Gray
  },
};
