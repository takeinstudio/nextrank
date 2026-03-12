export const NOTES_BUCKET = 'notes';
export const QUESTION_BANKS_BUCKET = 'question-banks';

const buildStorageMarkers = (bucket: string) => [
  `/object/public/${bucket}/`,
  `/object/sign/${bucket}/`,
  `/object/authenticated/${bucket}/`,
];

export const sanitizeFileName = (fileName: string) =>
  fileName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');

export const buildNotesStoragePath = (subject: string, fileName: string) => {
  const subjectSlug = subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${subjectSlug}/${Date.now()}_${sanitizeFileName(fileName)}`;
};

export const buildQuestionBankStoragePath = (subject: string, fileName: string) =>
  buildNotesStoragePath(subject, fileName);

const extractStoragePath = (bucket: string, storedValue: string) => {
  const trimmedValue = storedValue.trim();

  if (!trimmedValue) {
    return '';
  }

  try {
    const parsedUrl = new URL(trimmedValue);
    const decodedPathname = decodeURIComponent(parsedUrl.pathname);
    const storageMarkers = buildStorageMarkers(bucket);

    for (const marker of storageMarkers) {
      const markerIndex = decodedPathname.indexOf(marker);

      if (markerIndex >= 0) {
        return decodedPathname.slice(markerIndex + marker.length);
      }
    }
  } catch {
    // Ignore URL parsing failures and treat the value as a storage path.
  }

  return decodeURIComponent(trimmedValue.replace(/^\/+/, ''));
};

export const extractNotesStoragePath = (storedValue: string) =>
  extractStoragePath(NOTES_BUCKET, storedValue);

export const extractQuestionBankStoragePath = (storedValue: string) =>
  extractStoragePath(QUESTION_BANKS_BUCKET, storedValue);