
import React from 'react';
import Logo from './Logo';

interface LanguageSelectorProps {
  onSelect: (language: string) => void;
  error: string | null;
}

const supportedLanguages = [
  { name: 'English', value: 'English' },
  { name: 'Македонски (Macedonian)', value: 'Macedonian' },
  { name: 'Türkçe (Turkish)', value: 'Turkish' },
  { name: 'Shqip (Albanian)', value: 'Albanian' },
];

const buttonColors = [
  'bg-happy-green-500 hover:bg-happy-green-600 focus:ring-happy-green-500',
  'bg-sky-blue-500 hover:bg-sky-blue-600 focus:ring-sky-blue-500',
  'bg-sunny-orange-500 hover:bg-sunny-orange-600 focus:ring-sunny-orange-500',
  'bg-soft-pink-500 hover:bg-soft-pink-600 focus:ring-soft-pink-500',
];


const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect, error }) => {

  return (
    <div className="min-h-screen text-gray-800 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg text-center animate-fade-in">
        <Logo className="h-20 w-20 mx-auto text-gray-800 mb-2" />
        <h1 className="text-3xl font-bold text-gray-800">Moody Buddy 2.0</h1>
        <p className="text-gray-600 mt-4 mb-6">Please select your language.</p>
        
        <div className="flex flex-col gap-4">
          {supportedLanguages.map((lang, index) => (
             <button
              key={lang.value}
              onClick={() => onSelect(lang.value)}
              className={`w-full px-6 py-3 font-semibold text-white rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 ${buttonColors[index % buttonColors.length]}`}
            >
              {lang.name}
            </button>
          ))}
        </div>
        
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        
      </div>
    </div>
  );
};

export default LanguageSelector;