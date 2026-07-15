import ProjectInquiryCard from './ProjectInquiryCard'
import Fade from './Fade'
import { useLanguage } from '../i18n/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer
      data-screen-label="Footer"
      data-nav-theme="dark"
      style={{ position: 'relative', overflow: 'hidden', isolation: 'isolate', background: 'var(--color-forest-950)' }}
    >
      <video
        data-plx="0.08"
        src="https://videos.pexels.com/video-files/30163672/12934696_2560_1440_30fps.mp4"
        poster="/assets/footer-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '-10%',
          width: '100%',
          height: '120%',
          objectFit: 'cover',
          objectPosition: 'center top',
          zIndex: -2,
          willChange: 'transform',
          filter: 'saturate(1.05) contrast(1.02)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,26,15,0.28) 0%, rgba(10,26,15,0.4) 55%, var(--color-forest-950) 100%)',
          zIndex: -1,
        }}
      />

      <section id="contact" data-screen-label="Contact CTA" data-nav-theme="dark" style={{ position: 'relative', padding: 0 }}>
        <div style={{ position: 'relative' }}>
          <div className="footer-contact-inner" style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <div
              data-reveal=""
              style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: 640,
                padding: 'clamp(32px,5vw,80px) 6vw',
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <h2
                style={{
                  margin: '0 0 22px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(36px,4.6vw,64px)',
                  lineHeight: 1.12,
                  letterSpacing: '-0.03em',
                  color: '#ffffff',
                }}
              >
                <Fade>{t('footer.heading')}</Fade>
              </h2>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', maxWidth: 440 }}>
                <Fade>{t('footer.paragraph')}</Fade>
              </p>
            </div>
            <div
              data-reveal=""
              className="footer-contact-card"
              style={{
                zIndex: 2,
                display: 'flex',
                alignItems: 'stretch',
                gap: 16,
                borderRadius: 26,
                padding: 16,
                background: 'rgba(210,216,212,0.55)',
                backdropFilter: 'blur(10px) saturate(1.3)',
                WebkitBackdropFilter: 'blur(10px) saturate(1.3)',
                opacity: 0,
                transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s',
              }}
            >
              <ProjectInquiryCard />
              <a
                href="mailto:geral@davdsm.pt"
                className="footer-cta-btn"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  background: 'var(--color-forest-950)',
                  color: '#ffffff',
                  borderRadius: 20,
                  padding: '20px 30px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 15,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                <Fade>{t('footer.cta')}</Fade>{' '}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 21v-8" />
                  <path d="M12 13c0-4-3-6.5-7.5-6.5 0 4.5 3 6.5 7.5 6.5z" />
                  <path d="M12 13c0-4 3-6.5 7.5-6.5 0 4.5-3 6.5-7.5 6.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div
        data-reveal=""
        className="footer-links-grid"
        style={{
          display: 'grid',
          gap: 40,
          padding: 'clamp(60px,8vw,110px) 6vw 40px',
          opacity: 0,
          transform: 'translateY(24px)',
          transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div>
          <img className="footer-logo" src="/assets/logo-white.svg" alt="DAVDSM" style={{ height: 32, width: 'auto', display: 'block', marginBottom: 16 }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 19, color: 'rgba(255,255,255,0.85)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 21v-8" />
              <path d="M12 13c0-4-3-6.5-7.5-6.5 0 4.5 3 6.5 7.5 6.5z" />
              <path d="M12 13c0-4 3-6.5 7.5-6.5 0 4.5-3 6.5-7.5 6.5z" />
            </svg>
            <Fade>{t('footer.tagline')}</Fade>
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: '#ffffff', marginBottom: 8 }}><Fade>{t('footer.exploreHeading')}</Fade></span>
          <a href="#/studio" className="footer-link" style={{ fontFamily: 'var(--font-sans)', fontSize: 15 }}><Fade>{t('footer.studio')}</Fade></a>
          <a href="#/work" className="footer-link" style={{ fontFamily: 'var(--font-sans)', fontSize: 15 }}><Fade>{t('footer.work')}</Fade></a>
          <a href="#craft" className="footer-link" style={{ fontFamily: 'var(--font-sans)', fontSize: 15 }}><Fade>{t('footer.craft')}</Fade></a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: '#ffffff', marginBottom: 8 }}><Fade>{t('footer.elsewhereHeading')}</Fade></span>
          <a href="#" className="footer-link" style={{ fontFamily: 'var(--font-sans)', fontSize: 15 }}><Fade>{t('footer.instagram')}</Fade></a>
          <a href="#" className="footer-link" style={{ fontFamily: 'var(--font-sans)', fontSize: 15 }}><Fade>{t('footer.behance')}</Fade></a>
          <a href="mailto:geral@davdsm.pt" className="footer-link" style={{ fontFamily: 'var(--font-sans)', fontSize: 15 }}>geral@davdsm.pt</a>
        </div>
      </div>

      <div
        data-reveal=""
        className="footer-bottom-bar"
        style={{
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(16px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '16px 28px',
          opacity: 0,
          transform: 'translateY(24px)',
          transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s',
        }}
      >
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: '#ffffff', whiteSpace: 'nowrap' }}><Fade>{t('footer.copyright')}</Fade></span>
        <div className="footer-bottom-bar-links" style={{ display: 'flex', alignItems: 'center' }}>
          <a href="#/terms" className="footer-link" style={{ fontFamily: 'var(--font-sans)', fontSize: 13, whiteSpace: 'nowrap' }}><Fade>{t('footer.terms')}</Fade></a>
          <a href="#/privacy" className="footer-link" style={{ fontFamily: 'var(--font-sans)', fontSize: 13, whiteSpace: 'nowrap' }}><Fade>{t('footer.privacy')}</Fade></a>
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: '#ffffff' }}><Fade>{t('footer.wildFlowers')}</Fade></span>
        </div>
      </div>
    </footer>
  )
}
