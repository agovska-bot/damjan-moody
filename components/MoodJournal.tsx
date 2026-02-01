
import React, { useState } from 'react';
import { Feature, MoodLog, UiStrings } from '../types';
import BackButton from './BreathingExercise';

interface MoodJournalProps {
  feature: Feature;
  goBack: () => void;
  points: number;
  moodHistory: MoodLog[];
  uiStrings: UiStrings;
  onAddNote: (mood: { label: string; emoji: string }, notes: string) => void;
}

const MoodJournal: React.FC<MoodJournalProps> = ({ feature, goBack, points, moodHistory, uiStrings, onAddNote }) => {
  const [note, setNote] = useState('');
  const buttonFocusRingClass = feature.focusRingClass;
  const { moodJournal: text } = uiStrings;

  const handleSaveNote = () => {
    if (!note.trim()) return;
    onAddNote({ label: 'Journal Entry', emoji: '📝' }, note);
    setNote('');
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg h-full min-h-[550px] animate-fade-in overflow-y-auto">
      <div className="w-full -mt-6 -mx-6 mb-6">
        <div className={`relative w-full p-2 rounded-t-lg text-center ${feature.activeClasses}`}>
          <h2 className="text-2xl font-bold">{feature.label}</h2>
          <BackButton onClick={goBack} className={`${feature.activeClasses} text-white ${buttonFocusRingClass}`} label={uiStrings.backButton}/>
        </div>
      </div>
      
      <div className="flex flex-col items-center w-full">
        {/* Top Summary */}
        <div className="text-center p-4 bg-playful-yellow-100 rounded-xl shadow-sm w-full mb-6">
          <p className="text-sm font-semibold text-playful-yellow-600">{text.totalPoints}</p>
          <p className="text-4xl font-bold text-gray-800">⭐ {points}</p>
        </div>

        {/* Manual Journal Entry */}
        <div className="w-full mb-8 p-4 bg-sky-blue-50 rounded-lg border-2 border-sky-blue-200">
           <h3 className="text-md font-bold text-sky-blue-700 mb-2">{text.journalPrompt}</h3>
           <textarea
             value={note}
             onChange={(e) => setNote(e.target.value)}
             className="w-full h-24 p-2 border border-sky-blue-200 rounded-lg focus:ring-2 focus:ring-sky-blue-400 focus:outline-none resize-none"
             placeholder={text.addNote}
           />
           <button 
             onClick={handleSaveNote}
             disabled={!note.trim()}
             className="mt-2 w-full px-4 py-2 bg-sky-blue-500 text-white font-bold rounded-lg hover:bg-sky-blue-600 transition-colors disabled:bg-gray-300"
           >
             {text.saveNote}
           </button>
        </div>

        {/* History Log */}
        <h3 className="text-lg font-bold text-gray-700 mb-3 self-start">{text.feelingsLog}</h3>
        
        <div className="w-full space-y-3">
          {moodHistory.length > 0 ? (
            moodHistory.map((log, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                <span className="text-2xl mr-3 mt-1">{log.emoji}</span>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <p className="font-bold text-gray-800">{log.mood}</p>
                    <p className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleDateString()}</p>
                  </div>
                  {log.notes && <p className="text-sm text-gray-600 mt-1 italic">"{log.notes}"</p>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400">
                {text.emptyLog}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodJournal;
