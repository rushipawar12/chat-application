import React, { useState } from 'react';
import RoleBadge from './RoleBadge';
import TranslateButton from './TranslateButton';
import ProductCard from './ProductCard';
import { Clock, Crown, Star } from 'lucide-react';

const MessageBubble = ({ message, isOwn, currentUser, translateMessage }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslate = async () => {
    if (!showTranslation) {
      const translated = await translateMessage(message.text);
      setTranslatedText(translated);
      setShowTranslation(true);
    } else {
      setShowTranslation(false);
    }
  };

  const isAdminMessage = message.senderRole === 'Admin';
  const isProductMessage = message.text.startsWith('[PRODUCT]');

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Sender Info */}
        {!isOwn && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-700">{message.senderName}</span>
            <RoleBadge role={message.senderRole} />
            {isAdminMessage && (
              <Crown size={14} className="text-yellow-500" />
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`relative rounded-lg px-4 py-2 ${
            isOwn
              ? 'bg-blue-500 text-white'
              : isAdminMessage
              ? 'bg-yellow-100 border-2 border-yellow-300 text-gray-800'
              : 'bg-white border border-gray-200 text-gray-800'
          }`}
        >
          {/* Admin Highlight */}
          {isAdminMessage && (
            <div className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Star size={12} className="mr-1" />
              Admin
            </div>
          )}

          {/* Product Message */}
          {isProductMessage && message.product ? (
            <div className="space-y-2">
              <p className="text-sm opacity-90">{message.text.replace('[PRODUCT] ', '')}</p>
              <ProductCard
                product={message.product}
                isDisplayOnly={true}
                onBuyNow={() => {
                  // Handle purchase flow
                  console.log('Purchase initiated for:', message.product);
                }}
              />
            </div>
          ) : (
            <p className="text-sm">{message.text}</p>
          )}

          {/* Translation */}
          {showTranslation && translatedText && (
            <div className="mt-2 pt-2 border-t border-gray-300 border-opacity-30">
              <p className="text-xs opacity-75 italic">Translated:</p>
              <p className="text-sm">{translatedText}</p>
            </div>
          )}

          {/* Message Actions */}
          <div className="flex items-center justify-between mt-2 pt-1">
            <div className="flex items-center space-x-1 text-xs opacity-70">
              <Clock size={12} />
              <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <TranslateButton onClick={handleTranslate} />
              {message.senderRole === 'Admin' && (
                <button className="text-xs opacity-70 hover:opacity-100">
                  Pin
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Own Message Info */}
        {isOwn && (
          <div className="flex items-center justify-end space-x-2 mt-1">
            <RoleBadge role={message.senderRole} />
            <span className="text-xs text-gray-500">{message.senderName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
