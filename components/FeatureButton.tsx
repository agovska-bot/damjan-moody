
import React from 'react';
import { Feature } from '../types';
import FallingEmojis from './FallingEmojis';
import PointsAnimation from './PointsAnimation';
import BouncingBall from './BouncingBall';
import WaveAnimation from './WaveAnimation';
import GratitudeAnimation from './GratitudeAnimation';

interface FeatureButtonProps {
  feature: Feature;
  isActive: boolean;
  onClick: () => void;
  ageRange: string;
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ feature, isActive, onClick, ageRange }) => {
  const baseClasses = "group w-full text-center p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden flex flex-col items-center justify-center min-h-[120px]";

  const isAdult = ageRange === '18+';
  const isTeen = ageRange === '13-18';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${feature.focusRingClass} ${isActive ? feature.activeClasses : feature.inactiveClasses}`}
    >
      {/* Background Animations */}
      {!isAdult && feature.id === 'mood-selection' && <FallingEmojis ageRange={ageRange} />}
      {!isAdult && feature.id === 'get-moving' && <BouncingBall ageRange={ageRange} />}
      {!isAdult && feature.id === 'calm-zone' && <WaveAnimation ageRange={ageRange} />}
      {!isAdult && feature.id === 'gratitude-jar' && <GratitudeAnimation ageRange={ageRange} />}

      {/* Specialty Animations */}
      {!isAdult && feature.id === 'act-of-kindness' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <svg
            className={`w-16 h-16 text-soft-pink-300 animate-pulse-heart ${isTeen ? 'opacity-20' : 'opacity-50'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      )}
      
      {!isAdult && feature.id === 'mood-journal' && <PointsAnimation ageRange={ageRange} />}

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center">
        {feature.icon}
        <span className="font-bold text-sm sm:text-base leading-tight mt-1">{feature.label}</span>
      </div>
    </button>
  );
};

export default FeatureButton;
