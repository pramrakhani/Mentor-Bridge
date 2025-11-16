import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Users, BookOpen, MessageCircle, Video, Award } from 'lucide-react';

export default function Landing() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-400/10">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-8 h-8 text-primary-500" />
          <span className="text-2xl font-bold text-neutral-800">MentorBridge</span>
        </div>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <Link
              to="/dashboard"
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-2 text-neutral-800 hover:text-primary-500 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-neutral-800 mb-6">
          Connect with Mentors.
          <br />
          <span className="text-primary-500">Learn from Experts.</span>
          <br />
          Grow Together.
        </h1>
        <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
          Access affordable tutoring, free mentorship, and study guidance. 
          Get 100 free tokens to start your learning journey today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="px-8 py-4 bg-primary-500 text-white rounded-lg text-lg font-semibold hover:bg-primary-600 transition shadow-lg"
          >
            Find a Mentor (Free)
          </Link>
          <Link
            to="/signup"
            className="px-8 py-4 bg-secondary-500 text-white rounded-lg text-lg font-semibold hover:bg-secondary-400 transition shadow-lg"
          >
            Book a Tutor (Tokens)
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-neutral-800 mb-2">500+</div>
            <div className="text-neutral-600">Active Mentors</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <BookOpen className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-neutral-800 mb-2">10,000+</div>
            <div className="text-neutral-600">Sessions Completed</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <Award className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-neutral-800 mb-2">100</div>
            <div className="text-neutral-600">Free Starter Tokens</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-neutral-800 mb-12">
          Why Choose MentorBridge?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow-md">
            <MessageCircle className="w-10 h-10 text-primary-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Free Mentorship</h3>
            <p className="text-neutral-600">
              Connect with mentors for guidance, motivation, and career advice at no cost.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md">
            <Video className="w-10 h-10 text-primary-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Flexible Communication</h3>
            <p className="text-neutral-600">
              Chat, call, or video call. Choose what works best for you.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md">
            <Award className="w-10 h-10 text-primary-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Token Economy</h3>
            <p className="text-neutral-600">
              Affordable tutoring with our token system. Start with 100 free tokens.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="bg-primary-500 text-white rounded-2xl p-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already learning with MentorBridge
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-primary-500 rounded-lg text-lg font-semibold hover:bg-neutral-50 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-neutral-100">
        <div className="text-center text-neutral-600">
          <p>&copy; 2025 MentorBridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

