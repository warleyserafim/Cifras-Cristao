export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const transposeChord = (chord: string, semitones: number): string => {
  if (!chord) return '';

  const parts = chord.match(/([A-G][#b]?)(m|maj|min|sus|add|dim|aug)?[0-9]*(?:[A-G][#b]?)?/);
  if (!parts) return chord;

  const root = parts[1];
  const suffix = parts[2] || '';
  const other = chord.substring(root.length + suffix.length);

  let rootIndex = NOTES.indexOf(root);
  if (rootIndex === -1) {
    if (root.includes('b')) {
      const sharpEquivalent = NOTES[NOTES.indexOf(root.replace('b', '')) - 1];
      rootIndex = NOTES.indexOf(sharpEquivalent);
    } else {
      return chord;
    }
  }

  let newIndex = (rootIndex + semitones) % NOTES.length;
  if (newIndex < 0) newIndex += NOTES.length;

  return NOTES[newIndex] + suffix + other;
};