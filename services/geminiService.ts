import { GoogleGenAI, Type } from "@google/genai";
import { UiStrings, AgeSelectorUiStrings } from "../types";

// Always initialize the Google GenAI client using a named parameter for the API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper function to call Gemini for text generation tasks.
const callGemini = async (prompt: string, defaultResponse: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Use the .text property directly as per latest SDK guidelines.
    return response.text?.trim().replace(/"/g, "") || defaultResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    return defaultResponse;
  }
};

export const englishStrings: UiStrings = {
  subtitles: [
    "Your friendly feelings friend!",
    "Ready for a fun adventure?",
    "Let's explore our feelings together!",
    "Time to smile and play!",
    "Your happy helper is here!",
    "What amazing thing will we do today?"
  ],
  features: {
    "mood-selection": { "label": "How Are You?" },
    "calm-zone": { "label": "Calm Zone" },
    "get-moving": { "label": "Get Moving" },
    "act-of-kindness": { "label": "Act of Kindness" },
    "gratitude-jar": { "label": "Gratitude Jar" },
    "mood-journal": { "label": "Mood Journal" }
  },
  featureDetails: {
    "gratitude-jar": {
      "buttonText": "Find Something to be Grateful For",
      "introText": "Let's think about all the wonderful things in our lives!"
    },
    "get-moving": {
      "buttonText": "Suggest a Fun Activity",
      "introText": "Time to wiggle and giggle! Let's see what fun move we can do."
    },
    "act-of-kindness": {
      "buttonText": "Suggest a Kind Act",
      "introText": "Let's spread some happiness! What kind thing can we do today?"
    },
    "calm-zone": {
      "buttonText": "Get a Breathing Exercise",
      "introText": "Let's take a moment to relax with a fun breathing exercise."
    }
  },
  aiContentScreen: {
    "thinking": "Thinking...",
    "createAnother": "Create Another!",
    "error": "Something went wrong. Please try again.",
    "iDidIt": "I did it! (+10 points)"
  },
  moodTracker: {
    "title": "How are you feeling right now?",
    "feeling": "You're feeling",
    "prompt": "Want to write more about it?",
    "optional": "(This is optional!)",
    "done": "Done!",
    "thanks": "Thanks for sharing!",
    "startOver": "Start Over",
    "moods": {
      "Happy": "Happy", "Calm": "Calm", "Silly": "Silly", "Sad": "Sad", "Worried": "Worried", "Grumpy": "Grumpy"
    }
  },
  moodJournal: {
    "totalPoints": "Total Stars",
    "feelingsLog": "Feelings Log",
    "emptyLog": "Your journal is waiting! Log your feelings to start your journey.",
    "journalPrompt": "What's on your mind today?",
    "addNote": "Add a thought...",
    "saveNote": "Save to Journal"
  },
  storyCreator: {
    "error": "Oops! My storytelling magic ran out.",
    "theEnd": "The End! 🌟",
    "startNew": "Start New",
    "placeholder": "What's next?",
    "finish": "Finish",
    "thinking": "...",
    "addPart": "Go!"
  },
  "backButton": "Back",
  "changeLanguageAndAge": "Change Language",
  "saveProgress": "Save Progress",
  "progressSaved": "Saved!",
  "saveFailed": "Failed!"
};

// Translates the UI strings based on language and age range.
export const translateUI = async (targetLanguage: string, ageRange: string): Promise<UiStrings> => {
    const prompt = `Translate this JSON into ${targetLanguage} for a ${ageRange} year old. 
    IMPORTANT: Use a friendly "Buddy" persona. For Macedonian, use "ти" (informal). 
    Ensure task descriptions sound native and encouraging.
    
    ${JSON.stringify(englishStrings)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || '{}') as UiStrings;
    } catch (e) {
        return englishStrings;
    }
};

// Translates UI strings for the age selection screen.
export const translateAgeSelectorUI = async (targetLanguage: string): Promise<AgeSelectorUiStrings> => {
    const prompt = `Translate this Age Selection UI into ${targetLanguage}.
    {
      "backButton": "Back",
      "title": "How old are you?",
      "prompt": "I will adjust the app for you!",
      "loading": "Loading...",
      "ages": { "5-7": "5-7", "8-12": "8-12", "13-18": "13-18", "18+": "Adult" }
    }`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || '{}') as AgeSelectorUiStrings;
    } catch (e) {
        return {
          backButton: "Back", title: "How old are you?", prompt: "...", loading: "...", ages: {"5-7":"5-7", "8-12":"8-12", "13-18":"13-18", "18+":"Adult"}
        };
    }
};

// Story creator logic: Starts a new interactive story.
export const startStory = (lang: string, age: string) => 
  callGemini(`As a friendly Buddy, start a fun interactive story for a ${age} year old in ${lang}. Stop at a cliffhanger and ask what happens next. Keep it under 60 words.`, "Once upon a time...");

// Story creator logic: Continues the story based on user input.
export const continueStory = (storySoFar: string, lang: string, age: string) => 
  callGemini(`As a friendly Buddy, continue this story for a ${age} year old in ${lang} based on their input. Story so far: ${storySoFar}. Keep it brief (under 60 words) and ask what happens next.`, "And then...");

// Story creator logic: Concludes the story with a happy ending.
export const finishStory = (storySoFar: string, lang: string, age: string) => 
  callGemini(`As a friendly Buddy, write a happy ending for this story for a ${age} year old in ${lang}. Story so far: ${storySoFar}.`, "The end.");

export const generateGratitudePrompt = (lang: string, age: string) => 
  callGemini(`As a friendly Buddy, ask a ${age} year old in ${lang} what they are grateful for today. Be very brief.`, "На што си благодарен денес?");

export const generateMovingActivity = (lang: string, age: string) => 
  callGemini(`As a friendly Buddy, suggest a 1-minute physical activity for a ${age} year old in ${lang}.`, "Скокни 10 пати во место!");

export const generateKindnessAct = (lang: string, age: string) => 
  callGemini(`As a friendly Buddy, suggest a small act of kindness for a ${age} year old in ${lang}.`, "Кажи му на некој нешто убаво!");

export const generateCalmnessActivity = (lang: string, age: string) => 
  callGemini(`As a friendly Buddy, describe a simple breathing exercise for a ${age} year old in ${lang}.`, "Диши длабоко како балон...");

export const generateMoodResponse = (mood: string, notes: string, lang: string, age: string) => 
  callGemini(`As a friendly Buddy, respond to a ${age} year old feeling ${mood} in ${lang}. Note: ${notes}`, "Те слушам. Тука сум за тебе!");