# Demo Data Seeding Guide

This document provides detailed information about the demo data seeding system for MentorBridge.

## Overview

The seeding system populates your Firestore database with realistic demo data to enable full testing of all platform features without manual data entry.

## What Gets Created

### 1. Student Users (10 total)

Each student includes:
- **Name**: Realistic first and last names
- **Email**: Unique email addresses
- **Grade**: Various grade levels (8th-12th grade, College)
- **Subjects**: 2-3 subject interests per student
- **Token Balance**: Random between 50-130 tokens
- **Profile Photo**: Generated avatar from DiceBear API

**Sample Students:**
- Alex Johnson (10th Grade, Math/Physics/Chemistry, 85 tokens)
- Sarah Chen (12th Grade, Biology/English/History, 120 tokens)
- Michael Rodriguez (9th Grade, Math/CS/Spanish, 95 tokens)
- ... and 7 more

### 2. Mentor/Tutor Profiles (8 total)

Each mentor/tutor includes:
- **Name & Title**: Professional names with job titles
- **User Type**: Either "mentor" (free) or "tutor" (paid)
- **Bio**: Realistic professional background
- **Subjects**: 2-3 subjects they teach/mentor in
- **Rating**: 4.2-5.0 stars
- **Total Sessions**: Number of completed sessions
- **Hourly Rate**: 0 for mentors, 10-30 tokens for tutors
- **Verified Status**: All verified
- **Education & Experience**: Professional credentials
- **Why I Mentor**: Personal motivation statement

**Sample Mentors:**
- Dr. Priya Sharma (Mentor, CS/Programming, 4.9★, Free)
- Prof. David Kim (Tutor, Math/Calculus, 4.8★, 25 tokens/hr)
- Maria Garcia (Mentor, Career/Product Management, 4.7★, Free)
- ... and 5 more

### 3. Sessions (5 total)

Mix of:
- **Upcoming Sessions** (3): Scheduled in the next 2 weeks
- **Completed Sessions** (2): Past sessions with feedback

Each session includes:
- Student and mentor names
- Subject/topic
- Scheduled date/time
- Duration (1-2 hours)
- Token cost (0 for mentors, 10-30 for tutors)
- Status ("upcoming" or "completed")
- Feedback (for completed sessions)

### 4. Conversations (3 total)

Each conversation includes:
- **Participants**: Student and mentor IDs
- **Message History**: 2-5 messages per conversation
- **Timestamps**: Realistic message timing
- **Last Message**: Most recent message preview

**Sample Conversations:**
- Alex Johnson ↔ Prof. David Kim (Calculus help)
- Sarah Chen ↔ Maria Garcia (Career guidance)
- Michael Rodriguez ↔ Dr. Priya Sharma (Python programming)

### 5. Reviews (10 total)

Reviews distributed across mentors:
- **Rating**: 4-5 stars
- **Comment**: Realistic student testimonials
- **Student Name**: Who left the review
- **Timestamp**: When the review was created

## How to Seed

### Method 1: Browser-Based (Easiest)

1. Start your dev server: `npm run dev`
2. Login with any account
3. Navigate to: `http://localhost:5174/seed`
4. Click "Seed Database"
5. Wait for completion message

### Method 2: Command Line

```bash
npm run seed
```

**Note**: Command-line seeding requires Node.js and may need Firebase Admin SDK for full functionality.

## Demo User Login

All seeded users have the same password for easy testing:

- **Password**: `demo123456`
- **Emails**: 
  - `alex.johnson@student.com`
  - `sarah.chen@student.com`
  - `priya.sharma@mentor.com`
  - `david.kim@tutor.com`
  - ... (see seedData.js for full list)

## Data Structure

### Firestore Collections

```
users/
  ├── {studentId}/
  │   ├── displayName
  │   ├── email
  │   ├── userType: "student"
  │   ├── tokens
  │   ├── subjects: []
  │   └── ...
  └── {mentorId}/
      ├── displayName
      ├── userType: "mentor" | "tutor"
      ├── rating
      ├── hourlyRate
      └── ...

sessions/
  ├── {sessionId}/
      ├── studentId
      ├── mentorId
      ├── subject
      ├── scheduledAt
      ├── status
      └── ...

conversations/
  ├── {conversationId}/
      ├── participants: []
      ├── lastMessage
      └── messages/
          ├── {messageId}/
              ├── text
              ├── senderId
              └── createdAt

reviews/
  ├── {reviewId}/
      ├── mentorId
      ├── studentId
      ├── rating
      ├── comment
      └── ...
```

## Customizing Seed Data

To modify the seed data:

1. Edit `src/utils/seedData.js`
2. Modify the arrays:
   - `seedStudents` - Add/remove students
   - `seedMentors` - Add/remove mentors
   - `generateSessions()` - Modify session logic
   - `generateConversations()` - Modify conversation logic
   - `generateReviews()` - Modify review logic

3. Re-run the seed process

## Resetting Data

To start fresh:

1. **Delete Users**: Firebase Console → Authentication → Delete users
2. **Delete Collections**: Firestore → Delete collections:
   - `sessions`
   - `conversations`
   - `reviews`
3. **Re-seed**: Run seed process again

## Security Notes

⚠️ **Important**: 
- Demo users have weak passwords (`demo123456`)
- This is for development/testing only
- Never use demo passwords in production
- Set proper Firestore security rules before deploying

## Troubleshooting

### "Email already in use"
- Users already exist in Firebase Auth
- Delete them from Firebase Console or use different emails

### "Permission denied"
- Check Firestore security rules
- Ensure rules allow authenticated users to write

### "No data showing"
- Check browser console for errors
- Verify Firestore collections were created
- Check that queries match the data structure

## Expected UI Results

After seeding, you should see:

- **Dashboard**: 
  - Upcoming sessions cards
  - Recent conversations list
  - Recommended mentors section

- **Directory**: 
  - 8 mentor/tutor cards with ratings
  - Search and filter working
  - Subject tags visible

- **Chat**: 
  - 3 conversation threads
  - Message history visible
  - Real-time updates working

- **Profile Pages**: 
  - Mentor bios displayed
  - Ratings and reviews shown
  - Subject specialties listed

- **Sessions**: 
  - Mix of upcoming and completed
  - Feedback visible on completed sessions

---

For questions or issues, check the main README.md or open an issue.

