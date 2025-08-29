export const SUPPORTED_LANGUAGES = {
  ENGLISH: 'en',
  HINDI: 'hi',
  MARATHI: 'mr',
  FRENCH: 'fr',
  SPANISH: 'es',
  GERMAN: 'de',
  CHINESE: 'zh',
  JAPANESE: 'ja'
};

export const LANGUAGE_NAMES = {
  [SUPPORTED_LANGUAGES.ENGLISH]: 'English',
  [SUPPORTED_LANGUAGES.HINDI]: 'हिंदी (Hindi)',
  [SUPPORTED_LANGUAGES.MARATHI]: 'मराठी (Marathi)',
  [SUPPORTED_LANGUAGES.FRENCH]: 'Français (French)',
  [SUPPORTED_LANGUAGES.SPANISH]: 'Español (Spanish)',
  [SUPPORTED_LANGUAGES.GERMAN]: 'Deutsch (German)',
  [SUPPORTED_LANGUAGES.CHINESE]: '中文 (Chinese)',
  [SUPPORTED_LANGUAGES.JAPANESE]: '日本語 (Japanese)'
};

export const translateMessage = async (text, targetLanguage = SUPPORTED_LANGUAGES.ENGLISH) => {
  try {
    const apiUrl = import.meta?.env?.VITE_TRANSLATE_API_URL || '';
    const apiKey = import.meta?.env?.VITE_TRANSLATE_API_KEY || '';
    if (apiUrl) {
      const payload = {
        q: text,
        source: 'auto',
        target: targetLanguage,
        format: 'text'
      };
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        const translated = data.translatedText || data.translation || '';
        if (translated) return translated;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 400));

    
    const translations = {
      [SUPPORTED_LANGUAGES.HINDI]: {
        'Hello': 'नमस्ते',
        'How are you?': 'आप कैसे हैं?',
        'Thank you': 'धन्यवाद',
        'Goodbye': 'अलविदा',
        'Welcome': 'स्वागत है',
        'Yes': 'हाँ',
        'No': 'नहीं',
        'Please': 'कृपया',
        'Sorry': 'माफ़ कीजिए',
        'Help': 'मदद'
      },
      [SUPPORTED_LANGUAGES.MARATHI]: {
        'Hello': 'नमस्कार',
        'How are you?': 'तुम कसे आहात?',
        'Thank you': 'धन्यवाद',
        'Goodbye': 'पुन्हा भेटू',
        'Welcome': 'स्वागत आहे',
        'Yes': 'होय',
        'No': 'नाही',
        'Please': 'कृपया',
        'Sorry': 'माफ करा',
        'Help': 'मदत'
      },
      [SUPPORTED_LANGUAGES.FRENCH]: {
        'Hello': 'Bonjour',
        'How are you?': 'Comment allez-vous?',
        'Thank you': 'Merci',
        'Goodbye': 'Au revoir',
        'Welcome': 'Bienvenue',
        'Yes': 'Oui',
        'No': 'Non',
        'Please': 'S\'il vous plaît',
        'Sorry': 'Désolé',
        'Help': 'Aide'
      },
      [SUPPORTED_LANGUAGES.SPANISH]: {
        'Hello': 'Hola',
        'How are you?': '¿Cómo estás?',
        'Thank you': 'Gracias',
        'Goodbye': 'Adiós',
        'Welcome': 'Bienvenido',
        'Yes': 'Sí',
        'No': 'No',
        'Please': 'Por favor',
        'Sorry': 'Lo siento',
        'Help': 'Ayuda'
      },
      [SUPPORTED_LANGUAGES.GERMAN]: {
        'Hello': 'Hallo',
        'How are you?': 'Wie geht es dir?',
        'Thank you': 'Danke',
        'Goodbye': 'Auf Wiedersehen',
        'Welcome': 'Willkommen',
        'Yes': 'Ja',
        'No': 'Nein',
        'Please': 'Bitte',
        'Sorry': 'Entschuldigung',
        'Help': 'Hilfe'
      },
      [SUPPORTED_LANGUAGES.CHINESE]: {
        'Hello': '你好',
        'How are you?': '你好吗？',
        'Thank you': '谢谢',
        'Goodbye': '再见',
        'Welcome': '欢迎',
        'Yes': '是',
        'No': '不',
        'Please': '请',
        'Sorry': '对不起',
        'Help': '帮助'
      },
      [SUPPORTED_LANGUAGES.JAPANESE]: {
        'Hello': 'こんにちは',
        'How are you?': 'お元気ですか？',
        'Thank you': 'ありがとう',
        'Goodbye': 'さようなら',
        'Welcome': 'ようこそ',
        'Yes': 'はい',
        'No': 'いいえ',
        'Please': 'お願いします',
        'Sorry': 'すみません',
        'Help': '助けて'
      }
    };

    const languageTranslations = translations[targetLanguage];
    
    if (!languageTranslations) {
      return text;
    }
    let translatedText = text;
    Object.entries(languageTranslations).forEach(([english, translated]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translatedText = translatedText.replace(regex, translated);
    });
    if (translatedText === text) {
      translatedText = `${text} [Translated to ${LANGUAGE_NAMES[targetLanguage]}]`;
    }

    return translatedText;

  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export const detectLanguage = async (text) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const hasHindiChars = /[\u0900-\u097F]/.test(text);
    const hasMarathiChars = /[\u0900-\u097F]/.test(text); // Same as Hindi for demo
    const hasChineseChars = /[\u4E00-\u9FFF]/.test(text);
    const hasJapaneseChars = /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
    const hasFrenchChars = /[àâäéèêëïîôöùûüÿç]/i.test(text);
    const hasGermanChars = /[äöüß]/i.test(text);
    const hasSpanishChars = /[ñáéíóúü]/i.test(text);

    if (hasHindiChars) return SUPPORTED_LANGUAGES.HINDI;
    if (hasMarathiChars) return SUPPORTED_LANGUAGES.MARATHI;
    if (hasChineseChars) return SUPPORTED_LANGUAGES.CHINESE;
    if (hasJapaneseChars) return SUPPORTED_LANGUAGES.JAPANESE;
    if (hasFrenchChars) return SUPPORTED_LANGUAGES.FRENCH;
    if (hasGermanChars) return SUPPORTED_LANGUAGES.GERMAN;
    if (hasSpanishChars) return SUPPORTED_LANGUAGES.SPANISH;
    
    return SUPPORTED_LANGUAGES.ENGLISH;
  } catch (error) {
    console.error('Language detection error:', error);
    return SUPPORTED_LANGUAGES.ENGLISH;
  }
};

export const getLanguageFlag = (languageCode) => {
  const flags = {
    [SUPPORTED_LANGUAGES.ENGLISH]: '🇺🇸',
    [SUPPORTED_LANGUAGES.HINDI]: '🇮🇳',
    [SUPPORTED_LANGUAGES.MARATHI]: '🇮🇳',
    [SUPPORTED_LANGUAGES.FRENCH]: '🇫🇷',
    [SUPPORTED_LANGUAGES.SPANISH]: '🇪🇸',
    [SUPPORTED_LANGUAGES.GERMAN]: '🇩🇪',
    [SUPPORTED_LANGUAGES.CHINESE]: '🇨🇳',
    [SUPPORTED_LANGUAGES.JAPANESE]: '🇯🇵'
  };
  
  return flags[languageCode] || '🌐';
};

export const saveTranslationPreference = (preferredLanguage) => {
  try {
    localStorage.setItem('chatAppTranslationLanguage', preferredLanguage);
    return true;
  } catch (error) {
    console.error('Failed to save translation preference:', error);
    return false;
  }
};

export const getTranslationPreference = () => {
  try {
    return localStorage.getItem('chatAppTranslationLanguage') || SUPPORTED_LANGUAGES.ENGLISH;
  } catch (error) {
    console.error('Failed to load translation preference:', error);
    return SUPPORTED_LANGUAGES.ENGLISH;
  }
};
