// Display-ready text for synopsis, titles, bios
export const cleanText = (s: string = '') =>
  s
    .replace(/`/g, '’')
    .replace(/[ \t]*\n[ \t]*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

// Chapter text: keep paragraph breaks, remove ``` fences, fix apostrophes
export const toParagraphs = (content: string = ''): string[] =>
  content
    .replace(/```/g, '')
    .replace(/`/g, '’')
    .split(/\n\s*\n/)
    .map(p => p.replace(/[ \t]*\n[ \t]*/g, ' ').replace(/\s{2,}/g, ' ').trim())
    .filter(Boolean);