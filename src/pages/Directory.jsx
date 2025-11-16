import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import Sidebar from '../components/Sidebar';
import { Search, Filter, Star, MessageCircle, Video, Clock } from 'lucide-react';

export default function Directory() {
  const { userData } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // If user is a tutor/mentor, show students. Otherwise show mentors/tutors
        const targetUserType = userData?.userType === 'tutor' || userData?.userType === 'mentor'
          ? 'student'
          : ['mentor', 'tutor'];
        
        const usersQuery = query(
          collection(db, 'users'),
          typeof targetUserType === 'string'
            ? where('userType', '==', targetUserType)
            : where('userType', 'in', targetUserType)
        );
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMentors(usersData);
        setFilteredMentors(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userData]);

  useEffect(() => {
    let filtered = mentors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (mentor) =>
          mentor.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.subjects?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter((mentor) =>
        mentor.subjects?.includes(selectedSubject)
      );
    }

    // Filter by type (only for students viewing mentors/tutors)
    if (userData?.userType === 'student' && selectedType !== 'all') {
      filtered = filtered.filter((person) => person.userType === selectedType);
    }

    setFilteredMentors(filtered);
  }, [searchTerm, selectedSubject, selectedType, mentors, userData]);

  const allSubjects = Array.from(
    new Set(mentors.flatMap((m) => m.subjects || []))
  ).sort();

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-8">
            {userData?.userType === 'tutor' || userData?.userType === 'mentor'
              ? 'Browse Students'
              : 'Find Mentors & Tutors'}
          </h1>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Subjects</option>
                {allSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {userData?.userType === 'student' && (
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="mentor">Mentors (Free)</option>
                  <option value="tutor">Tutors (Paid)</option>
                </select>
              )}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12 text-neutral-500">
              Loading {userData?.userType === 'tutor' || userData?.userType === 'mentor' ? 'students' : 'mentors'}...
            </div>
          ) : filteredMentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((person) => (
                <div
                  key={person.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-500 font-semibold text-lg">
                          {person.displayName?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-800">
                          {person.displayName || (userData?.userType === 'tutor' || userData?.userType === 'mentor' ? 'Student' : 'Mentor')}
                        </div>
                        <div className="text-sm text-neutral-500 capitalize">
                          {person.userType}
                          {person.grade && ` • ${person.grade}`}
                        </div>
                      </div>
                    </div>
                    {person.rating && (userData?.userType === 'student') && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">{person.rating}</span>
                      </div>
                    )}
                  </div>

                  {person.bio && (
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {person.bio}
                    </p>
                  )}

                  {person.subjects && person.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {person.subjects.slice(0, 3).map((subject, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded"
                        >
                          {subject}
                        </span>
                      ))}
                      {person.subjects.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded">
                          +{person.subjects.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div className="text-sm">
                      {userData?.userType === 'tutor' || userData?.userType === 'mentor' ? (
                        <span className="text-neutral-600">
                          {person.tokens || 0} tokens
                        </span>
                      ) : person.userType === 'mentor' ? (
                        <span className="text-success-500 font-semibold">Free</span>
                      ) : (
                        <span className="text-neutral-800 font-semibold">
                          {person.hourlyRate || 15} tokens/hr
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/chat/${person.id}`}
                        className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition"
                        title="Message"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/profile/${person.id}`}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition text-sm font-semibold"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-neutral-500 text-lg mb-2">
                No {userData?.userType === 'tutor' || userData?.userType === 'mentor' ? 'students' : 'mentors'} found
              </p>
              <p className="text-neutral-400 text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

