import React from 'react';

// Simple star rating with half-star support using SVG masks
export default function StarRating({ value = 0, size = 24 }) {
  const stars = [0, 1, 2, 3, 4];
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${value} of 5`}>
      {stars.map((i) => {
        const filled = Math.min(Math.max(value - i, 0), 1); // 0..1
        return (
          <Star key={i} filled={filled} size={size} />
        );
      })}
    </div>
  );
}

function Star({ filled, size }) {
  // filled: 0..1 portion
  const id = Math.random().toString(36).slice(2);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset={`${filled * 100}%`} stopColor="#FFD54A" />
          <stop offset={`${filled * 100}%`} stopColor="#27272a" />
        </linearGradient>
      </defs>
      <path
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={`url(#grad-${id})`}
        stroke="#3f3f46"
        strokeWidth="1"
      />
    </svg>
  );
}
