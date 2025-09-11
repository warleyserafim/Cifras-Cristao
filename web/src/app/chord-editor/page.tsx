'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ChordEditorProps {
  inputText: string;
  setInputText: (text: string) => void;
}

const COMMON_CHORDS = ['C', 'G', 'Am', 'F', 'Dm', 'E', 'E7', 'A', 'D', 'Bm', 'C#', 'Eb', 'F#', 'Ab', 'Bb']; // Extended common chords

const ChordEditor: React.FC<ChordEditorProps> = ({ inputText, setInputText }) => {
  const [previewHtml, setPreviewHtml] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Autocomplete states
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const [currentChordSearch, setCurrentChordSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

  const parseAndAlign = useCallback((text: string) => {
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

      const chordRegex = /(\[[A-G][#b]?(?:m|maj|min|sus|add|dim|aug)?[0-9]*(?:\/[A-G][#b]?)?\])/g;
      const chordsInLine = line.match(chordRegex);

      if (chordsInLine) {
        let chordLine = '';
        let lyricLine = '';
        let lastIndex = 0;

        line.replace(chordRegex, (match, chord, offset) => {
          const textBeforeChord = line.substring(lastIndex, offset);
          const chordName = chord.substring(1, chord.length - 1);

          // Calculate padding for chords and lyrics
          // This is a simplified alignment. For perfect alignment, a fixed-width font is crucial.
          const padding = textBeforeChord.length;
          chordLine += ' '.repeat(padding) + `<span class="text-blue-500 font-bold">${chordName}</span>`;
          lyricLine += textBeforeChord;

          lastIndex = offset + chord.length;
          return match; // Return original match to keep replace working
        });

        lyricLine += line.substring(lastIndex);

        html += `<div class="whitespace-pre-wrap font-mono text-sm"><div class="chord-line">${chordLine}</div><div class="lyric-line">${lyricLine}</div></div>`;
      } else {
        html += `<div class="whitespace-pre-wrap font-mono text-sm"><div class="lyric-line">${line}</div></div>`;
      }
    });
    return html;
  }, []);

  useEffect(() => {
    setPreviewHtml(parseAndAlign(inputText));
  }, [inputText, parseAndAlign]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    setCursorPosition(e.target.selectionStart);

    // Autocomplete logic
    const currentText = text.substring(0, e.target.selectionStart);
    const lastOpenBracketIndex = currentText.lastIndexOf('[');
    const lastCloseBracketIndex = currentText.lastIndexOf(']');

    if (lastOpenBracketIndex > lastCloseBracketIndex && lastOpenBracketIndex !== -1) {
      const potentialChord = currentText.substring(lastOpenBracketIndex + 1);
      setCurrentChordSearch(potentialChord);
      const filteredSuggestions = COMMON_CHORDS.filter(chord =>
        chord.toLowerCase().startsWith(potentialChord.toLowerCase())
      );
      setAutocompleteSuggestions(filteredSuggestions);
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
      setCurrentChordSearch('');
    }
  };

  const insertTextAtCursor = (textToInsert: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newText = inputText.substring(0, start) + textToInsert + inputText.substring(end);
      setInputText(newText);

      // Adjust cursor position after insertion
      const newCursorPosition = start + textToInsert.length;
      // Use setTimeout to ensure the DOM is updated before setting selection
      setTimeout(() => {
        textareaRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  };

  const handleAutocompleteSelect = (chord: string) => {
    if (textareaRef.current) {
      const currentText = inputText.substring(0, cursorPosition);
      const lastOpenBracketIndex = currentText.lastIndexOf('[');
      if (lastOpenBracketIndex !== -1) {
        const textBeforeBracket = inputText.substring(0, lastOpenBracketIndex + 1);
        const textAfterCursor = inputText.substring(cursorPosition);
        const newText = textBeforeBracket + chord + ']'
 + textAfterCursor;
        setInputText(newText);

        const newCursorPosition = lastOpenBracketIndex + 1 + chord.length + 1; // +1 for ']'
        setTimeout(() => {
          textareaRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
      }
    }
    setShowAutocomplete(false);
    setCurrentChordSearch('');
  };

  const handleInsertSection = (sectionType: 'VERSO' | 'REFRÃO') => {
    insertTextAtCursor(`[${sectionType}]\n`);
  };

  return (
    <div className="container mx-auto p-4 flex flex-row gap-4">
      <div className="flex-1 relative">
        <h2 className="text-xl font-bold mb-2">Editor</h2>
        {/* <div className="mb-2 flex gap-2">
          <button
            onClick={() => handleInsertSection('VERSO')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Inserir Verso
          </button>
          <button
            onClick={() => handleInsertSection('REFRÃO')}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Inserir Refrão
          </button>
        </div> */}
        <textarea
          ref={textareaRef}
          className="w-full h-96 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white font-mono text-sm"
          value={inputText}
          onChange={handleInputChange}
          onKeyUp={(e) => setCursorPosition(e.currentTarget.selectionStart)}
          onClick={(e) => setCursorPosition(e.currentTarget.selectionStart)}
          placeholder="Digite a letra com acordes aqui. Ex: [C]Minha [G]vida"
        />
        {/* {showAutocomplete && autocompleteSuggestions.length > 0 && (
          <div className="absolute z-10 bg-gray-700 border border-gray-600 rounded-md mt-1 max-h-40 overflow-y-auto">
            {autocompleteSuggestions.map((chord, index) => (
              <div
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-600 text-white"
                onClick={() => handleAutocompleteSelect(chord)}
              >
                {chord}
              </div>
            ))}
          </div>
        )} */}
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-2">Pré-visualização</h2>
        <div
          ref={previewRef}
          className="w-full h-96 p-2 border border-gray-300 rounded-md overflow-y-auto bg-gray-900 text-white"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    </div>
  );
};

export default ChordEditor;
