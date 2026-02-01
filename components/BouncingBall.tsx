
import React from 'react';

interface BouncingBallProps {
  ageRange: string;
}

const BouncingBall: React.FC<BouncingBallProps> = ({ ageRange }) => {
  const isTeen = ageRange === '13-18';
  
  return (
    <div
      className={`absolute bg-sky-blue-500 rounded-full animate-bounce-around pointer-events-none ${isTeen ? 'w-2 h-2 opacity-10' : 'w-4 h-4 opacity-40'}`}
      style={{
        filter: isTeen ? 'blur(4px)' : 'blur(1px)',
        animationDuration: isTeen ? '12s' : '4s',
      }}
      aria-hidden="true"
    />
  );
};

export default BouncingBall;
