/**
 * Seed Data Page - Browser-based database seeding
 * 
 * This page allows you to seed the database directly from the browser.
 * Access at: /seed (only in development)
 * 
 * Note: This creates demo users with a default password "demo123456"
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import {
  seedStudents,
  seedMentors,
  generateSessions,
  generateConversations,
  generateReviews,
} from '../utils/seedData';

export default function SeedData() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState('');

  // Helper to create user
  const createUser = async (userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        'demo123456'
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        ...userData,
        uid: uid,
        createdAt: serverTimestamp(),
      });

      return uid;
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        return null; // User already exists
      }
      throw error;
    }
  };

  const handleSeed = async () => {
    if (!currentUser) {
      setStatus('❌ Please login first');
      return;
    }

    setLoading(true);
    setStatus('Starting seed...');
    const studentIds = [];
    const mentorIds = [];

    try {
      // Seed Students
      setProgress('Creating students...');
      for (const student of seedStudents) {
        const uid = await createUser(student);
        if (uid) studentIds.push(uid);
        setProgress(`Created ${studentIds.length}/${seedStudents.length} students...`);
      }
      setStatus(`✓ Created ${studentIds.length} students`);

      // Seed Mentors
      setProgress('Creating mentors...');
      for (const mentor of seedMentors) {
        const uid = await createUser(mentor);
        if (uid) mentorIds.push(uid);
        setProgress(`Created ${mentorIds.length}/${seedMentors.length} mentors...`);
      }
      setStatus(`✓ Created ${mentorIds.length} mentors`);

      if (studentIds.length === 0 || mentorIds.length === 0) {
        setStatus('⚠️ Some users already exist. Continuing with existing data...');
      }

      // Seed Sessions
      if (studentIds.length > 0 && mentorIds.length > 0) {
        setProgress('Creating sessions...');
        const sessions = generateSessions(studentIds, mentorIds);
        for (const session of sessions) {
          await addDoc(collection(db, 'sessions'), {
            ...session,
            scheduledAt: session.scheduledAt instanceof Date 
              ? session.scheduledAt.toISOString() 
              : session.scheduledAt,
            createdAt: serverTimestamp(),
          });
        }
        setStatus(`✓ Created ${sessions.length} sessions`);
      }

      // Seed Conversations
      if (studentIds.length > 0 && mentorIds.length > 0) {
        setProgress('Creating conversations...');
        const conversations = generateConversations(studentIds, mentorIds);
        for (const conv of conversations) {
          const convRef = await addDoc(collection(db, 'conversations'), {
            participants: conv.participants,
            participantsData: conv.participantsData,
            lastMessage: conv.lastMessage,
            lastMessageAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          });

          for (const message of conv.messages) {
            await addDoc(collection(db, 'conversations', convRef.id, 'messages'), {
              ...message,
              createdAt: message.createdAt instanceof Date
                ? message.createdAt.toISOString()
                : message.createdAt,
            });
          }
        }
        setStatus(`✓ Created ${conversations.length} conversations`);
      }

      // Seed Reviews
      if (studentIds.length > 0 && mentorIds.length > 0) {
        setProgress('Creating reviews...');
        const reviews = generateReviews(studentIds, mentorIds);
        for (const review of reviews) {
          await addDoc(collection(db, 'reviews'), {
            ...review,
            createdAt: serverTimestamp(),
          });
        }
        setStatus(`✓ Created ${reviews.length} reviews`);
      }

      setProgress('');
      setStatus('✅ Database seeding completed successfully!');
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error('Seeding error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">
            Seed Demo Data
          </h1>
          <p className="text-neutral-600 mb-6">
            This will populate your Firestore database with demo data including:
          </p>
          <ul className="list-disc list-inside text-neutral-600 mb-6 space-y-2">
            <li>10 student users</li>
            <li>8 mentor/tutor profiles</li>
            <li>5 example sessions</li>
            <li>3 sample conversations with messages</li>
            <li>10 reviews/testimonials</li>
          </ul>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Warning:</strong> This will create demo users with the password{' '}
              <code className="bg-yellow-100 px-1 rounded">demo123456</code>. Make sure
              you have proper Firestore security rules set up.
            </p>
          </div>

          {progress && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">{progress}</p>
            </div>
          )}

          {status && (
            <div
              className={`border rounded-lg p-4 mb-6 ${
                status.includes('✅')
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : status.includes('❌')
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <p className="text-sm">{status}</p>
            </div>
          )}

          <button
            onClick={handleSeed}
            disabled={loading || !currentUser}
            className="w-full py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Seeding Database...' : 'Seed Database'}
          </button>

          {!currentUser && (
            <p className="text-sm text-neutral-500 mt-4 text-center">
              Please login first to seed the database
            </p>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

