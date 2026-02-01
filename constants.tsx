
import React from 'react';
import { Feature } from './types';
import * as geminiService from './services/geminiService';

const iconClasses = "w-10 h-10 mx-auto mb-1 transition-transform duration-300 group-hover:scale-110";

export const FEATURES: Feature[] = [
  {
    id: 'mood-selection',
    label: 'Како си?',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    inactiveClasses: 'bg-lovely-purple-100 text-lovely-purple-600 hover:bg-lovely-purple-200',
    activeClasses: 'bg-lovely-purple-500 text-white',
    focusRingClass: 'focus:ring-lovely-purple-500',
    iconColorClass: 'text-lovely-purple-500',
  },
  {
    id: 'calm-zone',
    label: 'Зона на мир',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 8.464a5 5 0 000 7.072m2.828 2.828A9 9 0 009 5.636" />
      </svg>
    ),
    inactiveClasses: 'bg-aqua-teal-100 text-aqua-teal-600 hover:bg-aqua-teal-200',
    activeClasses: 'bg-aqua-teal-500 text-white',
    focusRingClass: 'focus:ring-aqua-teal-500',
    iconColorClass: 'text-aqua-teal-500',
    promptGenerator: geminiService.generateCalmnessActivity,
    buttonText: 'Вежба за дишење',
    introText: 'Ајде да дишеме заедно.',
  },
  {
    id: 'get-moving',
    label: 'Размрдај се',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    inactiveClasses: 'bg-sky-blue-100 text-sky-blue-600 hover:bg-sky-blue-200',
    activeClasses: 'bg-sky-blue-500 text-white',
    focusRingClass: 'focus:ring-sky-blue-500',
    iconColorClass: 'text-sky-blue-500',
    promptGenerator: geminiService.generateMovingActivity,
    buttonText: 'Што да правам?',
    introText: 'Движењето носи среќа!',
  },
  {
    id: 'act-of-kindness',
    label: 'Добро дело',
    icon: (
       <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    inactiveClasses: 'bg-soft-pink-100 text-soft-pink-600 hover:bg-soft-pink-200',
    activeClasses: 'bg-soft-pink-500 text-white',
    focusRingClass: 'focus:ring-soft-pink-500',
    iconColorClass: 'text-soft-pink-500',
    promptGenerator: geminiService.generateKindnessAct,
    buttonText: 'Предложи нешто',
    introText: 'Направи некого среќен денес.',
  },
  {
    id: 'gratitude-jar',
    label: 'Благодарност',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    inactiveClasses: 'bg-happy-green-100 text-happy-green-600 hover:bg-happy-green-200',
    activeClasses: 'bg-happy-green-500 text-white',
    focusRingClass: 'focus:ring-happy-green-500',
    iconColorClass: 'text-happy-green-500',
    promptGenerator: geminiService.generateGratitudePrompt,
    buttonText: 'Мисли убаво',
    introText: 'За што си благодарен?',
  },
  {
    id: 'story-creator',
    label: 'Приказни',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    inactiveClasses: 'bg-playful-yellow-100 text-playful-yellow-600 hover:bg-playful-yellow-200',
    activeClasses: 'bg-playful-yellow-500 text-white',
    focusRingClass: 'focus:ring-playful-yellow-500',
    iconColorClass: 'text-playful-yellow-500',
  },
  {
    id: 'mood-journal',
    label: 'Дневник',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    inactiveClasses: 'bg-sunny-orange-100 text-sunny-orange-600 hover:bg-sunny-orange-200',
    activeClasses: 'bg-sunny-orange-500 text-white',
    focusRingClass: 'focus:ring-sunny-orange-500',
    iconColorClass: 'text-sunny-orange-500',
  },
];
