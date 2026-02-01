
import React, { useState, useEffect } from 'react';

interface PointState {
  value: number;
  key: number;
  top: string;
  left: string;
}

interface PointsAnimationProps {
  ageRange: string;
}

const PointsAnimation: React.FC<PointsAnimationProps> = ({ ageRange }) => {
  const [point, setPoint] = useState<PointState | null>(null);
  const isTeen = ageRange === '13-18';

  useEffect(() => {
    const generateNewPoint = () => {
      const value = Math.floor(Math.random() * 15) + 5;
      const key = Date.now();
      const quadrant = Math.floor(Math.random() * 4);
      const verticalPosition = (Math.random() * 30) + (quadrant > 1 ? 60 : 5);
      const horizontalPosition = (Math.random() * 30) + (quadrant % 2 === 1 ? 60 : 5);
      
      const top = `${verticalPosition}%`;
      const left = `${horizontalPosition}%`;

      setPoint({ value, key, top, left });
    };

    generateNewPoint();
    const intervalId = setInterval(generateNewPoint, isTeen ? 5000 : 2000);

    return () => clearInterval(intervalId);
  }, [isTeen]);
  
  if (!point) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        key={point.key}
        className={`absolute animate-point-popup text-playful-yellow-600 font-bold ${isTeen ? 'text-sm opacity-20' : 'text-2xl opacity-80'}`}
        style={{ top: point.top, left: point.left, animationDuration: isTeen ? '4s' : '2s' }}
      >
        +{point.value}
      </div>
    </div>
  );
};

export default PointsAnimation;
