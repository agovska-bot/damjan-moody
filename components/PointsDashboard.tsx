import React from 'react';
import { Feature, MoodLog, UiStrings } from '../types';
import BackButton from './BreathingExercise';

interface PointsDashboardProps {
  feature: Feature;
  goBack: () => void;
  points: number;
  moodHistory: MoodLog[];
  uiStrings: UiStrings;
}

const PointsDashboard: React.FC<PointsDashboardProps> = ({ feature, goBack, points, moodHistory, uiStrings }) => {
  const buttonFocusRingClass = feature.focusRingClass;
  // Fix: The 'pointsDashboard' key was missing in UiStrings; mapping it to 'moodJournal' which contains identical fields.
  const { moodJournal: text } = uiStrings;

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg h-full min-h-[500px] animate-fade-in">
      <div className="w-full -mt-6 -mx-6 mb-6">
        <div className={`relative w-full p-2 rounded-t-lg text-center ${feature.activeClasses}`}>
          <h2 className="text-2xl font-bold">{feature.label}</h2>
          <BackButton onClick={goBack} className={`${feature.activeClasses} text-white ${buttonFocusRingClass}`} label={uiStrings.backButton}/>
        </div>
      </div>
      
      <div className="flex flex-col items-center w-full">
        <div className="text-center p-6 bg-playful-yellow-100 rounded-xl shadow-md w-full">
          <p className="text-lg font-semibold text-playful-yellow-600">{text.totalPoints}</p>
          <p className="text-6xl font-bold text-gray-800">{points}</p>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-4 self-start">{text.feelingsLog}</h3>
        
        <div className="w-full flex-grow overflow-y-auto space-y-3 pr-2 max-h-[280px]">
          {moodHistory.length > 0 ? (
            moodHistory.map((log, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm">
                <span className="text-3xl mr-4">{log.emoji}</span>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800">{log.mood}</p>
                  {log.notes && <p className="text-sm text-gray-500 italic">"{log.notes}"</p>}
                </div>
                <span className="font-bold text-happy-green-500">+10</span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 px-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                {text.emptyLog}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointsDashboard;