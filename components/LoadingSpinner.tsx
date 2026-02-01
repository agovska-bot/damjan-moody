
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-playful-yellow-200 border-t-happy-green-500 rounded-full animate-spin"></div>
      <span className="ml-3 text-gray-500">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;