
import React, { useState, useEffect } from 'react';

interface GratitudeAnimationProps {
  ageRange: string;
}

const GratitudeAnimation: React.FC<GratitudeAnimationProps> = ({ ageRange }) => {
  const word = "thanks";
  const [invisibleIndex, setInvisibleIndex] = useState(0);
  const [position, setPosition] = useState({ top: '15%', left: '15%' });
  const isTeen = ageRange === '13-18';

  const getNewPosition = () => {
    const area = Math.floor(Math.random() * 4);
    let top: number, left: number;

    switch (area) {
      case 0:
        top = Math.random() * 15 + 10;
        left = Math.random() * 80 + 10;
        break;
      case 1:
        top = Math.random() * 15 + 75;
        left = Math.random() * 80 + 10;
        break;
      case 2:
        top = Math.random() * 50 + 25;
        left = Math.random() * 15 + 10;
        break;
      default:
        top = Math.random() * 50 + 25;
        left = Math.random() * 15 + 75;
        break;
    }
    return { top: `${top}%`, left: `${left}%` };
  };

  useEffect(() => {
    setPosition(getNewPosition());

    const interval = setInterval(() => {
      setInvisibleIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % word.length;
        if (nextIndex === 0) {
          setPosition(getNewPosition());
        }
        return nextIndex;
      });
    }, isTeen ? 2000 : 1000);

    return () => clearInterval(interval);
  }, [isTeen]);

  return (
    <div 
      className={`absolute text-happy-green-600 font-semibold italic pointer-events-none transition-all duration-1000 ease-in-out ${isTeen ? 'text-sm opacity-10' : 'text-2xl opacity-40'}`} 
      style={{
        ...position,
        transform: 'translate(-50%, -50%)'
      }}
      aria-hidden="true"
    >
      {word.split('').map((char, index) => (
        <span
          key={index}
          className={`transition-opacity duration-700 ease-in-out ${index === invisibleIndex ? 'opacity-0' : 'opacity-100'}`}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default GratitudeAnimation;
