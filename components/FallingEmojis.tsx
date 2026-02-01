
import React from 'react';

const HappyFace = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 13a4 4 0 0 0 8 0" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
);

const CalmFace = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="12" cy="12" r="10" />
        <line x1="8" y1="15" x2="16" y2="15" />
        <line x1="9" y1="10" x2="11" y2="10" />
        <line x1="13" y1="10" x2="15" y2="10" />
    </svg>
);

const SillyFace = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="12" cy="12" r="10" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="14" y1="9" x2="16" y2="9" />
        <path d="M12 14v3a1.5 1.5 0 0 0 3 0v-3" />
    </svg>
);

const FACES = [
    <HappyFace key="happy" />,
    <CalmFace key="calm" />,
    <SillyFace key="silly" />
];

interface FallingEmojisProps {
  ageRange: string;
}

const FallingEmojis: React.FC<FallingEmojisProps> = ({ ageRange }) => {
  const isTeen = ageRange === '13-18';
  const count = isTeen ? 5 : 12;
  const baseSpeed = isTeen ? 12 : 6;
  const baseOpacity = isTeen ? 0.1 : 0.3;

  const emojiElements = Array.from({ length: count }).map((_, i) => {
    const size = `${Math.random() * 0.5 + 0.8}rem`;
    const style = {
      left: `${Math.random() * 95}%`,
      animationDuration: `${Math.random() * 4 + baseSpeed}s`,
      animationDelay: `${Math.random() * 5}s`,
      width: size,
      height: size,
      opacity: Math.random() * 0.2 + baseOpacity,
    };
    
    const FaceComponent = FACES[Math.floor(Math.random() * FACES.length)];

    return (
      <div
        key={i}
        className="absolute top-0 emoji-fall select-none text-lovely-purple-400"
        style={style}
        aria-hidden="true"
      >
        {FaceComponent}
      </div>
    );
  });

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {emojiElements}
    </div>
  );
};

export default FallingEmojis;
