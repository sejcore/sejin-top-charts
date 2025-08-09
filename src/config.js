// Configure your Google Sheet here
export const SHEET_ID = '1bUhsAN58vjTtDpRmbciDszWbgANzjuFDOyO48hH-Jwg';
// PUBLIC KEY (visible to users). You can rotate/regenerate anytime in Google Cloud.
export const API_KEY = 'AIzaSyAnYfAfgCELD3iP9NCJMbCoJOCAbEyeUz0';

// Sheet tabs to render
export const TABS = [
  { key: 'KR Movie', label: '🇰🇷 Korean Movies', flag: 'KR', kind: 'video' },
  { key: 'KR Drama', label: '🇰🇷 Korean Dramas', flag: 'KR', kind: 'video' },
  { key: 'KR Music', label: '🇰🇷 Korean Music', flag: 'KR', kind: 'music' },
  { key: 'EN Movie', label: '🇺🇸 American Movies', flag: 'EN', kind: 'video' },
  { key: 'EN Drama', label: '🇺🇸 American Dramas', flag: 'EN', kind: 'video' },
  { key: 'EN Music', label: '🇺🇸 American Music', flag: 'EN', kind: 'music' },
];

// Helper: prefix asset paths correctly for GitHub Pages
export const withBase = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
