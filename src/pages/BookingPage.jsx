import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  CaretRight,
  Quotes,
  Lightning,
  CalendarCheck,
  Moon,
  Sun,
  Clock,
  ChartLineUp,
  Handshake,
  ArrowLeft,
  Star,
} from '@phosphor-icons/react';
import SEO from '@/components/SEO';
import ScrollReveal from '@/components/ui/ScrollReveal';

// ============================================
// BRAND CONFIGURATION (local, matching other pages)
// ============================================
const BRAND = {
  brown: '#3F200C',
  blue: '#004AAC',
  green: '#51AF43',
  cream: '#FFF0D4',
  black: '#000000',
};

const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Poppins', sans-serif",
};

const getTheme = (isDark) => ({
  bg: isDark ? '#0d0b09' : '#faf8f5',
  bgAlt: isDark ? '#100e0b' : BRAND.cream,
  cardBg: isDark ? '#171411' : '#ffffff',
  cardBorder: isDark ? '#2a2420' : '#e8e0d4',
  text: isDark ? '#f5f0eb' : '#3F200C',
  textMuted: isDark ? '#a09585' : '#7a6652',
  textSubtle: isDark ? '#6b5f52' : '#a09585',
});

// ============================================
// GHL CALENDAR EMBED COMPONENT
// ============================================
function GHLCalendarEmbed() {
  const containerRef = useRef(null);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://connect.brewedops.com/js/form_embed.js"]'
    );
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://connect.brewedops.com/js/form_embed.js';
      script.type = 'text/javascript';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <iframe
        src="https://connect.brewedops.com/widget/booking/etoVHFeyWv1bqRkpxZee"
        style={{
          width: '100%',
          border: 'none',
          overflow: 'hidden',
          minHeight: '800px',
        }}
        scrolling="no"
        id="etoVHFeyWv1bqRkpxZee_booking"
        title="Book a Strategy Call with BrewedOps"
      />
    </div>
  );
}

// ============================================
// BOOKING LANDING PAGE
// ============================================
function BookingPage({ isDark, setIsDark }) {
  const navigate = useNavigate();
  const theme = getTheme(isDark);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Default to light mode on this page
  useEffect(() => {
    setIsDark(false);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;

  const scrollToCalendar = () => {
    const el = document.getElementById('booking-calendar');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text }}>
      <SEO
        title="Book a Free Strategy Call | BrewedOps"
        description="Reclaim 20+ hours every week. Book a free strategy call and get a custom plan to eliminate busywork with a trained VA and GoHighLevel automation."
        keywords="virtual assistant, GHL automation, GoHighLevel, book a call, free strategy session, VA services, business automation"
      />

      {/* ============================================ */}
      {/* MINIMAL HEADER — conversion-focused, no distractions */}
      {/* ============================================ */}
      <nav style={{
        padding: isMobile ? '12px 16px' : '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.cardBorder}`,
        backgroundColor: theme.bg,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: '8px',
              color: theme.textMuted,
              cursor: 'pointer',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <div
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <img
              src="https://i.imgur.com/R52jwPvt.png"
              alt="BrewedOps Logo"
              width={32}
              height={32}
              style={{ width: '32px', height: '32px', borderRadius: '8px' }}
            />
            <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: FONTS.heading }}>
              <span style={{ color: isDark ? '#fff' : BRAND.brown }}>Brewed</span>
              <span style={{ color: BRAND.blue }}>Ops</span>
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '8px',
            color: theme.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </nav>

      <main>
        {/* ============================================ */}
        {/* HERO — Headline, Subheadline, CTA */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '48px 20px 40px' : '64px 32px 52px',
          textAlign: 'center',
          maxWidth: '820px',
          margin: '0 auto',
        }}>
          <ScrollReveal>
            {/* Trust badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: isDark ? 'rgba(0,74,172,0.15)' : 'rgba(0,74,172,0.08)',
              borderRadius: '100px',
              marginBottom: '24px',
              border: `1px solid ${isDark ? 'rgba(0,74,172,0.3)' : 'rgba(0,74,172,0.15)'}`,
            }}>
              <CalendarCheck size={16} weight="fill" style={{ color: BRAND.blue }} />
              <span style={{
                fontSize: '13px',
                fontWeight: '600',
                color: BRAND.blue,
                fontFamily: FONTS.body,
                letterSpacing: '0.02em',
              }}>
                FREE 30-MINUTE STRATEGY CALL
              </span>
            </div>

            {/* Headline — desire-driven, specific */}
            <h1 style={{
              fontSize: isMobile ? '36px' : isTablet ? '48px' : '58px',
              fontWeight: '800',
              fontFamily: FONTS.heading,
              lineHeight: '1.12',
              marginBottom: '20px',
              color: theme.text,
              letterSpacing: '-0.02em',
            }}>
              Reclaim 20+ Hours a Week.{' '}
              <span style={{
                color: BRAND.blue,
                display: isMobile ? 'inline' : 'block',
              }}>
                Without Hiring Full-Time.
              </span>
            </h1>

            {/* Subheadline — visceral, specific */}
            <p style={{
              fontSize: isMobile ? '18px' : '22px',
              color: theme.textMuted,
              lineHeight: '1.6',
              maxWidth: '640px',
              margin: '0 auto 36px',
              fontFamily: FONTS.body,
            }}>
              You're doing everything yourself. It's not sustainable.
              <br />
              <strong style={{ color: theme.text }}>Let's fix that — for free.</strong>
            </p>

            {/* Primary CTA */}
            <button
              onClick={scrollToCalendar}
              style={{
                padding: isMobile ? '16px 32px' : '18px 40px',
                backgroundColor: BRAND.blue,
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: isMobile ? '16px' : '18px',
                fontFamily: FONTS.body,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 20px rgba(0,74,172,0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <CalendarCheck size={20} weight="bold" />
              Book Your Free Strategy Call
              <CaretRight size={18} weight="bold" />
            </button>

            <p style={{
              fontSize: '14px',
              color: theme.textSubtle,
              marginTop: '14px',
              fontFamily: FONTS.body,
            }}>
              No pitch. No obligation. Just a clear plan.
            </p>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* PROBLEM STATEMENT + PAIN STACKING */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '40px 20px' : '52px 32px',
          backgroundColor: isDark ? '#100e0b' : BRAND.cream,
          borderTop: `1px solid ${theme.cardBorder}`,
          borderBottom: `1px solid ${theme.cardBorder}`,
        }}>
          <ScrollReveal>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: isMobile ? '28px' : '38px',
                fontWeight: '800',
                fontFamily: FONTS.heading,
                marginBottom: '12px',
                color: theme.text,
                lineHeight: '1.2',
                textAlign: 'center',
              }}>
                You Built a Business. Now It Runs You.
              </h2>
              <p style={{
                fontSize: isMobile ? '17px' : '20px',
                color: theme.textMuted,
                textAlign: 'center',
                marginBottom: '36px',
                fontFamily: FONTS.body,
                lineHeight: '1.6',
              }}>
                How many of these hit home?
              </p>

              {/* Pain stacking bullets */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                {[
                  '12-hour days. Revenue still flat.',
                  'Leads go cold — you can\'t follow up fast enough.',
                  'You\'re the receptionist, bookkeeper, and bottleneck.',
                  'No real day off in months.',
                ].map((text, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '16px 20px',
                      backgroundColor: isDark ? 'rgba(239,68,68,0.06)' : 'rgba(239,68,68,0.04)',
                      borderRadius: '10px',
                      border: `1px solid ${isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)'}`,
                    }}
                  >
                    <span style={{
                      color: isDark ? '#ef4444' : '#dc2626',
                      fontSize: '20px',
                      lineHeight: '1.5',
                      flexShrink: 0,
                    }}>
                      ✕
                    </span>
                    <p style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: theme.text,
                      margin: 0,
                      fontFamily: FONTS.body,
                      lineHeight: '1.5',
                      fontWeight: '500',
                    }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Case study thread — pain context */}
              <div style={{
                marginTop: '32px',
                padding: '20px 24px',
                backgroundColor: isDark ? 'rgba(0,74,172,0.08)' : 'rgba(0,74,172,0.05)',
                borderLeft: `3px solid ${BRAND.blue}`,
                borderRadius: '0 10px 10px 0',
              }}>
                <p style={{
                  fontSize: isMobile ? '15px' : '17px',
                  color: theme.textMuted,
                  margin: 0,
                  fontFamily: FONTS.body,
                  lineHeight: '1.7',
                  fontStyle: 'italic',
                }}>
                  "50+ messages a day, three spreadsheets, and I was still losing leads. Making money but had zero life."
                  <span style={{ display: 'block', marginTop: '8px', fontStyle: 'normal', fontWeight: '600', color: theme.text, fontSize: '14px' }}>
                    — Marco D., Business Coach
                  </span>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* BENEFITS SECTION */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '40px 20px' : '52px 32px',
          backgroundColor: theme.bg,
        }}>
          <ScrollReveal>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: isMobile ? '28px' : '38px',
                fontWeight: '800',
                fontFamily: FONTS.heading,
                marginBottom: '12px',
                color: theme.text,
                lineHeight: '1.2',
                textAlign: 'center',
              }}>
                What You Get — Even If You Don't Hire Us
              </h2>
              <p style={{
                fontSize: isMobile ? '17px' : '20px',
                color: theme.textMuted,
                textAlign: 'center',
                marginBottom: '36px',
                fontFamily: FONTS.body,
                lineHeight: '1.6',
              }}>
                This call is about your business, not ours.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Know exactly which tasks to delegate first.',
                  'A VA handling emails, scheduling, and follow-ups from day one.',
                  'GHL automations that respond to leads in under 2 minutes.',
                  'A step-by-step roadmap you can use immediately.',
                ].map((benefit, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '16px 20px',
                      backgroundColor: isDark ? 'rgba(81,175,67,0.06)' : 'rgba(81,175,67,0.04)',
                      borderRadius: '10px',
                      border: `1px solid ${isDark ? 'rgba(81,175,67,0.15)' : 'rgba(81,175,67,0.1)'}`,
                    }}
                  >
                    <CheckCircle
                      size={22}
                      weight="fill"
                      style={{ color: BRAND.green, flexShrink: 0, marginTop: '1px' }}
                    />
                    <p style={{
                      fontSize: isMobile ? '16px' : '18px',
                      color: theme.text,
                      margin: 0,
                      fontFamily: FONTS.body,
                      lineHeight: '1.5',
                      fontWeight: '500',
                    }}>
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>

              {/* Case study thread — results */}
              <div style={{
                marginTop: '32px',
                padding: '20px 24px',
                backgroundColor: isDark ? 'rgba(81,175,67,0.08)' : 'rgba(81,175,67,0.05)',
                borderLeft: `3px solid ${BRAND.green}`,
                borderRadius: '0 10px 10px 0',
              }}>
                <p style={{
                  fontSize: isMobile ? '15px' : '17px',
                  color: theme.textMuted,
                  margin: 0,
                  fontFamily: FONTS.body,
                  lineHeight: '1.7',
                  fontStyle: 'italic',
                }}>
                  "10 days in, my VA ran onboarding end-to-end. Lead response went from 6 hours to 90 seconds. Closed 3 extra clients month one."
                  <span style={{ display: 'block', marginTop: '8px', fontStyle: 'normal', fontWeight: '600', color: theme.text, fontSize: '14px' }}>
                    — Marco D., Business Coach
                  </span>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* GHL CALENDAR EMBED — full width, no max constraint */}
        {/* ============================================ */}
        <section
          id="booking-calendar"
          style={{
            padding: isMobile ? '40px 12px' : '52px 32px',
            backgroundColor: isDark ? '#100e0b' : BRAND.cream,
            borderTop: `1px solid ${theme.cardBorder}`,
            borderBottom: `1px solid ${theme.cardBorder}`,
          }}
        >
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '32px', maxWidth: '700px', margin: '0 auto 32px' }}>
              <h2 style={{
                fontSize: isMobile ? '28px' : '38px',
                fontWeight: '800',
                fontFamily: FONTS.heading,
                marginBottom: '12px',
                color: theme.text,
                lineHeight: '1.2',
              }}>
                Grab Your Spot
              </h2>
              <p style={{
                fontSize: isMobile ? '17px' : '20px',
                color: theme.textMuted,
                fontFamily: FONTS.body,
                lineHeight: '1.6',
                margin: 0,
              }}>
                30 minutes. Zero pressure. Pick a time below.
              </p>
            </div>

            {/* Calendar embed — constrained to natural calendar size */}
            <div style={{
              maxWidth: '1080px',
              margin: '0 auto',
              backgroundColor: theme.cardBg,
              borderRadius: '16px',
              border: `1px solid ${theme.cardBorder}`,
              padding: isMobile ? '8px' : '16px',
              boxShadow: isDark
                ? '0 8px 32px rgba(0,0,0,0.3)'
                : '0 8px 32px rgba(63,32,12,0.08)',
            }}>
              <GHLCalendarEmbed />
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* SOCIAL PROOF / TESTIMONIALS */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '40px 20px' : '52px 32px',
          backgroundColor: theme.bg,
        }}>
          <ScrollReveal>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: isMobile ? '26px' : '36px',
                fontWeight: '800',
                fontFamily: FONTS.heading,
                marginBottom: '32px',
                color: theme.text,
                lineHeight: '1.2',
                textAlign: 'center',
              }}>
                They Were Where You Are
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '20px',
              }}>
                {/* Testimonial 1 */}
                <div style={{
                  padding: '28px 24px',
                  backgroundColor: theme.cardBg,
                  borderRadius: '14px',
                  border: `1px solid ${theme.cardBorder}`,
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} weight="fill" style={{ color: '#f59e0b' }} />
                    ))}
                  </div>
                  <p style={{
                    fontSize: isMobile ? '15px' : '17px',
                    color: theme.text,
                    lineHeight: '1.7',
                    fontFamily: FONTS.body,
                    margin: '0 0 16px',
                  }}>
                    "VA running my onboarding in two weeks. They didn't give me help — they gave me a system."
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: isDark ? 'rgba(0,74,172,0.2)' : 'rgba(0,74,172,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: BRAND.blue,
                      fontWeight: '700',
                      fontSize: '15px',
                      fontFamily: FONTS.heading,
                    }}>
                      RL
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: theme.text, fontFamily: FONTS.body }}>
                        Rachel L.
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: theme.textMuted, fontFamily: FONTS.body }}>
                        Online Fitness Coach
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div style={{
                  padding: '28px 24px',
                  backgroundColor: theme.cardBg,
                  borderRadius: '14px',
                  border: `1px solid ${theme.cardBorder}`,
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} weight="fill" style={{ color: '#f59e0b' }} />
                    ))}
                  </div>
                  <p style={{
                    fontSize: isMobile ? '15px' : '17px',
                    color: theme.text,
                    lineHeight: '1.7',
                    fontFamily: FONTS.body,
                    margin: '0 0 16px',
                  }}>
                    "Close rate jumped 40% in month one. No lead falls through the cracks anymore."
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: isDark ? 'rgba(81,175,67,0.2)' : 'rgba(81,175,67,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: BRAND.green,
                      fontWeight: '700',
                      fontSize: '15px',
                      fontFamily: FONTS.heading,
                    }}>
                      JT
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: theme.text, fontFamily: FONTS.body }}>
                        James T.
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: theme.textMuted, fontFamily: FONTS.body }}>
                        Real Estate Consultant
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* AUTHORITY LINE */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '36px 20px' : '44px 32px',
          backgroundColor: isDark ? '#100e0b' : BRAND.cream,
          borderTop: `1px solid ${theme.cardBorder}`,
          borderBottom: `1px solid ${theme.cardBorder}`,
          textAlign: 'center',
        }}>
          <ScrollReveal>
            <div style={{
              maxWidth: '700px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}>
              <Handshake size={36} weight="duotone" style={{ color: BRAND.blue }} />
              <p style={{
                fontSize: isMobile ? '18px' : '24px',
                fontWeight: '700',
                color: theme.text,
                fontFamily: FONTS.heading,
                lineHeight: '1.4',
                margin: 0,
              }}>
                Trained VAs. Battle-tested GHL automation.
                <br />
                Built for business owners who are done doing it all.
              </p>
              <div style={{
                display: 'flex',
                gap: isMobile ? '32px' : '56px',
                marginTop: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                {[
                  { label: 'Hours Reclaimed', value: '500+' },
                  { label: 'Automations Built', value: '50+' },
                  { label: 'Avg. Response', value: '<2 min' },
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <p style={{
                      fontSize: isMobile ? '32px' : '42px',
                      fontWeight: '800',
                      color: BRAND.blue,
                      margin: 0,
                      fontFamily: FONTS.heading,
                      lineHeight: '1',
                    }}>
                      {stat.value}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: theme.textMuted,
                      margin: '6px 0 0',
                      fontFamily: FONTS.body,
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* TRANSFORMATION STATEMENT */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '40px 20px' : '52px 32px',
          backgroundColor: theme.bg,
          textAlign: 'center',
        }}>
          <ScrollReveal>
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              <Lightning size={40} weight="fill" style={{ color: BRAND.blue, marginBottom: '16px' }} />
              <h2 style={{
                fontSize: isMobile ? '28px' : '38px',
                fontWeight: '800',
                fontFamily: FONTS.heading,
                marginBottom: '20px',
                color: theme.text,
                lineHeight: '1.2',
              }}>
                One Week From Today
              </h2>
              <p style={{
                fontSize: isMobile ? '17px' : '21px',
                color: theme.textMuted,
                lineHeight: '1.7',
                fontFamily: FONTS.body,
                margin: 0,
              }}>
                Leads booked. Inbox handled. Calendar organized.
                <br />
                <strong style={{ color: theme.text }}>You didn't touch any of it.</strong>
              </p>
              <p style={{
                fontSize: isMobile ? '18px' : '22px',
                color: theme.text,
                lineHeight: '1.5',
                fontFamily: FONTS.body,
                fontWeight: '700',
                marginTop: '24px',
              }}>
                That's what happens after one call.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ============================================ */}
        {/* FINAL CTA — repeat with urgency */}
        {/* ============================================ */}
        <section style={{
          padding: isMobile ? '44px 20px' : '56px 32px',
          background: `linear-gradient(135deg, ${BRAND.blue} 0%, #003080 100%)`,
          textAlign: 'center',
        }}>
          <ScrollReveal>
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: isMobile ? '28px' : '42px',
                fontWeight: '800',
                fontFamily: FONTS.heading,
                color: '#ffffff',
                marginBottom: '16px',
                lineHeight: '1.15',
              }}>
                Your Business Won't Fix Itself.
              </h2>
              <p style={{
                fontSize: isMobile ? '17px' : '20px',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: '1.6',
                marginBottom: '32px',
                fontFamily: FONTS.body,
              }}>
                Every week you wait = 20+ hours lost.
                <br />
                <strong style={{ color: '#fff' }}>Limited spots each month.</strong>
              </p>

              <button
                onClick={scrollToCalendar}
                style={{
                  padding: isMobile ? '16px 32px' : '18px 40px',
                  backgroundColor: '#ffffff',
                  color: BRAND.blue,
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: isMobile ? '16px' : '18px',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease',
                }}
              >
                <CalendarCheck size={20} weight="bold" />
                Claim Your Free Strategy Call
                <CaretRight size={18} weight="bold" />
              </button>

              <p style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.6)',
                marginTop: '14px',
                fontFamily: FONTS.body,
              }}>
                No credit card. No contract. Just a clear plan you can use today.
              </p>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* ============================================ */}
      {/* MINIMAL FOOTER */}
      {/* ============================================ */}
      <footer style={{
        padding: '24px 32px',
        borderTop: `1px solid ${theme.cardBorder}`,
        textAlign: 'center',
        backgroundColor: theme.bg,
      }}>
        <p style={{
          fontSize: '12px',
          color: theme.textSubtle,
          margin: 0,
          fontFamily: FONTS.body,
        }}>
          &copy; {new Date().getFullYear()} BrewedOps. All rights reserved. |{' '}
          <a
            href="/privacy"
            style={{ color: theme.textMuted, textDecoration: 'none' }}
          >
            Privacy
          </a>{' '}
          |{' '}
          <a
            href="/terms"
            style={{ color: theme.textMuted, textDecoration: 'none' }}
          >
            Terms
          </a>
        </p>
      </footer>
    </div>
  );
}

export default BookingPage;
