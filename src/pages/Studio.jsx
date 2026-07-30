import { useEffect, useRef } from 'react'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/LanguageContext'
import '../styles/studio.css'

const CUSTOM_CURSOR = true
const AUTO_DRIFT = true
const MOTION_INTENSITY = 1

function getGalleryItems(t) {
  return [
    { src: '/assets/studio/season/01-shore.png', alt: 'Tropical shore from a porch', caption: t('studioPage.gallery.items.shore'), n: '01', wide: false },
    { src: '/assets/studio/season/02-boats.png', alt: 'Longtail boats in a turquoise bay', caption: t('studioPage.gallery.items.boats'), n: '02', wide: false },
    { src: '/assets/studio/season/03-horses.png', alt: 'Horses grazing by the forest', caption: t('studioPage.gallery.items.horses'), n: '03', wide: false },
    { src: '/assets/studio/season/04-bay.png', alt: 'Cliff above a green bay', caption: t('studioPage.gallery.items.bay'), n: '04', wide: false },
    { src: '/assets/studio/season/05-street.png', alt: 'Street corner with a tall cactus', caption: t('studioPage.gallery.items.street'), n: '05', wide: false },
    { src: '/assets/studio/season/06-snow.png', alt: 'Snow village at blue hour', caption: t('studioPage.gallery.items.snow'), n: '06', wide: false },
    { src: '/assets/studio/season/07-cliffs.png', alt: 'Coastal cliffs meeting the sea', caption: t('studioPage.gallery.items.cliffs'), n: '07', wide: false },
    { src: '/assets/studio/season/08-cove.png', alt: 'Hidden cove with green water', caption: t('studioPage.gallery.items.cove'), n: '08', wide: false },
    { src: '/assets/studio/season/09-canopy.png', alt: 'Looking up through the canopy', caption: t('studioPage.gallery.items.canopy'), n: '09', wide: false },
  ]
}

function getTimeline(t) {
  return [
    { year: '2019', label: t('studioPage.story.timeline.seed.label'), text: t('studioPage.story.timeline.seed.text'), img: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=800&auto=format&fit=crop', alt: 'Bonsai', radius: '58% 42% 44% 56% / 55% 60% 40% 45%', dot: 'var(--color-forest-500)', yearColor: 'var(--color-forest-600)' },
    { year: '2021', label: t('studioPage.story.timeline.roots.label'), text: t('studioPage.story.timeline.roots.text'), img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop', alt: 'Forest path', radius: '42% 58% 56% 44% / 45% 40% 60% 55%', dot: 'var(--color-forest-500)', yearColor: 'var(--color-forest-600)' },
    { year: '2023', label: t('studioPage.story.timeline.branches.label'), text: t('studioPage.story.timeline.branches.text'), img: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=800&auto=format&fit=crop', alt: 'Light through leaves', radius: '55% 45% 40% 60% / 60% 55% 45% 40%', dot: 'var(--color-forest-500)', yearColor: 'var(--color-forest-600)' },
    { year: '2026', label: t('studioPage.story.timeline.blossom.label'), text: t('studioPage.story.timeline.blossom.text'), img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop', alt: 'Wildflowers in bloom', radius: '45% 55% 60% 40% / 40% 45% 55% 60%', dot: 'var(--color-earth-400)', yearColor: 'var(--color-earth-500)' },
  ]
}

function GalleryFigure({ item, ariaHide }) {
  return (
    <figure style={{ margin: 0, width: item.wide ? 'clamp(260px,30vw,480px)' : 'clamp(220px,22vw,360px)', flexShrink: 0, marginTop: item.wide ? 0 : 'clamp(24px,3vw,56px)' }}>
      <div style={{ aspectRatio: item.wide ? '4/3' : '3/4', borderRadius: 16, overflow: 'hidden', background: 'var(--color-mint-200)' }}>
        <img src={item.src} alt={ariaHide ? '' : item.alt} aria-hidden={ariaHide || undefined} draggable="false" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
      </div>
      <figcaption style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 12, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-neutral-500)' }}>
        <span><Fade>{item.caption}</Fade></span>
        <span style={{ color: 'var(--color-forest-400)' }}>{item.n}</span>
      </figcaption>
    </figure>
  )
}

export default function Studio() {
  const { t } = useLanguage()
  const GALLERY_ITEMS = getGalleryItems(t)
  const TIMELINE = getTimeline(t)
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
      vid.loop = true
      const tryPlay = () => {
        const p = vid.play()
        if (p && p.catch) p.catch(() => {})
      }
      tryPlay()
      on(vid, 'canplay', tryPlay)
      on(vid, 'ended', () => { vid.currentTime = 0; tryPlay() })
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
    const storyTrack = $('[data-story-track]')
    const growLine = $('[data-grow-line]')
    let storyTop = 0
    let storyH = 0
    const measure = () => {
      syncSpacerHeight()
      plxEls.forEach((el) => {
        const prev = el.style.transform
        el.style.transform = 'none'
        const r = el.getBoundingClientRect()
        el._plxBase = r.top + cur + r.height / 2
        el.style.transform = prev
      })
      if (storyTrack) {
        const r = storyTrack.getBoundingClientRect()
        storyTop = r.top + cur
        storyH = r.height
      }
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
    on(window, 'mousemove', (e) => {
      cursorX = e.clientX
      cursorY = e.clientY
      if (dot) dot.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 4}px)`
    })

    /* ---------- Gallery carousel: drag + auto drift, infinite ---------- */
    const carousel = $('[data-carousel]')
    const track = $('[data-carousel-track]')
    const firstSet = $('[data-carousel-set]')
    let carPos = 0
    let carTarget = 0
    let dragging = false
    let dragStartX = 0
    let dragStartTarget = 0
    let dragVel = 0
    let lastDragX = 0
    const drift = AUTO_DRIFT ? 0.45 : 0
    const setW = () => {
      const gap = parseFloat(getComputedStyle(track).gap) || 24
      return firstSet ? firstSet.getBoundingClientRect().width + gap : 1
    }
    if (carousel && track) {
      on(carousel, 'pointerdown', (e) => {
        dragging = true
        dragStartX = e.clientX
        lastDragX = e.clientX
        dragStartTarget = carTarget
        carousel.style.cursor = 'grabbing'
        carousel.setPointerCapture(e.pointerId)
      })
      on(carousel, 'pointermove', (e) => {
        if (!dragging) return
        dragVel = lastDragX - e.clientX
        lastDragX = e.clientX
        carTarget = dragStartTarget + (dragStartX - e.clientX)
      })
      const endDrag = () => {
        if (!dragging) return
        dragging = false
        carousel.style.cursor = 'grab'
        carTarget += dragVel * 14
        dragVel = 0
      }
      on(carousel, 'pointerup', endDrag)
      on(carousel, 'pointercancel', endDrag)
    }

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
      plxEls.forEach((el) => {
        if (el._plxBase == null) return
        const sp = parseFloat(el.getAttribute('data-plx') || '0') * intensity
        const y = (el._plxBase - cur - vh / 2) * -sp
        el.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`
      })
      if (growLine && storyH) {
        const p = Math.min(1, Math.max(0, (cur + vh * 0.7 - storyTop) / storyH))
        growLine.style.transform = `scaleY(${p.toFixed(3)})`
      }
      if (track) {
        if (!dragging) carTarget += drift
        carPos += (carTarget - carPos) * (dragging ? 0.35 : 0.06)
        const w = setW()
        let norm = carPos % w
        if (norm < 0) norm += w
        if (Math.abs(carPos) > w * 4) {
          carPos = norm
          carTarget = (carTarget % w) + (carTarget < 0 ? w : 0)
        }
        track.style.transform = `translate3d(${(-norm).toFixed(2)}px,0,0)`
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
        <section id="top" data-screen-label="Studio Hero" data-nav-theme="dark" style={{ position: 'relative', minHeight: '50vh', background: '#0a1a0f', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16vh 6vw 8vh' }}>
          <video
            data-plx="0.14"
            data-hero-video=""
            src="https://videos.pexels.com/video-files/32284929/13768555_1920_1080_60fps.mp4"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            poster="/assets/studio-hero-poster.jpg"
            style={{ position: 'absolute', left: 0, right: 0, top: '-14%', width: '100%', height: '128%', objectFit: 'cover', willChange: 'transform', filter: 'saturate(1.05) contrast(1.02) brightness(1.04)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(8,18,11,0.5) 0%,rgba(8,18,11,0.42) 55%,#0a1a0f 100%)' }} />
          <div style={{ position: 'relative', zIndex: 2, width: '100%', textAlign: 'left', padding: '0 6vw' }}>
            <div data-hero-reveal="" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 14, marginBottom: '4vh', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)' }}>
              <span style={{ width: 44, height: 1, background: 'var(--color-mint-300)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-mint-300)' }}><Fade>{t('studioPage.hero.eyebrow')}</Fade></span>
              <span style={{ width: 44, height: 1, background: 'var(--color-mint-300)', display: 'inline-block' }} />
            </div>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(44px,7vw,120px)', lineHeight: 0.98, letterSpacing: '-0.035em', color: '#ffffff' }}>
              <span style={{ display: 'block', overflow: 'hidden' }}><span data-hero-word="" style={{ display: 'block', transform: 'translateY(115%)', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }}><Fade>{t('studioPage.hero.line1')}</Fade></span></span>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span data-hero-word="" style={{ display: 'block', transform: 'translateY(115%)', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }}>
                  <Fade>{t('studioPage.hero.line2Pre')}</Fade><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-mint-300)' }}><Fade>{t('studioPage.hero.emphasis')}</Fade></em>
                </span>
              </span>
            </h1>
          </div>
        </section>

        <div data-screen-label="Studio Marquee" style={{ position: 'relative', zIndex: 3, background: 'var(--color-mint-200)', overflow: 'hidden', padding: '18px 0' }}>
          <div style={{ display: 'flex', width: 'max-content', animation: 'dvdMarquee 32s linear infinite' }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 36, paddingRight: 36, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.01em', color: 'var(--color-forest-800)', whiteSpace: 'nowrap' }}>
                <span><Fade>{t('studioPage.marquee.since')}</Fade></span><span style={{ color: 'var(--color-earth-500)' }}>✳</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300 }}><Fade>{t('studioPage.marquee.madeOfForest')}</Fade></span><span style={{ color: 'var(--color-earth-500)' }}>✳</span>
                <span><Fade>{t('studioPage.marquee.portugal')}</Fade></span><span style={{ color: 'var(--color-earth-500)' }}>✳</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300 }}><Fade>{t('studioPage.marquee.beauty')}</Fade></span><span style={{ color: 'var(--color-earth-500)' }}>✳</span>
              </div>
            ))}
          </div>
        </div>

        <section id="story" data-screen-label="Storyline" data-nav-theme="light" style={{ position: 'relative', background: '#F2FBF4', padding: 'clamp(100px,13vw,180px) 6vw', overflow: 'hidden' }}>
          <div className="story-header-grid" style={{ display: 'grid', gap: 'clamp(32px,6vw,120px)', alignItems: 'end', marginBottom: 'clamp(64px,8vw,120px)' }}>
            <div>
              <span data-reveal="" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-forest-500)', opacity: 0, transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)', marginBottom: 28 }}>
                <span style={{ width: 44, height: 1, background: 'var(--color-forest-500)', display: 'inline-block' }} />
                <Fade>{t('studioPage.story.kicker')}</Fade>
              </span>
              <h2 data-reveal="" style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(40px,5.6vw,84px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--color-forest-900)', opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
                <Fade>{t('studioPage.story.headingLine1')}</Fade><br /><Fade>{t('studioPage.story.headingLine2')}</Fade> <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-forest-500)' }}><Fade>{t('studioPage.story.headingEmphasis')}</Fade></em>
              </h2>
            </div>
            <p data-reveal="" style={{ margin: '0 0 10px', maxWidth: 420, fontFamily: 'var(--font-sans)', fontSize: 17, lineHeight: 1.7, color: 'var(--color-neutral-600)', opacity: 0, transform: 'translateY(24px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.12s' }}>
              <Fade>{t('studioPage.story.paragraph')}</Fade>
            </p>
          </div>

          <div data-story-track="" style={{ position: 'relative', maxWidth: 980, margin: '0 auto' }}>
            <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: 'rgba(53,114,72,0.14)' }} />
            <div data-grow-line="" style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: 'linear-gradient(to bottom,var(--color-forest-500),var(--color-forest-600))', transformOrigin: 'top', transform: 'scaleY(0)' }} />

            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                data-reveal=""
                style={{
                  position: 'relative', display: 'grid', gridTemplateColumns: '60px 1fr',
                  padding: i === TIMELINE.length - 1 ? '0' : '0 0 clamp(64px,8vw,110px)',
                  opacity: 0, transform: 'translateY(48px)',
                  transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: item.dot, boxShadow: `0 0 0 6px ${item.dot === 'var(--color-earth-400)' ? 'rgba(232,122,40,0.16)' : 'rgba(53,114,72,0.14)'}`, marginTop: 8 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'clamp(20px,3vw,48px)', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(40px,5vw,72px)', lineHeight: 1, color: item.yearColor }}>{item.year}</span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: item.dot === 'var(--color-earth-400)' ? 'var(--color-earth-500)' : 'var(--color-forest-400)' }}><Fade>{item.label}</Fade></span>
                    </div>
                    <p style={{ margin: 0, maxWidth: 420, fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.75, color: 'var(--color-neutral-600)' }}><Fade>{item.text}</Fade></p>
                  </div>
                  <div style={{ width: 'clamp(120px,16vw,220px)', aspectRatio: '4/5', borderRadius: item.radius, overflow: 'hidden' }}>
                    <img src={item.img} alt={item.alt} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="founder" data-screen-label="Founder Message" data-nav-theme="dark" style={{ position: 'relative', background: '#0a1a0f', padding: 'clamp(100px,14vw,190px) 6vw', overflow: 'hidden' }}>
          <img data-plx="0.08" src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2400&auto=format&fit=crop" alt="" aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: '-12%', width: '100%', height: '124%', objectFit: 'cover', opacity: 0.16, willChange: 'transform' }} />
          <div className="founder-grid" style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 'clamp(40px,6vw,100px)', alignItems: 'center', maxWidth: 1240, margin: '0 auto' }}>
            <div data-reveal="" className="founder-portrait-wrap" style={{ position: 'relative', opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
              <div style={{ aspectRatio: '4/5', borderRadius: '58% 42% 46% 54% / 52% 58% 42% 48%', overflow: 'hidden', background: '#12281a', animation: 'dvdBreathe 10s ease-in-out infinite' }}>
                <img
                  src="/assets/founder-portrait.jpg"
                  alt={`${t('studioPage.founder.name')}, founder of DAVDSM, portrait photo`}
                  width={800}
                  height={1067}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ position: 'absolute', bottom: -14, left: -18, background: 'var(--color-earth-400)', color: '#ffffff', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '9px 16px', borderRadius: 9999, animation: 'studioFloat 8s ease-in-out infinite' }}>
                <Fade>{t('studioPage.founder.badge')}</Fade>
              </div>
            </div>
            <div>
              <span data-reveal="" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-mint-300)', opacity: 0, transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)', marginBottom: 30 }}>
                <span style={{ width: 44, height: 1, background: 'var(--color-mint-300)', display: 'inline-block' }} />
                <Fade>{t('studioPage.founder.kicker')}</Fade>
              </span>
              <blockquote data-reveal="" style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(26px,3.2vw,46px)', lineHeight: 1.35, color: 'var(--color-mint-100)', opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
                “<Fade>{t('studioPage.founder.quotePre')}</Fade><b><Fade>{t('studioPage.founder.quoteBoldPre')}</Fade><span style={{ color: 'var(--color-mint-300)' }}><Fade>{t('studioPage.founder.quoteBoldSpan')}</Fade></span></b><Fade>{t('studioPage.founder.quoteEnd')}</Fade>”
              </blockquote>
              <div data-reveal="" style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 38, opacity: 0, transform: 'translateY(24px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>
                <span style={{ width: 44, height: 1, background: 'var(--color-earth-400)', display: 'inline-block' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#ffffff' }}><Fade>{t('studioPage.founder.name')}</Fade></span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}><Fade>{t('studioPage.founder.role')}</Fade></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="gallery" data-screen-label="Gallery Carousel" data-nav-theme="light" style={{ position: 'relative', background: '#F2FBF4', padding: 'clamp(100px,13vw,170px) 0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', padding: '0 6vw', marginBottom: 'clamp(48px,6vw,80px)' }}>
            <div>
              <span data-reveal="" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-forest-500)', opacity: 0, transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)', marginBottom: 24 }}>
                <span style={{ width: 44, height: 1, background: 'var(--color-forest-500)', display: 'inline-block' }} />
                <Fade>{t('studioPage.gallery.kicker')}</Fade>
              </span>
              <h2 data-reveal="" style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(40px,5.6vw,84px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--color-forest-900)', opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
                <Fade>{t('studioPage.gallery.heading')}</Fade> <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-forest-500)' }}><Fade>{t('studioPage.gallery.headingEmphasis')}</Fade></em>
              </h2>
            </div>
            <span data-reveal="" style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-neutral-500)', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10, opacity: 0, transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8L22 12L18 16" /><path d="M6 8L2 12L6 16" /><path d="M2 12H22" /></svg>
              <Fade>{t('studioPage.gallery.dragHint')}</Fade>
            </span>
          </div>

          <div data-carousel="" data-cursor={t('common.drag')} style={{ position: 'relative', overflow: 'hidden', cursor: 'grab', userSelect: 'none', WebkitUserSelect: 'none' }}>
            <div data-carousel-track="" style={{ display: 'flex', gap: 'clamp(16px,2vw,32px)', width: 'max-content', willChange: 'transform', padding: '4px 0' }}>
              <div style={{ display: 'flex', gap: 'clamp(16px,2vw,32px)' }} data-carousel-set="">
                {GALLERY_ITEMS.map((item) => (
                  <GalleryFigure key={`a-${item.n}`} item={item} ariaHide={false} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 'clamp(16px,2vw,32px)' }} data-carousel-set="">
                {GALLERY_ITEMS.map((item) => (
                  <GalleryFigure key={`b-${item.n}`} item={item} ariaHide />
                ))}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
      <div data-scroll-spacer="" style={{ width: '100%', pointerEvents: 'none' }} />
    </div>
  )
}
