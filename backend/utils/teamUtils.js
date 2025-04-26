import { customAlphabet } from 'nanoid';

// Create a custom ID generator for participant IDs (P-xxxxxx format)
export const generateParticipantId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
export const formatParticipantId = (id) => `P-${id}`;

// Create a custom ID generator for team IDs (T-xxxxxx format)
export const generateTeamId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
export const formatTeamId = (id) => `T-${id}`;

// Helper function to validate team size
export const validateTeamSize = (currentSize, maxSize) => {
    return currentSize < maxSize;
};