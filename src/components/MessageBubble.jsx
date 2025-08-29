import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import RoleBadge from './RoleBadge';
import TranslateButton from './TranslateButton';
import ProductCard from './ProductCard';
import { Clock, Crown, Star } from 'lucide-react';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '../utils/translate';

const MessageBubble = ({ message, isOwn, currentUser, translateMessage }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [translations, setTranslations] = useState([]);
  const navigate = useNavigate();

  const targetLanguages = [
    SUPPORTED_LANGUAGES.ENGLISH,
    SUPPORTED_LANGUAGES.HINDI,
    SUPPORTED_LANGUAGES.MARATHI,
  ];

  const handleTranslate = async () => {
    if (!showTranslation) {
      const results = [];
      for (const lang of targetLanguages) {
        const translated = await translateMessage(message.text, lang);
        results.push({ lang, text: translated });
      }
      setTranslations(results);
      setShowTranslation(true);
    } else {
      setShowTranslation(false);
    }
  };

  const isAdminMessage = message.senderRole === 'Admin';
  const isProductMessage = message.text.startsWith('[PRODUCT]');

  // ✅ Extracted from nested ternary
  const getBubbleClasses = () => {
    if (isOwn) return 'bg-blue-500 text-white';
    if (isAdminMessage) return 'bg-yellow-100 border-2 border-yellow-300 text-gray-800';
    return 'bg-white border border-gray-200 text-gray-800';
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {!isOwn && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-700">{message.senderName}</span>
            <RoleBadge role={message.senderRole} />
            {isAdminMessage && <Crown size={14} className="text-yellow-500" />}
          </div>
        )}

        <div className={`relative rounded-lg px-4 py-2 ${getBubbleClasses()}`}>
          {isAdminMessage && (
            <div className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Star size={12} className="mr-1" />
              Admin
            </div>
          )}

          {isProductMessage && message.product ? (
            <div className="space-y-2">
              <p className="text-sm opacity-90">{message.text.replace('[PRODUCT] ', '')}</p>
              <ProductCard
                product={message.product}
                isDisplayOnly
                onBuyNow={() => navigate('/checkout', { state: { product: message.product } })}
              />
            </div>
          ) : (
            <p className="text-sm">{message.text}</p>
          )}

          {showTranslation && translations.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-300 border-opacity-30 space-y-1">
              {translations.map((t) => (
                <div key={t.lang} className="text-sm">
                  <span className="text-xs opacity-70 mr-2">{LANGUAGE_NAMES[t.lang]}:</span>
                  <span>{t.text}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-2 pt-1">
            <div className="flex items-center space-x-1 text-xs opacity-70">
              <Clock size={12} />
              <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
            </div>

            <div className="flex items-center space-x-1">
              <TranslateButton onClick={handleTranslate} />
              {isAdminMessage && (
                <button className="text-xs opacity-70 hover:opacity-100">Pin</button>
              )}
            </div>
          </div>
        </div>

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

MessageBubble.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    senderName: PropTypes.string.isRequired,
    senderRole: PropTypes.string.isRequired,
    product: PropTypes.object,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  isOwn: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  translateMessage: PropTypes.func.isRequired,
};

export default MessageBubble;
