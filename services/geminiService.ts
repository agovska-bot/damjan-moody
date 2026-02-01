
import { GoogleGenAI, Type } from "@google/genai";
import { UiStrings, AgeSelectorUiStrings } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const englishAgeSelectorStrings: AgeSelectorUiStrings = {
  backButton: "← Back",
  title: "How old are you?",
  prompt: "This helps me make things just right for you!",
  loading: "Getting things ready...",
  ages: {
    '5-7': "5-7 years old",
    '8-12': "8-12 years old",
    '13-18': "13-18 years old",
    '18+': "Adult",
  }
};

const englishStrings: UiStrings = {
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
    "error": "Oops! My storytelling magic ran out. Let's try again!",
    "theEnd": "The End! 🌟",
    "startNew": "Start a New Adventure",
    "placeholder": "What happens next?",
    "finish": "Finish the Story",
    "thinking": "Thinking...",
    "addPart": "Tell Me!"
  },
  "backButton": "Back",
  "changeLanguageAndAge": "Change Language And Age",
  "saveProgress": "Save Progress",
  "progressSaved": "Progress Saved!",
  "saveFailed": "Save Failed!"
};

export const translateAgeSelectorUI = async (targetLanguage: string): Promise<AgeSelectorUiStrings> => {
    if (targetLanguage.toLowerCase().includes('english')) {
        return englishAgeSelectorStrings;
    }

    const prompt = `Translate the following JSON object of UI strings for an age selection screen in a kids' app. The target language is ${targetLanguage}. Keep the JSON structure and all keys identical. Only translate the string values.

${JSON.stringify(englishAgeSelectorStrings, null, 2)}
`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as AgeSelectorUiStrings;
    } catch (error) {
        console.error("Error translating age selector UI, falling back to English:", error);
        return englishAgeSelectorStrings;
    }
};

export const translateUI = async (targetLanguage: string, ageRange: string): Promise<UiStrings> => {
    if (targetLanguage.toLowerCase().includes('english')) {
        return englishStrings;
    }

    const prompt = `Translate the following JSON object of UI strings for a kids' app from English into ${targetLanguage}. The target audience is in the age range of ${ageRange} years old. Tailor the language to be appropriate for them. Keep the JSON structure and all keys identical. Only translate the string values.

${JSON.stringify(englishStrings, null, 2)}
`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as UiStrings;
    } catch (error) {
        console.error("Error translating UI, falling back to English:", error);
        return englishStrings;
    }
};

const callGemini = async (prompt: string, defaultResponse: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text.trim().replace(/"/g, "");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return defaultResponse;
  }
};

export const generateGratitudePrompt = (language: string, ageRange: string) => callGemini(
  `Generate a single, simple prompt in ${language} to help someone in the age range of ${ageRange} years old think about something they are grateful for. The response should be a complete question or a gentle instruction. Keep the response concise.`,
  "What is your favorite toy and why do you love it?"
);

export const generateMovingActivity = (language: string, ageRange: string) => callGemini(
  `Suggest a single, fun, simple physical activity for someone in the age range of ${ageRange} years old to do, in ${language}. It should be easy to do indoors or outdoors.`,
  "Let's be a tree! Stand on one leg for as long as you can, then switch to the other."
);

export const generateKindnessAct = (language: string, ageRange: string) => callGemini(
  `Suggest a single, simple act of kindness someone in the age range of ${ageRange} years old can do today, in ${language}.`,
  "Can you tell someone they are doing a great job today?"
);

export const generateCalmnessActivity = (language: string, ageRange: string) => callGemini(
  `Suggest a single, simple, calming breathing exercise for someone in the age range of ${ageRange} years old who needs to relax, in ${language}. Describe the steps in a fun, imaginative way.`,
  "Let's do some 'Snake Breaths'! Breathe in through your nose, and then breathe out with a long, slow hissing sound like a snake."
);

export const generateMoodResponse = (mood: string, notes: string, language: string, ageRange: string) => {
  let prompt = `A user in the age range of ${ageRange} years old is feeling ${mood}.`;
  if (notes) {
    prompt += ` They wrote: "${notes}".`;
  }
  prompt += ` Provide a short, simple, reassuring, and positive response in 1-2 sentences, written in ${language}. Address the user directly.`;
  
  return callGemini(prompt, "Thanks for sharing how you feel. It's good to talk about our feelings!");
};

/**
 * Starts a new interactive story for a child.
 */
export const startStory = (language: string, ageRange: string) => callGemini(
  `You are a storyteller for kids. Start a fun, imaginative story for a child aged ${ageRange} in ${language}. Just provide the first 2-3 sentences. Encourage the child to decide what happens next by asking a simple question.`,
  "Once upon a time, there was a little robot who found a mysterious blue door in the forest. What do you think was behind the door?"
);

/**
 * Continues an existing story based on user input.
 */
export const continueStory = (storySoFar: string, language: string, ageRange: string) => callGemini(
  `You are a storyteller for kids aged ${ageRange}. Here is the story so far:\n\n${storySoFar}\n\nContinue the story based on the latest input, in ${language}. Keep it to 2-3 sentences and ask another question to keep the child engaged.`,
  "The robot opened the door and found a room full of floating balloons! One balloon was bigger than the others. What color was it?"
);

/**
 * Provides a conclusion to the story.
 */
export const finishStory = (storySoFar: string, language: string, ageRange: string) => callGemini(
  `You are a storyteller for kids aged ${ageRange}. Here is the story so far:\n\n${storySoFar}\n\nProvide a happy and creative ending for the story in ${language}. Keep it to 3-4 sentences.`,
  "And so, the robot and all the floating balloons had a big party. Everyone was happy and the robot made many new friends. The end!"
);
