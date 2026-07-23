import { useEffect, useRef } from 'react'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/LanguageContext'
import { PROJECTS } from '../data/projects'
import '../styles/forezguima-case-study.css'

const ASSETS = '/assets/work/forezguima'

const SAW_PATH = 'M50 4 L55 13 L64 8 L66 18 L76 16 L74 26 L84 27 L79 36 L88 40 L81 47 L88 55 L79 59 L84 68 L74 68 L75 78 L66 75 L63 85 L55 80 L50 89 L45 80 L37 85 L34 75 L25 78 L26 68 L16 68 L21 59 L12 55 L19 47 L12 40 L21 36 L16 27 L26 26 L24 16 L34 18 L36 8 L45 13 Z'

function SawBlade({ size = 100, spin = 'normal', blade = '#f7f5ee', ring = '#d3a029', hub = '#16281c', className = '' }) {
  const spinClass = spin === 'reverse' ? 'fg-saw--spin-reverse' : spin === 'slow' ? 'fg-saw--spin-slow' : 'fg-saw--spin'
  return (
    <div className={`fg-saw ${spinClass} ${className}`.trim()} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <path fill={blade} d={SAW_PATH} />
        <circle cx="50" cy="50" r="17" fill="none" stroke={ring} strokeWidth="1.6" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="7" fill={hub} />
      </svg>
    </div>
  )
}

function ChipRow({ chips, tone = 'onLight' }) {
  const toneClass = tone === 'onLight' ? 'fg-chip--outline' : 'fg-chip--ghost'
  return (
    <div className="fg-chip-row">
      <span className="fg-chip fg-chip--active">
        <Fade>{chips.all.label}</Fade> <span className="fg-chip-count">{chips.all.count}</span>
      </span>
      {['ct600', 'droite', 'gauche'].map((key) => (
        <span key={key} className={`fg-chip ${toneClass}`}>
          <Fade>{chips[key].label}</Fade> <span className="fg-chip-count">{chips[key].count}</span>
        </span>
      ))}
    </div>
  )
}

function NavPillWidget({ nav }) {
  return (
    <div className="fg-navpill">
      <span className="fg-navpill-link"><Fade>{nav.about}</Fade></span>
      <span className="fg-navpill-link"><Fade>{nav.products}</Fade></span>
      <span className="fg-navpill-link"><Fade>{nav.fairs}</Fade></span>
      <span className="fg-navpill-search">
        🔍 <Fade>{nav.searchLabel}</Fade> <span className="fg-navpill-kbd">{nav.searchShortcut}</span>
      </span>
      <span className="fg-navpill-cta"><Fade>{nav.contact}</Fade></span>
    </div>
  )
}

function ProductCardWidget({ card }) {
  return (
    <div className="fg-product-card">
      <div className="fg-product-card__viz">
        <svg viewBox="0 0 200 130">
          <polyline points="30,52 45,40 60,52 75,40 90,52 105,40 120,52 135,40 150,52 165,40" fill="none" stroke="#c9cdd2" strokeWidth="1.4" />
          <text x="100" y="76" fill="#8b9096" fontSize="8" textAnchor="middle" fontFamily="monospace">non trempé</text>
          <polyline points="30,100 42,92 54,100 66,92 78,100 90,92 102,100 114,92 126,100 138,92 150,100 162,92" fill="none" stroke="#ffffff" strokeWidth="1.6" />
        </svg>
      </div>
      <div className="fg-product-card__body">
        <div className="fg-product-card__cat">{card.category}</div>
        <div className="fg-product-card__name"><Fade>{card.name}</Fade></div>
        <div className="fg-product-card__refs">{card.refs}</div>
      </div>
    </div>
  )
}

function LogoChipWidget({ logo }) {
  return (
    <div className="fg-logo-chip">
      <svg width="30" height="34" viewBox="0 0 30 34" aria-hidden="true">
        <path d="M15 2 L20 11 L10 11 Z" fill="#7aa22e" />
        <path d="M15 8 L22 19 L8 19 Z" fill="#4d7a1f" />
        <path d="M15 15 L24 27 L6 27 Z" fill="#2f6a46" />
        <rect x="13.5" y="26" width="3" height="6" fill="#6b5330" />
      </svg>
      <div className="fg-logo-chip__name">{logo.name}</div>
      <div className="fg-logo-chip__sub">{logo.sub}</div>
    </div>
  )
}

function MacBook({ src, alt, onLight = false, right = false }) {
  return (
    <div className={`fg-macbook${right ? ' fg-macbook--right' : ''}`} data-nav-theme={onLight ? 'light' : undefined}>
      <div className={`fg-macbook-lid${onLight ? ' fg-macbook-lid--onlight' : ''}`}>
        <div className="fg-macbook-notch" />
        <div className="fg-macbook-screen">
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        </div>
      </div>
      <div className="fg-macbook-base">
        <div className="fg-macbook-base__notch" />
      </div>
    </div>
  )
}

function IPadFrame({ src, alt }) {
  return (
    <div className="fg-ipad" data-nav-theme="light">
      <div className="fg-ipad-screen">
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </div>
  )
}

function DarkMac({ src, alt }) {
  return (
    <div className="fg-dark-mac">
      <div className="fg-dark-mac-screen">
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </div>
  )
}

const PHONE_STATUS_ICON_COLORS = {
  dark: '#16281c',
  light: '#ffffff',
}

function PhoneStatusIcons({ color }) {
  return (
    <span className="fg-phone-status-icons">
      <svg width="15" height="11" viewBox="0 0 16 12" aria-hidden="true">
        <path d="M8 3.1c2.2 0 4.2.85 5.7 2.25l1.35-1.45C13.15 2.15 10.7 1.15 8 1.15S2.85 2.15.95 3.9L2.3 5.35C3.8 3.95 5.8 3.1 8 3.1Z" fill={color} />
        <path d="M8 6c1.25 0 2.4.5 3.25 1.3l1.35-1.45C11.3 4.6 9.75 3.95 8 3.95s-3.3.65-4.6 1.9L4.75 7.3C5.6 6.5 6.75 6 8 6Z" fill={color} />
        <circle cx="8" cy="9.4" r="1.5" fill={color} />
      </svg>
      <svg width="24" height="12" viewBox="0 0 26 12" aria-hidden="true">
        <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke={color} strokeOpacity="0.45" />
        <rect x="2.5" y="2.5" width="15" height="7" rx="1.5" fill={color} />
        <rect x="23.5" y="4" width="2" height="4" rx="1" fill={color} opacity="0.45" />
      </svg>
    </span>
  )
}

function PhoneWidget({ src, alt, bg, icon = 'dark', offset = false, floatClass = 'fg-float-a' }) {
  const iconColor = PHONE_STATUS_ICON_COLORS[icon]
  return (
    <div className={`fg-phone${offset ? ' fg-phone--offset' : ''} ${floatClass}`}>
      <div className="fg-phone-frame">
        <div className="fg-phone-island" />
        <div className="fg-phone-screen" style={{ background: bg }}>
          <div className="fg-phone-status" style={{ background: bg, color: iconColor }}>
            <span className="fg-phone-status-time">9:41</span>
            <PhoneStatusIcons color={iconColor} />
          </div>
          <div className="fg-phone-media">
            <img src={src} alt={alt} loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </div>
  )
}

function RefTable({ headers, rows }) {
  return (
    <div className="fg-ref-table">
      <div className="fg-ref-table__head">
        <span>{headers.code}</span>
        <span>{headers.diameter}</span>
        <span>{headers.bore}</span>
        <span>{headers.direction}</span>
      </div>
      {rows.map((row) => (
        <div key={row.code} className="fg-ref-table__row">
          <span className="fg-ref-table__code">{row.code}</span>
          <span>{row.diameter}</span>
          <span>{row.bore}</span>
          <span>{row.direction}</span>
        </div>
      ))}
    </div>
  )
}

function FgReveal({ as: Tag = 'div', className = '', hero = false, children }) {
  const motionProps = hero ? { 'data-hero-reveal': '' } : { 'data-reveal': '' }
  return (
    <Tag {...motionProps} className={`fg-motion-desc ${className}`.trim()}>
      {children}
    </Tag>
  )
}

export default function ForezguimaCaseStudy() {
  const { t } = useLanguage()
  const rootRef = useRef(null)
  const destroyedRef = useRef(false)
  const base = 'projectDetail.forezguima.caseStudy'
  const project = PROJECTS.forezguima

  useEffect(() => {
    destroyedRef.current = false
    const root = rootRef.current
    if (!root) return undefined

    const $$ = (s) => Array.from(root.querySelectorAll(s))
    const navLogoWhite = document.querySelector('[data-nav-logo-white]')
    const navLogoGreen = document.querySelector('[data-nav-logo-green]')
    const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'))
    const themeSections = $$('[data-nav-theme]')
    let navTheme = ''

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

    const updateNavTheme = () => {
      const y = 60
      let theme = 'dark'
      for (const sec of themeSections) {
        const r = sec.getBoundingClientRect()
        if (r.top <= y && r.bottom >= y) {
          theme = sec.getAttribute('data-nav-theme')
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
    window.addEventListener('scroll', updateNavTheme, { passive: true })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'none'
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.12 },
    )
    $$('[data-reveal]').forEach((el) => io.observe(el))

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pxEls = $$('[data-fg-parallax]').map((el) => ({ el, speed: parseFloat(el.getAttribute('data-fg-parallax')) || 0 }))
    let ticking = false
    const applyParallax = () => {
      const vh = window.innerHeight
      for (const { el, speed } of pxEls) {
        const r = el.getBoundingClientRect()
        const center = r.top + r.height / 2
        const shift = (center - vh / 2) * speed
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
    if (!reduceMotion && pxEls.length) {
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
      applyParallax()
    }

    return () => {
      destroyedRef.current = true
      if (onPtReveal) window.removeEventListener('davdsm:pt-reveal', onPtReveal)
      if (heroTimeout) clearTimeout(heroTimeout)
      window.removeEventListener('scroll', updateNavTheme)
      io.disconnect()
      if (!reduceMotion && pxEls.length) {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
    }
  }, [])

  const nav = t(`${base}.floating.navPill`)
  const heroChips = t(`${base}.floating.chips`)
  const productCard = t(`${base}.floating.productCard`)
  const approachChips = t(`${base}.approach.chips`)
  const logoChip = t(`${base}.approach.logoChip`)
  const tableHeaders = t(`${base}.screens.product.table.headers`)
  const tableRows = t(`${base}.screens.product.table.rows`)
  const stats = t(`${base}.outcome.stats`)

  return (
    <div ref={rootRef}>
      <article className="fg-page">
        {/* ---------- Intro / title ---------- */}
        <header className="fg-hero" data-nav-theme="dark">
          <img className="fg-hero-bg" src={`${ASSETS}/park-bg.jpg`} alt="" aria-hidden="true" loading="eager" decoding="async" />
          <div className="fg-hero-scrim" aria-hidden="true" />

          <div className="fg-hero-inner">
            <FgReveal hero as="div" className="fg-eyebrow-wrap">
              <div className="fg-eyebrow"><Fade>{t(`${base}.eyebrow`)}</Fade></div>
            </FgReveal>
            <h1 className="fg-title">
              <span className="fg-word-mask">
                <span data-hero-word="" className="fg-motion-word">
                  <Fade>{t(`${base}.titlePre`)}</Fade><span className="fg-title-accent"><Fade>{t(`${base}.titleAccent`)}</Fade></span>
                </span>
              </span>
            </h1>
            <FgReveal hero as="p" className="fg-tagline"><Fade>{t(`${base}.tagline`)}</Fade></FgReveal>
            <FgReveal hero as="p" className="fg-hero-summary">
              <Fade>{t(`${base}.heroSummaryPre`)}</Fade><strong><Fade>{t(`${base}.heroSummaryStrong`)}</Fade></strong><Fade>{t(`${base}.heroSummaryPost`)}</Fade>
            </FgReveal>
            <FgReveal hero as="div" className="fg-meta-row">
              {['role', 'scope', 'year'].map((key) => (
                <div key={key}>
                  <div className="fg-meta-label"><Fade>{t(`${base}.meta.${key}.label`)}</Fade></div>
                  <div className="fg-meta-value"><Fade>{t(`${base}.meta.${key}.value`)}</Fade></div>
                </div>
              ))}
            </FgReveal>
          </div>

          <FgReveal hero as="div" className="fg-floaters">
            <div className="fg-floater fg-float-b"><NavPillWidget nav={nav} /></div>
            <div className="fg-floater fg-float-a"><SawBlade size={150} /></div>
            <div className="fg-floater fg-float-c"><ChipRow chips={heroChips} tone="onLight" /></div>
            <div className="fg-floater fg-float-a"><ProductCardWidget card={productCard} /></div>
          </FgReveal>

          <div className="fg-scroll-hint"><Fade>{t(`${base}.scrollHint`)}</Fade></div>
        </header>

        {/* ---------- Challenge + hero MacBook ---------- */}
        <section className="fg-challenge" data-nav-theme="dark">
          <div className="fg-challenge-inner">
            <div data-reveal="">
              <div className="fg-index"><Fade>{t(`${base}.challenge.index`)}</Fade></div>
              <h2 className="fg-h2"><Fade>{t(`${base}.challenge.title`)}</Fade></h2>
              <p className="fg-body"><Fade>{t(`${base}.challenge.text`)}</Fade></p>
            </div>
            <div data-reveal="" data-fg-parallax="-0.06">
              <div className="fg-float-a">
                <MacBook src={`${ASSETS}/shots/desktop-hero.png`} alt={t(`${base}.titlePre`) + t(`${base}.titleAccent`)} right />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Approach + kit strip ---------- */}
        <section className="fg-approach" data-nav-theme="light">
          <div className="fg-approach-inner">
            <div data-reveal="" className="fg-approach-lead">
              <div className="fg-index fg-index--green"><Fade>{t(`${base}.approach.index`)}</Fade></div>
              <h2 className="fg-approach-title">
                <Fade>{t(`${base}.approach.titleLine1`)}</Fade><br /><Fade>{t(`${base}.approach.titleLine2`)}</Fade>
              </h2>
              <p className="fg-body fg-body--dark"><Fade>{t(`${base}.approach.text`)}</Fade></p>
            </div>

            <div data-reveal="" className="fg-kit">
              <div className="fg-kit-label"><Fade>{t(`${base}.approach.kitLabel`)}</Fade></div>
              <div className="fg-kit-row">
                <div className="fg-kit-buttons">
                  <span className="fg-btn fg-btn--primary"><Fade>{t(`${base}.approach.buttons.primary`)}</Fade></span>
                  <span className="fg-btn fg-btn--secondary"><Fade>{t(`${base}.approach.buttons.secondary`)}</Fade></span>
                </div>
                <SawBlade size={130} spin="reverse" />
                <ChipRow chips={approachChips} tone="onDark" />
                <LogoChipWidget logo={logoChip} />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Screens gallery ---------- */}
        <section className="fg-screens" data-nav-theme="light">
          <div className="fg-screens-inner">
            <div data-reveal="" className="fg-index fg-index--green fg-screens-index"><Fade>{t(`${base}.screens.index`)}</Fade></div>

            <div data-reveal="" className="fg-screen-block">
              <div data-fg-parallax="-0.03" className="fg-screen-oficina">
                <MacBook onLight src={`${ASSETS}/shots/desktop-oficina.png`} alt={t(`${base}.screens.oficina.alt`)} />
                <div className="fg-screen-oficina__copy">
                  <div className="fg-screen-title"><Fade>{t(`${base}.screens.oficina.title`)}</Fade></div>
                  <p className="fg-screen-text"><Fade>{t(`${base}.screens.oficina.text`)}</Fade></p>
                </div>
              </div>
            </div>

            <div data-reveal="" className="fg-screen-block fg-screen-sobre">
              <div className="fg-screen-sobre__copy">
                <div className="fg-kicker-mini"><Fade>{t(`${base}.screens.sobre.kicker`)}</Fade></div>
                <div className="fg-screen-title"><Fade>{t(`${base}.screens.sobre.title`)}</Fade></div>
                <p className="fg-screen-text"><Fade>{t(`${base}.screens.sobre.text`)}</Fade></p>
              </div>
              <div className="fg-float-c">
                <IPadFrame src={`${ASSETS}/shots/desktop-sobre.png`} alt={t(`${base}.screens.sobre.alt`)} />
              </div>
            </div>

            <div data-reveal="" className="fg-screen-block">
              <div data-fg-parallax="-0.03" className="fg-screen-catalogo">
                <div className="fg-screen-catalogo__head">
                  <div className="fg-h2 fg-h2--dark"><Fade>{t(`${base}.screens.catalogo.title`)}</Fade></div>
                  <p><Fade>{t(`${base}.screens.catalogo.text`)}</Fade></p>
                </div>
                <MacBook onLight src={`${ASSETS}/shots/desktop-catalogo.png`} alt={t(`${base}.screens.catalogo.alt`)} />
              </div>
            </div>
          </div>

          <div data-reveal="" className="fg-dark-chapter" data-nav-theme="dark">
            <div className="fg-dark-chapter-inner">
              <div>
                <div className="fg-index fg-index--olive"><Fade>{t(`${base}.screens.dark.kicker`)}</Fade></div>
                <h2 className="fg-h2"><Fade>{t(`${base}.screens.dark.title`)}</Fade></h2>
                <p className="fg-body fg-body--olive"><Fade>{t(`${base}.screens.dark.text`)}</Fade></p>
              </div>
              <div data-fg-parallax="-0.05">
                <div className="fg-float-a">
                  <DarkMac src={`${ASSETS}/shots/desktop-alimentar.png`} alt={t(`${base}.screens.dark.alt`)} />
                </div>
              </div>
            </div>
          </div>

          <div className="fg-screens-inner">
            <div data-reveal="" className="fg-screen-product">
              <div data-fg-parallax="-0.04">
                <div className="fg-float-c">
                  <MacBook onLight src={`${ASSETS}/shots/desktop-produto.png`} alt={t(`${base}.screens.product.alt`)} />
                </div>
              </div>
              <div>
                <div className="fg-kicker-mini"><Fade>{t(`${base}.screens.product.kicker`)}</Fade></div>
                <div className="fg-screen-title" style={{ fontSize: 28 }}><Fade>{t(`${base}.screens.product.title`)}</Fade></div>
                <p className="fg-screen-text" style={{ marginBottom: 22 }}><Fade>{t(`${base}.screens.product.text`)}</Fade></p>
                <RefTable headers={tableHeaders} rows={tableRows} />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Mobile ---------- */}
        <section className="fg-mobile" data-nav-theme="dark">
          <div className="fg-mobile-inner">
            <div data-reveal="" className="fg-mobile-head">
              <div className="fg-index"><Fade>{t(`${base}.mobile.index`)}</Fade></div>
              <h2 className="fg-h2">
                <Fade>{t(`${base}.mobile.titleLine1`)}</Fade><br /><Fade>{t(`${base}.mobile.titleLine2`)}</Fade>
              </h2>
            </div>
            <div data-reveal="" data-fg-parallax="-0.04" className="fg-phones">
              <PhoneWidget src={`${ASSETS}/shots/mobile-1.png`} alt="Forezguima mobile" bg="#f1ede1" icon="dark" floatClass="fg-float-a" />
              <PhoneWidget src={`${ASSETS}/shots/mobile-2.png`} alt="Forezguima mobile" bg="#333533" icon="light" offset floatClass="fg-float-c" />
              <PhoneWidget src={`${ASSETS}/shots/mobile-3.png`} alt="Forezguima mobile" bg="#f5f3ee" icon="dark" floatClass="fg-float-b" />
              <PhoneWidget src={`${ASSETS}/shots/mobile-4.png`} alt="Forezguima mobile" bg="#306a4e" icon="light" offset floatClass="fg-float-a" />
            </div>
          </div>
        </section>

        {/* ---------- Outcome ---------- */}
        <section className="fg-outcome" data-nav-theme="light">
          <div className="fg-outcome-inner">
            <div data-reveal="">
              <div className="fg-outcome-icon"><SawBlade size={90} blade="#2f6a46" ring="#d3a029" hub="#efece3" /></div>
              <div className="fg-index fg-index--green"><Fade>{t(`${base}.outcome.index`)}</Fade></div>
              <h2 className="fg-outcome-title"><Fade>{t(`${base}.outcome.title`)}</Fade></h2>
              <p className="fg-outcome-text"><Fade>{t(`${base}.outcome.text`)}</Fade></p>
            </div>
            <div data-reveal="" className="fg-stats">
              {['products', 'categories', 'craft'].map((key) => (
                <div key={key}>
                  <div className="fg-stat-value">
                    {stats[key].value}{stats[key].suffix && <span className="fg-stat-suffix">{stats[key].suffix}</span>}
                  </div>
                  <div className="fg-stat-label"><Fade>{stats[key].label}</Fade></div>
                </div>
              ))}
            </div>
            <a href="#/work/amPrestige" data-reveal="" className="fg-next">
              <div>
                <div className="fg-next__label"><Fade>{t(`${base}.next.label`)}</Fade></div>
                <div className="fg-next__title"><Fade>{t(`${base}.next.title`)}</Fade></div>
              </div>
              <div className="fg-next__arrow" aria-hidden="true">↗</div>
            </a>
          </div>
        </section>
      </article>

      <div className="fg-cta-bar">
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
