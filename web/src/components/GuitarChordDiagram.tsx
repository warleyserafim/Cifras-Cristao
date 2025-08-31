'use client';

import React from 'react';

interface GuitarDiagram {
  frets: (number | null)[]; // Array of fret numbers for each string (EADGBe from low to high)
  fingers: (number | null)[]; // Array of finger numbers for each string (1=index, 2=middle, etc.)
  barre?: { fret: number; from: number; to: number }; // Optional barre chord
  capo?: number; // Optional capo position
}

interface GuitarChordDiagramProps {
  diagram: GuitarDiagram;
}

const GuitarChordDiagram: React.FC<GuitarChordDiagramProps> = ({ diagram }) => {
  const numFrets = 5; // Display 5 frets
  const numStrings = 6; // Standard 6-string guitar
  const fretWidth = 25; // Width of each fret space
  const stringSpacing = 20; // Spacing between strings
  const nutHeight = 6; // Height of the nut
  const diagramHeight = nutHeight + (numFrets * fretWidth);
  const diagramWidth = (numStrings - 1) * stringSpacing;

  // Determine the starting fret for the diagram
  let startFret = 0;
  if (diagram.frets.some(f => f !== null && f > numFrets)) {
    // If any fret is beyond the initial 5, find the minimum non-zero fret
    const minFret = Math.min(...diagram.frets.filter(f => f !== null && f > 0) as number[]);
    if (minFret > 1) {
      startFret = minFret - 1; // Start one fret before the lowest used fret
    }
  }

  return (
    <svg className="w-full h-full" viewBox={`-10 -10 ${diagramWidth + 20} ${diagramHeight + 20}`}>
      {/* Nut */}
      {startFret === 0 && (
        <line x1="0" y1="0" x2={diagramWidth} y2="0" stroke="currentColor" strokeWidth="4" />
      )}
      {startFret > 0 && (
        <text x="-5" y="15" fill="currentColor" fontSize="10" textAnchor="end">{startFret}</text>
      )}

      {/* Frets */}
      {[...Array(numFrets + 1)].map((_, i) => (
        <line 
          key={`fret-${i}`}
          x1="0" 
          y1={nutHeight + (i * fretWidth) - (startFret > 0 ? fretWidth : 0)}
          x2={diagramWidth} 
          y2={nutHeight + (i * fretWidth) - (startFret > 0 ? fretWidth : 0)}
          stroke="currentColor" 
          strokeWidth="1"
        />
      ))}

      {/* Strings */}
      {[...Array(numStrings)].map((_, i) => (
        <line 
          key={`string-${i}`}
          x1={i * stringSpacing} 
          y1="0" 
          x2={i * stringSpacing} 
          y2={diagramHeight - (startFret > 0 ? fretWidth : 0)}
          stroke="currentColor" 
          strokeWidth="1"
        />
      ))}

      {/* Capo (if applicable) */}
      {diagram.capo && (
        <rect 
          x="0" 
          y={nutHeight + ((diagram.capo - (startFret > 0 ? startFret : 0)) * fretWidth) - fretWidth}
          width={diagramWidth} 
          height={fretWidth} 
          fill="var(--color-primary)" fillOpacity="0.3"
        />
      )}

      {/* Barre (if applicable) */}
      {diagram.barre && (
        <rect 
          x={(diagram.barre.from - 1) * stringSpacing} 
          y={nutHeight + ((diagram.barre.fret - (startFret > 0 ? startFret : 0)) * fretWidth) - fretWidth / 2}
          width={(diagram.barre.to - diagram.barre.from + 1) * stringSpacing} 
          height={fretWidth} 
          fill="var(--color-accent)" fillOpacity="0.3"
          rx="5" ry="5"
        />
      )}

      {/* Fingers/Dots */}
      {diagram.frets.map((fret, stringIndex) => {
        if (fret === null) return null; // Muted string
        if (fret === 0) { // Open string
          return (
            <circle 
              key={`open-${stringIndex}`}
              cx={stringIndex * stringSpacing} 
              cy={-nutHeight / 2} 
              r="3" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            />
          );
        }
        
        const displayFret = fret - (startFret > 0 ? startFret : 0);
        if (displayFret < 1 || displayFret > numFrets) return null; // Fret not in display range

        return (
          <circle 
            key={`fret-dot-${stringIndex}`}
            cx={stringIndex * stringSpacing} 
            cy={nutHeight + (displayFret * fretWidth) - (fretWidth / 2)}
            r="6" 
            fill="currentColor"
          />
        );
      })}

      {/* Finger numbers */}
      {diagram.fingers.map((finger, stringIndex) => {
        if (finger === null || finger === 0) return null;
        const fret = diagram.frets[stringIndex];
        if (fret === null || fret === 0) return null;

        const displayFret = fret - (startFret > 0 ? startFret : 0);
        if (displayFret < 1 || displayFret > numFrets) return null;

        return (
          <text 
            key={`finger-${stringIndex}`}
            x={stringIndex * stringSpacing} 
            y={nutHeight + (displayFret * fretWidth) - (fretWidth / 2) + 5} // Center text vertically
            fill="white" 
            fontSize="10" 
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {finger}
          </text>
        );
      })}
    </svg>
  );
};

export default GuitarChordDiagram;