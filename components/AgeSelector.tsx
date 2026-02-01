
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

const buttonVariants = [
  { bg: 'bg-lovely-purple-500', hover: 'hover:bg-lovely-purple-600', ring: 'focus:ring-lovely-purple-500' },
  { bg: 'bg-aqua-teal-500', hover: 'hover:bg-aqua-teal-600', ring: 'focus:ring-aqua-teal-500' },
  { bg: 'bg-sky-blue-500', hover: 'hover:bg-sky-blue-600', ring: 'focus:ring-sky-blue-500' },
  { bg: 'bg-sunny-orange-500', hover: 'hover:bg-sunny-orange-600', ring: 'focus:ring-sunny-orange-500' },
];

const AgeSelector: React.FC<AgeSelectorProps> = ({ onSelect, onBack, loading, loadingStrings, uiStrings }) => {
  if (loadingStrings || !uiStrings) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  }
  
  const ranges = [
    { name: uiStrings.ages['5-7'], value: '5-7' },
    { name: uiStrings.ages['8-12'], value: '8-12' },
    { name: uiStrings.ages['13-18'], value: '13-18' },
    { name: uiStrings.ages['18+'], value: '18+' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm bg-white p-10 rounded-[2.5rem] card-shadow animate-fade-in-up relative">
        <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 font-bold hover:text-gray-600">←</button>
        <h1 className="text-3xl font-black text-gray-900 mb-2 mt-4">{uiStrings.title}</h1>
        <p className="text-gray-500 mb-8 font-medium">{uiStrings.prompt}</p>
        
        {loading ? <LoadingSpinner /> : (
          <div className="flex flex-col gap-4">
            {ranges.map((age, i) => (
              <button
                key={age.value}
                onClick={() => onSelect(age.value)}
                className={`w-full py-4 font-black text-white rounded-2xl shadow-sm transition-all transform hover:scale-105 active:scale-95 ${buttonVariants[i].bg} ${buttonVariants[i].hover} focus:ring-4 ${buttonVariants[i].ring} focus:ring-opacity-50`}
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
