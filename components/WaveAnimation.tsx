
import React from 'react';

interface WaveAnimationProps {
  ageRange: string;
}

const WaveAnimation: React.FC<WaveAnimationProps> = ({ ageRange }) => {
  const isTeen = ageRange === '13-18';
  
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center space-y-2 pointer-events-none transition-opacity duration-1000 ${isTeen ? 'opacity-10' : 'opacity-40'}`} aria-hidden="true">
      <div 
        className="w-16 h-1 bg-aqua-teal-400 rounded-full animate-wave" 
        style={{ animationDelay: '0s', animationDuration: isTeen ? '5s' : '2.5s' }}
      />
      <div 
        className="w-16 h-1 bg-aqua-teal-400 rounded-full animate-wave" 
        style={{ animationDelay: '0.2s', animationDuration: isTeen ? '5s' : '2.5s' }}
      />
      {!isTeen && (
        <div 
          className="w-16 h-1 bg-aqua-teal-400 rounded-full animate-wave" 
          style={{ animationDelay: '0.4s', animationDuration: '2.5s' }}
        />
      )}
    </div>
  );
};

export default WaveAnimation;
