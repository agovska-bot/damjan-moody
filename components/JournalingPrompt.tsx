
import React, { useState, useCallback } from 'react';
import { Feature, UiStrings } from '../types';
import LoadingSpinner from './LoadingSpinner';
import BackButton from './BreathingExercise';

interface AiContentScreenProps {
  feature: Feature;
  goBack: () => void;
  addPoints: (amount: number) => void;
  language: string;
  ageRange: string;
  uiStrings: UiStrings;
}

const AiContentScreen: React.FC<AiContentScreenProps> = ({ feature, goBack, addPoints, language, ageRange, uiStrings }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pointsClaimed, setPointsClaimed] = useState<boolean>(false);

  const pointEligibleFeatures = ['gratitude-jar', 'get-moving', 'act-of-kindness', 'calm-zone'];

  const fetchContent = useCallback(async () => {
    if (!feature.promptGenerator) return;
    setIsLoading(true);
    setError(null);
    setPointsClaimed(false);
    try {
      const newContent = await feature.promptGenerator(language, ageRange);
      setContent(newContent);
    } catch (err) {
      setError(uiStrings.aiContentScreen.error);
    } finally {
      setIsLoading(false);
    }
  }, [feature.promptGenerator, language, ageRange, uiStrings]);

  const handleClaimPoints = () => {
    addPoints(10);
    setPointsClaimed(true);
  };

  const buttonColorClasses = feature.inactiveClasses.replace('text-white', '');
  const buttonFocusRingClass = feature.focusRingClass;
  const isPointEligible = pointEligibleFeatures.includes(feature.id);

  return (
    <div className="flex flex-col items-center justify-start p-6 bg-white rounded-lg shadow-lg h-full min-h-[400px] animate-fade-in">
      <div className="w-full -mt-6 -mx-6 mb-6">
        <div className={`relative w-full p-2 rounded-t-lg text-center ${feature.activeClasses}`}>
            <h2 className="text-2xl font-bold">{feature.label}</h2>
            <BackButton onClick={goBack} className={`${feature.activeClasses} text-white ${buttonFocusRingClass}`} label={uiStrings.backButton}/>
        </div>
      </div>
      
      <div className="w-full max-w-lg min-h-[150px] p-6 bg-playful-yellow-100 rounded-lg text-center flex flex-col items-center justify-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : content ? (
          <p className="text-lg text-gray-800 whitespace-pre-wrap">{content}</p>
        ) : (
          <p className="text-gray-500">{feature.introText}</p>
        )}
      </div>

      <div className="flex flex-col items-center mt-6 space-y-3 w-full max-w-xs">
        <button
          onClick={fetchContent}
          disabled={isLoading}
          className={`w-full px-6 py-3 font-semibold rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 ${buttonColorClasses} ${buttonFocusRingClass}`}
        >
          {isLoading ? uiStrings.aiContentScreen.thinking : content ? uiStrings.aiContentScreen.createAnother : feature.buttonText}
        </button>

        {isPointEligible && content && !pointsClaimed && !isLoading && (
          <button
            onClick={handleClaimPoints}
            className="w-full px-6 py-3 font-semibold rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 bg-happy-green-500 text-white hover:bg-happy-green-600 focus:ring-happy-green-500"
          >
            {uiStrings.aiContentScreen.iDidIt}
          </button>
        )}
      </div>
    </div>
  );
};

export default AiContentScreen;