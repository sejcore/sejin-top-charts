import React, { useEffect, useState } from 'react';
import { TABS } from './config';
import { fetchTab } from './lib/sheets';
import TopChartCarousel from './components/TopChartCarousel';

export default function App() {
  const [tab, setTab] = useState(TABS[0]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchTab(tab.key);
        if (alive) setItems(data);
      } catch (e) {
        if (alive) setError('Failed to load data. Check API key, Sheet sharing, and tab names.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [tab]);

  return (
    <div className="min-h-screen text-white flex flex-col items-center">
      <header className="w-full max-w-3xl px-4 pt-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center tracking-wide">Sejin's Top Charts</h1>
        <div className="mt-6 flex justify-center">
          <select
            className="select-clean"
            value={tab.key}
            onChange={(e) => {
              const next = TABS.find(t => t.key === e.target.value);
              if (next) setTab(next);
            }}
          >
            {TABS.map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="flex-1 w-full px-4">
        {loading && (
          <div className="text-center text-neutral-400 mt-16">Loading…</div>
        )}
        {error && (
          <div className="text-center text-red-400 mt-8">{error}</div>
        )}
        {!loading && !error && (
          <TopChartCarousel items={items} flag={tab.flag} />
        )}
      </main>

      <footer className="w-full max-w-3xl px-4 py-10 text-center text-xs text-neutral-500">
        Data syncs live from Google Sheets. Images are read from the repo's <code>public/</code> folder using filenames in Column F.
      </footer>
    </div>
  );
}
