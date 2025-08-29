import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import MessageBubble from "./MessageBubble";
import RoleBadge from "./RoleBadge";
import ProductCard from "./ProductCard";
import { Send, Mic, Paperclip, Smile } from "lucide-react";

const ChatWindow = ({ currentUser, selectedUser, messages, sendMessage, translateMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage, selectedUser.id, null, currentUser);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSendToUser = (targetUser) =>
    currentUser.role === "Admin" ||
    (currentUser.role === "Staff" && targetUser.role !== "Agent") ||
    (currentUser.role === "Agent" && targetUser.role !== "Agent");

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderId === currentUser.id && msg.receiverId === selectedUser.id) ||
      (msg.senderId === selectedUser.id && msg.receiverId === currentUser.id)
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {selectedUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{selectedUser.name}</h3>
            <div className="flex items-center space-x-2">
              <RoleBadge role={selectedUser.role} />
              <span className="text-sm text-gray-500">
                {selectedUser.online ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <Mic size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <Paperclip size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUser.id}
            currentUser={currentUser}
            translateMessage={translateMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        {!canSendToUser(selectedUser) && (
          <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            ⚠️ You don't have permission to send messages to this user based on your role hierarchy.
          </div>
        )}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <Smile size={20} />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="1"
              disabled={!canSendToUser(selectedUser)}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !canSendToUser(selectedUser)}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>

        {currentUser.role === "Admin" && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => setShowProductForm(!showProductForm)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {showProductForm ? "Cancel" : "Sell Product"}
            </button>
            {showProductForm && (
              <ProductCard
                onSendProduct={(product) => {
                  sendMessage(
                    `[PRODUCT] ${product.name} - $${product.price}`,
                    selectedUser.id,
                    product,
                    currentUser
                  );
                  setShowProductForm(false);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  selectedUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    online: PropTypes.bool,
  }).isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      senderId: PropTypes.string.isRequired,
      receiverId: PropTypes.string.isRequired,
      text: PropTypes.string,
    })
  ).isRequired,
  sendMessage: PropTypes.func.isRequired,
  translateMessage: PropTypes.func,
};

export default ChatWindow;
