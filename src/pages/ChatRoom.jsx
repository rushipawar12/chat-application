import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import ChatWindow from '../components/ChatWindow';
import RoleBadge from '../components/RoleBadge';
import { LogOut, Search, Users, Crown, User, Users as StaffIcon } from 'lucide-react';

const ChatRoom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const { currentUser, logout } = useAuth();
  const { users, messages, sendMessage, translateMessage } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredUsers = users
    .filter(user => user.id !== currentUser.id)
    .filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <Crown size={16} className="text-red-600" />;
      case 'Staff':
        return <StaffIcon size={16} className="text-blue-600" />;
      case 'Agent':
        return <User size={16} className="text-green-600" />;
      default:
        return <User size={16} className="text-gray-600" />;
    }
  };

  const canChatWithUser = (targetUser) => (
    currentUser.role === 'Admin' ||
    (currentUser.role === 'Staff' && targetUser.role !== 'Agent') ||
    (currentUser.role === 'Agent' && targetUser.role !== 'Agent')
  );

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{currentUser.name}</h2>
                <div className="flex items-center space-x-2">
                  <RoleBadge role={currentUser.role} />
                  <span className="text-xs text-green-600">● Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Role Filter */}
          <div className="mt-3 flex space-x-1">
            {['all', 'Admin', 'Staff', 'Agent'].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filterRole === role
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {role === 'all' ? 'All' : role}
              </button>
            ))}
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Users size={48} className="mx-auto mb-2 text-gray-300" />
              <p>No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const canChat = canChatWithUser(user);
              const unreadCount = messages.filter(
                msg =>
                  msg.senderId === user.id &&
                  msg.receiverId === currentUser.id &&
                  !msg.read
              ).length;

              return (
                <button
                  key={user.id}
                  onClick={() => canChat && setSelectedUser(user)}
                  disabled={!canChat}
                  className={`w-full text-left p-4 border-b border-gray-100 transition-colors ${
                    selectedUser?.id === user.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  } ${!canChat ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {getRoleIcon(user.role)}
                        <RoleBadge role={user.role} />
                        {!canChat && <span className="text-xs text-red-600">No permission</span>}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatWindow
            currentUser={currentUser}
            selectedUser={selectedUser}
            messages={messages}
            sendMessage={sendMessage}
            translateMessage={translateMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Users size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Select a user to start chatting
              </h3>
              <p className="text-gray-500">
                Choose someone from the user list to begin your conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
