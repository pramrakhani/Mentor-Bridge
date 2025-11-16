import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, query, orderBy, limit, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Sidebar from '../components/Sidebar';
import { Users, BookOpen, Coins, TrendingUp, ArrowDownCircle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { userData } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    totalTokens: 0,
    activeMentors: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch all users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        
        // Fetch all sessions
        const sessionsSnapshot = await getDocs(collection(db, 'sessions'));
        const sessions = sessionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Calculate stats
        const totalTokens = users.reduce((sum, user) => sum + (user.tokens || 0), 0);
        const activeMentors = users.filter(
          (u) => (u.userType === 'mentor' || u.userType === 'tutor') && u.totalSessions > 0
        ).length;

        setStats({
          totalUsers: users.length,
          totalSessions: sessions.length,
          totalTokens: totalTokens,
          activeMentors: activeMentors,
        });

        // Recent users
        const recentUsersQuery = query(
          collection(db, 'users'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const recentUsersSnapshot = await getDocs(recentUsersQuery);
        setRecentUsers(
          recentUsersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        // Recent sessions
        const recentSessionsQuery = query(
          collection(db, 'sessions'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const recentSessionsSnapshot = await getDocs(recentSessionsQuery);
        setRecentSessions(
          recentSessionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        // Pending withdrawals
        const withdrawalsQuery = query(
          collection(db, 'withdrawals'),
          where('status', '==', 'pending'),
          orderBy('createdAt', 'desc')
        );
        const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
        setPendingWithdrawals(
          withdrawalsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleApproveWithdrawal = async (withdrawalId) => {
    try {
      await updateDoc(doc(db, 'withdrawals', withdrawalId), {
        status: 'completed',
        processedAt: new Date().toISOString(),
      });
      
      // Refresh withdrawals
      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
      setPendingWithdrawals(
        withdrawalsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      alert('Failed to approve withdrawal. Please try again.');
    }
  };

  if (userData?.userType !== 'admin') {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="text-center py-12">
            <p className="text-neutral-500">Access denied. Admin only.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-8">Admin Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Total Users</div>
                  <div className="text-3xl font-bold text-neutral-800">
                    {loading ? '...' : stats.totalUsers}
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Total Sessions</div>
                  <div className="text-3xl font-bold text-neutral-800">
                    {loading ? '...' : stats.totalSessions}
                  </div>
                </div>
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-secondary-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Total Tokens</div>
                  <div className="text-3xl font-bold text-neutral-800">
                    {loading ? '...' : stats.totalTokens.toLocaleString()}
                  </div>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <Coins className="w-6 h-6 text-success-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Active Mentors</div>
                  <div className="text-3xl font-bold text-neutral-800">
                    {loading ? '...' : stats.activeMentors}
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Recent Users</h2>
              {loading ? (
                <div className="text-neutral-500">Loading...</div>
              ) : recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-500 font-semibold">
                            {user.displayName?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-800">
                            {user.displayName || 'Unknown'}
                          </div>
                          <div className="text-sm text-neutral-500 capitalize">
                            {user.userType}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-600">
                        {user.tokens || 0} tokens
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-neutral-500">No users yet</div>
              )}
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Recent Sessions</h2>
              {loading ? (
                <div className="text-neutral-500">Loading...</div>
              ) : recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3 bg-neutral-50 rounded-lg"
                    >
                      <div className="font-semibold text-neutral-800 mb-1">
                        {session.subject || 'Session'}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {session.studentName} → {session.mentorName}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1 capitalize">
                        Status: {session.status || 'unknown'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-neutral-500">No sessions yet</div>
              )}
            </div>
          </div>

          {/* Pending Withdrawals */}
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-800 flex items-center space-x-2">
                <ArrowDownCircle className="w-5 h-5" />
                <span>Pending Withdrawals</span>
              </h2>
              {pendingWithdrawals.length > 0 && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                  {pendingWithdrawals.length} pending
                </span>
              )}
            </div>
            {loading ? (
              <div className="text-neutral-500">Loading...</div>
            ) : pendingWithdrawals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Tutor</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Tokens</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Method</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Payout Details</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-3 px-4 text-sm text-neutral-600">
                          {withdrawal.createdAt?.seconds
                            ? format(new Date(withdrawal.createdAt.seconds * 1000), 'MMM d, yyyy')
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-neutral-800">
                          {withdrawal.tutorName || 'Unknown'}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-800">
                          {withdrawal.tokens}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-neutral-800">
                          ₹{withdrawal.netAmount?.toFixed(2) || '0.00'}
                          <div className="text-xs text-neutral-500">
                            (Commission: ₹{withdrawal.commission?.toFixed(2) || '0.00'})
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-600 capitalize">
                          {withdrawal.payoutMethod}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-600">
                          {withdrawal.payoutDetails}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleApproveWithdrawal(withdrawal.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-semibold flex items-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pending withdrawals</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

