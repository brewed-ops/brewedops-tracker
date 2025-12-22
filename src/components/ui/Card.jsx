import React from 'react';

// ============================================
// CARD COMPONENTS
// ============================================

const Card = React.forwardRef(({ 
  children, 
  className = '', 
  hover = false,
  style = {}, 
  ...props 
}, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
      style={{
        borderRadius: '12px',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--card)',
        color: 'var(--card-foreground)',
        boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow)',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ 
  children, 
  className = '', 
  style = {}, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      padding: '24px 24px 0',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ 
  children, 
  as: Component = 'h3',
  className = '', 
  style = {}, 
  ...props 
}, ref) => (
  <Component
    ref={ref}
    style={{
      fontSize: '18px',
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: '-0.025em',
      color: 'var(--foreground)',
      margin: 0,
      ...style,
    }}
    {...props}
  >
    {children}
  </Component>
));

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ 
  children, 
  className = '', 
  style = {}, 
  ...props 
}, ref) => (
  <p
    ref={ref}
    style={{
      fontSize: '14px',
      color: 'var(--muted-foreground)',
      margin: 0,
      lineHeight: '1.5',
      ...style,
    }}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ 
  children, 
  className = '', 
  style = {}, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    style={{
      padding: '24px',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ 
  children, 
  className = '', 
  style = {}, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px 24px',
      gap: '12px',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

// Stat Card - Pre-styled card for statistics
const StatCard = ({ 
  title, 
  value, 
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  gradient,
  style = {},
  ...props 
}) => {
  const gradients = {
    blue: 'linear-gradient(135deg, hsl(221 83% 53%) 0%, hsl(221 83% 43%) 100%)',
    green: 'linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(142 76% 26%) 100%)',
    purple: 'linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(262 83% 48%) 100%)',
    red: 'linear-gradient(135deg, hsl(0 84% 60%) 0%, hsl(0 84% 50%) 100%)',
    orange: 'linear-gradient(135deg, hsl(25 95% 53%) 0%, hsl(25 95% 43%) 100%)',
  };

  return (
    <Card
      style={{
        background: gradient ? gradients[gradient] : 'var(--card)',
        border: gradient ? 'none' : '1px solid var(--border)',
        ...style,
      }}
      {...props}
    >
      <CardContent style={{ padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}>
          <span style={{ 
            fontSize: '13px', 
            fontWeight: '500',
            color: gradient ? 'rgba(255,255,255,0.8)' : 'var(--muted-foreground)',
          }}>
            {title}
          </span>
          {Icon && (
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: gradient ? 'rgba(255,255,255,0.2)' : 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon style={{ 
                width: '18px', 
                height: '18px', 
                color: gradient ? 'white' : 'var(--muted-foreground)',
              }} />
            </div>
          )}
        </div>
        <p style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: gradient ? 'white' : 'var(--foreground)',
          margin: '0 0 8px',
          letterSpacing: '-0.025em',
        }}>
          {value}
        </p>
        {(subtitle || trend) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {trend && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '12px',
                fontWeight: '500',
                color: trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : 'var(--muted-foreground)',
              }}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''}
                {trendValue}
              </span>
            )}
            {subtitle && (
              <span style={{ 
                fontSize: '12px', 
                color: gradient ? 'rgba(255,255,255,0.7)' : 'var(--muted-foreground)',
              }}>
                {subtitle}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatCard };
