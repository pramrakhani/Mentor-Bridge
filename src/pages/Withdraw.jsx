import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Sidebar from '../components/Sidebar';
import TokenBalance from '../components/TokenBalance';
import { Coins, ArrowDownCircle, History, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

// Configuration constants
const TOKEN_TO_RUPEE_RATE = 1; // 1 token = ₹1
const PLATFORM_COMMISSION = 0.10; // 10% commission

export default function Withdraw() {
  const { userData, currentUser } = useAuth();
  const [tokensToWithdraw, setTokensToWithdraw] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('upi');
  const [payoutDetails, setPayoutDetails] = useState({
    upi: '',
    bankAccount: '',
    bankIFSC: '',
    paypalEmail: '',
  });
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (currentUser && userData?.userType === 'tutor') {
      fetchWithdrawalHistory();
    }
  }, [currentUser, userData]);

  const fetchWithdrawalHistory = async () => {
    try {
      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        where('tutorId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(withdrawalsQuery);
      setWithdrawalHistory(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      console.error('Error fetching withdrawal history:', error);
    }
  };

  const calculatePayout = (tokens) => {
    const grossAmount = tokens * TOKEN_TO_RUPEE_RATE;
    const commission = grossAmount * PLATFORM_COMMISSION;
    const netAmount = grossAmount - commission;
    return {
      grossAmount,
      commission,
      netAmount,
    };
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const tokens = parseInt(tokensToWithdraw);
    if (!tokens || tokens <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid number of tokens' });
      return;
    }

    if (tokens > userData.tokens) {
      setMessage({ type: 'error', text: 'Insufficient tokens. You cannot withdraw more than your balance.' });
      return;
    }

    // Validate payout details based on method
    let details = '';
    if (payoutMethod === 'upi' && !payoutDetails.upi) {
      setMessage({ type: 'error', text: 'Please enter your UPI ID' });
      return;
    } else if (payoutMethod === 'bank' && (!payoutDetails.bankAccount || !payoutDetails.bankIFSC)) {
      setMessage({ type: 'error', text: 'Please enter bank account and IFSC code' });
      return;
    } else if (payoutMethod === 'paypal' && !payoutDetails.paypalEmail) {
      setMessage({ type: 'error', text: 'Please enter your PayPal email' });
      return;
    }

    setSubmitting(true);

    try {
      const payout = calculatePayout(tokens);

      // Create withdrawal request
      const withdrawalData = {
        tutorId: currentUser.uid,
        tutorName: userData.displayName,
        tokens: tokens,
        grossAmount: payout.grossAmount,
        commission: payout.commission,
        netAmount: payout.netAmount,
        payoutMethod: payoutMethod,
        payoutDetails: payoutMethod === 'upi' 
          ? payoutDetails.upi 
          : payoutMethod === 'bank'
          ? `${payoutDetails.bankAccount} (IFSC: ${payoutDetails.bankIFSC})`
          : payoutDetails.paypalEmail,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'withdrawals'), withdrawalData);

      // Deduct tokens from user balance
      await updateDoc(doc(db, 'users', currentUser.uid), {
        tokens: userData.tokens - tokens,
      });

      setMessage({ 
        type: 'success', 
        text: `Withdrawal request submitted successfully! ₹${payout.netAmount.toFixed(2)} will be processed within 2-3 business days.` 
      });

      // Reset form
      setTokensToWithdraw('');
      setPayoutDetails({
        upi: '',
        bankAccount: '',
        bankIFSC: '',
        paypalEmail: '',
      });

      // Refresh history
      await fetchWithdrawalHistory();
      
      // Refresh user data (tokens will update on next auth check)
      window.location.reload();
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      setMessage({ type: 'error', text: 'Failed to submit withdrawal request. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (userData?.userType !== 'tutor') {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="text-center py-12">
            <p className="text-neutral-500">This page is only available for tutors.</p>
          </div>
        </div>
      </div>
    );
  }

  const payout = tokensToWithdraw 
    ? calculatePayout(parseInt(tokensToWithdraw) || 0)
    : null;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-800 mb-8">Withdraw Tokens</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Withdrawal Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Token Balance */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <TokenBalance />
              </div>

              {/* Withdrawal Form */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">Request Withdrawal</h2>

                {message.text && (
                  <div
                    className={`mb-4 p-4 rounded-lg ${
                      message.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Tokens to Withdraw
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={tokensToWithdraw}
                        onChange={(e) => setTokensToWithdraw(e.target.value)}
                        min="1"
                        max={userData.tokens}
                        required
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter amount"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 text-sm">
                        Max: {userData.tokens || 0}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Available tokens: {userData.tokens || 0}
                    </p>
                  </div>

                  {/* Payout Calculation Preview */}
                  {payout && parseInt(tokensToWithdraw) > 0 && (
                    <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Gross Amount:</span>
                          <span className="font-semibold">₹{payout.grossAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Platform Commission ({PLATFORM_COMMISSION * 100}%):</span>
                          <span className="text-red-600">-₹{payout.commission.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-primary-200 pt-2 flex justify-between">
                          <span className="font-semibold text-neutral-800">Net Payout:</span>
                          <span className="font-bold text-primary-600 text-lg">
                            ₹{payout.netAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payout Method */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Payout Method
                    </label>
                    <select
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="upi">UPI</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>

                  {/* Payout Details */}
                  {payoutMethod === 'upi' && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        value={payoutDetails.upi}
                        onChange={(e) => setPayoutDetails({ ...payoutDetails, upi: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="yourname@upi"
                      />
                    </div>
                  )}

                  {payoutMethod === 'bank' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Bank Account Number
                        </label>
                        <input
                          type="text"
                          value={payoutDetails.bankAccount}
                          onChange={(e) => setPayoutDetails({ ...payoutDetails, bankAccount: e.target.value })}
                          required
                          className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter account number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          value={payoutDetails.bankIFSC}
                          onChange={(e) => setPayoutDetails({ ...payoutDetails, bankIFSC: e.target.value.toUpperCase() })}
                          required
                          className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="BANK0001234"
                        />
                      </div>
                    </>
                  )}

                  {payoutMethod === 'paypal' && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        PayPal Email
                      </label>
                      <input
                        type="email"
                        value={payoutDetails.paypalEmail}
                        onChange={(e) => setPayoutDetails({ ...payoutDetails, paypalEmail: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !tokensToWithdraw || parseInt(tokensToWithdraw) <= 0}
                    className="w-full py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <ArrowDownCircle className="w-5 h-5" />
                    <span>{submitting ? 'Submitting...' : 'Request Withdrawal'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-neutral-800 mb-4">Withdrawal Info</h3>
                <div className="space-y-3 text-sm text-neutral-600">
                  <div>
                    <strong>Conversion Rate:</strong> 1 token = ₹{TOKEN_TO_RUPEE_RATE}
                  </div>
                  <div>
                    <strong>Platform Commission:</strong> {PLATFORM_COMMISSION * 100}%
                  </div>
                  <div className="pt-3 border-t border-neutral-200">
                    <p className="text-xs">
                      Withdrawals are processed within 2-3 business days. You'll receive a confirmation email once processed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal History */}
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-800 flex items-center space-x-2">
                <History className="w-5 h-5" />
                <span>Withdrawal History</span>
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-8 text-neutral-500">Loading history...</div>
            ) : withdrawalHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Tokens</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Method</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawalHistory.map((withdrawal) => (
                      <tr key={withdrawal.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-3 px-4 text-sm text-neutral-600">
                          {withdrawal.createdAt?.seconds
                            ? format(new Date(withdrawal.createdAt.seconds * 1000), 'MMM d, yyyy')
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-neutral-800">
                          {withdrawal.tokens}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-neutral-800">
                          ₹{withdrawal.netAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-600 capitalize">
                          {withdrawal.payoutMethod}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                              withdrawal.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : withdrawal.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {withdrawal.status === 'completed' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : withdrawal.status === 'pending' ? (
                              <Clock className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            <span className="capitalize">{withdrawal.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No withdrawal history yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

