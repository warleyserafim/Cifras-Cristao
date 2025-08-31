'use client';

import React, { useState } from 'react';
import { getChordDiagram } from '@/utils/chordDiagrams';
import GuitarChordDiagram from './GuitarChordDiagram';
import KeyboardChordDiagram from './KeyboardChordDiagram';

interface ChordTooltipProps {
  chordName: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export default function ChordTooltip({ chordName, position, onClose }: ChordTooltipProps) {
  const [diagramType, setDiagramType] = useState<'guitar' | 'keyboard'>('guitar');

  const chordData = getChordDiagram(chordName, diagramType);

  return (
    <div 
      className="fixed bg-[var(--color-card-background)] rounded-lg shadow-xl p-2 z-50 border border-[var(--color-border)] w-36"
      style={{
        left: position.x,
        top: position.y + 20, // Offset from the hovered element
        transform: 'translateX(-50%)', // Center horizontally
      }}
      onMouseLeave={onClose} // Close when mouse leaves the tooltip
    >
      <h3 className="text-base font-bold mb-2 text-center">{chordName}</h3>

      <div className="flex justify-center gap-1 mb-2">
        <button 
          onClick={() => setDiagramType('guitar')}
          className={`py-1 px-2 rounded-md font-semibold text-[10px] transition-colors ${diagramType === 'guitar' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-background)] text-[var(--color-text-primary)] hover:bg-[var(--color-background)]/80'}`}
        >
          Violão
        </button>
        <button 
          onClick={() => setDiagramType('keyboard')}
          className={`py-1 px-2 rounded-md font-semibold text-[10px] transition-colors ${diagramType === 'keyboard' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-background)] text-[var(--color-text-primary)] hover:bg-[var(--color-background)]/80'}`}
        >
          Teclado
        </button>
      </div>

      <div className="min-h-[100px] flex items-center justify-center bg-[var(--color-background)] rounded-md p-1">
        {chordData ? (
          diagramType === 'guitar' ? (
            <GuitarChordDiagram diagram={chordData as any} />
          ) : (
            <KeyboardChordDiagram diagram={chordData as any} />
          )
        ) : (
          <p className="text-[var(--color-text-secondary)] text-center text-[10px]">Diagrama não disponível.</p>
        )}
      </div>
    </div>
  );
}
