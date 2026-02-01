
import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
  label: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, className, label }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 left-2 -translate-y-1/2 px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-x-1 ${className}`}
      aria-label="Go back to main menu"
    >
      &larr; {label}
    </button>
  );
};

export default BackButton;
