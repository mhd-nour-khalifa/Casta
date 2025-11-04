# 🎬 Casta - Quick Start Guide

## ✅ Project Status: READY TO RUN!

Your Casta mobile app has been successfully created and the development server is running!

---

## 📱 What's Been Built

### ✅ Core Features Implemented

1. **Complete Navigation System**
   - Authentication flow (Welcome → Login → OTP → Dashboard)
   - Talent navigation with 5 tabs (Dashboard, Requests, History, Calendar, Profile)
   - Company navigation with 5 tabs (Dashboard, Create, Projects, Talents, Profile)

2. **Authentication System**
   - Beautiful welcome screen with gradient
   - User type selection (Talent vs Company)
   - Phone number input with Saudi format (+966)
   - OTP verification (demo mode - accepts any 4-digit code)
   - Persistent login with AsyncStorage

3. **Talent Features**
   - **Dashboard**: Beautiful stats cards showing projects, requests, ratings, earnings
   - **Requests Screen**:
     - Real-time countdown timers (updates every second!)
     - Color-coded by urgency (red when < 5 minutes)
     - Accept/Decline functionality
     - View/Viewed status tracking
   - Quick actions and recent activity feed

4. **UI/UX**
   - Purple gradient theme for talents (#8B5CF6)
   - Blue gradient theme for companies (#3B82F6)
   - Smooth animations and transitions
   - Responsive design for all screen sizes
   - Professional color scheme and typography

5. **Mock Data**
   - 5 diverse talent profiles
   - 3 verified companies
   - 3 sample projects
   - 2 active casting requests with live timers
   - Reviews, messages, and calendar events

---

## 🚀 How to Run the App

The Expo development server is already running! Here's how to test it:

### Option 1: iOS Simulator (Mac only)
```bash
# Press 'i' in the terminal where Expo is running
# OR run:
cd ~/Desktop/Casta
npm run ios
```

### Option 2: Android Emulator
```bash
# Press 'a' in the terminal where Expo is running
# OR run:
cd ~/Desktop/Casta
npm run android
```

### Option 3: Physical Device
1. Install "Expo Go" app from App Store or Play Store
2. Scan the QR code shown in the terminal
3. App will load on your device

### Option 4: Web Browser (Quick Preview)
```bash
# Press 'w' in the terminal where Expo is running
# OR run:
cd ~/Desktop/Casta
npm run web
```

---

## 🎯 Testing the App - Step by Step

### 1. Welcome Screen
- Beautiful purple/blue gradient
- "CASTA" logo with tagline
- "Get Started" button

### 2. Select User Type
- Choose "Model / Talent" (purple card)
- Or "Production Company" (blue card)

### 3. Phone Login
- Enter any Saudi phone number
- Format: 5XX XXX XXX (starts with 5)
- Example: 555 123 456
- Click "Continue"

### 4. OTP Verification
- Enter any 4-digit code (demo mode)
- Example: 1234
- Auto-verifies when 4 digits entered

### 5. Talent Dashboard
Explore these features:
- **Stats Cards**: Projects, Requests, Rating, Earnings
- **Quick Actions**: View Requests, Calendar, Edit Profile, Messages
- **Recent Activity**: Latest notifications and updates

### 6. Casting Requests Screen (⭐ Key Feature!)
- See active casting requests
- **Watch the countdown timers** - they update in real-time!
- Timer turns RED when under 5 minutes
- Click "Accept" to accept a request
- Click "Decline" to decline
- Click "View Full Details" for more info

---

## 📂 Project Structure

```
~/Desktop/Casta/
├── src/
│   ├── components/common/    # Reusable components
│   ├── constants/            # Colors, data constants
│   ├── contexts/             # AuthContext for state
│   ├── data/                 # Mock data
│   ├── navigation/           # Navigation setup
│   └── screens/
│       ├── auth/             # Login, OTP, Registration
│       ├── talent/           # Talent-specific screens
│       ├── company/          # Company-specific screens
│       └── shared/           # Shared screens
├── App.js                    # Entry point
├── README.md                 # Full documentation
└── QUICK_START.md           # This file!
```

---

## 🎨 Color Scheme

**Talent Theme (Purple)**
- Primary: `#8B5CF6`
- Secondary: `#A78BFA`
- Light: `#DDD6FE`

**Company Theme (Blue)**
- Primary: `#3B82F6`
- Secondary: `#60A5FA`
- Light: `#DBEAFE`

**Status Colors**
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Orange)
- Error: `#EF4444` (Red)
- Info: `#3B82F6` (Blue)

---

## 🔑 Key Features Highlights

### ⏱️ Real-Time Countdown Timers
The casting request system features sophisticated countdown timers:
- Updates every second
- Shows time in MM:SS format
- Turns red when urgent (< 5 minutes)
- Automatically handles expiration
- Smooth, performant updates

### 📊 Dashboard Statistics
Beautiful gradient cards showing:
- Total projects completed
- Active casting requests
- Average rating (stars)
- Monthly earnings (SAR)

### 🎯 Smart Request Management
- Filter by status (All, Urgent, Viewed)
- View details before accepting
- Track viewed status
- Accept/Decline with confirmations

---

## 📝 Mock Data for Testing

### Demo Talent Account
- Name: Ahmed Al-Hassan
- Phone: +966 555 123 456
- City: Riyadh
- Nationality: Syrian
- Rating: 4.8 ⭐
- Projects: 18 completed

### Demo Company Account
- Company: Elite Productions
- Phone: +966 11 234 5678
- City: Riyadh
- Type: Production House
- Rating: 4.9 ⭐
- Projects: 145

### Active Requests
1. **Summer Fashion Campaign 2025**
   - Company: Elite Productions
   - Type: Advertisement
   - Location: Riyadh
   - Dates: May 15-17, 2025
   - Compensation: 5,000 SAR/day
   - Timer: 25 minutes remaining

2. **Tech Product Launch Video**
   - Company: Bright Marketing
   - Type: Corporate Video
   - Location: Jeddah
   - Dates: May 20-21, 2025
   - Compensation: 8,000 SAR
   - Timer: 45 minutes remaining

---

## 🛠️ Development Commands

```bash
# Start development server
cd ~/Desktop/Casta
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Clear cache if needed
npx expo start -c
```

---

## 🎭 App Demo Flow

1. **Launch** → Welcome screen with gradient
2. **Select** → Choose "Model/Talent"
3. **Login** → Enter phone: 555 123 456
4. **Verify** → Enter OTP: 1234
5. **Dashboard** → See beautiful stats and cards
6. **Requests** → Navigate to "Requests" tab
7. **Watch** → See countdown timers in action!
8. **Accept** → Accept a casting request
9. **Explore** → Check other tabs (History, Calendar, Profile)

---

## 📱 Screenshots Reference

### Welcome Screen
- Purple to blue gradient background
- Large "CASTA" logo
- Tagline: "Connecting Talent with Opportunity"
- Get Started button
- Features showcase

### Talent Dashboard
- Personalized greeting
- 4 gradient stat cards
- Quick action buttons
- Recent activity feed
- Bottom navigation (5 tabs)

### Requests Screen
- Active requests count badge
- Filter tabs (All, Urgent, Viewed)
- Request cards with:
  - Project type badge
  - Countdown timer (MM:SS)
  - Project details
  - Location, dates, compensation
  - Accept/Decline buttons

---

## 🚧 Placeholder Features (Ready for Expansion)

The following screens have placeholder implementations:
- Full 3-step registration flow
- Company registration with documents
- Calendar with booking management
- Messaging system
- Rating and review details
- Profile editing
- Company project creation
- Talent pool browsing
- Analytics and reports

These can be expanded based on requirements!

---

## 💡 Tips for Best Experience

1. **Use iOS Simulator** for best performance and animations
2. **Watch the timers** - they're the star feature!
3. **Try Accept/Decline** - see the confirmation alerts
4. **Explore all tabs** - each has unique design
5. **Check the stats** - beautiful gradient cards
6. **Notice the colors** - purple for talents, blue for companies

---

## 🎉 You're Ready to Go!

The app is fully functional and ready to demonstrate. The development server is running, so just choose your preferred platform (iOS/Android/Web) and start exploring!

**To view the app:**
1. Look at the terminal where Expo is running
2. Press the key for your preferred platform
3. Wait for the app to load
4. Start from the Welcome screen
5. Follow the demo flow above

---

## 📞 Need Help?

If you encounter any issues:
1. Check the terminal for error messages
2. Try clearing the cache: `npx expo start -c`
3. Restart the server: `npm start`
4. Check the README.md for more details

---

**Happy Testing! 🎬✨**

*Casta - Connecting Talent with Opportunity*
