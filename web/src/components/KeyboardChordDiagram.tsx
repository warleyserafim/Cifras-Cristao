'use client';

import React from 'react';

interface KeyboardDiagram {
  keys: string[]; // Array of key names (e.g., 'C4', 'E4', 'G4')
}

interface KeyboardChordDiagramProps {
  diagram: KeyboardDiagram;
}

const KeyboardChordDiagram: React.FC<KeyboardChordDiagramProps> = ({ diagram }) => {
  const whiteKeysInOctave = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackKeyOffsets: { [key: string]: number } = { 'C#': 0.6, 'D#': 1.4, 'F#': 3.6, 'G#': 4.4, 'A#': 5.2 }; // Relative to white key width

  const numOctaves = 2; // Display 2 octaves for simplicity
  const whiteKeyWidth = 9; 
  const whiteKeyHeight = 60;
  const blackKeyWidth = whiteKeyWidth * 0.6;
  const blackKeyHeight = whiteKeyHeight * 0.6;

  const totalWidth = numOctaves * whiteKeysInOctave.length * whiteKeyWidth;
  const totalHeight = whiteKeyHeight;

  // Generate all keys in the displayed range
 interface KeyInfo {
    name: string;
    octave: number;
    x: number;
    isBlack: boolean;
  }

const allKeys: KeyInfo[] = [];

for (let octave = 0; octave < numOctaves; octave++) {
  for (let i = 0; i < whiteKeysInOctave.length; i++) {
    const whiteKeyName = whiteKeysInOctave[i];
    allKeys.push({ 
      name: whiteKeyName, 
      octave: octave, 
      x: octave * whiteKeysInOctave.length * whiteKeyWidth + i * whiteKeyWidth, 
      isBlack: false 
    });
    if (blackKeyOffsets[whiteKeyName + '#']) {
      allKeys.push({ 
        name: whiteKeyName + '#', 
        octave: octave, 
        x: octave * whiteKeysInOctave.length * whiteKeyWidth + i * whiteKeyWidth + (whiteKeyWidth * blackKeyOffsets[whiteKeyName + '#']), 
        isBlack: true 
      });
    }
  }
}

  return (
    <div className="relative overflow-hidden" style={{ width: totalWidth, height: totalHeight }}>
      {/* Render White Keys */}
      {allKeys.filter(key => !key.isBlack).map((key) => (
        <div
          key={`white-${key.name}-${key.octave}`}
          className="absolute border border-[var(--color-border)] bg-[var(--color-background)]"
          style={{
            left: key.x,
            width: whiteKeyWidth,
            height: whiteKeyHeight,
            zIndex: 1,
          }}
        ></div>
      ))}

      {/* Render Black Keys */}
      {allKeys.filter(key => key.isBlack).map((key) => (
        <div
          key={`black-${key.name}-${key.octave}`}
          className="absolute bg-black border border-[var(--color-border)]"
          style={{
            left: key.x,
            width: blackKeyWidth,
            height: blackKeyHeight,
            zIndex: 2,
          }}
        ></div>
      ))}

      {/* Render Highlighted Keys */}
      {diagram.keys.map((highlightedKeyName) => {
        const key = allKeys.find(k => k.name === highlightedKeyName.slice(0, -1) && k.octave === parseInt(highlightedKeyName.slice(-1)) - 3); // Assuming startOctave 3 for diagram data
        if (!key) return null;

        return (
          <div
            key={highlightedKeyName}
            className="absolute rounded-full flex items-center justify-center text-white font-bold"
            style={{
              left: key.x + (key.isBlack ? blackKeyWidth / 2 : whiteKeyWidth / 2) - 7.5, // Center dot
              top: key.isBlack ? blackKeyHeight / 2 - 7.5 : whiteKeyHeight / 2 - 7.5, // Center dot
              width: 15, height: 15, 
              backgroundColor: 'var(--color-primary)', // Use primary color for highlight
              zIndex: 3,
              fontSize: '8px'
            }}
          >
            {key.name.slice(0, -1)} {/* Show just the note name */}
          </div>
        );
      })}
    </div>
  );
};

export default KeyboardChordDiagram;