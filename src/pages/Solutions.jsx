import { useEffect, useRef } from 'react'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/LanguageContext'
import '../styles/solutions.css'

const CUSTOM_CURSOR = true
const MOTION_INTENSITY = 1
const STUDIO_URL = 'https://studio.davdsm.pt/landing'

const BLOOM_PETALS = [
  { top: '8%', left: '6%', size: [18, 12], color: '#f6cfd9', dur: 11, delay: 0 },
  { top: '22%', left: '48%', size: [13, 9], color: '#c3edd1', dur: 9, delay: 1.2 },
  { top: '12%', left: '78%', size: [16, 11], color: 'rgba(255,255,255,0.9)', dur: 12, delay: 0.6 },
  { top: '58%', left: '10%', size: [12, 8], color: '#98deb0', dur: 10, delay: 2 },
  { top: '78%', left: '42%', size: [15, 10], color: '#f6cfd9', dur: 13, delay: 0.9 },
  { top: '40%', left: '90%', size: [17, 11], color: '#c3edd1', dur: 10.5, delay: 1.6 },
  { top: '84%', left: '86%', size: [12, 9], color: '#f6cfd9', dur: 9.5, delay: 2.4 },
  { top: '30%', left: '28%', size: [14, 10], color: 'rgba(255,255,255,0.85)', dur: 11.5, delay: 0.3 },
]

const FEATURE_KEYS = ['messages', 'invoices', 'communication', 'studios']

function FeatureIcon({ name }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.7',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  if (name === 'messages') {
    return (
      <svg {...common}>
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H10l-4 3.5V16H6.5A2.5 2.5 0 0 1 4 13.5v-7Z" />
        <path d="M8 9h8M8 12h5" />
      </svg>
    )
  }
  if (name === 'invoices') {
    return (
      <svg {...common}>
        <path d="M7 3.5h10a1 1 0 0 1 1 1V20l-2.2-1.4L13.6 20 11 18.6 8.4 20 6 18.6V4.5a1 1 0 0 1 1-1Z" />
        <path d="M9 8h6M9 11.5h6M9 15h3.5" />
      </svg>
    )
  }
  if (name === 'communication') {
    return (
      <svg {...common}>
        <circle cx="8" cy="10" r="3" />
        <circle cx="16.5" cy="10" r="3" />
        <path d="M3.5 17.5c.8-2.2 2.5-3.4 4.5-3.4s3.7 1.2 4.5 3.4" />
        <path d="M12 17.5c.8-2.2 2.5-3.4 4.5-3.4s3.7 1.2 4.5 3.4" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M4 19V8.5L12 4l8 4.5V19" />
      <path d="M9 19v-6h6v6" />
      <path d="M4 19h16" />
    </svg>
  )
}

export default function Solutions() {
  const { t } = useLanguage()
  const rootRef = useRef(null)
  const destroyedRef = useRef(false)

  useEffect(() => {
    destroyedRef.current = false
    const root = rootRef.current
    const $ = (s) => root.querySelector(s)
    const $$ = (s) => Array.from(root.querySelectorAll(s))
    const intensity = MOTION_INTENSITY
    const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const cleanups = []
    const on = (target, ev, fn, opts) => {
      target.addEventListener(ev, fn, opts)
      cleanups.push(() => target.removeEventListener(ev, fn, opts))
    }

    let onPtReveal
    let heroTimeout
    const heroEntrance = () => {
      if (destroyedRef.current) return
      $$('[data-hero-word]').forEach((el, i) => {
        el.style.transitionDelay = `${0.1 + i * 0.12}s`
        el.style.transform = 'translateY(0)'
      })
      $$('[data-hero-reveal]').forEach((el, i) => {
        el.style.transitionDelay = `${0.35 + i * 0.1}s`
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
    }
    if (window.__davdsmPTActive) {
      onPtReveal = () => setTimeout(heroEntrance, 150)
      window.addEventListener('davdsm:pt-reveal', onPtReveal, { once: true })
    } else {
      heroTimeout = setTimeout(heroEntrance, 120)
    }

    const onAnchorClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]')
      if (!a) return
      const href = a.getAttribute('href')
      const id = href.slice(1)
      if (id === '/') {
        window.location.hash = '#/'
        return
      }
      const target = id ? document.getElementById(id) : document.body
      if (!target && id) return
      e.preventDefault()
      const top = id ? target.getBoundingClientRect().top + window.scrollY : 0
      window.scrollTo({ top, behavior: 'smooth' })
    }
    on(document, 'click', onAnchorClick)

    const navLogoWhite = document.querySelector('[data-nav-logo-white]')
    const navLogoGreen = document.querySelector('[data-nav-logo-green]')
    const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'))
    const themeSections = $$('[data-nav-theme]')
    let navTheme = ''
    const updateNavTheme = () => {
      const y = 60
      let theme = 'dark'
      for (const sec of themeSections) {
        const r = sec.getBoundingClientRect()
        if (r.top <= y && r.bottom >= y) {
          theme = sec.getAttribute('data-nav-theme')
          break
        }
      }
      if (theme === navTheme) return
      navTheme = theme
      const light = theme === 'light'
      if (navLogoWhite) navLogoWhite.style.opacity = light ? '0' : '1'
      if (navLogoGreen) navLogoGreen.style.opacity = light ? '1' : '0'
      navLinks.forEach((el) => { el.style.color = light ? 'var(--color-forest-900)' : '#ffffff' })
    }
    updateNavTheme()

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1'
          e.target.style.transform = 'none'
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
    $$('[data-reveal]').forEach((el) => io.observe(el))

    const scrollContainer = $('[data-scroll-container]')
    const scrollSpacer = $('[data-scroll-spacer]')
    let cur = 0
    let maxCur = 0
    const syncSpacerHeight = () => {
      if (scrollContainer && scrollSpacer) scrollSpacer.style.height = `${scrollContainer.scrollHeight}px`
      maxCur = scrollContainer ? scrollContainer.scrollHeight : 0
    }
    if (scrollContainer) window.scrollTo(0, 0)
    syncSpacerHeight()

    const plxEls = $$('[data-plx]')
    const measure = () => {
      syncSpacerHeight()
      plxEls.forEach((el) => {
        const prev = el.style.transform
        el.style.transform = 'none'
        const r = el.getBoundingClientRect()
        el._plxBase = r.top + cur + r.height / 2
        el.style.transform = prev
      })
    }
    measure()
    const measureTimeout = setTimeout(measure, 800)
    on(window, 'load', measure)
    on(window, 'resize', measure)

    const dot = $('[data-cursor-dot]')
    const ring = $('[data-cursor-ring]')
    const ringText = $('[data-cursor-text]')
    let cursorX = -100
    let cursorY = -100
    const useCursor = CUSTOM_CURSOR && fine
    let cursorStyle
    if (!useCursor) {
      if (dot) dot.style.display = 'none'
      if (ring) ring.style.display = 'none'
    } else {
      cursorStyle = document.createElement('style')
      cursorStyle.textContent = 'body, a, button, [data-cursor] { cursor: none !important; }'
      document.head.appendChild(cursorStyle)
      on(document, 'mouseover', (e) => {
        const label = e.target.closest && e.target.closest('[data-cursor]')
        const link = e.target.closest && e.target.closest('a, button')
        if (label) {
          const txt = label.getAttribute('data-cursor')
          if (ringText) { ringText.textContent = txt; ringText.style.opacity = '1' }
          ring.style.width = '84px'; ring.style.height = '84px'; ring.style.margin = '-42px 0 0 -42px'
          ring.style.background = 'rgba(195,237,209,0.95)'
          ring.style.border = 'none'
        } else if (link) {
          if (ringText) ringText.style.opacity = '0'
          ring.style.width = '60px'; ring.style.height = '60px'; ring.style.margin = '-30px 0 0 -30px'
          ring.style.background = 'rgba(152,222,176,0.18)'
          ring.style.border = '1.5px solid rgba(152,222,176,0.9)'
        } else {
          if (ringText) ringText.style.opacity = '0'
          ring.style.width = '42px'; ring.style.height = '42px'; ring.style.margin = '-21px 0 0 -21px'
          ring.style.background = 'rgba(152,222,176,0)'
          ring.style.border = '1.5px solid rgba(152,222,176,0.75)'
        }
      })
    }
    on(window, 'mousemove', (e) => {
      cursorX = e.clientX
      cursorY = e.clientY
      if (dot) dot.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 4}px)`
    })

    let ringX = -100
    let ringY = -100
    let raf
    const loop = () => {
      if (destroyedRef.current) return
      cur += (window.scrollY - cur) * 0.09
      if (maxCur) cur = Math.min(cur, maxCur)
      if (scrollContainer) scrollContainer.style.transform = `translate3d(0,${(-cur).toFixed(2)}px,0)`
      const vh = window.innerHeight
      if (!reduceMotion) {
        plxEls.forEach((el) => {
          if (el._plxBase == null) return
          const sp = parseFloat(el.getAttribute('data-plx') || '0') * intensity
          const y = (el._plxBase - cur - vh / 2) * -sp
          el.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`
        })
      }
      updateNavTheme()
      if (useCursor && ring) {
        ringX += (cursorX - ringX) * 0.16
        ringY += (cursorY - ringY) * 0.16
        ring.style.transform = `translate(${ringX.toFixed(1)}px,${ringY.toFixed(1)}px)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      destroyedRef.current = true
      if (onPtReveal) window.removeEventListener('davdsm:pt-reveal', onPtReveal)
      if (heroTimeout) clearTimeout(heroTimeout)
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(measureTimeout)
      io.disconnect()
      if (cursorStyle) cursorStyle.remove()
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    <div ref={rootRef}>
      <div
        data-cursor-dot=""
        style={{ position: 'fixed', top: 0, left: 0, width: 8, height: 8, borderRadius: '50%', background: '#98deb0', zIndex: 300, pointerEvents: 'none', transform: 'translate(-100px,-100px)', mixBlendMode: 'difference' }}
      />
      <div
        data-cursor-ring=""
        style={{
          position: 'fixed', top: 0, left: 0, width: 42, height: 42, margin: '-21px 0 0 -21px', borderRadius: '50%',
          border: '1.5px solid rgba(152,222,176,0.75)', background: 'rgba(152,222,176,0)', zIndex: 299, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translate(-100px,-100px)',
          transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), margin 0.35s cubic-bezier(0.16,1,0.3,1), background 0.35s',
        }}
      >
        <span data-cursor-text="" style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0a1a0f', opacity: 0, transition: 'opacity 0.25s', whiteSpace: 'nowrap' }}>
          <Fade>{t('solutionsPage.openCtaShort')}</Fade>
        </span>
      </div>

      <div data-scroll-container="" style={{ position: 'fixed', top: 0, left: 0, width: '100%', willChange: 'transform' }}>
        <section id="top" data-screen-label="Solutions Hero" data-nav-theme="dark" style={{ position: 'relative', background: 'var(--color-forest-950)', overflow: 'hidden', padding: '18vh 6vw 10vh' }}>
          <div data-hero-reveal="" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 14, marginBottom: '4vh', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)' }}>
            <span style={{ width: 44, height: 1, background: 'var(--color-mint-300)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-mint-300)' }}><Fade>{t('solutionsPage.hero.eyebrow')}</Fade></span>
            <span style={{ width: 44, height: 1, background: 'var(--color-mint-300)', display: 'inline-block' }} />
          </div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(44px,7vw,120px)', lineHeight: 0.98, letterSpacing: '-0.035em', color: '#ffffff' }}>
            <span style={{ display: 'block', overflow: 'hidden' }}><span data-hero-word="" style={{ display: 'block', transform: 'translateY(115%)', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }}><Fade>{t('solutionsPage.hero.line1')}</Fade></span></span>
            <span style={{ display: 'block', overflow: 'hidden' }}>
              <span data-hero-word="" style={{ display: 'block', transform: 'translateY(115%)', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }}>
                <Fade>{t('solutionsPage.hero.line2Pre')}</Fade><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-mint-300)' }}><Fade>{t('solutionsPage.hero.emphasis')}</Fade></em>
              </span>
            </span>
          </h1>
          <p data-hero-reveal="" style={{ margin: 'clamp(24px,3vw,40px) 0 0', maxWidth: '42ch', fontFamily: 'var(--font-sans)', fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.72)', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)' }}>
            <Fade>{t('solutionsPage.hero.paragraph')}</Fade>
          </p>
        </section>

        <section id="studio" data-screen-label="Studio Product" data-nav-theme="light" className="solutions-bloom" style={{ position: 'relative', background: 'linear-gradient(150deg,#eafcf0 0%,#fdeef2 52%,#e9f3ff 100%)', overflow: 'hidden', padding: 'clamp(90px,12vw,170px) 6vw clamp(96px,13vw,180px)' }}>
          <div aria-hidden="true" className="solutions-bloom-wash solutions-bloom-wash--pink" />
          <div aria-hidden="true" className="solutions-bloom-wash solutions-bloom-wash--mint" />
          <div aria-hidden="true">
            {BLOOM_PETALS.map((petal, i) => (
              <span
                key={i}
                className="solutions-bloom-petal"
                style={{
                  position: 'absolute',
                  top: petal.top,
                  left: petal.left,
                  width: petal.size[0],
                  height: petal.size[1],
                  background: petal.color,
                  borderRadius: '62% 38% 55% 45% / 60% 50% 50% 40%',
                  animationDuration: `${petal.dur}s`,
                  animationDelay: `${petal.delay}s`,
                }}
              />
            ))}
          </div>

          <div className="solutions-bloom-grid">
            <div>
              <span data-reveal="" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-forest-500)', opacity: 0, transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)', marginBottom: 22 }}>
                <span style={{ width: 44, height: 1, background: 'var(--color-forest-500)', display: 'inline-block' }} />
                <Fade>{t('solutionsPage.studio.kicker')}</Fade>
              </span>
              <h2 style={{ margin: '0 0 clamp(18px,2.4vw,28px)' }}>
                <span data-reveal="" style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(20px,2.3vw,32px)', letterSpacing: '-0.015em', color: 'var(--color-forest-500)', marginBottom: 'clamp(12px,1.6vw,20px)', opacity: 0, transform: 'translateY(24px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
                  <Fade>{t('solutionsPage.studio.leadPre')}</Fade><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-earth-500)' }}><Fade>{t('solutionsPage.studio.leadEmphasis')}</Fade></em>
                </span>
                <span data-reveal="" style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(52px,8vw,126px)', lineHeight: 0.96, letterSpacing: '-0.035em', color: 'var(--color-forest-900)', textWrap: 'balance', opacity: 0, transform: 'translateY(36px)', transition: 'opacity 1.15s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 1.15s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
                  <Fade>{t('solutionsPage.studio.name')}</Fade>
                </span>
              </h2>
              <div data-reveal="" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 12, fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--color-forest-500)', marginBottom: 18, opacity: 0, transform: 'translateY(20px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}><Fade>{t('solutionsPage.studio.badge')}</Fade></span>
                <span style={{ fontFamily: 'var(--font-sans)' }}><Fade>{t('solutionsPage.studio.tag')}</Fade></span>
              </div>
              <p data-reveal="" style={{ margin: '0 0 clamp(28px,3.6vw,44px)', maxWidth: '46ch', fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.7, color: 'var(--color-neutral-600)', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.28s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.28s' }}>
                <Fade>{t('solutionsPage.studio.description')}</Fade>
              </p>
              <a
                data-reveal=""
                href={STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor={t('solutionsPage.openCtaShort')}
                className="solutions-cta"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 9999, borderWidth: 1, borderStyle: 'solid', padding: '14px 24px', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, textDecoration: 'none', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.36s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.36s' }}
              >
                <Fade>{t('solutionsPage.studio.cta')}</Fade>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M8 7h9v9" /></svg>
              </a>
            </div>

            <div className="solutions-bloom-media" data-plx="0.04">
              <div className="solutions-product-card" aria-hidden="true">
                <div className="solutions-product-card__glow" />
                <div className="solutions-product-card__top">
                  <span className="solutions-product-card__dot" />
                  <span className="solutions-product-card__dot" />
                  <span className="solutions-product-card__dot" />
                  <span className="solutions-product-card__label"><Fade>{t('solutionsPage.studio.previewLabel')}</Fade></span>
                </div>
                <div className="solutions-product-card__body">
                  <p className="solutions-product-card__eyebrow"><Fade>{t('solutionsPage.studio.previewEyebrow')}</Fade></p>
                  <p className="solutions-product-card__title"><Fade>{t('solutionsPage.studio.previewTitle')}</Fade></p>
                  <div className="solutions-product-card__rows">
                    <div className="solutions-product-card__row">
                      <span /><span /><span />
                    </div>
                    <div className="solutions-product-card__row solutions-product-card__row--soft">
                      <span /><span /><span />
                    </div>
                    <div className="solutions-product-card__row">
                      <span /><span /><span />
                    </div>
                  </div>
                  <div className="solutions-product-card__chip">
                    <Fade>{t('solutionsPage.studio.previewChip')}</Fade>
                  </div>
                </div>
              </div>
              <div className="solutions-float-pill solutions-float-pill--a">
                <Fade>{t('solutionsPage.studio.floatA')}</Fade>
              </div>
              <div className="solutions-float-pill solutions-float-pill--b">
                <Fade>{t('solutionsPage.studio.floatB')}</Fade>
              </div>
            </div>
          </div>
        </section>

        <section id="features" data-screen-label="Studio Features" data-nav-theme="light" style={{ position: 'relative', background: '#F2FBF4', padding: 'clamp(90px,12vw,160px) 6vw', overflow: 'hidden' }}>
          <div className="solutions-features-header">
            <div>
              <span data-reveal="" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-forest-500)', opacity: 0, transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)', marginBottom: 28 }}>
                <span style={{ width: 44, height: 1, background: 'var(--color-forest-500)', display: 'inline-block' }} />
                <Fade>{t('solutionsPage.features.kicker')}</Fade>
              </span>
              <h2 data-reveal="" style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px,5vw,72px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--color-forest-900)', opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
                <Fade>{t('solutionsPage.features.heading')}</Fade>{' '}
                <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-forest-500)' }}><Fade>{t('solutionsPage.features.headingEmphasis')}</Fade></em>
              </h2>
            </div>
            <p data-reveal="" style={{ margin: '0 0 10px', maxWidth: 340, fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.7, color: 'var(--color-neutral-600)', opacity: 0, transform: 'translateY(24px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s' }}>
              <Fade>{t('solutionsPage.features.paragraph')}</Fade>
            </p>
          </div>

          <div className="solutions-features-grid">
            {FEATURE_KEYS.map((key, i) => (
              <article
                key={key}
                data-reveal=""
                className="solutions-feature-card"
                style={{ opacity: 0, transform: 'translateY(28px)', transition: `opacity 1.05s cubic-bezier(0.16,1,0.3,1) ${0.08 + i * 0.08}s, transform 1.05s cubic-bezier(0.16,1,0.3,1) ${0.08 + i * 0.08}s` }}
              >
                <div className="solutions-feature-card__icon">
                  <FeatureIcon name={key} />
                </div>
                <h3 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: 'var(--color-forest-900)' }}>
                  <Fade>{t(`solutionsPage.features.items.${key}.title`)}</Fade>
                </h3>
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.65, color: 'var(--color-neutral-600)' }}>
                  <Fade>{t(`solutionsPage.features.items.${key}.text`)}</Fade>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="open" data-screen-label="Open Studio" data-nav-theme="dark" style={{ position: 'relative', background: 'var(--color-forest-950)', padding: 'clamp(88px,12vw,150px) 6vw', overflow: 'hidden' }}>
          <div className="solutions-open-grid">
            <div>
              <h2 data-reveal="" style={{ margin: '0 0 18px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px,5.4vw,78px)', lineHeight: 1.02, letterSpacing: '-0.03em', color: '#ffffff', opacity: 0, transform: 'translateY(36px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
                <Fade>{t('solutionsPage.open.heading')}</Fade>{' '}
                <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-mint-300)' }}><Fade>{t('solutionsPage.open.headingEmphasis')}</Fade></em>
              </h2>
              <p data-reveal="" style={{ margin: 0, maxWidth: '42ch', fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.68)', opacity: 0, transform: 'translateY(24px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s' }}>
                <Fade>{t('solutionsPage.open.paragraph')}</Fade>
              </p>
            </div>
            <div data-reveal="" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.18s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.18s' }}>
              <a
                href={STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor={t('solutionsPage.openCtaShort')}
                className="solutions-cta solutions-cta--solid"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 9999, borderWidth: 1, borderStyle: 'solid', padding: '15px 26px', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
              >
                <Fade>{t('solutionsPage.studio.cta')}</Fade>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M8 7h9v9" /></svg>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
      <div data-scroll-spacer="" aria-hidden="true" />
    </div>
  )
}
