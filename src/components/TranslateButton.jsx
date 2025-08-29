import React from 'react';
import { Languages } from 'lucide-react';

const TranslateButton = ({ onClick, isTranslated = false }) => {
  return (
    <button
      onClick={onClick}
      className={`p-1 rounded text-xs transition-colors ${
        isTranslated 
          ? 'text-green-600 hover:text-green-700' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
      title={isTranslated ? 'Hide translation' : 'Translate message'}
    >
      <Languages size={12} />
    </button>
  );
};

export default TranslateButton;
