import { useAuth } from '../contexts/AuthContext';
import { Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TokenBalance() {
  const { userData } = useAuth();
  const tokens = userData?.tokens || 0;

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Coins className="w-6 h-6" />
          <span className="text-lg font-semibold">Token Balance</span>
        </div>
        <Link
          to="/tokens"
          className="text-sm underline opacity-90 hover:opacity-100"
        >
          Buy More
        </Link>
      </div>
      <div className="text-4xl font-bold mb-2">{tokens}</div>
      <div className="text-sm opacity-90">Available tokens</div>
    </div>
  );
}

