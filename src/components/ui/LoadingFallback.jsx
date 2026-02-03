import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  }}>
    <Loader2 style={{
      width: '32px',
      height: '32px',
      color: '#6b5f52',
      animation: 'spin 1s linear infinite',
    }} />
  </div>
);

export default LoadingFallback;
