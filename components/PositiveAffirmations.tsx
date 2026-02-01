
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Feature, UiStrings } from '../types';
import * as geminiService from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import BackButton from './BreathingExercise';

interface StoryPart {
  author: 'ai' | 'user';
  text: string;
}

interface PositiveAffirmationsProps {
  feature: Feature;
  goBack: () => void;
  addPoints: (amount: number) => void;
  language: string;
  ageRange: string;
  uiStrings: UiStrings;
}

const PositiveAffirmations: React.FC<PositiveAffirmationsProps> = ({ feature, goBack, addPoints, language, ageRange, uiStrings }) => {
    const [storyParts, setStoryParts] = useState<StoryPart[]>([]);
    const [currentUserInput, setCurrentUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const storyEndRef = useRef<null | HTMLDivElement>(null);
    const { storyCreator: text } = uiStrings;

    useEffect(() => {
        storyEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [storyParts, isLoading]);

    const startNewStory = useCallback(async () => {
        setIsLoading(true);
        setIsFinished(false);
        setStoryParts([]);
        setCurrentUserInput('');
        try {
            const firstPart = await geminiService.startStory(language, ageRange);
            setStoryParts([{ author: 'ai', text: firstPart }]);
        } catch (error) {
            console.error(error);
            setStoryParts([{ author: 'ai', text: text.error }]);
        } finally {
            setIsLoading(false);
        }
    }, [language, ageRange, text.error]);

    useEffect(() => {
        startNewStory();
    }, [startNewStory]);

    const handleAddPart = useCallback(async () => {
        if (!currentUserInput.trim()) return;
        const newStoryParts: StoryPart[] = [...storyParts, { author: 'user', text: currentUserInput.trim() }];
        setStoryParts(newStoryParts);
        setCurrentUserInput('');
        setIsLoading(true);

        const storySoFar = newStoryParts.map(p => p.text).join('\n\n');
        try {
            const nextPart = await geminiService.continueStory(storySoFar, language, ageRange);
            setStoryParts(prev => [...prev, { author: 'ai', text: nextPart }]);
        } finally {
            setIsLoading(false);
        }
    }, [currentUserInput, storyParts, language, ageRange]);
    
    const handleFinishStory = useCallback(async () => {
        setIsLoading(true);
        let currentStory = [...storyParts];
        if (currentUserInput.trim()) {
            currentStory.push({ author: 'user', text: currentUserInput.trim() });
            setStoryParts(currentStory);
            setCurrentUserInput('');
        }

        const storySoFar = currentStory.map(p => p.text).join('\n\n');
        try {
            const finalPart = await geminiService.finishStory(storySoFar, language, ageRange);
            setStoryParts(prev => [...prev, { author: 'ai', text: finalPart }]);
            addPoints(20);
        } finally {
            setIsLoading(false);
            setIsFinished(true);
        }
    }, [currentUserInput, storyParts, addPoints, language, ageRange]);
    
    const buttonColorClasses = feature.inactiveClasses.replace('text-white', '');
    const buttonFocusRingClass = feature.focusRingClass;

    return (
        <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg h-full min-h-[500px] animate-fade-in">
            <div className="w-full -mt-6 -mx-6 mb-6">
                <div className={`relative w-full p-2 rounded-t-lg text-center ${feature.activeClasses}`}>
                    <h2 className="text-2xl font-bold">{feature.label}</h2>
                    <BackButton onClick={goBack} className={`${feature.activeClasses} text-white ${buttonFocusRingClass}`} label={uiStrings.backButton}/>
                </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-2 space-y-4 flex flex-col">
                {storyParts.map((part, index) => (
                    <div key={index} className={`p-3 rounded-lg max-w-xs break-words shadow-sm ${
                        part.author === 'ai' 
                            ? 'bg-playful-yellow-100 self-start' 
                            : 'bg-sky-blue-200 self-end'
                    }`}>
                        <p className="text-gray-800 whitespace-pre-wrap">{part.text}</p>
                    </div>
                ))}
                {isLoading && (
                    <div className="self-start">
                         <LoadingSpinner />
                    </div>
                )}
                <div ref={storyEndRef} />
            </div>

            {isFinished ? (
                <div className="text-center p-4 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{text.theEnd}</h3>
                    <button
                        onClick={startNewStory}
                        className={`px-6 py-2 font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${buttonColorClasses} ${buttonFocusRingClass}`}
                    >
                        {text.startNew}
                    </button>
                </div>
            ) : (
                <div className="p-2 border-t border-gray-200">
                    <textarea
                        value={currentUserInput}
                        onChange={(e) => setCurrentUserInput(e.target.value)}
                        placeholder={text.placeholder}
                        className="w-full h-20 p-2 border-2 border-playful-yellow-200 rounded-lg focus:ring-2 focus:ring-playful-yellow-400 focus:outline-none resize-none"
                        disabled={isLoading}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <button
                            onClick={handleFinishStory}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                        >
                            {text.finish}
                        </button>
                        <button
                            onClick={handleAddPart}
                            disabled={isLoading || !currentUserInput.trim()}
                            className={`px-6 py-2 font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 ${buttonColorClasses} ${buttonFocusRingClass}`}
                        >
                           {isLoading ? text.thinking : text.addPart}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PositiveAffirmations;