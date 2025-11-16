// Seed data for MentorBridge demo
// This file contains sample data for populating the database
//all passwords: demo123456
export const seedStudents = [
  {
    displayName: "Alex Johnson",
    email: "alex.johnson@student.com",
    userType: "student",
    grade: "10th Grade",
    subjects: ["Math", "Physics", "Chemistry"],
    tokens: 85,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Sarah Chen",
    email: "sarah.chen@student.com",
    userType: "student",
    grade: "12th Grade",
    subjects: ["Biology", "English", "History"],
    tokens: 120,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Michael Rodriguez",
    email: "michael.r@student.com",
    userType: "student",
    grade: "9th Grade",
    subjects: ["Math", "Computer Science", "Spanish"],
    tokens: 95,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Emma Wilson",
    email: "emma.wilson@student.com",
    userType: "student",
    grade: "11th Grade",
    subjects: ["English", "Literature", "Art"],
    tokens: 70,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "James Park",
    email: "james.park@student.com",
    userType: "student",
    grade: "College Freshman",
    subjects: ["Calculus", "Physics", "Engineering"],
    tokens: 110,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Olivia Martinez",
    email: "olivia.m@student.com",
    userType: "student",
    grade: "8th Grade",
    subjects: ["Math", "Science", "French"],
    tokens: 60,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Noah Thompson",
    email: "noah.t@student.com",
    userType: "student",
    grade: "College Sophomore",
    subjects: ["Computer Science", "Data Structures", "Algorithms"],
    tokens: 130,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Sophia Lee",
    email: "sophia.lee@student.com",
    userType: "student",
    grade: "10th Grade",
    subjects: ["Chemistry", "Biology", "Math"],
    tokens: 88,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Liam Brown",
    email: "liam.brown@student.com",
    userType: "student",
    grade: "12th Grade",
    subjects: ["History", "Government", "Economics"],
    tokens: 105,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Ava Davis",
    email: "ava.davis@student.com",
    userType: "student",
    grade: "9th Grade",
    subjects: ["English", "Spanish", "Music"],
    tokens: 75,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
    createdAt: new Date().toISOString(),
  },
];

export const seedMentors = [
  {
    displayName: "Dr. Priya Sharma",
    email: "priya.sharma@mentor.com",
    userType: "mentor",
    title: "Senior Software Engineer @ Google",
    bio: "10+ years of experience in software development. Passionate about helping students discover their potential in computer science.",
    subjects: ["Computer Science", "Programming", "Career Guidance"],
    rating: 4.9,
    totalSessions: 127,
    verified: true,
    hourlyRate: 0, // Free mentor
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    whyMentor: "I believe in giving back to the community and helping the next generation of developers succeed.",
    education: "M.S. Computer Science, Stanford University",
    experience: "10 years at Google, 5 years mentoring students",
    certifications: ["Google Cloud Certified", "AWS Solutions Architect"],
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Prof. David Kim",
    email: "david.kim@tutor.com",
    userType: "tutor",
    title: "Mathematics Professor @ MIT",
    bio: "Mathematics professor with expertise in calculus, linear algebra, and advanced mathematics. Available for tutoring sessions.",
    subjects: ["Math", "Calculus", "Linear Algebra"],
    rating: 4.8,
    totalSessions: 89,
    verified: true,
    hourlyRate: 25,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    whyMentor: "I love making complex mathematical concepts accessible to students.",
    education: "Ph.D. Mathematics, MIT",
    experience: "15 years teaching at MIT",
    certifications: ["Ph.D. Mathematics"],
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Maria Garcia",
    email: "maria.garcia@mentor.com",
    userType: "mentor",
    title: "Product Manager @ Microsoft",
    bio: "Experienced product manager helping students navigate career paths in tech and product management.",
    subjects: ["Career Guidance", "Product Management", "Business"],
    rating: 4.7,
    totalSessions: 95,
    verified: true,
    hourlyRate: 0,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    whyMentor: "I want to help students make informed career decisions and build confidence.",
    education: "MBA, Harvard Business School",
    experience: "8 years in product management",
    certifications: ["PMP Certified"],
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Dr. Robert Chen",
    email: "robert.chen@tutor.com",
    userType: "tutor",
    title: "Physics Teacher",
    bio: "High school physics teacher with 12 years of experience. Specialized in AP Physics and exam preparation.",
    subjects: ["Physics", "AP Physics", "Science"],
    rating: 4.9,
    totalSessions: 156,
    verified: true,
    hourlyRate: 20,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    whyMentor: "Physics can be challenging, but with the right approach, anyone can excel.",
    education: "M.Ed. Science Education, UC Berkeley",
    experience: "12 years teaching high school physics",
    certifications: ["Teaching Credential", "AP Physics Certified"],
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Jennifer Taylor",
    email: "jennifer.taylor@mentor.com",
    userType: "mentor",
    title: "UX Designer @ Apple",
    bio: "UI/UX designer passionate about design thinking and helping students develop their creative skills.",
    subjects: ["Design", "UX/UI", "Creative Thinking"],
    rating: 4.6,
    totalSessions: 72,
    verified: true,
    hourlyRate: 0,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
    whyMentor: "Design is about solving problems creatively. I help students think like designers.",
    education: "B.F.A. Design, Art Center College",
    experience: "7 years in UX design",
    certifications: ["Google UX Design Certificate"],
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Dr. Ahmed Hassan",
    email: "ahmed.hassan@tutor.com",
    userType: "tutor",
    title: "Chemistry Professor",
    bio: "University professor specializing in organic and inorganic chemistry. Available for tutoring and exam prep.",
    subjects: ["Chemistry", "Organic Chemistry", "AP Chemistry"],
    rating: 4.8,
    totalSessions: 103,
    verified: true,
    hourlyRate: 22,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    whyMentor: "Chemistry is everywhere. I help students see the beauty and logic in chemical reactions.",
    education: "Ph.D. Chemistry, University of Cambridge",
    experience: "10 years teaching at university level",
    certifications: ["Ph.D. Chemistry"],
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Lisa Wang",
    email: "lisa.wang@mentor.com",
    userType: "mentor",
    title: "Data Scientist @ Amazon",
    bio: "Data scientist and machine learning enthusiast. Helping students understand data science and AI.",
    subjects: ["Data Science", "Machine Learning", "Python"],
    rating: 4.7,
    totalSessions: 64,
    verified: true,
    hourlyRate: 0,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    whyMentor: "Data science is the future. I want to inspire the next generation of data scientists.",
    education: "M.S. Data Science, Carnegie Mellon",
    experience: "6 years in data science",
    certifications: ["AWS Machine Learning Specialty"],
    createdAt: new Date().toISOString(),
  },
  {
    displayName: "Dr. James Anderson",
    email: "james.anderson@tutor.com",
    userType: "tutor",
    title: "English Literature Professor",
    bio: "English professor specializing in literature analysis, essay writing, and SAT/ACT prep.",
    subjects: ["English", "Literature", "Writing"],
    rating: 4.9,
    totalSessions: 141,
    verified: true,
    hourlyRate: 18,
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    whyMentor: "Great writing opens doors. I help students express themselves clearly and powerfully.",
    education: "Ph.D. English Literature, Oxford University",
    experience: "14 years teaching English",
    certifications: ["Ph.D. English Literature"],
    createdAt: new Date().toISOString(),
  },
];

// Helper function to get future date
export const getFutureDate = (daysFromNow, hours = 14) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hours, 0, 0, 0);
  return date;
};

// Helper function to get past date
export const getPastDate = (daysAgo, hours = 10) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, 0, 0, 0);
  return date;
};

export const generateSessions = (studentIds, mentorIds) => {
  return [
    {
      studentId: studentIds[0],
      studentName: "Alex Johnson",
      mentorId: mentorIds[1], // David Kim
      mentorName: "Prof. David Kim",
      subject: "Calculus",
      duration: 1,
      scheduledAt: getFutureDate(3, 15),
      status: "upcoming",
      cost: 25,
      createdAt: getPastDate(5).toISOString(),
    },
    {
      studentId: studentIds[1],
      studentName: "Sarah Chen",
      mentorId: mentorIds[3], // Robert Chen
      mentorName: "Dr. Robert Chen",
      subject: "AP Physics",
      duration: 1.5,
      scheduledAt: getFutureDate(5, 16),
      status: "upcoming",
      cost: 30,
      createdAt: getPastDate(3).toISOString(),
    },
    {
      studentId: studentIds[2],
      studentName: "Michael Rodriguez",
      mentorId: mentorIds[0], // Priya Sharma
      mentorName: "Dr. Priya Sharma",
      subject: "Computer Science",
      duration: 1,
      scheduledAt: getFutureDate(7, 14),
      status: "upcoming",
      cost: 0, // Free mentor
      createdAt: getPastDate(2).toISOString(),
    },
    {
      studentId: studentIds[4],
      studentName: "James Park",
      mentorId: mentorIds[5], // Ahmed Hassan
      mentorName: "Dr. Ahmed Hassan",
      subject: "Organic Chemistry",
      duration: 2,
      scheduledAt: getPastDate(2, 11),
      status: "completed",
      cost: 44,
      createdAt: getPastDate(10).toISOString(),
      feedback: {
        rating: 5,
        comment: "Excellent tutor! Explained complex concepts clearly.",
        studentName: "James Park",
      },
    },
    {
      studentId: studentIds[6],
      studentName: "Noah Thompson",
      mentorId: mentorIds[0], // Priya Sharma
      mentorName: "Dr. Priya Sharma",
      subject: "Career Guidance",
      duration: 1,
      scheduledAt: getPastDate(5, 13),
      status: "completed",
      cost: 0,
      createdAt: getPastDate(12).toISOString(),
      feedback: {
        rating: 5,
        comment: "Very helpful career advice. Gave me great insights!",
        studentName: "Noah Thompson",
      },
    },
  ];
};

export const generateConversations = (studentIds, mentorIds) => {
  return [
    {
      participants: [studentIds[0], mentorIds[1]],
      participantsData: {
        [studentIds[0]]: { displayName: "Alex Johnson" },
        [mentorIds[1]]: { displayName: "Prof. David Kim" },
      },
      lastMessage: "Thank you for the help with calculus!",
      lastMessageAt: new Date().toISOString(),
      messages: [
        {
          text: "Hi! I need help with calculus limits.",
          senderId: studentIds[0],
          senderName: "Alex Johnson",
          createdAt: getPastDate(2, 10),
        },
        {
          text: "Hello Alex! I'd be happy to help. What specific topic are you struggling with?",
          senderId: mentorIds[1],
          senderName: "Prof. David Kim",
          createdAt: getPastDate(2, 10, 15),
        },
        {
          text: "I'm having trouble with L'Hôpital's rule.",
          senderId: studentIds[0],
          senderName: "Alex Johnson",
          createdAt: getPastDate(2, 11),
        },
        {
          text: "Great! Let's schedule a session. I can explain it step by step.",
          senderId: mentorIds[1],
          senderName: "Prof. David Kim",
          createdAt: getPastDate(2, 11, 30),
        },
        {
          text: "Thank you for the help with calculus!",
          senderId: studentIds[0],
          senderName: "Alex Johnson",
          createdAt: getPastDate(1, 9),
        },
      ],
    },
    {
      participants: [studentIds[1], mentorIds[2]],
      participantsData: {
        [studentIds[1]]: { displayName: "Sarah Chen" },
        [mentorIds[2]]: { displayName: "Maria Garcia" },
      },
      lastMessage: "I'll send you the resources by tomorrow.",
      lastMessageAt: new Date().toISOString(),
      messages: [
        {
          text: "Hi Maria! I'm interested in product management as a career.",
          senderId: studentIds[1],
          senderName: "Sarah Chen",
          createdAt: getPastDate(5, 14),
        },
        {
          text: "That's wonderful! Product management is a great field. What would you like to know?",
          senderId: mentorIds[2],
          senderName: "Maria Garcia",
          createdAt: getPastDate(5, 14, 20),
        },
        {
          text: "What skills do I need to get started?",
          senderId: studentIds[1],
          senderName: "Sarah Chen",
          createdAt: getPastDate(5, 15),
        },
        {
          text: "I'll send you the resources by tomorrow.",
          senderId: mentorIds[2],
          senderName: "Maria Garcia",
          createdAt: getPastDate(4, 16),
        },
      ],
    },
    {
      participants: [studentIds[2], mentorIds[0]],
      participantsData: {
        [studentIds[2]]: { displayName: "Michael Rodriguez" },
        [mentorIds[0]]: { displayName: "Dr. Priya Sharma" },
      },
      lastMessage: "Looking forward to our session!",
      lastMessageAt: new Date().toISOString(),
      messages: [
        {
          text: "Hello! I'm learning Python and need guidance.",
          senderId: studentIds[2],
          senderName: "Michael Rodriguez",
          createdAt: getPastDate(1, 15),
        },
        {
          text: "Hi Michael! I'd love to help you with Python. What are you working on?",
          senderId: mentorIds[0],
          senderName: "Dr. Priya Sharma",
          createdAt: getPastDate(1, 15, 10),
        },
        {
          text: "I'm building a web scraper for a project.",
          senderId: studentIds[2],
          senderName: "Michael Rodriguez",
          createdAt: getPastDate(1, 15, 30),
        },
        {
          text: "Great project! Let's schedule a session and I'll help you with best practices.",
          senderId: mentorIds[0],
          senderName: "Dr. Priya Sharma",
          createdAt: getPastDate(1, 16),
        },
        {
          text: "Looking forward to our session!",
          senderId: studentIds[2],
          senderName: "Michael Rodriguez",
          createdAt: getPastDate(1, 16, 30),
        },
      ],
    },
  ];
};

export const generateReviews = (studentIds, mentorIds) => {
  return [
    {
      mentorId: mentorIds[0], // Priya Sharma
      studentId: studentIds[6],
      studentName: "Noah Thompson",
      rating: 5,
      comment: "Dr. Sharma is an amazing mentor! She helped me understand complex algorithms and gave great career advice. Highly recommend!",
      createdAt: getPastDate(5).toISOString(),
    },
    {
      mentorId: mentorIds[0],
      studentId: studentIds[2],
      studentName: "Michael Rodriguez",
      rating: 5,
      comment: "Best mentor I've had. Very patient and explains things clearly.",
      createdAt: getPastDate(3).toISOString(),
    },
    {
      mentorId: mentorIds[1], // David Kim
      studentId: studentIds[0],
      studentName: "Alex Johnson",
      rating: 5,
      comment: "Prof. Kim made calculus so much easier to understand. Great tutor!",
      createdAt: getPastDate(2).toISOString(),
    },
    {
      mentorId: mentorIds[1],
      studentId: studentIds[4],
      studentName: "James Park",
      rating: 4,
      comment: "Very knowledgeable and helpful. The sessions were well-structured.",
      createdAt: getPastDate(7).toISOString(),
    },
    {
      mentorId: mentorIds[3], // Robert Chen
      studentId: studentIds[1],
      studentName: "Sarah Chen",
      rating: 5,
      comment: "Dr. Chen is excellent at explaining physics concepts. My grades improved significantly!",
      createdAt: getPastDate(4).toISOString(),
    },
    {
      mentorId: mentorIds[3],
      studentId: studentIds[7],
      studentName: "Sophia Lee",
      rating: 5,
      comment: "Amazing tutor! Very patient and makes physics fun.",
      createdAt: getPastDate(6).toISOString(),
    },
    {
      mentorId: mentorIds[5], // Ahmed Hassan
      studentId: studentIds[4],
      studentName: "James Park",
      rating: 5,
      comment: "Excellent tutor! Explained complex concepts clearly.",
      createdAt: getPastDate(2).toISOString(),
    },
    {
      mentorId: mentorIds[7], // James Anderson
      studentId: studentIds[3],
      studentName: "Emma Wilson",
      rating: 5,
      comment: "Dr. Anderson helped me improve my essay writing skills tremendously. Great mentor!",
      createdAt: getPastDate(8).toISOString(),
    },
    {
      mentorId: mentorIds[2], // Maria Garcia
      studentId: studentIds[1],
      studentName: "Sarah Chen",
      rating: 4,
      comment: "Very helpful career guidance. Gave me great insights into product management.",
      createdAt: getPastDate(5).toISOString(),
    },
    {
      mentorId: mentorIds[4], // Jennifer Taylor
      studentId: studentIds[3],
      studentName: "Emma Wilson",
      rating: 4,
      comment: "Great design mentor! Helped me think creatively about UX problems.",
      createdAt: getPastDate(3).toISOString(),
    },
  ];
};

