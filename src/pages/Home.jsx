import { useEffect, useRef } from 'react'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import HomeWorkLeafyVisual from '../components/HomeWorkLeafyVisual'
import { useLanguage } from '../i18n/LanguageContext'
import { PROJECTS } from '../data/projects'
import '../styles/home.css'

const CUSTOM_CURSOR = true
const MOTION_INTENSITY = 1

const HOME_WORK_GRID = [
  { key: 'forezguima', slug: 'forezguima', gridColumn: '1/8', plx: '0.05', aspectRatio: '16/9' },
  { key: 'agraWines', slug: 'agraWines', gridColumn: '9/13', plx: '-0.08', aspectRatio: '4/5', marginTop: 'clamp(60px,10vw,160px)', revealDelay: '0.12s' },
  { key: 'singula', slug: 'singula', gridColumn: '2/6', plx: '0.07', aspectRatio: '4/5', marginTop: 'clamp(20px,4vw,60px)' },
]

const CLIENT_LOGOS = [
  { key: 'jfbrito', src: '/assets/clients/jfbrito.png', name: 'Junta de Freguesia de Brito', height: 60 },
  { key: 'nerlei', src: '/assets/clients/nerlei.svg', name: 'Nerlei', height: 26, invert: true },
  { key: 'pbs', src: '/assets/clients/pbs.svg', name: 'PBS', height: 42, invert: true },
  { key: 'phf', src: '/assets/clients/phf.png', name: 'PHF Concept', height: 32, invert: true },
  { key: 'seekers', src: '/assets/clients/seekers.png', name: 'Seekers', height: 32, invert: true },
]

const MAP_DOTS = [
  { key: 'portugal', x: 170, y: 220 },
  { key: 'spain', x: 215, y: 205 },
  { key: 'france', x: 270, y: 150 },
  { key: 'switzerland', x: 320, y: 130 },
  { key: 'netherlands', x: 300, y: 85 },
  { key: 'london', x: 230, y: 75 },
  { key: 'angola', x: 470, y: 420 },
]

export default function Home({ showIntro }) {
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

    const cleanups = []
    const on = (target, ev, fn, opts) => {
      target.addEventListener(ev, fn, opts)
      cleanups.push(() => target.removeEventListener(ev, fn, opts))
    }

    /* ---------- Hero background video ---------- */
    const vid = $('[data-hero-video]')
    if (vid) {
      vid.muted = true
      const tryPlay = () => {
        const p = vid.play()
        if (p && p.catch) p.catch(() => {})
      }
      tryPlay()
      on(vid, 'canplay', tryPlay)
    }

    /* ---------- Preloader ---------- */
    const pre = $('[data-preloader]')
    const countEl = $('[data-pre-count]')
    let iv
    let onPtReveal
    const finishIntro = () => {
      if (destroyedRef.current) return
      if (pre) {
        pre.style.transform = 'translateY(-101%)'
        setTimeout(() => {
          try {
            pre.remove()
          } catch {
            /* noop */
          }
        }, 1100)
      }
      $$('[data-hero-word]').forEach((el, i) => {
        el.style.transitionDelay = `${0.1 + i * 0.12}s`
        el.style.transform = 'translateY(0)'
      })
      $$('[data-hero-reveal]').forEach((el, i) => {
        el.style.transitionDelay = `${0.45 + i * 0.1}s`
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
    }
    if (showIntro && pre) {
      const logo = $('[data-pre-logo]')
      if (logo) requestAnimationFrame(() => { logo.style.opacity = '1'; logo.style.transform = 'none' })
      let n = 0
      iv = setInterval(() => {
        n = Math.min(100, n + 1 + Math.round(Math.random() * 5))
        if (countEl) countEl.textContent = String(n).padStart(3, '0')
        if (n >= 100) {
          clearInterval(iv)
          setTimeout(finishIntro, 300)
        }
      }, 26)
    } else {
      if (pre) pre.remove()
      if (window.__davdsmPTActive) {
        onPtReveal = () => setTimeout(finishIntro, 150)
        window.addEventListener('davdsm:pt-reveal', onPtReveal, { once: true })
      } else {
        finishIntro()
      }
    }

    /* ---------- Wind petals (hero) ---------- */
    const fcv = $('[data-petals]')
    let flyRaf
    if (fcv && fcv.getContext) {
      const fctx = fcv.getContext('2d')
      const hero = fcv.parentElement
      let fw = 1
      let fh = 1
      const fitFlies = () => {
        const r = hero.getBoundingClientRect()
        fw = fcv.width = Math.max(1, Math.round(r.width))
        fh = fcv.height = Math.max(1, Math.round(r.height))
      }
      fitFlies()
      on(window, 'resize', fitFlies)

      let mx = null
      let my = null
      on(hero, 'mousemove', (e) => {
        const r = hero.getBoundingClientRect()
        mx = e.clientX - r.left
        my = e.clientY - r.top
      })
      on(hero, 'mouseleave', () => { mx = null; my = null })

      const COLORS = ['#fdeef2', '#fff7d6', '#eafcf0', '#c3edd1']
      const flies = Array.from({ length: 48 }, (_, i) => ({
        x: Math.random() * fw,
        y: Math.random() * fh,
        vx: 0,
        vy: 0,
        r: 1.6 + Math.random() * 2.2,
        phase: Math.random() * Math.PI * 2,
        flick: 0.7 + Math.random() * 1.6,
        drift: 0.12 + Math.random() * 0.22,
        color: COLORS[i % COLORS.length],
      }))

      let t = 0
      const tick = () => {
        if (destroyedRef.current) return
        t += 0.016
        fctx.clearRect(0, 0, fw, fh)
        for (const f of flies) {
          f.vx += 0.006 * f.drift * 10 + Math.cos(t * f.flick * 0.6 + f.phase) * 0.012 * f.drift * 10
          f.vy += 0.003 * f.drift * 10 + Math.sin(t * f.flick * 0.5 + f.phase * 1.7) * 0.01 * f.drift * 10
          if (mx !== null) {
            const dx = f.x - mx
            const dy = f.y - my
            const d = Math.sqrt(dx * dx + dy * dy) || 1
            if (d < 160) {
              const force = ((160 - d) / 160) * 1.4
              f.vx += (dx / d) * force
              f.vy += (dy / d) * force
            }
          }
          f.vx *= 0.94
          f.vy *= 0.94
          f.x += f.vx
          f.y += f.vy
          if (f.x < -20) f.x = fw + 20
          if (f.x > fw + 20) f.x = -20
          if (f.y < -20) f.y = fh + 20
          if (f.y > fh + 20) f.y = -20
          const a = 0.35 + 0.5 * (0.5 + 0.5 * Math.sin(t * f.flick + f.phase))
          const glow = f.r * 7
          const g = fctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glow)
          g.addColorStop(0, f.color)
          g.addColorStop(0.25, `${f.color}55`)
          g.addColorStop(1, `${f.color}00`)
          fctx.globalAlpha = a * 0.55
          fctx.fillStyle = g
          fctx.beginPath()
          fctx.arc(f.x, f.y, glow, 0, Math.PI * 2)
          fctx.fill()
          fctx.globalAlpha = a
          fctx.fillStyle = f.color
          fctx.beginPath()
          fctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
          fctx.fill()
        }
        fctx.globalAlpha = 1
        flyRaf = requestAnimationFrame(tick)
      }
      flyRaf = requestAnimationFrame(tick)
    }

    /* ---------- Smooth in-page anchor scrolling ---------- */
    const onAnchorClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href').slice(1)
      const target = id ? document.getElementById(id) : document.body
      if (!target && id) return
      e.preventDefault()
      const top = id ? target.getBoundingClientRect().top + window.scrollY : 0
      window.scrollTo({ top, behavior: 'smooth' })
    }
    on(document, 'click', onAnchorClick)

    /* ---------- Adaptive nav (logo + link color per section) ---------- */
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
    on(window, 'scroll', updateNavTheme, { passive: true })

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

    /* ---------- Locomotive-style virtual scroll ---------- */
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

    /* ---------- Smoothed parallax (locomotive-style lerp) ---------- */
    const plxEls = $$('[data-plx]')
    const mapWrap = $('[data-map-wrap]')
    const mapPath = $('[data-map-path]')
    const mapDots = $$('[data-map-dot]')
    let mapTop = 0
    let mapHeight = 0
    let mapPathLength = 0
    const measure = () => {
      syncSpacerHeight()
      plxEls.forEach((el) => {
        const prev = el.style.transform
        el.style.transform = 'none'
        const r = el.getBoundingClientRect()
        el._plxBase = r.top + cur + r.height / 2
        el.style.transform = prev
      })
      if (mapWrap) {
        const r = mapWrap.getBoundingClientRect()
        mapTop = r.top + cur
        mapHeight = r.height
      }
      if (mapPath && !mapPathLength) {
        mapPathLength = mapPath.getTotalLength()
        mapPath.style.strokeDasharray = `${mapPathLength}`
      }
    }
    measure()
    const measureTimeout = setTimeout(measure, 800)
    on(window, 'load', measure)
    on(window, 'resize', measure)

    let mx = 0
    let my = 0
    let smx = 0
    let smy = 0
    let cursorX = -100
    let cursorY = -100
    const mouseEls = $$('[data-mouse]')
    const dot = $('[data-cursor-dot]')
    const ring = $('[data-cursor-ring]')
    const ringText = $('[data-cursor-text]')

    const onMouseMove = (e) => {
      mx = e.clientX / window.innerWidth - 0.5
      my = e.clientY / window.innerHeight - 0.5
      cursorX = e.clientX
      cursorY = e.clientY
      if (dot) dot.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 4}px)`
    }
    on(window, 'mousemove', onMouseMove)

    /* ---------- Custom cursor ---------- */
    let cursorStyle
    const useCursor = CUSTOM_CURSOR && fine
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
          const t = label.getAttribute('data-cursor')
          if (ringText) { ringText.textContent = t; ringText.style.opacity = '1' }
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

    /* ---------- rAF loop ---------- */
    let ringX = -100
    let ringY = -100
    let raf
    const loop = () => {
      if (destroyedRef.current) return
      cur += (window.scrollY - cur) * 0.09
      if (maxCur) cur = Math.min(cur, maxCur)
      smx += (mx - smx) * 0.07
      smy += (my - smy) * 0.07
      if (scrollContainer) scrollContainer.style.transform = `translate3d(0,${(-cur).toFixed(2)}px,0)`
      const vh = window.innerHeight
      const isMobileViewport = window.innerWidth <= 860
      plxEls.forEach((el) => {
        if (el._plxBase == null) return
        if (isMobileViewport && el.closest('.craft-steps-grid')) {
          el.style.transform = 'none'
          return
        }
        const sp = parseFloat(el.getAttribute('data-plx') || '0') * intensity
        const y = (el._plxBase - cur - vh / 2) * -sp
        const isImg = el.tagName === 'IMG'
        el.style.transform = `translate3d(0,${y.toFixed(2)}px,0)${isImg && el.closest('[data-mouse]') ? ' scale(1.22)' : ''}`
      })
      mouseEls.forEach((el) => {
        const d = parseFloat(el.getAttribute('data-mouse') || '0') * intensity
        el.style.transform = `translate3d(${(smx * d).toFixed(2)}px,${(smy * d).toFixed(2)}px,0)`
      })
      if (mapPath && mapPathLength) {
        // Start drawing a bit before the map is fully in view (not while it's still well off-screen below),
        // and finish just as it's about to scroll out at the top.
        const earlyStart = vh * 0.7
        const span = Math.max(80, vh - mapHeight + earlyStart)
        const progress = Math.min(1, Math.max(0, (cur - (mapTop + mapHeight - vh - earlyStart)) / span))
        mapPath.style.strokeDashoffset = `${mapPathLength * (1 - progress)}`
        mapDots.forEach((g) => {
          const idx = parseInt(g.getAttribute('data-dot-index') || '0', 10)
          const threshold = (idx / Math.max(1, mapDots.length - 1)) * 0.9
          const active = progress >= threshold
          const circle = g.querySelector('[data-map-dot-circle]')
          const label = g.querySelector('[data-map-dot-label]')
          if (circle) {
            circle.setAttribute('fill', active ? 'var(--color-earth-400)' : 'var(--color-forest-300)')
            circle.setAttribute('opacity', active ? '1' : '0.4')
          }
          if (label) label.setAttribute('opacity', active ? '1' : '0')
        })
      }
      if (useCursor && ring) {
        ringX += (cursorX - ringX) * 0.16
        ringY += (cursorY - ringY) * 0.16
        ring.style.transform = `translate(${ringX.toFixed(1)}px,${ringY.toFixed(1)}px)`
        ring.style.top = '0'; ring.style.left = '0'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      destroyedRef.current = true
      if (onPtReveal) window.removeEventListener('davdsm:pt-reveal', onPtReveal)
      if (flyRaf) cancelAnimationFrame(flyRaf)
      if (raf) cancelAnimationFrame(raf)
      if (iv) clearInterval(iv)
      clearTimeout(measureTimeout)
      io.disconnect()
      if (cursorStyle) cursorStyle.remove()
      cleanups.forEach((fn) => fn())
    }
  }, [showIntro])

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
          <Fade>{t('common.view')}</Fade>
        </span>
      </div>

      <div
        data-preloader=""
        style={{
          position: 'fixed', inset: 0, zIndex: 200, background: 'var(--color-forest-950)', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24,
          transition: 'transform 1s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <img data-pre-logo="" src="/assets/logo-mint.svg" alt="DAVDSM" style={{ height: 36, width: 'auto', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)' }} />
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, color: 'rgba(195,237,209,0.7)' }}><Fade>{t('common.madeOfForest')}</Fade></div>
        <div data-pre-count="" style={{ position: 'absolute', right: '6vw', bottom: '6vh', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(64px,10vw,140px)', lineHeight: 1, color: 'var(--color-forest-700)', fontVariantNumeric: 'tabular-nums' }}>
          000
        </div>
      </div>

      <div data-scroll-container="" style={{ position: 'fixed', top: 0, left: 0, width: '100%', willChange: 'transform' }}>
        <section id="top" data-screen-label="Hero" data-nav-theme="dark" style={{ position: 'relative', minHeight: '100vh', background: 'var(--color-forest-900)', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '20vh 6vw 14vh' }}>
          <video
            data-hero-video=""
            data-plx="0.14"
            src="https://videos.pexels.com/video-files/36671169/15545936_2560_1440_60fps.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/hero-home-poster.jpg"
            style={{ position: 'absolute', left: 0, right: 0, top: '-12%', width: '100%', height: '124%', objectFit: 'cover', willChange: 'transform', filter: 'saturate(1.06) contrast(1.03) brightness(1.05)' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(6,14,9,0.58) 0%, rgba(6,14,9,0.3) 28%, rgba(6,14,9,0.36) 64%, rgba(6,14,9,0.62) 100%)',
            }}
          />
          <canvas data-petals="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }} />

          <div data-mouse="18" style={{ position: 'absolute', right: '5vw', top: '16vh', width: 'min(36vw,480px)', zIndex: 1, animation: 'homeFloat 9s ease-in-out infinite', display: 'none' }}>
            <div style={{ overflow: 'hidden', borderRadius: '60% 40% 40% 60% / 60% 60% 40% 40%', aspectRatio: '4/5' }}>
              <img data-plx="0.1" src="https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=1200&auto=format&fit=crop" alt="Bonsai" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.22)', willChange: 'transform' }} />
            </div>
            <div data-hero-reveal="" style={{ position: 'absolute', bottom: -18, left: -24, background: 'var(--color-earth-400)', color: '#ffffff', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '10px 18px', borderRadius: 9999, transform: 'rotate(-6deg)', opacity: 0, transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)' }}>
              Since the roots
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
            <div data-hero-reveal="" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '4vh', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)' }}>
              <span style={{ width: 44, height: 1, background: 'var(--color-mint-300)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-mint-300)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <svg className="hero-eyebrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 21v-8" /><path d="M12 13c0-4-3-6.5-7.5-6.5 0 4.5 3 6.5 7.5 6.5z" /><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4.5-3 6.5-7.5 6.5z" />
                </svg>
                <Fade>{t('home.hero.eyebrow')}</Fade>
              </span>
            </div>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(48px,7vw,104px)', lineHeight: 0.98, letterSpacing: '-0.03em', color: '#ffffff', textAlign: 'left' }}>
              <span style={{ display: 'block', overflow: 'hidden' }}><span data-hero-word="" style={{ display: 'block', transform: 'translateY(115%)', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }}><Fade>{t('home.hero.line1')}</Fade></span></span>
              <span style={{ display: 'block', overflow: 'hidden' }}><span data-hero-word="" style={{ display: 'block', transform: 'translateY(115%)', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }}><Fade>{t('home.hero.line2')}</Fade></span></span>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span data-hero-word="" style={{ display: 'block', transform: 'translateY(115%)', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }}>
                  <em style={{ fontFamily: 'var(--font-display)', fontStyle: 'normal', fontWeight: 800, color: 'var(--color-forest-500)', display: 'inline-block', WebkitMaskImage: 'linear-gradient(to bottom,#000 35%,transparent 100%)', maskImage: 'linear-gradient(to bottom,#000 35%,transparent 100%)' }}><Fade>{t('home.hero.emphasis')}</Fade></em>
                </span>
              </span>
            </h1>
            <div data-hero-reveal="" style={{ display: 'flex', marginTop: '5vh', opacity: 0, transform: 'translateY(24px)', transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)' }}>
              <a href="#studio" className="hero-cta-btn" style={{ position: 'relative', isolation: 'isolate', overflow: 'hidden', display: 'inline-flex', alignItems: 'center', gap: 16, fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 600, color: '#ffffff', background: 'rgba(255,255,255,0.001)', WebkitBackdropFilter: 'blur(3px) saturate(1.6)', backdropFilter: 'blur(3px) saturate(1.6)', boxShadow: 'inset 1.5px 1.5px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 0 rgba(255,255,255,0.22)', borderRadius: 9999 }}>
                <Fade>{t('home.hero.cta')}</Fade>{' '}
                <span className="hero-cta-icon-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9999, background: 'var(--color-forest-900)', color: 'var(--color-mint-200)' }}>
                  <svg className="hero-cta-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22v-4" /><path d="M12 2 6.5 10h3L5 18h14l-4.5-8h3z" />
                  </svg>
                </span>
              </a>
            </div>
            <div data-hero-reveal="" style={{ marginTop: '6vh', opacity: 0, transform: 'translateY(24px)', transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)' }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}><Fade>{t('home.hero.trustedBy')}</Fade></span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(24px,3vw,40px)', flexWrap: 'wrap' }}>
                {CLIENT_LOGOS.map((c) => (
                  <img key={c.key} src={c.src} alt={c.name} className="hero-client-logo" style={{ '--logo-h': `${c.height}px`, width: 'auto', display: 'block', filter: c.invert ? 'brightness(0) invert(1)' : 'none' }} />
                ))}
              </div>
            </div>
          </div>

          <div data-hero-reveal="" style={{ position: 'absolute', right: '6vw', bottom: '5vh', display: 'flex', alignItems: 'center', gap: 12, opacity: 0, transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1)' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', writingMode: 'vertical-rl' }}><Fade>{t('home.hero.scroll')}</Fade></span>
            <span style={{ width: 1, height: 56, background: 'linear-gradient(to bottom,rgba(255,255,255,0.6),rgba(255,255,255,0))', display: 'inline-block' }} />
          </div>
        </section>

        <div data-screen-label="Marquee" style={{ position: 'relative', zIndex: 3, background: 'var(--color-mint-200)', transform: 'rotate(-1.6deg) scale(1.03)', margin: '-34px 0', overflow: 'hidden', padding: '20px 0', display: 'none' }}>
          <div style={{ display: 'flex', gap: 0, width: 'max-content', animation: 'dvdMarquee 30s linear infinite' }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 36, paddingRight: 36, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.01em', color: 'var(--color-forest-800)', whiteSpace: 'nowrap' }}>
                <span>design</span><span style={{ color: 'var(--color-earth-500)' }}>✳</span>
                <span>code</span><span style={{ color: 'var(--color-earth-500)' }}>✳</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300 }}>patience</span><span style={{ color: 'var(--color-earth-500)' }}>✳</span>
                <span>roots</span><span style={{ color: 'var(--color-earth-500)' }}>✳</span>
                <span>seasons</span><span style={{ color: 'var(--color-earth-500)' }}>✳</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300 }}>slow growth</span><span style={{ color: 'var(--color-earth-500)' }}>✳</span>
              </div>
            ))}
          </div>
        </div>

        <section id="studio" data-screen-label="Studio" data-nav-theme="light" style={{ position: 'relative', padding: 'clamp(120px,16vw,200px) 3vw clamp(80px,8vw,120px)', overflow: 'hidden', backgroundColor: '#F2FBF4' }}>
          <div className="studio-header-grid" style={{ display: 'grid', gap: 'clamp(32px,6vw,120px)', alignItems: 'end', padding: '0 3vw', marginBottom: 'clamp(56px,7vw,110px)' }}>
            <div>
              <span data-reveal="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-forest-500)', opacity: 0, transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)', marginBottom: 28 }}>
                <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M223.45,40.07a8,8,0,0,0-7.52-7.52C139.8,28.08,78.82,51,52.82,94a87.09,87.09,0,0,0-12.76,49c.57,15.92,5.21,32,13.79,47.85l-19.51,19.5a8,8,0,0,0,11.32,11.32l19.5-19.51C81,210.73,97.09,215.37,113,215.94q1.67.06,3.33.06A86.93,86.93,0,0,0,162,203.18C205,177.18,227.93,116.21,223.45,40.07ZM153.75,189.5c-22.75,13.78-49.68,14-76.71.77l88.63-88.62a8,8,0,0,0-11.32-11.32L65.73,179c-13.19-27-13-54,.77-76.71,22.09-36.47,74.6-56.44,141.31-54.06C210.2,114.89,190.22,167.41,153.75,189.5Z" /></svg>
                <Fade>{t('home.studio.kicker')}</Fade>
              </span>
              <h2 data-reveal="" style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(40px,5.6vw,84px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--color-forest-900)', opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
                <Fade>{t('home.studio.headingLine1')}</Fade><br /><Fade>{t('home.studio.headingLine2')}</Fade> <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-forest-500)' }}><Fade>{t('home.studio.headingEmphasis')}</Fade></em>
              </h2>
            </div>
            <p data-reveal="" style={{ margin: '0 0 10px', maxWidth: 420, fontFamily: 'var(--font-sans)', fontSize: 17, lineHeight: 1.7, color: 'var(--color-neutral-600)', opacity: 0, transform: 'translateY(24px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s' }}>
              <Fade>{t('home.studio.paragraph')}</Fade>
            </p>
          </div>
          <div data-reveal="" style={{ opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
            <div data-map-wrap="" style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
              <svg viewBox="0 0 800 520" style={{ width: '100%', height: 'auto', display: 'block' }}>
                <path d="M170,30 C280,10 380,40 400,110 C420,170 380,230 320,255 C260,275 190,260 150,220 C110,180 100,120 130,80 C145,55 150,40 170,30 Z" fill="rgba(53,114,72,0.09)" />
                <path d="M430,260 C500,240 580,260 610,320 C640,380 620,450 570,490 C520,520 450,505 420,460 C395,420 390,370 400,320 C405,295 415,275 430,260 Z" fill="rgba(53,114,72,0.09)" />
                <path
                  data-map-path=""
                  d="M170,220 C195,215 200,210 215,205 C240,195 250,175 270,150 C290,145 305,140 320,130 C325,110 315,95 300,85 C280,80 250,78 230,75 C300,150 400,300 470,420"
                  fill="none"
                  stroke="var(--color-forest-500)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {MAP_DOTS.map((d, i) => (
                  <g key={d.key} data-map-dot="" data-dot-index={i}>
                    <circle data-map-dot-circle="" cx={d.x} cy={d.y} r={6} fill="var(--color-forest-300)" opacity={0.4} style={{ transition: 'fill 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
                    <text data-map-dot-label="" x={d.x + 12} y={d.y + 4} style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1)' }} fill="var(--color-forest-700)" opacity={0}>
                      {t(`home.studio.map.${d.key}`)}
                    </text>
                  </g>
                ))}
              </svg>
              <p style={{ margin: '8px 0 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-neutral-500)' }}>
                <Fade>{t('home.studio.map.caption')}</Fade>
              </p>
            </div>
          </div>
        </section>

        <section id="work" data-screen-label="Work" data-nav-theme="dark" style={{ position: 'relative', padding: 'clamp(100px,14vw,200px) 6vw', overflow: 'hidden', background: 'var(--color-forest-950)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 'clamp(48px,7vw,110px)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap' }}>
              <h2 data-reveal="" style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(48px,8vw,120px)', letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--color-forest-50)', opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
                <Fade>{t('home.work.heading')}</Fade> <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-earth-400)' }}><Fade>{t('home.work.headingEmphasis')}</Fade></em>
              </h2>
              <span data-reveal="" style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--color-neutral-500)', opacity: 0, transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s' }}><Fade>{t('home.work.range')}</Fade></span>
            </div>
            <a
              href="#/work"
              data-reveal=""
              className="footer-link"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.72)', opacity: 0, transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s, color 0.25s, transform 0.25s' }}
            >
              <Fade>{t('home.work.seeAll')}</Fade>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M8 7h9v9" /></svg>
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 'clamp(20px,3vw,44px)' }}>
            {HOME_WORK_GRID.map((item) => {
              const project = item.slug ? PROJECTS[item.slug] : null
              const name = t(`home.work.projects.${item.key}.name`)
              const revealDelay = item.revealDelay || '0s'
              const cardStyle = {
                display: 'block',
                color: 'inherit',
                textDecoration: 'none',
                gridColumn: item.gridColumn,
                marginTop: item.marginTop,
                opacity: 0,
                transform: 'translateY(56px)',
                transition: `opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${revealDelay}, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${revealDelay}`,
              }
              const inner = (
                <>
                  <HomeWorkLeafyVisual
                    aspectRatio={item.aspectRatio}
                    coverSrc={project?.cover}
                    coverAlt={name}
                    revealSrc={project?.hoverCover || project?.gallery?.[project.gallery.length - 1]}
                  />
                  <div className="home-work-card-meta" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginTop: 18 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--color-forest-50)' }}><Fade>{t(`home.work.projects.${item.key}.name`)}</Fade></span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-neutral-500)' }}><Fade>{t(`home.work.projects.${item.key}.tag`)}</Fade></span>
                  </div>
                </>
              )
              if (item.slug) {
                return (
                  <a
                    key={item.key}
                    href={`#/work/${item.slug}`}
                    data-reveal=""
                    data-cursor={t('common.view')}
                    data-plx={item.plx}
                    style={cardStyle}
                  >
                    {inner}
                  </a>
                )
              }
              return (
                <div key={item.key} data-reveal="" data-cursor={t('common.view')} data-plx={item.plx} style={cardStyle}>
                  {inner}
                </div>
              )
            })}
          </div>
        </section>

        <section id="craft" data-screen-label="Craft" data-nav-theme="light" style={{ position: 'relative', background: '#F2FBF4', padding: 'clamp(100px,14vw,200px) 6vw', overflow: 'hidden' }}>
          <img data-plx="0.12" src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2400&auto=format&fit=crop" alt="Foggy hills" style={{ position: 'absolute', left: 0, right: 0, top: '-12%', width: 1196, height: 1381, objectFit: 'cover', willChange: 'transform', display: 'none' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20, marginBottom: 'clamp(48px,7vw,100px)', position: 'relative', zIndex: 1 }}>
            <span data-reveal="" style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#357248', opacity: 0, transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21v-8" /><path d="M12 13c0-4-3-6.5-7.5-6.5 0 4.5 3 6.5 7.5 6.5z" /><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4.5-3 6.5-7.5 6.5z" /></svg>
              <Fade>{t('home.craft.kicker')}</Fade>
            </span>
            <h2 data-reveal="" style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(40px,6vw,88px)', letterSpacing: '-0.03em', lineHeight: 1.02, color: '#122219', opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
              <Fade>{t('home.craft.heading')}</Fade> <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: '#357248' }}><Fade>{t('home.craft.headingEmphasis')}</Fade></em>
            </h2>
          </div>
          <div className="craft-steps-grid" style={{ display: 'grid', gap: 'clamp(24px,3vw,44px)', alignItems: 'start', position: 'relative', zIndex: 1 }}>
            <div className="craft-step" data-reveal="" data-plx="0.04" style={{ borderTop: '1px solid rgba(195,237,209,0.25)', paddingTop: 26, opacity: 0, transform: 'translateY(48px)', transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(48px,5vw,80px)', lineHeight: 1, color: 'var(--color-forest-600)' }}>01</div>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest-500)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3c4.2 3.8 6.3 7.4 6.3 10.7a6.3 6.3 0 0 1-12.6 0C5.7 10.4 7.8 6.8 12 3z" /><path d="M12 10v6" /></svg>
              </div>
              <h3 style={{ margin: '18px 0 10px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: '#122219' }}><Fade>{t('home.craft.steps.seed.title')}</Fade></h3>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.65, color: '#76766B' }}><Fade>{t('home.craft.steps.seed.text')}</Fade></p>
            </div>
            <div className="craft-step craft-step-offset" data-reveal="" data-plx="-0.06" style={{ borderTop: '1px solid rgba(195,237,209,0.25)', paddingTop: 26, opacity: 0, transform: 'translateY(48px)', transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(48px,5vw,80px)', lineHeight: 1, color: 'var(--color-forest-600)' }}>02</div>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest-500)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21v-8" /><path d="M12 13c0-4-3-6.5-7.5-6.5 0 4.5 3 6.5 7.5 6.5z" /><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4.5-3 6.5-7.5 6.5z" /></svg>
              </div>
              <h3 style={{ margin: '18px 0 10px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: '#122219' }}><Fade>{t('home.craft.steps.root.title')}</Fade></h3>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.65, color: '#76766B' }}><Fade>{t('home.craft.steps.root.text')}</Fade></p>
            </div>
            <div className="craft-step" data-reveal="" data-plx="0.05" style={{ borderTop: '1px solid rgba(195,237,209,0.25)', paddingTop: 26, opacity: 0, transform: 'translateY(48px)', transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(48px,5vw,80px)', lineHeight: 1, color: 'var(--color-forest-600)' }}>03</div>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest-500)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5.5" /><path d="M12 14.5V22" /><path d="M12 18l3-2.5" /><path d="M12 19.5l-3-2.5" /></svg>
              </div>
              <h3 style={{ margin: '18px 0 10px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: '#122219' }}><Fade>{t('home.craft.steps.grow.title')}</Fade></h3>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.65, color: '#76766B' }}><Fade>{t('home.craft.steps.grow.text')}</Fade></p>
            </div>
            <div className="craft-step craft-step-offset" data-reveal="" data-plx="-0.04" style={{ borderTop: '1px solid rgba(195,237,209,0.25)', paddingTop: 26, opacity: 0, transform: 'translateY(48px)', transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.3s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(48px,5vw,80px)', lineHeight: 1, color: 'var(--color-forest-600)' }}>04</div>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest-500)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="2.4" /><path d="M12 9.6c-1.8-2.2-1.8-5.4 0-7.6 1.8 2.2 1.8 5.4 0 7.6z" /><path d="M12 14.4c1.8 2.2 1.8 5.4 0 7.6-1.8-2.2-1.8-5.4 0-7.6z" /><path d="M9.6 12c-2.2-1.8-5.4-1.8-7.6 0 2.2 1.8 5.4 1.8 7.6 0z" /><path d="M14.4 12c2.2-1.8 5.4-1.8 7.6 0-2.2 1.8-5.4 1.8-7.6 0z" /></svg>
              </div>
              <h3 style={{ margin: '18px 0 10px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: '#122219' }}><Fade>{t('home.craft.steps.blossom.title')}</Fade></h3>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.65, color: '#76766B' }}><Fade>{t('home.craft.steps.blossom.text')}</Fade></p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
      <div data-scroll-spacer="" style={{ width: 1, pointerEvents: 'none' }} />
    </div>
  )
}
