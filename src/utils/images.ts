// "https://www.gutenberg.org/ebooks/902" -> real cover image
export const gutenbergCover = (pageUrl: string) => {
  const id = pageUrl.match(/ebooks\/(\d+)/)?.[1];
  return id ? `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg` : null;
};

// "https://commons.wikimedia.org/wiki/File:Name.jpg" -> real photo
export const wikimediaImage = (pageUrl: string, width = 300) => {
  const file = pageUrl.split('/wiki/File:')[1];
  return file ? `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}` : null;
};