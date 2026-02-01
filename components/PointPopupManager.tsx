
import React from 'react';

export interface PointPopupInfo {
  id: number;
  amount: number;
  top: number;
  left: number;
}

interface PointPopupManagerProps {
  popups: PointPopupInfo[];
}

const PointPopupManager: React.FC<PointPopupManagerProps> = ({ popups }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="absolute animate-point-popup text-happy-green-500 font-bold text-4xl"
          style={{
            top: `${popup.top}%`,
            left: `${popup.left}%`,
            textShadow: '1px 1px 3px rgba(0,0,0,0.3)', // Add shadow for better visibility
            transform: 'translate(-50%, -50%)',
          }}
        >
          +{popup.amount}
        </div>
      ))}
    </div>
  );
};

export default PointPopupManager;
