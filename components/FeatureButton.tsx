
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
  const isAdult = ageRange === '18+';

  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center p-6 rounded-[2rem] card-shadow transition-all duration-300 transform hover:-translate-y-2 active:scale-95 overflow-hidden min-h-[160px] w-full text-center ${feature.inactiveClasses} ${feature.focusRingClass} focus:outline-none focus:ring-4 focus:ring-opacity-50`}
    >
      {/* Позадински визуелни ефекти */}
      <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
        {!isAdult && feature.id === 'mood-selection' && <FallingEmojis ageRange={ageRange} />}
        {!isAdult && feature.id === 'get-moving' && <BouncingBall ageRange={ageRange} />}
        {!isAdult && feature.id === 'calm-zone' && <WaveAnimation ageRange={ageRange} />}
        {!isAdult && feature.id === 'gratitude-jar' && <GratitudeAnimation ageRange={ageRange} />}
        {!isAdult && feature.id === 'mood-journal' && <PointsAnimation ageRange={ageRange} />}
      </div>

      <div className="relative z-10">
        <div className={`mb-3 transition-transform duration-300 group-hover:scale-110 ${feature.iconColorClass}`}>
          {feature.icon}
        </div>
        <span className="block text-xl font-black tracking-tight leading-tight sm:text-2xl">
          {feature.label}
        </span>
      </div>
      
      {/* Glassmorphism ефект */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
    </button>
  );
};

export default FeatureButton;
