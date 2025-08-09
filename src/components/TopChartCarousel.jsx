import React from 'react';
import { withBase } from '../config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import StarRating from './StarRating.jsx';

export default function TopChartCarousel({ items = [], flag = 'KR' }) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <Swiper
        modules={[Navigation, Keyboard, A11y]}
        navigation
        keyboard
        spaceBetween={24}
        slidesPerView={1}
        centeredSlides
        className="!pb-10"
      >
        {items.map((it, idx) => (
          <SwiperSlide key={`${it.title}-${idx}`}>
            <div className="card flex flex-col items-center text-center">
              <img
                src={it.image ? withBase(it.image) : withBase('placeholder.png')}
                alt={it.title || 'poster'}
                className="w-[260px] h-[380px] object-cover rounded-xl border border-neutral-800 mb-4"
                loading="lazy"
              />
              <div className="text-2xl font-semibold text-white mb-1 flex items-center gap-2">
                <span>{flag === 'KR' ? '🇰🇷' : '🇺🇸'}</span>
                <span className="tracking-wide">{it.title || 'Untitled'}</span>
              </div>
              {it.release && (
                <div className="text-sm font-semibold text-neutral-300">{it.release}</div>
              )}
              {it.producer && (
                <div className="text-sm font-semibold text-neutral-400">{it.producer}</div>
              )}
              <div className="mt-3">
                <StarRating value={it.rating || 0} size={22} />
              </div>
              {it.rank && (
                <div className="text-xs text-neutral-400 mt-3">Rank #{it.rank}</div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
