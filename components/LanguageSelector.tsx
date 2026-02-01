
import React from 'react';
import Logo from './Logo';

interface LanguageSelectorProps {
  onSelect: (language: string) => void;
  error: string | null;
}

const supportedLanguages = [
  { name: 'Македонски', value: 'Macedonian' },
  { name: 'English', value: 'English' },
  { name: 'Shqip', value: 'Albanian' },
  { name: 'Türkçe', value: 'Turkish' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect, error }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] card-shadow animate-fade-in-up">
        <Logo className="h-24 w-24 mx-auto mb-6 drop-shadow-lg" />
        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Moody Buddy</h1>
        <p className="text-gray-500 mb-8 font-medium">Одбери го твојот јазик:</p>
        
        <div className="grid grid-cols-1 gap-4">
          {supportedLanguages.map((lang, index) => (
             <button
              key={lang.value}
              onClick={() => onSelect(lang.value)}
              className={`w-full px-6 py-4 font-bold text-white rounded-2xl shadow-sm hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
                index === 0 ? 'bg-indigo-500' : index === 1 ? 'bg-sky-500' : index === 2 ? 'bg-pink-500' : 'bg-teal-500'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
        
        {error && <p className="text-red-500 text-sm mt-6 font-bold">{error}</p>}
      </div>
    </div>
  );
};

export default LanguageSelector;
