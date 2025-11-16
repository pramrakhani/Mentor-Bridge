import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  Calendar,
  Coins,
  Settings,
  LogOut,
  Shield,
  Database,
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { userData, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const studentNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/directory', icon: Users, label: 'Find Mentors' },
    { path: '/chat', icon: MessageCircle, label: 'Messages' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/tokens', icon: Coins, label: 'Token Balance' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/seed', icon: Database, label: 'Seed Data (Dev)' },
  ];

  const mentorNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/directory', icon: Users, label: 'Browse Students' },
    { path: '/chat', icon: MessageCircle, label: 'Messages' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/tokens', icon: Coins, label: 'Earnings' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/seed', icon: Database, label: 'Seed Data (Dev)' },
  ];

  const tutorNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/directory', icon: Users, label: 'Browse Students' },
    { path: '/chat', icon: MessageCircle, label: 'Messages' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/tokens', icon: Coins, label: 'Earnings' },
    { path: '/withdraw', icon: Coins, label: 'Withdraw Tokens' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/seed', icon: Database, label: 'Seed Data (Dev)' },
  ];

  const adminNavItems = [
    { path: '/admin', icon: Shield, label: 'Admin Dashboard' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/directory', icon: Users, label: 'Users' },
  ];

  const navItems =
    userData?.userType === 'admin'
      ? adminNavItems
      : userData?.userType === 'tutor'
      ? tutorNavItems
      : userData?.userType === 'mentor'
      ? mentorNavItems
      : studentNavItems;

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-neutral-100 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-100">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">MB</span>
          </div>
          <span className="text-xl font-bold text-neutral-800">MentorBridge</span>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
            {userData?.displayName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-neutral-800 truncate">
              {userData?.displayName || 'User'}
            </div>
            <div className="text-xs text-neutral-500 capitalize">
              {userData?.userType || 'Student'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? 'bg-primary-50 text-primary-600 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neutral-100">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

