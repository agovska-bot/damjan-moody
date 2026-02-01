
import React, { useState, useCallback } from 'react';
import { Feature, UiStrings } from '../types';
import { generateMoodResponse } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import BackButton from './BreathingExercise';

interface HowAreYouProps {
  feature: Feature;
  goBack: () => void;
  onMoodSubmit: (mood: { label: string; emoji: string }, notes: string) => void;
  language: string;
  ageRange: string;
  uiStrings: UiStrings;
}

const initialMoods = [
  { key: 'Happy', emoji: '😊' },
  { key: 'Calm', emoji: '😌' },
  { key: 'Silly', emoji: '🤪' },
  { key: 'Sad', emoji: '😢' },
  { key: 'Worried', emoji: '😟' },
  { key: 'Grumpy', emoji: '😠' },
];

type Stage = 'selecting_mood' | 'entering_notes' | 'loading' | 'showing_response';

const HowAreYou: React.FC<HowAreYouProps> = ({ feature, goBack, onMoodSubmit, language, ageRange, uiStrings }) => {
  const [stage, setStage] = useState<Stage>('selecting_mood');
  const [selectedMood, setSelectedMood] = useState<{ label: string; emoji: string } | null>(null);
  const [notes, setNotes] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const { moodTracker: text } = uiStrings;
  const moods = initialMoods.map(m => ({...m, label: text.moods[m.key] || m.key }));

  const handleMoodSelect = (mood: { label: string; emoji: string }) => {
    setSelectedMood(mood);
    setStage('entering_notes');
  };

  const handleSubmit = useCallback(async () => {
    if (!selectedMood) return;
    setStage('loading');
    onMoodSubmit(selectedMood, notes);
    const response = await generateMoodResponse(selectedMood.label, notes, language, ageRange);
    setAiResponse(response);
    setStage('showing_response');
  }, [selectedMood, notes, onMoodSubmit, language, ageRange]);

  const handleReset = () => {
    setSelectedMood(null);
    setNotes('');
    setAiResponse('');
    setStage('selecting_mood');
  };
  
  const buttonColorClasses = feature.inactiveClasses.replace('text-white', '');
  const buttonFocusRingClass = feature.focusRingClass;

  const backLabel = stage === 'selecting_mood' ? uiStrings.backButton : text.startOver;

  return (
    <div className="flex flex-col items-center justify-start p-6 bg-white rounded-lg shadow-lg h-full min-h-[400px] animate-fade-in">
      <div className="w-full -mt-6 -mx-6 mb-6">
        <div className={`relative w-full p-2 rounded-t-lg text-center ${feature.activeClasses}`}>
            <h2 className="text-2xl font-bold">{feature.label}</h2>
            <BackButton onClick={stage === 'selecting_mood' ? goBack : handleReset} className={`${feature.activeClasses} text-white ${buttonFocusRingClass}`} label={backLabel}/>
        </div>
      </div>
      
      {stage === 'selecting_mood' && (
        <div className="w-full text-center animate-fade-in">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">{text.title}</h3>
          <div className="grid grid-cols-3 gap-4">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => handleMoodSelect(mood)}
                className="flex flex-col items-center p-4 bg-playful-yellow-100 rounded-lg shadow-sm hover:shadow-lg hover:bg-playful-yellow-200 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="text-4xl">{mood.emoji}</span>
                <span className="mt-2 font-medium text-gray-700">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'entering_notes' && selectedMood && (
        <div className="w-full text-center animate-fade-in">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{text.feeling} {selectedMood.label.toLowerCase()} {selectedMood.emoji}</h3>
          <p className="text-gray-600 mb-4">{text.prompt}</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-24 p-2 border-2 border-playful-yellow-200 rounded-lg focus:ring-2 focus:ring-playful-yellow-400 focus:outline-none"
            placeholder={text.optional}
          />
          <button onClick={handleSubmit} className={`mt-4 px-6 py-2 font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${buttonColorClasses} ${buttonFocusRingClass}`}>
            {text.done}
          </button>
        </div>
      )}
      
      {stage === 'loading' && <div className=""><LoadingSpinner /></div>}

      {stage === 'showing_response' && (
         <div className="w-full text-center animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{text.thanks}</h3>
            <div className="w-full max-w-lg min-h-[100px] p-6 bg-playful-yellow-100 rounded-lg text-center flex items-center justify-center">
                <p className="text-lg text-gray-800 italic">"{aiResponse}"</p>
            </div>
            <button onClick={handleReset} className={`mt-6 px-6 py-2 font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${buttonColorClasses} ${buttonFocusRingClass}`}>
                {text.startOver}
            </button>
         </div>
      )}
    </div>
  );
};

export default HowAreYou;