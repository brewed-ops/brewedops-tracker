import React, { useId } from 'react';

const ThemeToggle = ({ isDark, setIsDark }) => {
  const uid = useId().replace(/:/g, '');

  return (
    <label className={`tt-switch-${uid}`} aria-label="Toggle dark mode" style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px', flexShrink: 0 }}>
      <style>{`
        .tt-switch-${uid} input { opacity: 0; width: 0; height: 0; position: absolute; }
        .tt-slider-${uid} {
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background-color: #2196f3; transition: 0.4s; z-index: 0; overflow: hidden;
          border-radius: 34px;
        }
        .tt-sun-moon-${uid} {
          position: absolute; height: 26px; width: 26px; left: 4px; bottom: 4px;
          background-color: yellow; transition: 0.4s; border-radius: 50%;
        }
        .tt-switch-${uid} input:checked + .tt-slider-${uid} { background-color: #111; }
        .tt-switch-${uid} input:checked + .tt-slider-${uid} .tt-sun-moon-${uid} {
          transform: translateX(26px); background-color: white;
          animation: tt-rotate-${uid} 0.6s ease-in-out both;
        }
        @keyframes tt-rotate-${uid} {
          0% { transform: translateX(26px) rotate(0); }
          100% { transform: translateX(26px) rotate(360deg); }
        }
        .tt-moon-dot-${uid} { opacity: 0; transition: 0.4s; fill: gray; position: absolute; z-index: 4; }
        .tt-switch-${uid} input:checked + .tt-slider-${uid} .tt-moon-dot-${uid} { opacity: 1; }
        .tt-md1-${uid} { left: 10px; top: 3px; width: 6px; height: 6px; }
        .tt-md2-${uid} { left: 2px; top: 10px; width: 10px; height: 10px; }
        .tt-md3-${uid} { left: 16px; top: 18px; width: 3px; height: 3px; }
        .tt-lr1-${uid} { left: -8px; top: -8px; position: absolute; width: 43px; height: 43px; z-index: -1; fill: white; opacity: 0.1; }
        .tt-lr2-${uid} { left: -50%; top: -50%; position: absolute; width: 55px; height: 55px; z-index: -1; fill: white; opacity: 0.1; }
        .tt-lr3-${uid} { left: -18px; top: -18px; position: absolute; width: 60px; height: 60px; z-index: -1; fill: white; opacity: 0.1; }
        .tt-cloud-light-${uid} { position: absolute; fill: #eee; animation: tt-cloud-${uid} 6s infinite; }
        .tt-cloud-dark-${uid} { position: absolute; fill: #ccc; animation: tt-cloud-${uid} 6s infinite; animation-delay: 1s; }
        .tt-cd1-${uid} { left: 30px; top: 15px; width: 40px; }
        .tt-cd2-${uid} { left: 44px; top: 10px; width: 20px; }
        .tt-cd3-${uid} { left: 18px; top: 24px; width: 30px; }
        .tt-cl4-${uid} { left: 36px; top: 18px; width: 40px; }
        .tt-cl5-${uid} { left: 48px; top: 14px; width: 20px; }
        .tt-cl6-${uid} { left: 22px; top: 26px; width: 30px; }
        @keyframes tt-cloud-${uid} {
          0% { transform: translateX(0); }
          40% { transform: translateX(4px); }
          80% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
        .tt-stars-${uid} { transform: translateY(-32px); opacity: 0; transition: 0.4s; }
        .tt-star-${uid} { fill: white; position: absolute; transition: 0.4s; animation: tt-twinkle-${uid} 2s infinite; }
        .tt-switch-${uid} input:checked + .tt-slider-${uid} .tt-stars-${uid} { transform: translateY(0); opacity: 1; }
        .tt-s1-${uid} { width: 20px; top: 2px; left: 3px; animation-delay: 0.3s; }
        .tt-s2-${uid} { width: 6px; top: 16px; left: 3px; }
        .tt-s3-${uid} { width: 12px; top: 20px; left: 10px; animation-delay: 0.6s; }
        .tt-s4-${uid} { width: 18px; top: 0px; left: 18px; animation-delay: 1.3s; }
        @keyframes tt-twinkle-${uid} {
          0% { transform: scale(1); }
          40% { transform: scale(1.2); }
          80% { transform: scale(0.8); }
          100% { transform: scale(1); }
        }
      `}</style>
      <input
        type="checkbox"
        checked={isDark}
        onChange={() => setIsDark(!isDark)}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      />
      <div className={`tt-slider-${uid}`}>
        <div className={`tt-sun-moon-${uid}`}>
          {/* Moon dots */}
          <svg className={`tt-moon-dot-${uid} tt-md1-${uid}`} viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>
          <svg className={`tt-moon-dot-${uid} tt-md2-${uid}`} viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>
          <svg className={`tt-moon-dot-${uid} tt-md3-${uid}`} viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>
          {/* Light rays */}
          <svg className={`tt-lr1-${uid}`} viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>
          <svg className={`tt-lr2-${uid}`} viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>
          <svg className={`tt-lr3-${uid}`} viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>
          {/* Clouds */}
          <svg className={`tt-cloud-dark-${uid} tt-cd1-${uid}`} viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>
          <svg className={`tt-cloud-dark-${uid} tt-cd2-${uid}`} viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>
          <svg className={`tt-cloud-dark-${uid} tt-cd3-${uid}`} viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>
          <svg className={`tt-cloud-light-${uid} tt-cl4-${uid}`} viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>
          <svg className={`tt-cloud-light-${uid} tt-cl5-${uid}`} viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>
          <svg className={`tt-cloud-light-${uid} tt-cl6-${uid}`} viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>
        </div>
        <div className={`tt-stars-${uid}`}>
          <svg className={`tt-star-${uid} tt-s1-${uid}`} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10,0 10 C 10 10,10 10,10 20 C 10 10,10 10,20 10 C 10 10,10 10,10 0 C 10 10,10 10,0 10 Z" />
          </svg>
          <svg className={`tt-star-${uid} tt-s2-${uid}`} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10,0 10 C 10 10,10 10,10 20 C 10 10,10 10,20 10 C 10 10,10 10,10 0 C 10 10,10 10,0 10 Z" />
          </svg>
          <svg className={`tt-star-${uid} tt-s3-${uid}`} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10,0 10 C 10 10,10 10,10 20 C 10 10,10 10,20 10 C 10 10,10 10,10 0 C 10 10,10 10,0 10 Z" />
          </svg>
          <svg className={`tt-star-${uid} tt-s4-${uid}`} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10,0 10 C 10 10,10 10,10 20 C 10 10,10 10,20 10 C 10 10,10 10,10 0 C 10 10,10 10,0 10 Z" />
          </svg>
        </div>
      </div>
    </label>
  );
};

export default ThemeToggle;
