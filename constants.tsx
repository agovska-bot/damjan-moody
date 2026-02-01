
import React from 'react';
import { Feature } from './types';
import * as geminiService from './services/geminiService';

const iconClasses = "w-12 h-12 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110";

export const FEATURES: Feature[] = [
  {
    id: 'mood-selection',
    label: 'Како си?',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    inactiveClasses: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
    activeClasses: 'bg-indigo-500 text-white',
    focusRingClass: 'focus:ring-indigo-500',
    iconColorClass: 'text-indigo-600',
  },
  {
    id: 'calm-zone',
    label: 'Зона на мир',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 8.464a5 5 0 000 7.072m2.828 2.828A9 9 0 009 5.636" />
      </svg>
    ),
    inactiveClasses: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
    activeClasses: 'bg-teal-500 text-white',
    focusRingClass: 'focus:ring-teal-500',
    iconColorClass: 'text-teal-600',
    promptGenerator: geminiService.generateCalmnessActivity,
    buttonText: 'Вежба за дишење',
    introText: 'Ајде да се опуштиме заедно.',
  },
  {
    id: 'get-moving',
    label: 'Размрдај се',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    inactiveClasses: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    activeClasses: 'bg-blue-500 text-white',
    focusRingClass: 'focus:ring-blue-500',
    iconColorClass: 'text-blue-600',
    promptGenerator: geminiService.generateMovingActivity,
    buttonText: 'Идеја за активност',
    introText: 'Време е за малку акција!',
  },
  {
    id: 'act-of-kindness',
    label: 'Добро дело',
    icon: (
       <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    inactiveClasses: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
    activeClasses: 'bg-pink-500 text-white',
    focusRingClass: 'focus:ring-pink-500',
    iconColorClass: 'text-pink-600',
    promptGenerator: geminiService.generateKindnessAct,
    buttonText: 'Што да направам денес?',
    introText: 'Малите дела го менуваат светот.',
  },
  {
    id: 'gratitude-jar',
    label: 'Благодарност',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    inactiveClasses: 'bg-green-100 text-green-700 hover:bg-green-200',
    activeClasses: 'bg-green-500 text-white',
    focusRingClass: 'focus:ring-green-500',
    iconColorClass: 'text-green-600',
    promptGenerator: geminiService.generateGratitudePrompt,
    buttonText: 'На што сум благодарен?',
    introText: 'Да се потсетиме на убавите нешта.',
  },
  {
    id: 'mood-journal',
    label: 'Дневник',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    inactiveClasses: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    activeClasses: 'bg-amber-500 text-white',
    focusRingClass: 'focus:ring-amber-500',
    iconColorClass: 'text-amber-600',
  },
];
