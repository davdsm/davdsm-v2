import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageToggle from './LanguageToggle'
import Fade from './Fade'
import LiquidGlassFilter from './LiquidGlassFilter'

const MENU_KEYS = ['studio', 'work', 'solutions']
const MENU_HREFS = { studio: '#/studio', work: '#/work', solutions: '#craft' }

export default function Nav() {
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [phase, setPhase] = useState('closed') // closed | entering | open | exiting
  const glassLayerRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (menuOpen) {
      setPhase('entering')
      // Double rAF: the first frame commits the "entering" (off-screen) style,
      // the second flips to "open" — a single rAF can land before the browser
      // has painted the initial transform, so the slide-in never animates.
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => setPhase('open'))
        rafRef.current = raf2
      })
      rafRef.current = raf1
      return () => cancelAnimationFrame(rafRef.current)
    }
    setPhase((p) => (p === 'closed' ? 'closed' : 'exiting'))
    const closeTimer = setTimeout(() => setPhase('closed'), 700)
    return () => clearTimeout(closeTimer)
  }, [menuOpen])

  useEffect(() => {
    if (phase !== 'open') return
    const words = document.querySelectorAll('[data-menu-word]')
    words.forEach((el, i) => {
      el.style.transitionDelay = `${0.15 + i * 0.1}s`
      el.style.transform = 'translateY(0)'
    })
  }, [phase])

  useEffect(() => {
    if (phase === 'closed') return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [phase])

  const handleLogoClick = (e) => {
    const h = window.location.hash
    if (h === '' || h === '#' || h === '#/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav
      className="dvd-nav"
      style={{
        position: 'fixed',
        top: 24,
        left: 0,
        right: 0,
        zIndex: 150,
      }}
    >
      <a
        href="#/"
        onClick={handleLogoClick}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifySelf: 'start',
          height: 24,
          cursor: 'pointer',
        }}
      >
        <img
          data-nav-logo-white=""
          className="dvd-nav-logo"
          src="/assets/logo-white.svg"
          alt="DAVDSM"
          style={{ width: 'auto', display: 'block', opacity: 1, transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1)' }}
        />
        <img
          data-nav-logo-green=""
          className="dvd-nav-logo"
          src="/assets/logo-green.svg"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 'auto',
            display: 'block',
            opacity: 0,
            transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </a>

      <div className="dvd-nav-pill-wrap" style={{ position: 'relative', borderRadius: 9999, justifySelf: 'center', isolation: 'isolate' }}>
        <div
          ref={glassLayerRef}
          className="dvd-nav-glass-layer"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 9999,
            overflow: 'hidden',
            zIndex: 0,
          }}
        />
        <LiquidGlassFilter targetRef={glassLayerRef} filterId="dvd-liquid-glass" />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, zIndex: 1, background: 'rgba(255,255,255,0.08)' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 9999,
            zIndex: 3,
            boxShadow:
              'inset 1.5px 1.5px 1px 0 rgba(255,255,255,0.55), inset -1px -1px 1px 0 rgba(255,255,255,0.28), inset 0 0 12px rgba(255,255,255,0.12)',
          }}
        />
        <div className="dvd-nav-pill">
          <a
            href="#/studio"
            data-nav-link=""
            className="nav-link"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, color: '#ffffff', borderRadius: 9999 }}
          >
            <Fade>{t('nav.studio')}</Fade>
          </a>
          <a
            href="#/work"
            data-nav-link=""
            className="nav-link"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, color: '#ffffff', borderRadius: 9999 }}
          >
            <Fade>{t('nav.work')}</Fade>
          </a>
          <a
            href="#craft"
            data-nav-link=""
            className="nav-link"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, color: '#ffffff', borderRadius: 9999 }}
          >
            <Fade>{t('nav.solutions')}</Fade>
          </a>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'end', gap: 10 }}>
        <div className="dvd-nav-toggle-desktop">
          <LanguageToggle />
        </div>
        <button
          type="button"
          data-nav-link=""
          className="dvd-nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {menuOpen ? (
              <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>
            ) : (
              <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>
            )}
          </svg>
        </button>
      </div>

      {phase !== 'closed' && (
        <div className={`dvd-nav-mobile-menu dvd-nav-mobile-menu-${phase}`}>
          <video
            className="dvd-nav-mobile-menu-video"
            src="https://videos.pexels.com/video-files/30163672/12934696_2560_1440_30fps.mp4"
            poster="/assets/footer-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="dvd-nav-mobile-menu-scrim" aria-hidden="true" />
          <button
            type="button"
            className="dvd-nav-mobile-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 6l12 12" /><path d="M18 6L6 18" />
            </svg>
          </button>
          <div className="dvd-nav-mobile-menu-content">
            {MENU_KEYS.map((key) => (
              <a key={key} href={MENU_HREFS[key]} onClick={closeMenu} className="dvd-nav-mobile-link">
                <span className="dvd-nav-mobile-link-mask">
                  <span className="dvd-nav-mobile-link-word" data-menu-word="">
                    <Fade>{t(`nav.${key}`)}</Fade>
                  </span>
                </span>
              </a>
            ))}
            <div className="dvd-nav-mobile-divider" />
            <LanguageToggle />
          </div>
        </div>
      )}
    </nav>
  )
}
