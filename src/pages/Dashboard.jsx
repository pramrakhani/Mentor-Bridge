import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import Sidebar from '../components/Sidebar';
import TokenBalance from '../components/TokenBalance';
import { Calendar, Clock, BookOpen, MessageCircle, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { userData } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentConversations, setRecentConversations] = useState([]);
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userData) return;

      try {
        // Fetch upcoming sessions
        const sessionsQuery = query(
          collection(db, 'sessions'),
          where('studentId', '==', userData.uid),
          where('status', '==', 'upcoming'),
          orderBy('scheduledAt', 'asc'),
          limit(5)
        );
        const sessionsSnapshot = await getDocs(sessionsQuery);
        setUpcomingSessions(
          sessionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        // Fetch recent conversations
        const conversationsQuery = query(
          collection(db, 'conversations'),
          where('participants', 'array-contains', userData.uid),
          orderBy('lastMessageAt', 'desc'),
          limit(5)
        );
        const conversationsSnapshot = await getDocs(conversationsQuery);
        setRecentConversations(
          conversationsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        // Fetch recommended mentors (based on subjects)
        if (userData.subjects && userData.subjects.length > 0) {
          const mentorsQuery = query(
            collection(db, 'users'),
            where('userType', 'in', ['mentor', 'tutor']),
            limit(6)
          );
          const mentorsSnapshot = await getDocs(mentorsQuery);
          setRecommendedMentors(
            mentorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userData]);

  const isStudent = userData?.userType === 'student';

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              Welcome back, {userData?.displayName?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-neutral-600">
              {isStudent
                ? "Keep learning and earn XP today. You're on a great journey!"
                : 'Manage your mentorship activities and help students grow.'}
            </p>
          </div>

          {/* Token Balance */}
          {isStudent && (
            <div className="mb-8">
              <TokenBalance />
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              to="/directory"
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-4"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <div className="font-semibold text-neutral-800">Find Mentors</div>
                <div className="text-sm text-neutral-600">Browse available mentors</div>
              </div>
            </Link>
            <Link
              to="/chat"
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-4"
            >
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-secondary-500" />
              </div>
              <div>
                <div className="font-semibold text-neutral-800">Messages</div>
                <div className="text-sm text-neutral-600">View conversations</div>
              </div>
            </Link>
            <Link
              to="/calendar"
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-4"
            >
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-success-500" />
              </div>
              <div>
                <div className="font-semibold text-neutral-800">Calendar</div>
                <div className="text-sm text-neutral-600">View schedule</div>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-800">Upcoming Sessions</h2>
                <Link to="/calendar" className="text-sm text-primary-500 hover:underline">
                  View All
                </Link>
              </div>
              {loading ? (
                <div className="text-neutral-500">Loading...</div>
              ) : upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-800">
                          {session.subject || 'Session'}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {session.scheduledAt
                            ? format(new Date(session.scheduledAt.seconds * 1000), 'MMM d, h:mm a')
                            : 'TBD'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No upcoming sessions</p>
                  <Link
                    to="/directory"
                    className="text-primary-500 hover:underline mt-2 inline-block"
                  >
                    Book a session
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Conversations */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-800">Recent Conversations</h2>
                <Link to="/chat" className="text-sm text-primary-500 hover:underline">
                  View All
                </Link>
              </div>
              {loading ? (
                <div className="text-neutral-500">Loading...</div>
              ) : recentConversations.length > 0 ? (
                <div className="space-y-4">
                  {recentConversations.map((conv) => (
                    <Link
                      key={conv.id}
                      to={`/chat/${conv.id}`}
                      className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition"
                    >
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-500 font-semibold">
                          {conv.otherUserName?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-neutral-800 truncate">
                          {conv.otherUserName || 'Unknown'}
                        </div>
                        <div className="text-sm text-neutral-600 truncate">
                          {conv.lastMessage || 'No messages yet'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                  <Link
                    to="/directory"
                    className="text-primary-500 hover:underline mt-2 inline-block"
                  >
                    {userData?.userType === 'student' 
                      ? 'Find a mentor' 
                      : userData?.userType === 'mentor' || userData?.userType === 'tutor'
                      ? 'Browse students'
                      : 'Browse directory'}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Mentors */}
          {isStudent && recommendedMentors.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-800">Recommended Mentors</h2>
                <Link to="/directory" className="text-sm text-primary-500 hover:underline">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedMentors.map((mentor) => (
                  <Link
                    key={mentor.id}
                    to={`/profile/${mentor.id}`}
                    className="p-4 border border-neutral-200 rounded-lg hover:border-primary-500 hover:shadow-md transition"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-500 font-semibold">
                          {mentor.displayName?.[0]?.toUpperCase() || 'M'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-neutral-800 truncate">
                          {mentor.displayName || 'Mentor'}
                        </div>
                        <div className="text-xs text-neutral-500 capitalize">
                          {mentor.userType}
                        </div>
                      </div>
                    </div>
                    {mentor.subjects && mentor.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {mentor.subjects.slice(0, 2).map((subject, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

