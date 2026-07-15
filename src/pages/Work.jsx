import { useEffect, useRef } from 'react'
import ImageSlot from '../components/ImageSlot'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import HomeWorkLeafyVisual from '../components/HomeWorkLeafyVisual'
import { useLanguage } from '../i18n/LanguageContext'
import { PROJECTS } from '../data/projects'
import '../styles/work.css'

const CUSTOM_CURSOR = true
const MOTION_INTENSITY = 1
const STACK_CARD_SLOT_VH = 90
const STACK_PIN_TOP_PX = 130
const STACK_PIN_DURATION = 0.55

function getSelected(t) {
  return ['amPrestige'].map((key) => ({
    key,
    name: t(`home.work.projects.${key}.name`),
    tag: t(`home.work.projects.${key}.tag`),
    year: t(`workPage.hero.stack.projects.${key}.year`),
    description: t(`workPage.hero.stack.projects.${key}.description`),
    cover: PROJECTS[key]?.cover,
    hoverCover: PROJECTS[key]?.hoverCover,
    href: PROJECTS[key] ? `#/work/${key}` : undefined,
  }))
}

function getRecent(t) {
  return ['singula', 'highTide', 'raizRamo', 'portoNorte', 'musgo'].map((key) => ({
    key,
    name: t(`workPage.recent.projects.${key}.name`),
    tag: t(`workPage.recent.projects.${key}.tag`),
    year: t(`workPage.recent.projects.${key}.year`),
    cover: PROJECTS[key]?.cover,
    href: PROJECTS[key] ? `#/work/${key}` : undefined,
  }))
}

function getArchive(t) {
  return ['vilaNova', 'sobreiro', 'terra', 'ponte', 'bosque'].map((key) => ({
    key,
    name: t(`workPage.archive.projects.${key}.name`),
    tag: t(`workPage.archive.projects.${key}.tag`),
    year: t(`workPage.archive.projects.${key}.year`),
  }))
}

export default function Work() {
  const { t } = useLanguage()
  const SELECTED = getSelected(t)
  const RECENT = getRecent(t)
  const ARCHIVE = getArchive(t)
  const rootRef = useRef(null)
  const destroyedRef = useRef(false)

  useEffect(() => {
    destroyedRef.current = false
    const root = rootRef.current
    const $ = (s) => root.querySelector(s)
    const $$ = (s) => Array.from(root.querySelectorAll(s))
    const intensity = MOTION_INTENSITY
    const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches

    const cleanups = []
    const on = (target, ev, fn, opts) => {
      target.addEventListener(ev, fn, opts)
      cleanups.push(() => target.removeEventListener(ev, fn, opts))
    }

    /* ---------- Hero entrance ---------- */
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

    /* ---------- Smooth in-page anchor scrolling ---------- */
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

    /* ---------- Adaptive nav ---------- */
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

    /* ---------- Scroll reveals ---------- */
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

    /* ---------- Virtual scroll ---------- */
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

    /* ---------- Parallax measurement ---------- */
    const plxEls = $$('[data-plx]')
    const stackCards = $$('[data-stack-card]')
    const measure = () => {
      syncSpacerHeight()
      plxEls.forEach((el) => {
        const prev = el.style.transform
        el.style.transform = 'none'
        const r = el.getBoundingClientRect()
        el._plxBase = r.top + cur + r.height / 2
        el.style.transform = prev
      })
      stackCards.forEach((el) => {
        const prev = el.style.transform
        el.style.transform = 'none'
        const r = el.getBoundingClientRect()
        el._stackDocTop = r.top + cur
        el.style.transform = prev
      })
    }
    measure()
    const measureTimeout = setTimeout(measure, 800)
    on(window, 'load', measure)
    on(window, 'resize', measure)

    /* ---------- Custom cursor ---------- */
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

    /* ---------- rAF loop ---------- */
    let ringX = -100
    let ringY = -100
    let raf
    const loop = () => {
      if (destroyedRef.current) return
      cur += (window.scrollY - cur) * 0.09
      if (maxCur) cur = Math.min(cur, maxCur)
      if (scrollContainer) scrollContainer.style.transform = `translate3d(0,${(-cur).toFixed(2)}px,0)`
      const vh = window.innerHeight
      const isMobileViewport = window.innerWidth <= 700
      plxEls.forEach((el) => {
        if (el._plxBase == null) return
        const sp = parseFloat(el.getAttribute('data-plx') || '0') * intensity
        const y = (el._plxBase - cur - vh / 2) * -sp
        el.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`
      })
      if (isMobileViewport) {
        stackCards.forEach((el) => { el.style.transform = 'none' })
      } else if (stackCards.length && stackCards[0]._stackDocTop != null) {
        const slot = vh * (STACK_CARD_SLOT_VH / 100)
        const stackScrollable = Math.max(1, stackCards.length * slot - vh)
        const overallProgress = Math.min(1, Math.max(0, (cur - stackCards[0]._stackDocTop) / stackScrollable))
        stackCards.forEach((el, i) => {
          if (el._stackDocTop == null) return
          const pinStart = el._stackDocTop - STACK_PIN_TOP_PX
          const pinEnd = pinStart + slot * STACK_PIN_DURATION
          let extraY
          if (cur <= pinStart) extraY = 0
          else if (cur <= pinEnd) extraY = cur - pinStart
          else extraY = pinEnd - pinStart
          const rangeStart = i / stackCards.length
          const targetScale = 1 - (stackCards.length - i) * 0.05
          const localT = Math.min(1, Math.max(0, (overallProgress - rangeStart) / (1 - rangeStart)))
          const scale = 1 - (1 - targetScale) * localT
          el.style.transform = `translate3d(0,${extraY.toFixed(2)}px,0) scale(${scale.toFixed(4)})`
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
          <Fade>{t('common.drag')}</Fade>
        </span>
      </div>

      <div data-scroll-container="" style={{ position: 'fixed', top: 0, left: 0, width: '100%', willChange: 'transform' }}>
        <section id="top" data-screen-label="Work Hero" data-nav-theme="dark" style={{ position: 'relative', background: 'var(--color-forest-950)', overflow: 'hidden', padding: '18vh 6vw 8vh' }}>
          <div data-hero-reveal="" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 14, marginBottom: '4vh', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)' }}>
            <span style={{ width: 44, height: 1, background: 'var(--color-mint-300)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-mint-300)' }}><Fade>{t('workPage.hero.eyebrow')}</Fade></span>
            <span style={{ width: 44, height: 1, background: 'var(--color-mint-300)', display: 'inline-block' }} />
          </div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(44px,7vw,120px)', lineHeight: 0.98, letterSpacing: '-0.035em', color: '#ffffff' }}>
            <span style={{ display: 'block', overflow: 'hidden' }}><span data-hero-word="" style={{ display: 'block', transform: 'translateY(115%)', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }}><Fade>{t('workPage.hero.line1')}</Fade></span></span>
            <span style={{ display: 'block', overflow: 'hidden' }}>
              <span data-hero-word="" style={{ display: 'block', transform: 'translateY(115%)', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }}>
                <Fade>{t('workPage.hero.line2Pre')}</Fade><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-mint-300)' }}><Fade>{t('workPage.hero.emphasis')}</Fade></em>
              </span>
            </span>
          </h1>
        </section>

        <section id="selected" data-screen-label="Selected Work Stack" data-nav-theme="dark" style={{ position: 'relative', background: 'var(--color-forest-950)' }}>
          <div data-card-stack="" className="work-stack-container" style={{ position: 'relative', height: `${SELECTED.length * STACK_CARD_SLOT_VH}vh` }}>
            {SELECTED.map((item, i) => (
              <div
                key={item.key}
                data-stack-card=""
                className="work-stack-card"
                style={{
                  top: `${i * STACK_CARD_SLOT_VH}vh`,
                  zIndex: i + 1,
                  transformOrigin: 'top center',
                  background: 'rgba(242,251,244,0.85)',
                  backdropFilter: 'blur(18px) saturate(1.4)',
                  WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
                  boxShadow: 'inset 1.5px 1.5px 1px 0 rgba(255,255,255,0.55), inset -1px -1px 1px 0 rgba(255,255,255,0.28), inset 0 0 12px rgba(255,255,255,0.12)',
                  display: 'grid',
                  gap: 'clamp(24px,4vw,56px)',
                  padding: 'clamp(28px,3.4vw,48px)',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 46, height: 46, padding: '0 6px', borderRadius: 9999, border: '1px solid var(--color-earth-400)', fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--color-earth-500)', marginBottom: 'clamp(28px,4vw,52px)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--color-forest-500)', marginBottom: 14 }}>
                    <Fade>{item.year}</Fade> · <Fade>{item.tag}</Fade>
                  </div>
                  <h2 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px,3.2vw,42px)', letterSpacing: '-0.02em', color: 'var(--color-forest-900)' }}>
                    <Fade>{item.name}</Fade>
                  </h2>
                  <p style={{ margin: '0 0 clamp(24px,3.6vw,40px)', maxWidth: 380, fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.7, color: 'var(--color-neutral-600)' }}>
                    <Fade>{item.description}</Fade>
                  </p>
                  <a href={item.href || '#recent'} data-cursor={t('common.view')} className="work-hero-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 9999, borderWidth: 1, borderStyle: 'solid', padding: '13px 22px', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600 }}>
                    <Fade>{t('workPage.hero.stack.cta')}</Fade>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M8 7h9v9" /></svg>
                  </a>
                </div>
                <div className="work-stack-card-visual" style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', background: 'linear-gradient(160deg,var(--color-forest-900),var(--color-forest-700))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.cover ? (
                    <HomeWorkLeafyVisual
                      style={{ width: '100%', height: '100%', borderRadius: 20 }}
                      coverSrc={item.cover}
                      coverAlt={item.name}
                      revealSrc={item.hoverCover}
                    />
                  ) : (
                    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 21v-8" /><path d="M12 13c0-4-3-6.5-7.5-6.5 0 4.5 3 6.5 7.5 6.5z" /><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4.5-3 6.5-7.5 6.5z" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="recent" data-screen-label="Recent Work" data-nav-theme="light" style={{ position: 'relative', background: '#F2FBF4', padding: 'clamp(100px,14vw,200px) 6vw', overflow: 'hidden' }}>
          <div className="work-header-grid" style={{ display: 'grid', gap: 'clamp(32px,6vw,120px)', alignItems: 'end', marginBottom: 'clamp(56px,7vw,110px)' }}>
            <div>
              <span data-reveal="" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-forest-500)', opacity: 0, transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)', marginBottom: 28 }}>
                <span style={{ width: 44, height: 1, background: 'var(--color-forest-500)', display: 'inline-block' }} />
                <Fade>{t('workPage.recent.kicker')}</Fade>
              </span>
              <h2 data-reveal="" style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(40px,5.6vw,84px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--color-forest-900)', opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
                <Fade>{t('workPage.recent.heading')}</Fade> <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-forest-500)' }}><Fade>{t('workPage.recent.headingEmphasis')}</Fade></em>
              </h2>
            </div>
            <p data-reveal="" style={{ margin: '0 0 10px', maxWidth: 340, fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.7, color: 'var(--color-neutral-600)', opacity: 0, transform: 'translateY(24px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s' }}>
              <Fade>{t('workPage.recent.paragraph')}</Fade>
            </p>
          </div>
          <div className="work-recent-grid" style={{ display: 'grid', gap: 'clamp(24px,3vw,40px)' }}>
            {RECENT.map((item, i) => {
              const Tag = item.href ? 'a' : 'div'
              const linkProps = item.href ? { href: item.href } : {}
              return (
                <Tag
                  key={item.key}
                  {...linkProps}
                  data-reveal=""
                  data-cursor={t('common.view')}
                  style={{ display: 'block', color: 'inherit', textDecoration: 'none', opacity: 0, transform: 'translateY(48px)', transition: `opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s` }}
                >
                  <div className="grid-card-hover" style={{ overflow: 'hidden', borderRadius: 16, aspectRatio: '4/5', background: 'var(--color-mint-100)' }}>
                    {item.cover ? (
                      <img src={item.cover} alt={item.name} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ImageSlot placeholder="Drop project image" />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginTop: 16 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--color-forest-900)' }}><Fade>{item.name}</Fade></span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-forest-400)' }}>{item.year}</span>
                  </div>
                  <div style={{ marginTop: 4, fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-neutral-500)' }}><Fade>{item.tag}</Fade></div>
                </Tag>
              )
            })}
          </div>
        </section>

        <section id="archive" data-screen-label="Archive" data-nav-theme="dark" style={{ position: 'relative', background: 'var(--color-forest-950)', padding: 'clamp(100px,14vw,200px) 6vw', overflow: 'hidden' }}>
          <div className="work-header-grid" style={{ display: 'grid', gap: 'clamp(32px,6vw,120px)', alignItems: 'end', marginBottom: 'clamp(48px,6vw,90px)' }}>
            <div>
              <span data-reveal="" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-mint-300)', opacity: 0, transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)', marginBottom: 28 }}>
                <span style={{ width: 44, height: 1, background: 'var(--color-mint-300)', display: 'inline-block' }} />
                <Fade>{t('workPage.archive.kicker')}</Fade>
              </span>
              <h2 data-reveal="" style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(40px,5.6vw,84px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: '#ffffff', opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
                <Fade>{t('workPage.archive.heading')}</Fade> <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-mint-300)' }}><Fade>{t('workPage.archive.headingEmphasis')}</Fade></em>
              </h2>
            </div>
            <p data-reveal="" style={{ margin: '0 0 10px', maxWidth: 340, fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', opacity: 0, transform: 'translateY(24px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s' }}>
              <Fade>{t('workPage.archive.paragraph')}</Fade>
            </p>
          </div>
          <div data-reveal="" style={{ maxWidth: 980, opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }} />
            {ARCHIVE.map((item) => (
              <div key={item.key} data-cursor={t('common.view')} className="work-archive-row" style={{ position: 'relative', display: 'grid', alignItems: 'baseline', gap: 20, padding: '24px 12px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="work-archive-row-media" aria-hidden="true">
                  <ImageSlot placeholder="Drop project image" />
                </div>
                <span className="work-archive-year" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{item.year}</span>
                <span className="work-archive-name" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(20px,2.4vw,30px)', letterSpacing: '-0.01em' }}><Fade>{item.name}</Fade></span>
                <span className="work-archive-tag" style={{ fontFamily: 'var(--font-sans)', fontSize: 14, whiteSpace: 'nowrap' }}><Fade>{item.tag}</Fade></span>
                <svg className="work-archive-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M8 7h9v9" /></svg>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </div>
      <div data-scroll-spacer="" style={{ width: '100%', pointerEvents: 'none' }} />
    </div>
  )
}
