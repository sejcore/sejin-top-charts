import { API_KEY, SHEET_ID } from '../config';

// Fetch a tab (range) from Google Sheets API v4
export async function fetchTab(tabName) {
  const range = encodeURIComponent(`${tabName}`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/'${range}'?key=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);
  const json = await res.json();

  const rows = json.values || [];
  if (!rows.length) return [];

  // Assume first row is header; data starts from row 2
  const [, ...data] = rows;

  // Columns: A Rank, B Title, C Release, D Producer/Group, E Rating, F Image
  return data.map((r, i) => ({
    rank: r[0] ?? String(i + 1),
    title: r[1] ?? '',
    release: r[2] ?? '',
    producer: r[3] ?? '', // for Music, this is Group
    rating: parseFloat(r[4] ?? '0') || 0,
    image: (r[5] ?? '').trim(),
  }));
}
