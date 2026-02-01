
import React, { useState, useEffect, useCallback } from 'react';
import { Feature, MoodLog, UiStrings, AgeSelectorUiStrings } from './types';
import FeatureButton from './components/FeatureButton';
import AiContentScreen from './components/JournalingPrompt';
import HowAreYou from './components/MoodTracker';
import MoodJournal from './components/MoodJournal';
import LanguageSelector from './components/LanguageSelector';
import AgeSelector from './components/AgeSelector';
import * as geminiService from './services/geminiService';
import { FEATURES as featureTemplates } from './constants';
import Logo from './components/Logo';
import PointPopupManager, { PointPopupInfo } from './components/PointPopupManager';

interface SavedProgress {
  points: number;
  moodHistory: MoodLog[];
}

const App: React.FC = () => {
  const [language, setLanguage] = useState<string | null>(null);
  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [uiStrings, setUiStrings] = useState<UiStrings | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const [subtitle, setSubtitle] = useState<string>('');
  const [isHiding, setIsHiding] = useState(false);
  const [points, setPoints] = useState<number>(0);
  const [moodHistory, setMoodHistory] = useState<MoodLog[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  const [ageSelectorStrings, setAgeSelectorStrings] = useState<AgeSelectorUiStrings | null>(null);
  const [isFetchingAgeStrings, setIsFetchingAgeStrings] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState<string | null>(null);
  const [pointPopups, setPointPopups] = useState<PointPopupInfo[]>([]);
  const [prefetchedUiStrings, setPrefetchedUiStrings] = useState<Record<string, UiStrings | null>>({});

  useEffect(() => {
    try {
      const savedProgressJSON = localStorage.getItem('moodyBuddyProgress');
      if (savedProgressJSON) {
        const savedProgress: SavedProgress = JSON.parse(savedProgressJSON);
        const parsedMoodHistory = (savedProgress.moodHistory || []).map(log => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        setPoints(savedProgress.points || 0);
        setMoodHistory(parsedMoodHistory);
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  }, []);

  useEffect(() => {
    if (uiStrings) {
      const randomIndex = Math.floor(Math.random() * uiStrings.subtitles.length);
      setSubtitle(uiStrings.subtitles[randomIndex]);

      const translatedFeatures = featureTemplates.map(template => ({
        ...template,
        label: uiStrings.features[template.id]?.label || template.label,
        buttonText: uiStrings.featureDetails[template.id]?.buttonText || template.buttonText,
        introText: uiStrings.featureDetails[template.id]?.introText || template.introText,
      }));
      setFeatures(translatedFeatures);
      setSaveButtonText(uiStrings.saveProgress);
    }
  }, [uiStrings]);

  const handleLanguageReset = () => {
    setLanguage(null);
    setUiStrings(null);
    setAgeRange(null);
    setAgeSelectorStrings(null);
  };

  const handleLanguageSelect = useCallback(async (lang: string) => {
    setLanguage(lang);
    setIsFetchingAgeStrings(true);
    setTranslationError(null);
    try {
      const ageSelectorPromise = geminiService.translateAgeSelectorUI(lang);
      const translatedAgeStrings = await ageSelectorPromise;
      setAgeSelectorStrings(translatedAgeStrings);
    } catch (e) {
      setTranslationError("Грешка при вчитување. Обидете се повторно.");
      handleLanguageReset();
    } finally {
      setIsFetchingAgeStrings(false);
    }
  }, []);

  const handleAgeSelect = useCallback(async (age: string) => {
    if (!language) return;
    setAgeRange(age);
    setIsTranslating(true);
    try {
      const translatedStrings = await geminiService.translateUI(language, age);
      setUiStrings(translatedStrings);
    } catch (e) {
      setTranslationError("Грешка при поставување. Обидете се повторно.");
      setLanguage(null);
    } finally {
      setIsTranslating(false);
    }
  }, [language]);

  const handleFeatureClick = (feature: Feature) => {
    setIsHiding(true);
    setTimeout(() => {
      setActiveFeature(feature);
      setIsHiding(false);
    }, 300);
  };
  
  const handleGoBack = () => {
    setIsHiding(true);
    setTimeout(() => {
      setActiveFeature(null);
      setIsHiding(false);
    }, 300);
  };

  const addPoints = (amount: number) => {
    setPoints(prevPoints => prevPoints + amount);
    const newPopup: PointPopupInfo = {
      id: Date.now(),
      amount,
      top: Math.random() * 50 + 20,
      left: Math.random() * 60 + 20,
    };
    setPointPopups(currentPopups => [...currentPopups, newPopup]);
    setTimeout(() => {
      setPointPopups(currentPopups => currentPopups.filter(p => p.id !== newPopup.id));
    }, 2000);
  };

  const handleMoodSubmission = (mood: { label: string; emoji: string }, notes: string) => {
    addPoints(10);
    const newEntry: MoodLog = {
      mood: mood.label,
      emoji: mood.emoji,
      notes: notes,
      timestamp: new Date(),
    };
    setMoodHistory(prevHistory => [newEntry, ...prevHistory]);
  };

  const renderContent = () => {
    if (!activeFeature || !language || !uiStrings || !ageRange) return null;

    if (activeFeature.id === 'mood-selection') {
      return <HowAreYou feature={activeFeature} goBack={handleGoBack} onMoodSubmit={handleMoodSubmission} language={language} ageRange={ageRange} uiStrings={uiStrings} />;
    } else if (activeFeature.id === 'mood-journal') {
        return <MoodJournal feature={activeFeature} goBack={handleGoBack} points={points} moodHistory={moodHistory} uiStrings={uiStrings} onAddNote={handleMoodSubmission} />;
    } else {
      return <AiContentScreen feature={activeFeature} goBack={handleGoBack} addPoints={addPoints} language={language} ageRange={ageRange} uiStrings={uiStrings} />;
    }
  };

  if (!language) return <LanguageSelector onSelect={handleLanguageSelect} error={translationError} />;
  if (!uiStrings) return <AgeSelector onSelect={handleAgeSelect} onBack={handleLanguageReset} loading={isTranslating} loadingStrings={isFetchingAgeStrings} uiStrings={ageSelectorStrings} />;

  return (
    <div className="min-h-screen text-gray-800 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans overflow-x-hidden">
      <PointPopupManager popups={pointPopups} />
      <header className="w-full max-w-xl text-center mb-8 animate-fade-in">
        <Logo className="h-16 w-16 mx-auto mb-2 text-gray-800" />
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">Moody Buddy</h1>
        <p className="text-md text-gray-500 mt-1 font-medium">{subtitle}</p>
      </header>
      
      <main className="w-full max-w-md relative">
        <div className={`transition-all duration-300 ${activeFeature ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => (
              <FeatureButton
                key={feature.id}
                feature={feature}
                isActive={false}
                onClick={() => handleFeatureClick(feature)}
                ageRange={ageRange}
              />
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={() => {
                localStorage.setItem('moodyBuddyProgress', JSON.stringify({ points, moodHistory }));
                alert(uiStrings.progressSaved);
              }}
              className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              {uiStrings.saveProgress}
            </button>
            <button
              onClick={handleLanguageReset}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              {uiStrings.changeLanguageAndAge}
            </button>
            <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest">Powered by firSTep & Gemini</p>
          </div>
        </div>

        {activeFeature && (
          <div className="absolute top-0 left-0 w-full animate-fade-in-up">
            {renderContent()}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
