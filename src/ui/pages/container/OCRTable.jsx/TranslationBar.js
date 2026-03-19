// components/TranslationBar.js
import React, { useState } from 'react';
import './TranslationBar.css';

const TranslationBar = ({ selectedLanguage, languages }) => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const selectedLang = languages.find(l => l.code === selectedLanguage);

  const handleTranslate = () => {
    // This would integrate with actual translation API
    setTranslatedText(`[Translated to ${selectedLang.name}]: ${inputText}`);
  };

  return (
    <div className="translation-bar">
      <div className="translation-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type to translate..."
          className="translation-field"
        />
        <button onClick={handleTranslate} className="translate-btn">
          Translate
        </button>
      </div>
      
      {translatedText && (
        <div className="translation-output">
          <strong>Translation ({selectedLang.name}):</strong>
          <p>{translatedText}</p>
        </div>
      )}
      
      <div className="transcription-note">
        <small>🎤 Click the transcription button in any cell to transcribe</small>
      </div>
    </div>
  );
};

export default TranslationBar;