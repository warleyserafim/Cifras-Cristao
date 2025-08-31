'use client';

import { useState } from 'react';
import { getChordDiagram } from '@/utils/chordDiagrams';
import GuitarChordDiagram from './GuitarChordDiagram';
import KeyboardChordDiagram from './KeyboardChordDiagram';

interface ChordDiagramModalProps {
  chordName: string;
  diagramType: 'guitar' | 'keyboard';
  onClose: () => void;
}

export default function ChordDiagramModal({ chordName, diagramType: initialDiagramType, onClose }: ChordDiagramModalProps) {
  const [currentDiagramType, setCurrentDiagramType] = useState(initialDiagramType);

  const chordData = getChordDiagram(chordName, currentDiagramType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-card-background)] rounded-lg shadow-xl p-6 w-full max-w-md relative border border-[var(--color-border)]">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] text-3xl font-bold leading-none p-1 rounded-full hover:bg-[var(--color-background)] transition-colors"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center text-[var(--color-text-primary)]">{chordName}</h2>

        <div className="flex justify-center gap-4 mb-6">
          <button 
            onClick={() => setCurrentDiagramType('guitar')}
            className={`py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${currentDiagramType === 'guitar' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-background)] text-[var(--color-text-primary)] hover:bg-[var(--color-background)]/80'}`}
          >
            Violão
          </button>
          <button 
            onClick={() => setCurrentDiagramType('keyboard')}
            className={`py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${currentDiagramType === 'keyboard' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-background)] text-[var(--color-text-primary)] hover:bg-[var(--color-background)]/80'}`}
          >
            Teclado
          </button>
        </div>

        <div className="min-h-[200px] flex items-center justify-center bg-[var(--color-background)] rounded-md p-4">
          {chordData ? (
            currentDiagramType === 'guitar' ? (
              <GuitarChordDiagram diagram={chordData as any} />
            ) : (
              <KeyboardChordDiagram diagram={chordData as any} />
            )
          ) : (
            <p className="text-[var(--color-text-secondary)] text-center p-4">Diagrama não disponível para **{chordName}** em {currentDiagramType === 'guitar' ? 'violão' : 'teclado'}.</p>
          )}
        </div>
      </div>
    </div>
  );
}