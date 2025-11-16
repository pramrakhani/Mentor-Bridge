import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Sidebar from '../components/Sidebar';
import { Star, MessageCircle, Calendar, BookOpen, Clock, Award } from 'lucide-react';

export default function Profile() {
  const { id } = useParams();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileDoc = await getDoc(doc(db, 'users', id));
        if (profileDoc.exists()) {
          setProfile({ id: profileDoc.id, ...profileDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const handleBookSession = () => {
    if (profile?.userType === 'tutor') {
      navigate(`/booking/${id}`);
    } else {
      navigate(`/chat/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="text-center py-12">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="text-center py-12">
            <p className="text-neutral-500">Profile not found</p>
            <Link to="/directory" className="text-primary-500 hover:underline mt-2 inline-block">
              {userData?.userType === 'student' 
                ? 'Browse mentors' 
                : userData?.userType === 'mentor' || userData?.userType === 'tutor'
                ? 'Browse students'
                : 'Browse directory'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = userData?.uid === profile.id;
  const isStudent = userData?.userType === 'student';

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-500 font-bold text-3xl">
                    {profile.displayName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                    {profile.displayName || 'User'}
                  </h1>
                  <div className="flex items-center space-x-4 text-neutral-600">
                    <span className="capitalize">{profile.userType}</span>
                    {profile.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{profile.rating}</span>
                        {profile.totalSessions && (
                          <span className="text-sm">({profile.totalSessions} sessions)</span>
                        )}
                      </div>
                    )}
                  </div>
                  {profile.title && (
                    <p className="text-neutral-600 mt-2">{profile.title}</p>
                  )}
                </div>
              </div>
              {!isOwnProfile && isStudent && (
                <div className="flex items-center space-x-3">
                  <Link
                    to={`/chat/${profile.id}`}
                    className="px-6 py-3 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition font-semibold flex items-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Message</span>
                  </Link>
                  <button
                    onClick={handleBookSession}
                    className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-semibold flex items-center space-x-2"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>
                      {profile.userType === 'tutor' ? 'Book Session' : 'Connect'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md mb-6">
            <div className="flex border-b border-neutral-100">
              {['overview', 'availability', 'experience', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold capitalize transition ${
                    activeTab === tab
                      ? 'text-primary-500 border-b-2 border-primary-500'
                      : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {profile.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800 mb-2">About</h3>
                      <p className="text-neutral-600">{profile.bio}</p>
                    </div>
                  )}
                  {profile.whyMentor && (
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                        Why I Mentor
                      </h3>
                      <p className="text-neutral-600">{profile.whyMentor}</p>
                    </div>
                  )}
                  {profile.subjects && profile.subjects.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                        Specialties
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.subjects.map((subject, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.userType === 'tutor' && (
                    <div className="bg-primary-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-neutral-600">Hourly Rate</div>
                          <div className="text-2xl font-bold text-neutral-800">
                            {profile.hourlyRate || 15} tokens/hour
                          </div>
                        </div>
                        <Clock className="w-8 h-8 text-primary-500" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'availability' && (
                <div>
                  <p className="text-neutral-600">
                    Availability calendar will be displayed here. (To be implemented)
                  </p>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-4">
                  {profile.education && (
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800 mb-2">Education</h3>
                      <p className="text-neutral-600">{profile.education}</p>
                    </div>
                  )}
                  {profile.experience && (
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800 mb-2">Experience</h3>
                      <p className="text-neutral-600">{profile.experience}</p>
                    </div>
                  )}
                  {profile.certifications && profile.certifications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                        Certifications
                      </h3>
                      <ul className="list-disc list-inside text-neutral-600 space-y-1">
                        {profile.certifications.map((cert, idx) => (
                          <li key={idx}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <p className="text-neutral-600">
                    Reviews and testimonials will be displayed here. (To be implemented)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

