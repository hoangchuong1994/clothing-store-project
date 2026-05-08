import { useState, useEffect } from 'react';

const strengthLevels = ['weak', 'fair', 'good', 'strong', 'very strong'] as const;

/**
 * Simple password strength calculation
 */
function getPasswordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;

  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  return Math.min(score - 1, strengthLevels.length - 1);
}

export interface PasswordStrengthResult {
  score: number;
  level: (typeof strengthLevels)[number];
  progress: string;
  isValid: boolean;
  feedback: string;
}

/**
 * Hook for password strength calculation and validation
 */
export function usePasswordStrength(password: string): PasswordStrengthResult {
  const score = getPasswordStrength(password);
  const level = strengthLevels[score];
  const progress = `${(score / (strengthLevels.length - 1)) * 100}%`;
  const isValid = score >= 2; // Require at least "good" strength

  const getFeedback = (): string => {
    if (!password) return 'Enter a password';
    if (password.length < 12) return 'Use at least 12 characters';
    if (!/[A-Z]/.test(password)) return 'Add uppercase letters';
    if (!/[0-9]/.test(password)) return 'Add numbers';
    if (!/[^a-zA-Z0-9]/.test(password)) return 'Add special characters';
    return 'Strong password!';
  };

  return {
    score,
    level,
    progress,
    isValid,
    feedback: getFeedback(),
  };
}
