// web/src/utils/chordDiagrams.ts

export interface GuitarDiagram {
  frets: (number | null)[]; // Array of fret numbers for each string (EADGBe from low to high)
  fingers: (number | null)[]; // Array of finger numbers for each string (1=index, 2=middle, etc.)
  barre?: { fret: number; from: number; to: number }; // Optional barre chord
  capo?: number; // Optional capo position
}

export interface KeyboardDiagram {
  keys: string[]; // Array of key names (e.g., 'C4', 'E4', 'G4')
}

export interface ChordDiagrams {
  guitar?: GuitarDiagram;
  keyboard?: KeyboardDiagram;
}

// Simplified hardcoded chord data for demonstration
// In a real application, this would come from a more comprehensive database or library
export const CHORD_DIAGRAMS: { [key: string]: ChordDiagrams } = {
  // C Major
  'C': {
    guitar: { frets: [null, 3, 2, 0, 1, 0], fingers: [null, 3, 2, 0, 1, 0] },
    keyboard: { keys: ['C4', 'E4', 'G4'] },
  },
  // G Major
  'G': {
    guitar: { frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4] },
    keyboard: { keys: ['G3', 'B3', 'D4'] },
  },
  // Am (A minor)
  'Am': {
    guitar: { frets: [null, 0, 2, 2, 1, 0], fingers: [null, 0, 2, 3, 1, 0] },
    keyboard: { keys: ['A3', 'C4', 'E4'] },
  },
  // F Major
  'F': {
    guitar: { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barre: { fret: 1, from: 1, to: 6 } },
    keyboard: { keys: ['F3', 'A3', 'C4'] },
  },
  // D Major
  'D': {
    guitar: { frets: [null, null, 0, 2, 3, 2], fingers: [null, null, 0, 1, 3, 2] },
    keyboard: { keys: ['D4', 'F#4', 'A4'] },
  },
  // E Major
  'E': {
    guitar: { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
    keyboard: { keys: ['E4', 'G#4', 'B4'] },
  },
  // Dm (D minor)
  'Dm': {
    guitar: { frets: [null, null, 0, 2, 3, 1], fingers: [null, null, 0, 2, 3, 1] },
    keyboard: { keys: ['D4', 'F4', 'A4'] },
  },
  // E7 (E dominant 7th)
  'E7': {
    guitar: { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0] },
    keyboard: { keys: ['E4', 'G#4', 'B4', 'D5'] }, // Added D5 for 7th
  },
  // C# Major (example for transposed chord)
  'C#': {
    guitar: { frets: [null, 4, 3, 1, 2, 1], fingers: [null, 3, 2, 1, 4, 1], barre: { fret: 1, from: 1, to: 6 } }, // F shape capo 1
    keyboard: { keys: ['C#4', 'F4', 'G#4'] },
  },
  // D# Major (example for transposed chord)
  'D#': {
    guitar: { frets: [null, 6, 5, 3, 4, 3], fingers: [null, 3, 2, 1, 4, 1], barre: { fret: 3, from: 1, to: 6 } }, // F shape capo 3
    keyboard: { keys: ['D#4', 'G4', 'A#4'] },
  },
};

// Helper to get a diagram for a transposed chord
// This is a simplification. In a real app, you'd transpose the diagram data itself.
// For now, we just return the diagram for the exact chord name if it exists.
export const getChordDiagram = (chordName: string, type: 'guitar' | 'keyboard') => {
  return CHORD_DIAGRAMS[chordName]?.[type];
};
