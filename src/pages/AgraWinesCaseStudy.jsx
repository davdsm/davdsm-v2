import { useEffect, useRef, useState } from 'react'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/LanguageContext'
import { PROJECTS } from '../data/projects'
import '../styles/agra-wines-case-study.css'

const ASSETS = '/assets/work/agra-wines'

const SWATCHES = [
  { name: 'Wine 900', hex: '#1A0509' },
  { name: 'Wine 800', hex: '#2A0810' },
  { name: 'Wine 600', hex: '#5C0F20' },
  { name: 'Wine 500', hex: '#7B1228' },
  { name: 'Gold', hex: '#D8B25E' },
  { name: 'Gold soft', hex: '#E8D49A' },
  { name: 'Cream', hex: '#F3E6C4' },
  { name: 'Muted', hex: '#C9A98F' },
]

const WINES = [
  { key: 'vinhao', name: 'Agra Vinhão', price: 5.7, cap: '#7b1228', body: '#3a0a16', stroke: '#5c0f20' },
  { key: 'alvarinho', name: 'Agra Alvarinho', price: 13.4, cap: '#22472e', body: '#caa24a', stroke: '#8a6f28' },
  { key: 'loureiro', name: 'Agra Loureiro', price: 4.7, cap: '#8a6f28', body: '#caa24a', stroke: '#8a6f28' },
]

const fmtEuro = (n) => `€${n.toFixed(2).replace('.', ',')}`

function BottleIcon({ cap, body, stroke }) {
  return (
    <svg className="agw-order-bottle" width="26" height="42" viewBox="0 0 26 42" aria-hidden="true">
      <rect x="9" y="1" width="8" height="9" rx="2" fill={cap} />
      <path d="M6 12c0-1 1.5-2 3-2h8c1.5 0 3 1 3 2v26c0 2-1.5 3-3 3H9c-1.5 0-3-1-3-3V12Z" fill={body} stroke={stroke} />
      <rect x="9" y="20" width="8" height="12" rx="1" fill="#f3e6c4" />
    </svg>
  )
}

function DropIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4C11 10 8.5 14 8.5 20a7.5 7.5 0 0 0 15 0c0-6-2.5-10-7.5-16Z" fill="#d8b25e" />
    </svg>
  )
}

function MacBook({ variant = 'mbp', children }) {
  return (
    <div className={`agw-mbp${variant === 'mba' ? ' agw-mbp--mba' : ''}`}>
      <div className="agw-mbp-lid">
        <div className="agw-mbp-screen">
          <div className="agw-mbp-notch">
            <span className="agw-mbp-camera" />
          </div>
          {children}
        </div>
      </div>
      <div className="agw-mbp-base">
        <div className="agw-mbp-hinge" />
      </div>
    </div>
  )
}

function PhoneStatusBar() {
  return (
    <div className="agw-phone-status">
      <span className="agw-phone-time">9:41</span>
      <span className="agw-phone-icons">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="#f3e6c4" aria-hidden="true">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="20" height="10" rx="2.5" stroke="#f3e6c4" opacity="0.5" />
          <rect x="3" y="3" width="15" height="6" rx="1" fill="#f3e6c4" />
          <rect x="22.5" y="4" width="1.5" height="4" rx="0.75" fill="#f3e6c4" opacity="0.5" />
        </svg>
      </span>
    </div>
  )
}

function IPhone({ src, alt }) {
  return (
    <div>
      <div className="agw-phone">
        <div className="agw-phone-island" />
        <div className="agw-phone-screen">
          <PhoneStatusBar />
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  )
}

function Kicker({ center = false, children }) {
  return (
    <div className={`agw-kicker${center ? ' agw-kicker--center' : ''}`}>
      <span className="agw-kicker-line" />
      <span className="agw-kicker-text"><Fade>{children}</Fade></span>
      {center && <span className="agw-kicker-line" />}
    </div>
  )
}

export default function AgraWinesCaseStudy() {
  const { t } = useLanguage()
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const destroyedRef = useRef(false)
  const [qty, setQty] = useState({ vinhao: 0, alvarinho: 0, loureiro: 0 })
  const base = 'projectDetail.agraWines.caseStudy'
  const project = PROJECTS.agraWines

  const step = (key, delta) => {
    setQty((q) => ({ ...q, [key]: Math.max(0, q[key] + delta) }))
  }
  const total = WINES.reduce((sum, w) => sum + qty[w.key] * w.price, 0)
  const count = WINES.reduce((sum, w) => sum + qty[w.key], 0)

  useEffect(() => {
    destroyedRef.current = false
    const root = rootRef.current
    if (!root) return undefined

    const $$ = (s) => Array.from(root.querySelectorAll(s))
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* ---------- Nav stays in dark theme over the whole page ---------- */
    const navLogoWhite = document.querySelector('[data-nav-logo-white]')
    const navLogoGreen = document.querySelector('[data-nav-logo-green]')
    const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'))
    if (navLogoWhite) navLogoWhite.style.opacity = '1'
    if (navLogoGreen) navLogoGreen.style.opacity = '0'
    navLinks.forEach((el) => { el.style.color = '#ffffff' })

    /* ---------- Hero entrance ---------- */
    let onPtReveal
    let heroTimeout
    const heroEntrance = () => {
      if (destroyedRef.current) return
      $$('[data-hero-reveal]').forEach((el, i) => {
        el.style.transitionDelay = `${0.15 + i * 0.12}s`
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

    /* ---------- Scroll reveals ---------- */
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1'
          e.target.style.transform = 'none'
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.1 })
    $$('[data-reveal]').forEach((el) => io.observe(el))

    /* ---------- Parallax: hero visual + background photos ---------- */
    const pxEls = $$('[data-agw-parallax]').map((el) => ({
      el,
      speed: parseFloat(el.getAttribute('data-agw-parallax')) || 0,
    }))
    const bgEls = $$('[data-agw-parallax-bg]')
    let ticking = false
    const applyParallax = () => {
      const vh = window.innerHeight
      for (const { el, speed } of pxEls) {
        const r = el.getBoundingClientRect()
        const center = r.top + r.height / 2
        const shift = (center - vh / 2) * speed
        el.style.transform = `translate3d(0,${shift.toFixed(1)}px,0)`
      }
      for (const el of bgEls) {
        const r = el.getBoundingClientRect()
        const center = r.top + r.height / 2
        let progress = (vh / 2 - center) / (vh / 2 + r.height / 2)
        progress = Math.max(-1, Math.min(1, progress))
        /* image overshoots its section by 12% each side; stay within that buffer */
        const shift = progress * r.height * 0.11
        el.style.transform = `translate3d(0,${shift.toFixed(1)}px,0)`
      }
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(applyParallax)
      }
    }
    if (!reduceMotion) {
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
      applyParallax()
    }

    /* ---------- Make sure the reel plays ---------- */
    const video = videoRef.current
    if (video) {
      video.muted = true
      const p = video.play()
      if (p && p.catch) p.catch(() => {})
    }

    return () => {
      destroyedRef.current = true
      if (onPtReveal) window.removeEventListener('davdsm:pt-reveal', onPtReveal)
      if (heroTimeout) clearTimeout(heroTimeout)
      io.disconnect()
      if (!reduceMotion) {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
    }
  }, [])

  const scrollToComponents = (e) => {
    e.preventDefault()
    const target = document.getElementById('agw-componentes')
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const galleryItems = [
    { key: 'age', shot: `${ASSETS}/shots/shot-01.png`, variant: 'mbp', deviceKey: 'deviceMbp' },
    { key: 'bottle', shot: `${ASSETS}/shots/shot-04.png`, variant: 'mba', deviceKey: 'deviceMba' },
    { key: 'favorites', shot: `${ASSETS}/shots/shot-05.png`, variant: 'mbp', deviceKey: 'deviceMbp' },
    { key: 'order', shot: `${ASSETS}/shots/shot-06.png`, variant: 'mba', deviceKey: 'deviceMba' },
  ]

  return (
    <div ref={rootRef}>
      <div className="agw-page" data-nav-theme="dark">
        <div className="agw-grain" aria-hidden="true" />

        {/* ---------- Hero ---------- */}
        <section className="agw-hero">
          <div className="agw-hero-glow" aria-hidden="true" />
          <div style={{ position: 'relative' }}>
            <div data-hero-reveal="" className="agw-hero-reveal" style={{ marginBottom: 32 }}>
              <Kicker>{t(`${base}.eyebrow`)}</Kicker>
            </div>
            <div data-hero-reveal="" className="agw-hero-reveal">
              <h1 className="agw-title"><Fade>AgraWines</Fade></h1>
              <p className="agw-tagline"><Fade>{t(`${base}.tagline`)}</Fade></p>
            </div>
            <p data-hero-reveal="" className="agw-hero-reveal agw-summary"><Fade>{t(`${base}.heroSummary`)}</Fade></p>
            <div data-hero-reveal="" className="agw-hero-reveal agw-meta">
              {['role', 'year', 'stack', 'backend'].map((key) => (
                <div key={key}>
                  <div className="agw-meta-label"><Fade>{t(`${base}.meta.${key}.label`)}</Fade></div>
                  <div className="agw-meta-value"><Fade>{t(`${base}.meta.${key}.value`)}</Fade></div>
                </div>
              ))}
            </div>
            <div data-hero-reveal="" className="agw-hero-reveal agw-ctas">
              {project?.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="agw-btn agw-btn--solid">
                  <Fade>{t(`${base}.ctaVisit`)}</Fade> <span aria-hidden="true">↗</span>
                </a>
              )}
              <a href="#agw-componentes" onClick={scrollToComponents} className="agw-btn agw-btn--ghost">
                <Fade>{t(`${base}.ctaComponents`)}</Fade>
              </a>
            </div>
          </div>
          <div data-agw-parallax="0.14" className="agw-hero-visual">
            <div className="agw-hero-halo" aria-hidden="true" />
            <img className="agw-logo" src={`${ASSETS}/logo-a-gold.png`} alt={t(`${base}.logoAlt`)} />
          </div>
        </section>

        {/* ---------- Video reel ---------- */}
        <section data-reveal="" className="agw-reveal agw-section agw-section--surface agw-section--video">
          <div className="agw-inner">
            <Kicker center>{t(`${base}.video.kicker`)}</Kicker>
            <h2 className="agw-h2"><Fade>{t(`${base}.video.title`)}</Fade></h2>
            <div className="agw-video-stage">
              <MacBook>
                <video ref={videoRef} src={project?.video} autoPlay muted loop playsInline preload="auto" />
              </MacBook>
            </div>
            <p className="agw-caption"><Fade>{t(`${base}.video.caption`)}</Fade></p>
          </div>
        </section>

        {/* ---------- Overview ---------- */}
        <section data-reveal="" className="agw-reveal agw-section agw-bgsection">
          <img src={`${ASSETS}/bg-pines.jpg`} data-agw-parallax-bg="1" alt="" className="agw-bgimg" />
          <div className="agw-bgshade" aria-hidden="true" />
          <div className="agw-inner">
            <blockquote className="agw-quote"><Fade>{t(`${base}.overview.quote`)}</Fade></blockquote>
            <div className="agw-cols2">
              <p><Fade>{t(`${base}.overview.p1`)}</Fade></p>
              <p><Fade>{t(`${base}.overview.p2`)}</Fade></p>
            </div>
            <div className="agw-chips">
              {['age', 'scroll', 'bottle', 'gsap', 'cms', 'orders'].map((key) => (
                <span key={key} className="agw-chip"><Fade>{t(`${base}.overview.chips.${key}`)}</Fade></span>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Palette ---------- */}
        <section data-reveal="" className="agw-reveal agw-section agw-section--surface">
          <div className="agw-inner">
            <Kicker>{t(`${base}.palette.kicker`)}</Kicker>
            <h2 className="agw-h2 agw-palette-title"><Fade>{t(`${base}.palette.title`)}</Fade></h2>
            <p className="agw-palette-intro"><Fade>{t(`${base}.palette.text`)}</Fade></p>
            <div className="agw-swatches">
              {SWATCHES.map((swatch) => (
                <div key={swatch.name} className="agw-swatch">
                  <div className="agw-swatch-color" style={{ background: swatch.hex }} />
                  <div className="agw-swatch-info">
                    <div className="agw-swatch-name">{swatch.name}</div>
                    <div className="agw-swatch-hex">{swatch.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Typography ---------- */}
        <section data-reveal="" className="agw-reveal agw-section">
          <div className="agw-inner">
            <Kicker>{t(`${base}.type.kicker`)}</Kicker>
            <div className="agw-typegrid">
              <div className="agw-typecol">
                <div className="agw-typelabel"><Fade>{t(`${base}.type.displayLabel`)}</Fade></div>
                <div className="agw-type-aa--serif">Aa</div>
                <div className="agw-type-phrase"><Fade>{t(`${base}.type.displayPhrase`)}</Fade></div>
              </div>
              <div className="agw-typecol">
                <div className="agw-typelabel"><Fade>{t(`${base}.type.interfaceLabel`)}</Fade></div>
                <div className="agw-type-aa--sans">Aa</div>
                <div className="agw-type-text"><Fade>{t(`${base}.type.interfaceText`)}</Fade></div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Components ---------- */}
        <section id="agw-componentes" data-reveal="" className="agw-reveal agw-section agw-section--surface">
          <div className="agw-inner">
            <Kicker>{t(`${base}.components.kicker`)}</Kicker>
            <h2 className="agw-h2 agw-components-title"><Fade>{t(`${base}.components.title`)}</Fade></h2>

            <div className="agw-compblock">
              <div className="agw-complabel"><Fade>{t(`${base}.components.navLabel`)}</Fade></div>
              <div className="agw-compstage">
                <div className="agw-navpill">
                  <div className="agw-navpill-brand">
                    <DropIcon />
                    <span className="agw-navpill-name">AgraWines</span>
                  </div>
                  <div className="agw-navpill-links">
                    <span><Fade>{t(`${base}.components.navLinks.wines`)}</Fade></span>
                    <span><Fade>{t(`${base}.components.navLinks.gallery`)}</Fade></span>
                    <span><Fade>{t(`${base}.components.navLinks.story`)}</Fade></span>
                  </div>
                  <div className="agw-navpill-cta">
                    <button type="button" className="agw-pillbtn agw-pillbtn--sm"><Fade>{t(`${base}.components.navCta`)}</Fade></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="agw-compgrid2">
              <div>
                <div className="agw-complabel"><Fade>{t(`${base}.components.buttonsLabel`)}</Fade></div>
                <div className="agw-compstage agw-compstage--row">
                  <button type="button" className="agw-pillbtn"><Fade>{t(`${base}.components.buttonPrimary`)}</Fade></button>
                  <button type="button" className="agw-pillbtn agw-pillbtn--outline"><Fade>{t(`${base}.components.buttonSecondary`)}</Fade></button>
                </div>
              </div>
              <div>
                <div className="agw-complabel"><Fade>{t(`${base}.components.badgesLabel`)}</Fade></div>
                <div className="agw-compstage agw-compstage--row">
                  {['red', 'white', 'reserve'].map((key) => (
                    <span key={key} className="agw-badge"><Fade>{t(`${base}.components.badges.${key}`)}</Fade></span>
                  ))}
                  <span className="agw-badge agw-badge--outline"><Fade>{t(`${base}.components.badges.month`)}</Fade></span>
                </div>
              </div>
            </div>

            <div className="agw-compblock">
              <div className="agw-complabel"><Fade>{t(`${base}.components.cardsLabel`)}</Fade></div>
              <div className="agw-winecards">
                {['wc1', 'wc2', 'wc3'].map((key) => (
                  <div key={key} className="agw-winecard">
                    <img src={`${ASSETS}/comp/${key}.png`} alt={t(`${base}.components.cardAlts.${key}`)} loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="agw-complabel"><Fade>{t(`${base}.components.orderLabel`)}</Fade></div>
              <div className="agw-order">
                <div className="agw-order-kicker"><Fade>{t(`${base}.components.orderKicker`)}</Fade></div>
                <div className="agw-order-title"><Fade>{t(`${base}.components.orderTitle`)}</Fade></div>
                <div className="agw-order-rows">
                  {WINES.map((wine) => (
                    <div key={wine.key} className={`agw-order-row${qty[wine.key] > 0 ? ' agw-order-row--active' : ''}`}>
                      <BottleIcon cap={wine.cap} body={wine.body} stroke={wine.stroke} />
                      <div className="agw-order-info">
                        <strong className="agw-order-name">{wine.name}</strong>
                        <span className="agw-order-meta">Minho · {fmtEuro(wine.price)}</span>
                      </div>
                      <div className="agw-order-stepper">
                        <button type="button" className="agw-qtybtn" onClick={() => step(wine.key, -1)} aria-label={`− ${wine.name}`}>−</button>
                        <span className="agw-qty">{qty[wine.key]}</span>
                        <button type="button" className="agw-qtybtn" onClick={() => step(wine.key, 1)} aria-label={`+ ${wine.name}`}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="agw-order-footer">
                  <div className="agw-order-total-label">
                    <Fade>{t(`${base}.components.total`)}</Fade>
                    <strong className="agw-order-total">{fmtEuro(total)}</strong>
                  </div>
                  <span className="agw-order-count">
                    {count} <Fade>{count === 1 ? t(`${base}.components.bottleSingular`) : t(`${base}.components.bottlePlural`)}</Fade>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Mobile ---------- */}
        <section data-reveal="" className="agw-reveal agw-section agw-bgsection">
          <img src={`${ASSETS}/bg-moss.jpg`} data-agw-parallax-bg="1" alt="" className="agw-bgimg" />
          <div className="agw-bgshade" aria-hidden="true" />
          <div className="agw-inner">
            <Kicker>{t(`${base}.mobile.kicker`)}</Kicker>
            <h2 className="agw-h2 agw-mobile-title"><Fade>{t(`${base}.mobile.title`)}</Fade></h2>
            <div className="agw-phones">
              <IPhone src={`${ASSETS}/shots/shot-07.png`} alt={t(`${base}.mobile.alts.hero`)} />
              <IPhone src={`${ASSETS}/shots/shot-09.png`} alt={t(`${base}.mobile.alts.wine`)} />
              <IPhone src={`${ASSETS}/shots/shot-10.png`} alt={t(`${base}.mobile.alts.story`)} />
            </div>
          </div>
        </section>

        {/* ---------- Gallery ---------- */}
        <section data-reveal="" className="agw-reveal agw-section agw-section--surface">
          <div className="agw-inner">
            <Kicker>{t(`${base}.gallery.kicker`)}</Kicker>
            <h2 className="agw-h2 agw-gallery-title"><Fade>{t(`${base}.gallery.title`)}</Fade></h2>
            <div className="agw-gallery-grid">
              {galleryItems.map((item) => (
                <figure key={item.key} className="agw-fig">
                  <MacBook variant={item.variant}>
                    <img src={item.shot} alt={t(`${base}.gallery.items.${item.key}.alt`)} loading="lazy" decoding="async" />
                  </MacBook>
                  <figcaption className="agw-figcaption">
                    <Fade>{t(`${base}.gallery.items.${item.key}.caption`)}</Fade> · <span><Fade>{t(`${base}.gallery.${item.deviceKey}`)}</Fade></span>
                  </figcaption>
                </figure>
              ))}
            </div>

            <a href="#/work/amPrestige" className="agw-next">
              <div>
                <div className="agw-next-label"><Fade>{t(`${base}.next.label`)}</Fade></div>
                <div className="agw-next-title"><Fade>{t(`${base}.next.title`)}</Fade></div>
              </div>
              <div className="agw-next-arrow" aria-hidden="true">↗</div>
            </a>
          </div>
        </section>
      </div>

      <div className="agw-cta-bar">
        <a href="#/work" className="work-hero-cta work-hero-cta--on-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, borderWidth: 1, borderStyle: 'solid', padding: '9px 16px', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
          <Fade>{t('common.backToWork')}</Fade>
        </a>
        {project?.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="work-hero-cta work-hero-cta--solid" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, borderWidth: 1, borderStyle: 'solid', padding: '9px 16px', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
            <Fade>{t('common.visitWebsite')}</Fade>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M8 7h9v9" /></svg>
          </a>
        )}
      </div>

      <Footer />
    </div>
  )
}
