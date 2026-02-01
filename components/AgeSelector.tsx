
import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { AgeSelectorUiStrings } from '../types';

interface AgeSelectorProps {
  onSelect: (ageRange: string) => void;
  onBack: () => void;
  loading: boolean;
  loadingStrings: boolean;
  uiStrings: AgeSelectorUiStrings | null;
}

const buttonColors = [
  'bg-happy-green-500 hover:bg-happy-green-600 focus:ring-happy-green-500',
  'bg-sky-blue-500 hover:bg-sky-blue-600 focus:ring-sky-blue-500',
  'bg-sunny-orange-500 hover:bg-sunny-orange-600 focus:ring-sunny-orange-500',
  'bg-soft-pink-500 hover:bg-soft-pink-600 focus:ring-soft-pink-500',
];

const AgeSelector: React.FC<AgeSelectorProps> = ({ onSelect, onBack, loading, loadingStrings, uiStrings }) => {
  // Full screen loader while fetching its own strings
  if (loadingStrings || !uiStrings) {
    return (
      <div className="min-h-screen text-gray-800 flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg text-center">
          <p className="text-gray-500 mb-2">Getting things ready...</p>
          <LoadingSpinner />
        </div>
      </div>
    );
  }
  
  const ageRanges = [
    { name: uiStrings.ages['5-7'], value: '5-7' },
    { name: uiStrings.ages['8-12'], value: '8-12' },
    { name: uiStrings.ages['13-18'], value: '13-18' },
    { name: uiStrings.ages['18+'], value: '18+' },
  ];

  return (
    <div className="min-h-screen text-gray-800 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg text-center animate-fade-in relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 px-3 py-1 text-sm font-semibold text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:-translate-x-1 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:transform-none"
          aria-label="Go back to language selection"
          disabled={loading}
        >
          {uiStrings.backButton}
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mt-8">{uiStrings.title}</h1>
        <p className="text-gray-600 mt-4 mb-6">{uiStrings.prompt}</p>
        
        {loading ? ( // This is for when main app is loading AFTER selection
          <div className="mt-6">
            <p className="text-gray-500 mb-2">{uiStrings.loading}</p>
            <LoadingSpinner/>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {ageRanges.map((age, index) => (
              <button
                key={age.value}
                onClick={() => onSelect(age.value)}
                disabled={loading}
                className={`w-full px-6 py-3 font-semibold text-white rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed ${buttonColors[index % buttonColors.length]}`}
              >
                {age.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeSelector;