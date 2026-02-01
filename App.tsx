
import React, { useState, useEffect, useCallback } from 'react';
import { Feature, MoodLog, UiStrings, AgeSelectorUiStrings } from './types';
import FeatureButton from './components/FeatureButton';
import AiContentScreen from './components/JournalingPrompt';
import HowAreYou from './components/MoodTracker';
import MoodJournal from './components/MoodJournal';
import PositiveAffirmations from './components/PositiveAffirmations';
import LanguageSelector from './components/LanguageSelector';
import AgeSelector from './components/AgeSelector';
import * as geminiService from './services/geminiService';
import { FEATURES as featureTemplates } from './constants';
import Logo from './components/Logo';
import PointPopupManager, { PointPopupInfo } from './components/PointPopupManager';

const App: React.FC = () => {
  const [language, setLanguage] = useState<string | null>(null);
  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [uiStrings, setUiStrings] = useState<UiStrings | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [moodHistory, setMoodHistory] = useState<MoodLog[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [pointPopups, setPointPopups] = useState<PointPopupInfo[]>([]);
  const [ageSelectorStrings, setAgeSelectorStrings] = useState<AgeSelectorUiStrings | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('moodyBuddyProgress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPoints(parsed.points || 0);
        setMoodHistory((parsed.moodHistory || []).map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) })));
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (uiStrings) {
      const translated = featureTemplates.map(f => ({
        ...f,
        label: uiStrings.features[f.id]?.label || f.label,
        buttonText: uiStrings.featureDetails[f.id]?.buttonText || f.buttonText,
        introText: uiStrings.featureDetails[f.id]?.introText || f.introText,
      }));
      setFeatures(translated);
    }
  }, [uiStrings]);

  const handleLanguageSelect = async (lang: string) => {
    setLanguage(lang);
    try {
      const strings = await geminiService.translateAgeSelectorUI(lang);
      setAgeSelectorStrings(strings);
    } catch (e) { setLanguage(null); }
  };

  const handleAgeSelect = async (age: string) => {
    if (!language) return;
    setAgeRange(age);
    setIsTranslating(true);
    try {
      const strings = await geminiService.translateUI(language, age);
      setUiStrings(strings);
    } catch (e) { setLanguage(null); }
    setIsTranslating(false);
  };

  const addPoints = (amount: number) => {
    setPoints(p => p + amount);
    setPointPopups(prev => [...prev, { id: Date.now(), amount, top: 40, left: 50 }]);
    setTimeout(() => setPointPopups(p => p.slice(1)), 2000);
  };

  const renderContent = () => {
    if (!activeFeature || !uiStrings || !language || !ageRange) return null;
    switch (activeFeature.id) {
      // Fix: Mapped 'm.label' to 'mood' property required by MoodLog interface to resolve type mismatch
      case 'mood-selection': return <HowAreYou feature={activeFeature} goBack={() => setActiveFeature(null)} onMoodSubmit={(m, n) => { addPoints(10); setMoodHistory(prev => [{ mood: m.label, emoji: m.emoji, notes: n, timestamp: new Date() }, ...prev]) }} language={language} ageRange={ageRange} uiStrings={uiStrings} />;
      // Fix: Mapped 'm.label' to 'mood' property required by MoodLog interface to resolve type mismatch
      case 'mood-journal': return <MoodJournal feature={activeFeature} goBack={() => setActiveFeature(null)} points={points} moodHistory={moodHistory} uiStrings={uiStrings} onAddNote={(m, n) => { addPoints(10); setMoodHistory(prev => [{ mood: m.label, emoji: m.emoji, notes: n, timestamp: new Date() }, ...prev]) }} />;
      case 'story-creator': return <PositiveAffirmations feature={activeFeature} goBack={() => setActiveFeature(null)} addPoints={addPoints} language={language} ageRange={ageRange} uiStrings={uiStrings} />;
      default: return <AiContentScreen feature={activeFeature} goBack={() => setActiveFeature(null)} addPoints={addPoints} language={language} ageRange={ageRange} uiStrings={uiStrings} />;
    }
  };

  if (!language) return <LanguageSelector onSelect={handleLanguageSelect} error={null} />;
  if (!uiStrings) return <AgeSelector onSelect={handleAgeSelect} onBack={() => setLanguage(null)} loading={isTranslating} loadingStrings={!ageSelectorStrings} uiStrings={ageSelectorStrings} />;

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <PointPopupManager popups={pointPopups} />
      <header className="w-full max-w-md text-center mb-6 animate-fade-in">
        <Logo className="h-12 w-12 mx-auto mb-1" />
        <h1 className="text-2xl font-black text-gray-900">Moody Buddy</h1>
        <div className="flex justify-center gap-2 mt-2">
            <span className="bg-playful-yellow-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">⭐ {points} Stars</span>
        </div>
      </header>
      
      <main className="w-full max-w-md">
        {activeFeature ? renderContent() : (
          <div className="grid grid-cols-2 gap-3 animate-fade-in-up">
            {features.map((f, idx) => (
              <div key={f.id} className={idx === 6 ? "col-span-2" : ""}>
                <FeatureButton feature={f} isActive={false} onClick={() => setActiveFeature(f)} ageRange={ageRange || ''} />
              </div>
            ))}
            <button
              onClick={() => { localStorage.setItem('moodyBuddyProgress', JSON.stringify({ points, moodHistory })); alert(uiStrings.progressSaved); }}
              className="col-span-2 mt-4 py-3 bg-white border-2 border-gray-100 text-gray-400 font-bold rounded-2xl hover:bg-gray-50 transition-all text-xs uppercase"
            >
              {uiStrings.saveProgress}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
