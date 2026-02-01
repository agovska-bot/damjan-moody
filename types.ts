
import React from 'react';

export interface MoodLog {
  mood: string;
  emoji: string;
  notes: string;
  timestamp: Date;
}

export interface Feature {
  id: string;
  label: string;
  icon: React.ReactElement;
  inactiveClasses: string;
  activeClasses: string; // Used for screen headers/theming
  focusRingClass: string;
  iconColorClass: string;
  promptGenerator?: (language: string, ageRange: string) => Promise<string>;
  buttonText?: string;
  introText?: string;
}

export interface AgeSelectorUiStrings {
  backButton: string;
  title: string;
  prompt: string;
  loading: string;
  ages: {
    '5-7': string;
    '8-12': string;
    '13-18': string;
    '18+': string;
  };
}

export interface UiStrings {
  subtitles: string[];
  features: { [key: string]: { label: string } };
  featureDetails: { [key: string]: { buttonText: string; introText: string } };
  aiContentScreen: {
    thinking: string;
    createAnother: string;
    error: string;
    iDidIt: string;
  };
  moodTracker: {
    title: string;
    feeling: string;
    prompt: string;
    optional: string;
    done: string;
    thanks: string;
    startOver: string;
    moods: { [key: string]: string };
  };
  moodJournal: {
    totalPoints: string;
    feelingsLog: string;
    emptyLog: string;
    journalPrompt: string;
    addNote: string;
    saveNote: string;
  };
  storyCreator: {
    error: string;
    theEnd: string;
    startNew: string;
    placeholder: string;
    finish: string;
    thinking: string;
    addPart: string;
  };
  backButton: string;
  changeLanguageAndAge: string;
  saveProgress: string;
  progressSaved: string;
  saveFailed: string;
}
