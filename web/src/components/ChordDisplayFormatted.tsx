'use client';

import React from 'react';

interface ChordDisplayFormattedProps {
  content: string;
  fontSize: number;
  // Removed onChordHover and onChordLeave props
}

const ChordDisplayFormatted: React.FC<ChordDisplayFormattedProps> = ({ content, fontSize }) => {
  const parseAndAlign = (text: string) => {
    const lines = text.split('\n');
    let html = '';

    lines.forEach(line => {
      // Handle section markers first
      if (line.startsWith('[VERSO]')) {
        html += `<div class="section-marker bg-green-700/30 text-green-300 font-bold py-1 px-2 rounded mb-2">VERSO</div>`;
        line = line.substring('[VERSO]'.length).trim(); // Remove marker from line for chord parsing
      } else if (line.startsWith('[REFRÃO]')) {
        html += `<div class="section-marker bg-purple-700/30 text-purple-300 font-bold py-1 px-2 rounded mb-2">REFRÃO</div>`;
        line = line.substring('[REFRÃO]'.length).trim(); // Remove marker from line for chord parsing
      }

      // Handle chords in [C] format (from ChordEditor) or <b>C</b> format (from existing music data)
      const chordRegex = /(\[[A-G][#b]?(?:m|maj|min|sus|add|dim|aug)?[0-9]*(?:\/[A-G][#b]?)?\])|(<b>[A-G][#b]?(?:m|maj|min|sus|add|dim|aug)?[0-9]*(?:\/[A-G][#b]?)?<\/b>)/g;
      const chordsInLine = line.match(chordRegex);

      if (chordsInLine) {
        let chordLine = '';
        let lyricLine = '';
        let lastIndex = 0;

        line.replace(chordRegex, (match, markdownChord, htmlChord, offset) => {
          const textBeforeChord = line.substring(lastIndex, offset);
          let chordName = '';

          if (markdownChord) {
            chordName = markdownChord.substring(1, markdownChord.length - 1);
          } else if (htmlChord) {
            chordName = htmlChord.replace(/<b>|<\/b>/g, '');
          }

          // Calculate padding for chords and lyrics
          const padding = textBeforeChord.length;
          chordLine += ' '.repeat(padding) + `<span class="chord text-blue-500 font-bold" data-chord="${chordName}">${chordName}</span>`;
          lyricLine += textBeforeChord;

          lastIndex = offset + match.length;
          return match; // Return original match to keep replace working
        });

        lyricLine += line.substring(lastIndex);
        // Remove any remaining <b> tags from the lyricLine
        lyricLine = lyricLine.replace(/<b>|<\/b>/g, '');


        html += `<div class="whitespace-pre-wrap font-mono text-sm"><div class="chord-line">${chordLine}</div><div class="lyric-line">${lyricLine}</div></div>`;
      } else {
        // Remove any <b> tags from lines without chords
        const cleanedLine = line.replace(/<b>|<\/b>/g, '');
        html += `<div class="whitespace-pre-wrap font-mono text-sm"><div class="lyric-line">${cleanedLine}</div></div>`;
      }
    });
    return html;
  };

  const formattedContentHtml = parseAndAlign(content);

  return (
    <pre
      className="font-mono whitespace-pre-wrap break-words p-4 bg-transparent rounded-md text-[var(--color-text-primary)] text-left"
      style={{ fontSize: `${fontSize}px`, maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}
      dangerouslySetInnerHTML={{ __html: formattedContentHtml }}
    />
  );
};

export default ChordDisplayFormatted;