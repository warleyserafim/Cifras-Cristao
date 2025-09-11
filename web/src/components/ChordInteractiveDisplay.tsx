'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChordTooltip from './ChordTooltip';
import ChordDisplayFormatted from './ChordDisplayFormatted';

interface ChordInteractiveDisplayProps {
  content: string;
  fontSize: number;
}

const ChordInteractiveDisplay: React.FC<ChordInteractiveDisplayProps> = ({
  content,
  fontSize,
}) => {
  const [tooltip, setTooltip] = useState<{ chordName: string; position: { x: number; y: number } } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('chord')) {
      const chordName = target.dataset.chord;
      if (chordName) {
        const rect = target.getBoundingClientRect();
        setTooltip({
          chordName,
          position: {
            x: rect.left + rect.width / 2,
            y: rect.bottom + 5, // Position below the chord with a 5px offset
          },
        });
      }
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('chord')) {
      const chordName = target.dataset.chord;
      if (chordName) {
        console.log('Chord clicked:', chordName);
      }
    }
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;

    const currentContentRef = contentRef.current;
    currentContentRef.addEventListener('mouseenter', handleMouseEnter, true); // Use capture phase
    currentContentRef.addEventListener('mouseleave', handleMouseLeave, true); // Use capture phase
    currentContentRef.addEventListener('click', handleClick, true); // Use capture phase

    return () => {
      currentContentRef.removeEventListener('mouseenter', handleMouseEnter, true);
      currentContentRef.removeEventListener('mouseleave', handleMouseLeave, true);
      currentContentRef.removeEventListener('click', handleClick, true);
    };
  }, [handleMouseEnter, handleMouseLeave, handleClick]);

  return (
    <div ref={contentRef}>
      <ChordDisplayFormatted content={content} fontSize={fontSize} />
      {tooltip && (
        <ChordTooltip
          chordName={tooltip.chordName}
          position={tooltip.position}
          onClose={handleMouseLeave}
        />
      )}
    </div>
  );
};

export default ChordInteractiveDisplay;
