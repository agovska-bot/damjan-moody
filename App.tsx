
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
import LoadingSpinner from './components/LoadingSpinner';
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
      console.error("Failed to load progress from localStorage:", error);
      localStorage.removeItem('moodyBuddyProgress');
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
    setPrefetchedUiStrings({});
  };

  const handleLanguageSelect = useCallback(async (lang: string) => {
    setLanguage(lang);
    setIsFetchingAgeStrings(true);
    setTranslationError(null);
    setPrefetchedUiStrings({});

    try {
      const ageSelectorPromise = geminiService.translateAgeSelectorUI(lang);
      const ageRanges = ['5-7', '8-12', '13-18', '18+'];
      const prefetchPromises = ageRanges.map(age => 
          geminiService.translateUI(lang, age)
          .then(strings => ({ age, strings }))
          .catch(e => {
              console.error(`Prefetching UI for ${age} failed:`, e);
              return { age, strings: null };
          })
      );
      
      const translatedAgeStrings = await ageSelectorPromise;
      setAgeSelectorStrings(translatedAgeStrings);

      Promise.all(prefetchPromises).then(results => {
          const prefetched: Record<string, UiStrings | null> = {};
          results.forEach(result => {
              prefetched[result.age] = result.strings;
          });
          setPrefetchedUiStrings(prefetched);
      });

    } catch (e) {
      console.error("Age selector translation failed:", e);
      setTranslationError("Error: Translation unavailable. Try again later.");
      handleLanguageReset();
    } finally {
      setIsFetchingAgeStrings(false);
    }
  }, []);

  const handleAgeSelect = useCallback(async (age: string) => {
    if (!language) return;
    setAgeRange(age);
    
    const prefetched = prefetchedUiStrings[age];
    if (prefetched) {
      setUiStrings(prefetched);
      return;
    }

    setIsTranslating(true);
    setTranslationError(null);
    try {
      const translatedStrings = await geminiService.translateUI(language, age);
      setUiStrings(translatedStrings);
    } catch (e) {
      console.error("Translation failed:", e);
      setTranslationError("Error: Setting up failed. Please try again.");
      setLanguage(null);
      setAgeRange(null);
    } finally {
      setIsTranslating(false);
    }
  }, [language, prefetchedUiStrings]);

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
      setPointPopups(currentPopups =>
        currentPopups.filter(p => p.id !== newPopup.id)
      );
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
  
  const handleSaveProgress = () => {
    if (!uiStrings) return;
    try {
      const progressToSave = {
        points,
        moodHistory,
      };
      localStorage.setItem('moodyBuddyProgress', JSON.stringify(progressToSave));
      setSaveButtonText(uiStrings.progressSaved);
      setTimeout(() => {
        setSaveButtonText(uiStrings.saveProgress);
      }, 2000);
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
      setSaveButtonText(uiStrings.saveFailed);
       setTimeout(() => {
        setSaveButtonText(uiStrings.saveProgress);
      }, 2000);
    }
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

  if (!language) {
    return (
      <LanguageSelector 
        onSelect={handleLanguageSelect} 
        error={translationError}
      />
    );
  }

  if (!uiStrings) {
    return (
      <AgeSelector 
        onSelect={handleAgeSelect} 
        onBack={handleLanguageReset} 
        loading={isTranslating} 
        loadingStrings={isFetchingAgeStrings}
        uiStrings={ageSelectorStrings}
      />
    );
  }

  return (
    <div className="min-h-screen text-gray-800 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans overflow-x-hidden">
      <PointPopupManager popups={pointPopups} />
      <header className="w-full max-w-xl text-center mb-8">
        <Logo className="h-20 w-20 mx-auto text-gray-800 mb-2" />
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Moody Buddy 2.0</h1>
        <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
      </header>
      
      <main className="w-full max-w-sm relative">
        <div 
          className={`transition-transform duration-300 ease-in-out ${activeFeature ? 'transform -translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'}`}
          aria-hidden={!!activeFeature}
        >
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
          <div className="mt-8 text-center space-y-3">
            {saveButtonText && (
              <button
                onClick={handleSaveProgress}
                disabled={saveButtonText !== uiStrings.saveProgress}
                className="w-full max-w-xs mx-auto px-4 py-2 text-sm font-semibold text-white bg-sky-blue-500 rounded-lg hover:bg-sky-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-sky-blue-400 focus:ring-offset-2 disabled:bg-gray-400"
              >
                {saveButtonText}
              </button>
            )}
            <button
              onClick={handleLanguageReset}
              className="w-full max-w-xs mx-auto px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              {uiStrings.changeLanguageAndAge}
            </button>
          </div>
        </div>

        <div 
          className={`absolute top-0 left-0 w-full transition-transform duration-300 ease-in-out ${activeFeature ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'}`}
          aria-hidden={!activeFeature}
        >
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
