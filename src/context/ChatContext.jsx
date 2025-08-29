import React, { createContext, useContext, useState, useEffect } from 'react';
import { translateMessage } from '../utils/translate';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Demo users for the chat system
const initialUsers = [
  {
    id: 1,
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'Admin',
    online: true
  },
  {
    id: 2,
    email: 'staff@demo.com',
    name: 'Staff Member',
    role: 'Staff',
    online: true
  },
  {
    id: 3,
    email: 'agent@demo.com',
    name: 'Agent User',
    role: 'Agent',
    online: true
  }
];

// Sample initial messages
const initialMessages = [
  {
    id: 1,
    senderId: 1,
    receiverId: 2,
    senderName: 'Admin User',
    senderRole: 'Admin',
    text: 'Welcome to the chat system! I\'m the admin.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
    product: null
  },
  {
    id: 2,
    senderId: 2,
    receiverId: 1,
    senderName: 'Staff Member',
    senderRole: 'Staff',
    text: 'Thank you! I\'m excited to be part of the team.',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    read: true,
    product: null
  },
  {
    id: 3,
    senderId: 1,
    receiverId: 3,
    senderName: 'Admin User',
    senderRole: 'Admin',
    text: 'Hello Agent! How can I help you today?',
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    read: true,
    product: null
  }
];

export const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load messages from localStorage
    const storedMessages = localStorage.getItem('chatAppMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      setMessages(initialMessages);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    localStorage.setItem('chatAppMessages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (text, receiverId, product = null, currentUser = null) => {
    const newMessage = {
      id: Date.now(),
      senderId: currentUser?.id || 1,
      receiverId,
      senderName: currentUser?.name || 'Current User',
      senderRole: currentUser?.role || 'Admin',
      text,
      timestamp: new Date().toISOString(),
      read: false,
      product
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate real-time message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, read: true } : msg
        )
      );
    }, 1000);
  };

  const markMessageAsRead = (messageId) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const deleteMessage = (messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const addUser = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      online: true
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUserStatus = (userId, online) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, online } : user
      )
    );
  };

  const getUnreadCount = (userId) => {
    return messages.filter(
      msg => msg.receiverId === userId && !msg.read
    ).length;
  };

  const getChatHistory = (userId1, userId2) => {
    return messages.filter(
      msg => 
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const value = {
    users,
    messages,
    sendMessage,
    markMessageAsRead,
    deleteMessage,
    addUser,
    updateUserStatus,
    getUnreadCount,
    getChatHistory,
    translateMessage,
    loading
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
