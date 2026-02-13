import { SpinnerGap } from '@phosphor-icons/react';

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  }}>
    <SpinnerGap style={{
      width: '32px',
      height: '32px',
      color: '#9a8d80',
      animation: 'spin 1s linear infinite',
    }} />
  </div>
);

export default LoadingFallback;
