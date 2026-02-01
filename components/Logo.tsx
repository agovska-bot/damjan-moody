import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = 'h-16 w-16' }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Moody Buddy Logo"
      role="img"
    >
      <title>Moody Buddy Logo</title>

      {/* Define clip paths for left and right halves */}
      <defs>
        <clipPath id="clip-left">
          <rect x="0" y="0" width="50" height="100" />
        </clipPath>
        <clipPath id="clip-right">
          <rect x="50" y="0" width="50" height="100" />
        </clipPath>
      </defs>

      {/* Happy (Yellow) Side - Left */}
      <g className="text-playful-yellow-400">
        {/* Left half of face outline */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" clipPath="url(#clip-left)" />
        {/* Left eye */}
        <circle cx="28" cy="40" r="5" fill="currentColor" />
        {/* Happy mouth part (smile) */}
        <path 
          d="M 20 65 Q 35 82 50 65"
          stroke="currentColor" 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round" 
        />
      </g>

      {/* Sad (Blue) Side - Right */}
      <g className="text-sky-blue-400">
        {/* Right half of face outline */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" clipPath="url(#clip-right)" />
        {/* Right eye */}
        <circle cx="72" cy="40" r="5" fill="currentColor" />
        {/* Sad mouth part (frown) */}
        <path 
          d="M 50 65 Q 65 51 80 68" 
          stroke="currentColor" 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round" 
        />
      </g>
      
      {/* Center Dividing Line - will inherit currentColor from svg element */}
      <line x1="50" y1="2" x2="50" y2="98" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>

    </svg>
  );
};

export default Logo;