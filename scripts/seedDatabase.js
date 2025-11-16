/**
 * Seed Database Script for MentorBridge
 * 
 * This script populates Firestore with demo data including:
 * - Students, Mentors, Sessions, Conversations, and Reviews
 * 
 * Usage:
 *   node scripts/seedDatabase.js
 * 
 * Prerequisites:
 *   - Firebase project configured
 *   - Firestore database created
 *   - Authentication enabled (for creating users)
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {
  seedStudents,
  seedMentors,
  generateSessions,
  generateConversations,
  generateReviews,
} from '../src/utils/seedData.js';

// Firebase configuration - update with your config
const firebaseConfig = {
  apiKey: "AIzaSyBwE48Y7zTPCzKUpv1UX2OAHlqeMZFqkiE",
  authDomain: "mentor-bridge-1e158.firebaseapp.com",
  projectId: "mentor-bridge-1e158",
  storageBucket: "mentor-bridge-1e158.firebasestorage.app",
  messagingSenderId: "666720829430",
  appId: "1:666720829430:web:71d48c9777e5cd83ca51d7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Helper function to create user and return UID
async function createUserWithData(userData) {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      'demo123456' // Default password for demo users
    );
    const uid = userCredential.user.uid;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      uid: uid,
      createdAt: serverTimestamp(),
    });

    console.log(`✓ Created user: ${userData.displayName} (${uid})`);
    return uid;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`⚠ User already exists: ${userData.email}`);
      // Try to get existing user - in real scenario, you'd query by email
      // For demo, we'll skip and return null
      return null;
    }
    console.error(`✗ Error creating user ${userData.displayName}:`, error.message);
    return null;
  }
}

// Seed students
async function seedStudents() {
  console.log('\n📚 Seeding Students...');
  const studentIds = [];

  for (const student of seedStudents) {
    const uid = await createUserWithData(student);
    if (uid) {
      studentIds.push(uid);
    }
  }

  console.log(`✓ Created ${studentIds.length} students`);
  return studentIds;
}

// Seed mentors
async function seedMentors() {
  console.log('\n👨‍🏫 Seeding Mentors & Tutors...');
  const mentorIds = [];

  for (const mentor of seedMentors) {
    const uid = await createUserWithData(mentor);
    if (uid) {
      mentorIds.push(uid);
    }
  }

  console.log(`✓ Created ${mentorIds.length} mentors/tutors`);
  return mentorIds;
}

// Seed sessions
async function seedSessions(studentIds, mentorIds) {
  console.log('\n📅 Seeding Sessions...');
  const sessions = generateSessions(studentIds, mentorIds);
  let count = 0;

  for (const session of sessions) {
    try {
      // Convert dates to Firestore Timestamps
      const sessionData = {
        ...session,
        scheduledAt: session.scheduledAt,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'sessions'), sessionData);
      count++;
      console.log(`✓ Created session: ${session.subject} (${session.studentName} → ${session.mentorName})`);
    } catch (error) {
      console.error(`✗ Error creating session:`, error.message);
    }
  }

  console.log(`✓ Created ${count} sessions`);
}

// Seed conversations
async function seedConversations(studentIds, mentorIds) {
  console.log('\n💬 Seeding Conversations...');
  const conversations = generateConversations(studentIds, mentorIds);
  let count = 0;

  for (const conv of conversations) {
    try {
      // Create conversation document
      const convRef = await addDoc(collection(db, 'conversations'), {
        participants: conv.participants,
        participantsData: conv.participantsData,
        lastMessage: conv.lastMessage,
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      // Add messages to subcollection
      for (const message of conv.messages) {
        await addDoc(collection(db, 'conversations', convRef.id, 'messages'), {
          ...message,
          createdAt: message.createdAt,
        });
      }

      count++;
      console.log(`✓ Created conversation with ${conv.messages.length} messages`);
    } catch (error) {
      console.error(`✗ Error creating conversation:`, error.message);
    }
  }

  console.log(`✓ Created ${count} conversations`);
}

// Seed reviews
async function seedReviews(studentIds, mentorIds) {
  console.log('\n⭐ Seeding Reviews...');
  const reviews = generateReviews(studentIds, mentorIds);
  let count = 0;

  for (const review of reviews) {
    try {
      await addDoc(collection(db, 'reviews'), {
        ...review,
        createdAt: serverTimestamp(),
      });
      count++;
      console.log(`✓ Created review for mentor (Rating: ${review.rating})`);
    } catch (error) {
      console.error(`✗ Error creating review:`, error.message);
    }
  }

  console.log(`✓ Created ${count} reviews`);
}

// Main seed function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');
  console.log('⚠️  Note: This will create demo users with password "demo123456"');
  console.log('⚠️  Make sure Firestore is in test mode or has proper security rules\n');

  try {
    // Seed users
    const studentIds = await seedStudents();
    const mentorIds = await seedMentors();

    if (studentIds.length === 0 || mentorIds.length === 0) {
      console.log('\n⚠️  Warning: Some users already exist. Skipping related data.');
      console.log('   To reset, delete users from Firebase Console first.\n');
    }

    // Seed related data
    if (studentIds.length > 0 && mentorIds.length > 0) {
      await seedSessions(studentIds, mentorIds);
      await seedConversations(studentIds, mentorIds);
      await seedReviews(studentIds, mentorIds);
    }

    console.log('\n✅ Database seeding completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Check Firebase Console to verify data');
    console.log('   2. Login with any demo user (email + password: demo123456)');
    console.log('   3. Explore the platform with demo data\n');
  } catch (error) {
    console.error('\n✗ Error during seeding:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();

