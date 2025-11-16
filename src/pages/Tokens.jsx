import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import TokenBalance from '../components/TokenBalance';
import { Coins, ShoppingCart } from 'lucide-react';

export default function Tokens() {
  const { userData } = useAuth();

  const tokenPackages = [
    { tokens: 50, price: 99, popular: false },
    { tokens: 100, price: 179, popular: true },
    { tokens: 250, price: 399, popular: false },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-800 mb-8">Token Marketplace</h1>

          <div className="mb-8">
            <TokenBalance />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-neutral-800 mb-4">Recent Transactions</h2>
            <div className="text-center py-8 text-neutral-500">
              <Coins className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No transactions yet</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-6">Buy More Tokens</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tokenPackages.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`p-6 border-2 rounded-xl transition ${
                    pkg.popular
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  {pkg.popular && (
                    <div className="text-xs font-semibold text-primary-500 mb-2">POPULAR</div>
                  )}
                  <div className="text-3xl font-bold text-neutral-800 mb-2">
                    {pkg.tokens}
                  </div>
                  <div className="text-neutral-600 mb-4">tokens</div>
                  <div className="text-2xl font-bold text-neutral-800 mb-4">
                    ₹{pkg.price}
                  </div>
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      pkg.popular
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-neutral-500 mt-6 text-center">
              Payment integration coming soon. For now, tokens are managed manually by admins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

