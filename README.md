# MentorBridge - Student Mentorship and Learning Platform

A web-based platform connecting students with mentors, professionals, and tutors through a token-based economy. Built for a 48-hour hackathon.

## Features

- 🎓 **Free Mentorship**: Connect with mentors for guidance and motivation
- 💰 **Token Economy**: Affordable tutoring with a flexible token system
- 💬 **Real-time Chat**: Integrated messaging system for communication
- 📅 **Session Booking**: Schedule and manage tutoring sessions
- 🔍 **Smart Directory**: Search and filter mentors by subject, type, and availability
- 👤 **User Profiles**: Detailed profiles with ratings, reviews, and availability
- 🎫 **100 Free Tokens**: Every new user receives 100 starter tokens
- 🛡️ **Admin Dashboard**: Manage users, sessions, and platform statistics

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v20.13.1 or higher recommended)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mentorbridge
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Copy your Firebase configuration

4. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

5. Add your Firebase configuration to `.env`:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

6. Set up Firestore Security Rules (for development):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Note**: These are permissive rules for development. Implement proper security rules for production.

7. Start the development server:
```bash
npm run dev
```

8. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
mentorbridge/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Sidebar.jsx
│   │   └── TokenBalance.jsx
│   ├── config/          # Configuration files
│   │   └── firebase.js
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/          # Page components
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Directory.jsx
│   │   ├── Profile.jsx
│   │   ├── Chat.jsx
│   │   ├── Booking.jsx
│   │   └── AdminDashboard.jsx
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env.example        # Environment variables template
├── tailwind.config.js  # Tailwind configuration
└── package.json
```

## User Types

- **Students**: Can find mentors (free) or book tutors (token-based)
- **Mentors**: Provide free mentorship and guidance
- **Tutors**: Offer paid tutoring sessions (earn tokens)
- **Admins**: Manage platform, users, and sessions

## Key Features Implementation

### Token System
- New users receive 100 free tokens on signup
- Tokens are deducted when booking paid tutoring sessions
- Tokens can be purchased (payment integration - stretch goal)

### Authentication
- Email/Password authentication
- Google Sign-In
- User profiles stored in Firestore

### Real-time Chat
- Firebase Firestore for message storage
- Real-time updates using onSnapshot
- Conversation management

### Booking System
- Calendar-based scheduling
- Token deduction for paid sessions
- Session management

### Token Withdrawal System (For Tutors)
- Tutors can withdraw earned tokens as real money
- Conversion rate: 1 token = ₹1 (configurable)
- Platform commission: 10% (configurable)
- Multiple payout methods: UPI, Bank Transfer, PayPal
- Withdrawal request tracking and history
- Admin approval workflow for withdrawals

## Seeding Demo Data

To populate your database with sample data for testing and demos, you have two options:

### Option 1: Browser-Based Seeding (Recommended)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Login to the app with any account

3. Navigate to: `http://localhost:5174/seed`

4. Click the "Seed Database" button

This will create:
- **10 Student Users** with diverse profiles, subjects, and token balances (50-130 tokens)
- **8 Mentor/Tutor Profiles** with ratings, bios, and specialties
- **5 Example Sessions** (some upcoming, some completed)
- **3 Sample Conversations** with message history
- **10 Reviews/Testimonials** from students to mentors

**Default Password for Demo Users:** `demo123456`

### Option 2: Command-Line Seeding

1. Run the seed script:
   ```bash
   npm run seed
   ```

2. The script will create all demo data in your Firestore database

### Demo User Credentials

All demo users can be logged in with:
- **Email**: Use any email from the seed data (e.g., `alex.johnson@student.com`)
- **Password**: `demo123456`

### Resetting Demo Data

To reset and re-seed:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Navigate to Authentication → Users
3. Delete the demo users you want to reset
4. Navigate to Firestore Database
5. Delete collections: `sessions`, `conversations`, `reviews`
6. Re-run the seed script or use the browser-based seeder

### Expected Results After Seeding

After seeding, you should see:
- **Dashboard**: Shows upcoming sessions, recent conversations, and recommended mentors
- **Directory**: Displays 8 mentors/tutors with ratings and subjects
- **Chat**: Shows 3 active conversations with message history
- **Profile Pages**: Display mentor bios, ratings, and reviews
- **Sessions**: Mix of upcoming and completed sessions with feedback

## Token Withdrawal Feature

### For Tutors

Tutors can withdraw their earned tokens as real money through the withdrawal system:

1. **Access Withdrawal Page**: Navigate to "Withdraw Tokens" in the sidebar (tutors only)
2. **Enter Withdrawal Amount**: Specify number of tokens to withdraw (max: current balance)
3. **View Payout Calculation**: 
   - Gross Amount = Tokens × Conversion Rate (₹1 per token)
   - Platform Commission = 10% of gross amount
   - Net Payout = Gross Amount - Commission
4. **Select Payout Method**: Choose from UPI, Bank Transfer, or PayPal
5. **Enter Payout Details**: Provide UPI ID, bank account details, or PayPal email
6. **Submit Request**: Tokens are deducted immediately, withdrawal request is created
7. **Track Status**: View withdrawal history with status (pending/completed)

### For Admins

Admins can manage withdrawal requests:

1. **View Pending Withdrawals**: Admin dashboard shows all pending withdrawal requests
2. **Review Details**: See tutor name, amount, payout method, and payout details
3. **Approve Withdrawals**: Click "Approve" to mark withdrawal as completed
4. **Track Processing**: Withdrawals are marked with timestamps and status

### Configuration

Withdrawal settings can be configured in `src/pages/Withdraw.jsx`:
- `TOKEN_TO_RUPEE_RATE`: Conversion rate (default: 1 token = ₹1)
- `PLATFORM_COMMISSION`: Platform commission percentage (default: 0.10 = 10%)

### Database Structure

Withdrawals are stored in Firestore `withdrawals` collection with fields:
- `tutorId`: Tutor's user ID
- `tutorName`: Tutor's display name
- `tokens`: Number of tokens withdrawn
- `grossAmount`: Gross payout amount
- `commission`: Platform commission deducted
- `netAmount`: Final payout amount after commission
- `payoutMethod`: UPI, bank, or paypal
- `payoutDetails`: Payout account details
- `status`: pending, completed, or rejected
- `createdAt`: Request timestamp
- `processedAt`: Approval timestamp (when completed)

### Demo/Development Notes

- **No Real Payments**: This is a demo system. No actual money is transferred
- **Manual Processing**: Admins manually approve withdrawals (simulates payment processing)
- **Token Deduction**: Tokens are deducted immediately upon request submission
- **Processing Time**: Simulated 2-3 business days processing time

## Development Notes

- The app uses Firebase Firestore for data storage
- Real-time updates are implemented using Firestore listeners
- Token transactions are handled in Firestore
- All routes are protected except landing, login, and signup
- Demo data uses synthetic names and avatars (DiceBear API)
- Withdrawal system is for demo purposes only (no real payments processed)

## Future Enhancements (Stretch Goals)

- [ ] Payment integration (Razorpay/Stripe)
- [ ] Video/audio calling (WebRTC/Agora)
- [ ] Group study rooms
- [ ] AI-powered mentor matching
- [ ] Calendar integration and reminders
- [ ] Rating and review system
- [ ] File sharing in chat
- [ ] Mobile app (React Native)

## Contributing

This is a hackathon project. Contributions and improvements are welcome!

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues or questions, please open an issue on the repository.

---

Built with ❤️ for students seeking mentorship and learning opportunities.
