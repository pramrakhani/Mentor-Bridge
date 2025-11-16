import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import Sidebar from '../components/Sidebar';
import TokenBalance from '../components/TokenBalance';
import { Calendar, Clock, Coins, CheckCircle } from 'lucide-react';
import { format, addHours } from 'date-fns';

export default function Booking() {
  const { mentorId } = useParams();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const mentorDoc = await getDoc(doc(db, 'users', mentorId));
        if (mentorDoc.exists()) {
          setMentor({ id: mentorDoc.id, ...mentorDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching mentor:', error);
      } finally {
        setLoading(false);
      }
    };

    if (mentorId) {
      fetchMentor();
    }
  }, [mentorId]);

  const calculateCost = () => {
    if (!mentor || mentor.userType === 'mentor') return 0;
    return (mentor.hourlyRate || 15) * duration;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedDate || !selectedTime) {
      setError('Please select date and time');
      return;
    }

    const cost = calculateCost();
    if (cost > 0 && userData.tokens < cost) {
      setError(`Insufficient tokens. You need ${cost} tokens but only have ${userData.tokens}.`);
      return;
    }

    setBooking(true);

    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}`);
      
      // Create session
      const sessionData = {
        studentId: userData.uid,
        mentorId: mentor.id,
        studentName: userData.displayName,
        mentorName: mentor.displayName,
        subject: subject || 'General',
        duration: duration,
        scheduledAt: scheduledAt,
        status: 'upcoming',
        cost: cost,
        createdAt: new Date().toISOString(),
      };

      const sessionRef = await addDoc(collection(db, 'sessions'), sessionData);

      // Deduct tokens if paid session
      if (cost > 0) {
        await updateDoc(doc(db, 'users', userData.uid), {
          tokens: userData.tokens - cost,
        });
      }

      // Create or update conversation
      const conversationsQuery = collection(db, 'conversations');
      const existingConv = await getDoc(
        doc(db, 'conversations', `${userData.uid}_${mentor.id}`)
      );
      
      if (!existingConv.exists()) {
        await addDoc(conversationsQuery, {
          id: `${userData.uid}_${mentor.id}`,
          participants: [userData.uid, mentor.id],
          participantsData: {
            [userData.uid]: { displayName: userData.displayName },
            [mentor.id]: { displayName: mentor.displayName },
          },
          lastMessage: `Session booked for ${format(scheduledAt, 'MMM d, h:mm a')}`,
          lastMessageAt: new Date().toISOString(),
        });
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking session:', error);
      setError('Failed to book session. Please try again.');
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="text-center py-12">
            <p className="text-neutral-500">Mentor not found</p>
          </div>
        </div>
      </div>
    );
  }

  const cost = calculateCost();
  const isFree = mentor.userType === 'mentor' || cost === 0;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-800 mb-8">Book a Session</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-500 font-bold text-2xl">
                      {mentor.displayName?.[0]?.toUpperCase() || 'M'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-800">
                      {mentor.displayName || 'Mentor'}
                    </h2>
                    <p className="text-neutral-600 capitalize">{mentor.userType}</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Subject/Topic
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Math, Python, Career Advice"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Duration (hours)
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value={0.5}>30 minutes</option>
                      <option value={1}>1 hour</option>
                      <option value={1.5}>1.5 hours</option>
                      <option value={2}>2 hours</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={booking}
                    className="w-full py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {booking ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Booking...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Confirm Booking</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <TokenBalance />

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-neutral-800 mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-neutral-600">
                    <span>Duration</span>
                    <span className="font-semibold">{duration} hour{duration !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Rate</span>
                    <span className="font-semibold">
                      {isFree ? 'Free' : `${mentor.hourlyRate || 15} tokens/hr`}
                    </span>
                  </div>
                  <div className="border-t border-neutral-200 pt-3 flex justify-between">
                    <span className="font-semibold text-neutral-800">Total Cost</span>
                    <span className="font-bold text-primary-500 text-lg">
                      {isFree ? 'Free' : `${cost} tokens`}
                    </span>
                  </div>
                  {!isFree && (
                    <div className="text-sm text-neutral-500 pt-2">
                      You'll have {userData.tokens - cost} tokens remaining
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

