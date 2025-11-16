import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import Sidebar from '../components/Sidebar';
import { Send, MessageCircle, Video, Phone } from 'lucide-react';
import { format } from 'date-fns';

export default function Chat() {
  const { chatId } = useParams();
  const { userData } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!userData) return;

      try {
        const conversationsQuery = query(
          collection(db, 'conversations'),
          where('participants', 'array-contains', userData.uid),
          orderBy('lastMessageAt', 'desc')
        );
        const conversationsSnapshot = await getDocs(conversationsQuery);
        const conversationsData = conversationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConversations(conversationsData);

        // If chatId is provided, set it as active
        if (chatId) {
          const chat = conversationsData.find((c) => c.id === chatId);
          if (chat) {
            setActiveChat(chat);
          }
        } else if (conversationsData.length > 0) {
          setActiveChat(conversationsData[0]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userData, chatId]);

  useEffect(() => {
    if (!activeChat) return;

    const messagesQuery = query(
      collection(db, 'conversations', activeChat.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
      scrollToBottom();
    });

    return unsubscribe;
  }, [activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !userData) return;

    try {
      await addDoc(collection(db, 'conversations', activeChat.id, 'messages'), {
        text: newMessage,
        senderId: userData.uid,
        senderName: userData.displayName,
        createdAt: serverTimestamp(),
      });

      // Update conversation last message
      await addDoc(collection(db, 'conversations'), {
        ...activeChat,
        lastMessage: newMessage,
        lastMessageAt: serverTimestamp(),
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getOtherUser = (chat) => {
    if (!chat.participants || !userData) return null;
    const otherUserId = chat.participants.find((id) => id !== userData.uid);
    return chat.participantsData?.[otherUserId] || { displayName: 'Unknown' };
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 ml-64 flex">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r border-neutral-100 flex flex-col">
          <div className="p-4 border-b border-neutral-100">
            <h2 className="text-xl font-bold text-neutral-800">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-neutral-500">Loading...</div>
            ) : conversations.length > 0 ? (
              conversations.map((conv) => {
                const otherUser = getOtherUser(conv);
                const isActive = activeChat?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveChat(conv)}
                    className={`w-full p-4 text-left hover:bg-neutral-50 transition ${
                      isActive ? 'bg-primary-50 border-l-4 border-primary-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-500 font-semibold">
                          {otherUser.displayName?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-neutral-800 truncate">
                          {otherUser.displayName || 'Unknown'}
                        </div>
                        <div className="text-sm text-neutral-600 truncate">
                          {conv.lastMessage || 'No messages yet'}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-neutral-500">
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

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-neutral-100 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-500 font-semibold">
                      {getOtherUser(activeChat).displayName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-800">
                      {getOtherUser(activeChat).displayName || 'Unknown'}
                    </div>
                    <div className="text-xs text-neutral-500">Online</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition">
                    <Video className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                  const isOwn = message.senderId === userData?.uid;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-neutral-800 border border-neutral-200'
                        }`}
                      >
                        {!isOwn && (
                          <div className="text-xs font-semibold mb-1 opacity-75">
                            {message.senderName}
                          </div>
                        )}
                        <div>{message.text}</div>
                        {message.createdAt && (
                          <div
                            className={`text-xs mt-1 ${
                              isOwn ? 'text-white opacity-75' : 'text-neutral-500'
                            }`}
                          >
                            {format(
                              new Date(message.createdAt.seconds * 1000),
                              'h:mm a'
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-neutral-100 p-4">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="p-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 text-lg">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

