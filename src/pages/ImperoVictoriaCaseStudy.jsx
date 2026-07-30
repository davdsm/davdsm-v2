import { useEffect, useRef } from 'react'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/LanguageContext'
import { PROJECTS } from '../data/projects'
import '../styles/impero-victoria-case-study.css'

const ASSETS = '/assets/work/impero-victoria'

const STATUS_COLORS = {
  dark: '#0b0b0b',
  light: '#ffffff',
}

function PhoneStatusIcons({ color }) {
  return (
    <span className="iv-phone__status-icons" aria-hidden="true">
      <svg width="15" height="10" viewBox="0 0 16 11">
        <rect y="7" width="2.6" height="4" rx="1" fill={color} />
        <rect x="3.8" y="5" width="2.6" height="6" rx="1" fill={color} />
        <rect x="7.6" y="2.6" width="2.6" height="8.4" rx="1" fill={color} />
        <rect x="11.4" width="2.6" height="11" rx="1" fill={color} />
      </svg>
      <svg width="24" height="12" viewBox="0 0 26 12">
        <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke={color} strokeOpacity="0.45" />
        <rect x="2.5" y="2.5" width="15" height="7" rx="1.5" fill={color} />
        <rect x="23.5" y="4" width="2" height="4" rx="1" fill={color} opacity="0.45" />
      </svg>
    </span>
  )
}

function MacBook({ src, alt, variant = 'default', right = false }) {
  return (
    <div
      className={`iv-mac${right ? ' iv-mac--right' : ''}${variant === 'services' ? ' iv-mac--services' : ''}${variant === 'detail' ? ' iv-mac--detail' : ''}`}
      data-nav-theme={variant === 'default' || variant === 'dark' || variant === 'detail' ? undefined : 'light'}
    >
      <div className={`iv-mac__lid${variant === 'dark' ? ' iv-mac__lid--dark' : ''}`}>
        {variant !== 'services' && variant !== 'detail' && <div className="iv-mac__notch" />}
        <div className="iv-mac__screen">
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        </div>
      </div>
      {variant !== 'services' && variant !== 'detail' && (
        <div className="iv-mac__base">
          <div className="iv-mac__base-notch" />
        </div>
      )}
    </div>
  )
}

function Phone({ src, alt, bg, icon = 'dark', offset = false, floatClass = 'iv-float-a' }) {
  const iconColor = STATUS_COLORS[icon]
  return (
    <div className={`iv-phone${offset ? ' iv-phone--offset' : ''} ${floatClass}`}>
      <div className="iv-phone__frame">
        <div className="iv-phone__island" />
        <div className="iv-phone__screen" style={{ background: bg }}>
          <div className="iv-phone__status" style={{ background: bg, color: iconColor }}>
            <span className="iv-phone__status-time">9:41</span>
            <PhoneStatusIcons color={iconColor} />
          </div>
          <div className="iv-phone__media">
            <img src={src} alt={alt} loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </div>
  )
}

function IvReveal({ as: Tag = 'div', className = '', hero = false, children }) {
  const motionProps = hero ? { 'data-hero-reveal': '' } : { 'data-reveal': '' }
  return (
    <Tag {...motionProps} className={`iv-motion-desc ${className}`.trim()}>
      {children}
    </Tag>
  )
}

export default function ImperoVictoriaCaseStudy() {
  const { t } = useLanguage()
  const rootRef = useRef(null)
  const destroyedRef = useRef(false)
  const base = 'projectDetail.imperoVictoria.caseStudy'
  const project = PROJECTS.imperoVictoria

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
    const pxEls = $$('[data-iv-parallax]').map((el) => ({ el, speed: parseFloat(el.getAttribute('data-iv-parallax')) || 0 }))
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

  const kitFilters = t(`${base}.approach.filters`)
  const kitMeta = t(`${base}.approach.meta`)
  const filterList = t(`${base}.screens.filters.items`)
  const stats = t(`${base}.outcome.stats`)
  const partnerCard = t(`${base}.floating.partnerCard`)

  return (
    <div ref={rootRef}>
      <article className="iv-page">
        <header className="iv-hero" data-nav-theme="dark">
          <img className="iv-hero-bg" src={`${ASSETS}/shots/blossom-bg.jpg`} alt="" aria-hidden="true" loading="eager" decoding="async" />
          <div className="iv-hero-scrim" aria-hidden="true" />

          <div className="iv-hero-inner">
            <IvReveal hero as="div" className="iv-eyebrow"><Fade>{t(`${base}.eyebrow`)}</Fade></IvReveal>
            <h1 className="iv-title">
              <span className="iv-word-mask">
                <span data-hero-word="" className="iv-motion-word"><Fade>{t(`${base}.titleLine1`)}</Fade></span>
              </span>
              <span className="iv-word-mask">
                <span data-hero-word="" className="iv-motion-word"><Fade>{t(`${base}.titleLine2`)}</Fade></span>
              </span>
            </h1>
            <IvReveal hero as="div" className="iv-title-sub"><Fade>{t(`${base}.titleSub`)}</Fade></IvReveal>
            <IvReveal hero as="p" className="iv-tagline"><Fade>{t(`${base}.tagline`)}</Fade></IvReveal>
            <IvReveal hero as="p" className="iv-hero-summary">
              <Fade>{t(`${base}.heroSummaryPre`)}</Fade>
              <strong><Fade>{t(`${base}.heroSummaryStrong`)}</Fade></strong>
              <Fade>{t(`${base}.heroSummaryPost`)}</Fade>
            </IvReveal>
            <IvReveal hero as="div" className="iv-meta-row">
              {['role', 'scope', 'year'].map((key) => (
                <div key={key}>
                  <div className="iv-meta-label"><Fade>{t(`${base}.meta.${key}.label`)}</Fade></div>
                  <div className="iv-meta-value"><Fade>{t(`${base}.meta.${key}.value`)}</Fade></div>
                </div>
              ))}
            </IvReveal>
          </div>

          <IvReveal hero as="div" className="iv-floaters">
            <div className="iv-floater iv-float-b">
              <div className="iv-brand-chip" aria-hidden="true">
                <div className="iv-brand-chip__name">IMPEROVICTORIA</div>
                <div className="iv-brand-chip__sub">FASHION ASSETS</div>
              </div>
            </div>
            <div className="iv-floater iv-float-a">
              <div className="iv-progress" aria-hidden="true">
                <div className="iv-burger-ring"><i /><i /></div>
                <div className="iv-progress__track">
                  <span>03</span>
                  <div className="iv-progress__bar"><span /></div>
                  <span>01</span>
                </div>
              </div>
            </div>
            <div className="iv-floater iv-float-c">
              <div className="iv-cta-chip" aria-hidden="true">
                <span><Fade>{t(`${base}.floating.cta`)}</Fade></span>
              </div>
            </div>
            <div className="iv-floater iv-float-a">
              <div className="iv-partner-card" aria-hidden="true">
                <img src={`${ASSETS}/shots/desktop-grid.png`} alt="" />
                <div className="iv-partner-card__scrim" />
                <div className="iv-partner-card__copy">
                  <div className="iv-partner-card__cat"><Fade>{partnerCard.category}</Fade></div>
                  <div className="iv-partner-card__name"><Fade>{partnerCard.name}</Fade></div>
                </div>
              </div>
            </div>
          </IvReveal>

          <div className="iv-scroll-hint"><Fade>{t(`${base}.scrollHint`)}</Fade></div>
        </header>

        <section className="iv-challenge" data-nav-theme="dark">
          <div className="iv-inner iv-challenge-grid">
            <div data-reveal="">
              <div className="iv-index"><Fade>{t(`${base}.challenge.index`)}</Fade></div>
              <h2 className="iv-h2"><Fade>{t(`${base}.challenge.title`)}</Fade></h2>
              <p className="iv-body"><Fade>{t(`${base}.challenge.text`)}</Fade></p>
            </div>
            <div data-reveal="" data-iv-parallax="-0.06">
              <div className="iv-float-a">
                <MacBook variant="dark" right src={`${ASSETS}/shots/desktop-hero.png`} alt={t(`${base}.challenge.alt`)} />
              </div>
            </div>
          </div>
        </section>

        <section className="iv-approach" data-nav-theme="light">
          <div className="iv-inner">
            <div data-reveal="" className="iv-approach-lead">
              <div className="iv-index iv-index--muted"><Fade>{t(`${base}.approach.index`)}</Fade></div>
              <h2 className="iv-approach-title">
                <Fade>{t(`${base}.approach.titleLine1`)}</Fade><br /><Fade>{t(`${base}.approach.titleLine2`)}</Fade>
              </h2>
              <p className="iv-body iv-body--dark"><Fade>{t(`${base}.approach.text`)}</Fade></p>
            </div>

            <div data-reveal="" className="iv-kit">
              <div className="iv-kit-label"><Fade>{t(`${base}.approach.kitLabel`)}</Fade></div>
              <div className="iv-kit-row">
                <div className="iv-kit-logo iv-float-b" aria-hidden="true">
                  <div className="iv-kit-logo__name">IMPEROVICTORIA</div>
                  <div className="iv-kit-logo__sub">FASHION ASSETS</div>
                </div>
                <div className="iv-kit-nav iv-float-c" aria-hidden="true">
                  {kitFilters.map((item, i) => (
                    <span key={item.label} className={i === 0 ? 'is-active' : undefined}>
                      <Fade>{item.label}</Fade>
                      {item.count != null && <sup>{item.count}</sup>}
                    </span>
                  ))}
                </div>
                <div className="iv-kit-cta iv-float-a" aria-hidden="true">
                  <span><Fade>{t(`${base}.floating.cta`)}</Fade></span>
                </div>
                <div className="iv-kit-meta iv-float-a" aria-hidden="true">
                  {kitMeta.map((row) => (
                    <div key={row.label}>
                      <div className="iv-kit-meta__label"><Fade>{row.label}</Fade></div>
                      <div className="iv-kit-meta__value"><Fade>{row.value}</Fade></div>
                    </div>
                  ))}
                </div>
                <div className="iv-swatches iv-float-b" aria-hidden="true">
                  <span /><span /><span /><span />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="iv-screens" data-nav-theme="light">
          <div className="iv-inner">
            <div data-reveal="" className="iv-index iv-index--muted iv-screens-index"><Fade>{t(`${base}.screens.index`)}</Fade></div>

            <div data-reveal="" className="iv-screen-block">
              <div data-iv-parallax="-0.03" className="iv-screen-portfolio">
                <MacBook src={`${ASSETS}/shots/desktop-portfolio.png`} alt={t(`${base}.screens.portfolio.alt`)} />
                <div style={{ paddingBottom: 20 }}>
                  <div className="iv-screen-title"><Fade>{t(`${base}.screens.portfolio.title`)}</Fade></div>
                  <p className="iv-screen-text"><Fade>{t(`${base}.screens.portfolio.text`)}</Fade></p>
                </div>
              </div>
            </div>

            <div data-reveal="" className="iv-screen-block iv-screen-services">
              <div className="iv-screen-services__copy">
                <div className="iv-kicker-mini"><Fade>{t(`${base}.screens.services.kicker`)}</Fade></div>
                <div className="iv-screen-title"><Fade>{t(`${base}.screens.services.title`)}</Fade></div>
                <p className="iv-screen-text"><Fade>{t(`${base}.screens.services.text`)}</Fade></p>
              </div>
              <div className="iv-float-c">
                <MacBook variant="services" src={`${ASSETS}/shots/desktop-services.png`} alt={t(`${base}.screens.services.alt`)} />
              </div>
            </div>
          </div>

          <div data-reveal="" className="iv-dark-chapter" data-nav-theme="dark">
            <div className="iv-inner iv-dark-chapter-grid">
              <div>
                <div className="iv-index"><Fade>{t(`${base}.screens.partner.kicker`)}</Fade></div>
                <h2 className="iv-h2">
                  <Fade>{t(`${base}.screens.partner.titleLine1`)}</Fade><br /><Fade>{t(`${base}.screens.partner.titleLine2`)}</Fade>
                </h2>
                <p className="iv-body"><Fade>{t(`${base}.screens.partner.text`)}</Fade></p>
              </div>
              <div data-iv-parallax="-0.05">
                <div className="iv-float-a">
                  <MacBook variant="detail" src={`${ASSETS}/shots/desktop-detail.png`} alt={t(`${base}.screens.partner.alt`)} />
                </div>
              </div>
            </div>
          </div>

          <div className="iv-inner">
            <div data-reveal="" className="iv-screen-filters">
              <div data-iv-parallax="-0.04">
                <div className="iv-float-c">
                  <MacBook src={`${ASSETS}/shots/desktop-grid.png`} alt={t(`${base}.screens.filters.alt`)} />
                </div>
              </div>
              <div>
                <div className="iv-kicker-mini"><Fade>{t(`${base}.screens.filters.kicker`)}</Fade></div>
                <div className="iv-screen-title" style={{ fontSize: 28 }}><Fade>{t(`${base}.screens.filters.title`)}</Fade></div>
                <p className="iv-screen-text"><Fade>{t(`${base}.screens.filters.text`)}</Fade></p>
                <div className="iv-filter-list" aria-hidden="true">
                  {filterList.map((item, i) => (
                    <span key={item.label} className={i === 0 ? 'is-active' : undefined}>
                      <Fade>{item.label}</Fade>
                      {item.count != null && <sup>{item.count}</sup>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="iv-mobile" data-nav-theme="dark">
          <div className="iv-inner">
            <div data-reveal="" className="iv-mobile-head">
              <div className="iv-index"><Fade>{t(`${base}.mobile.index`)}</Fade></div>
              <h2 className="iv-h2">
                <Fade>{t(`${base}.mobile.titleLine1`)}</Fade><br /><Fade>{t(`${base}.mobile.titleLine2`)}</Fade>
              </h2>
            </div>
            <div data-reveal="" data-iv-parallax="-0.04" className="iv-phones">
              <Phone src={`${ASSETS}/shots/mobile-hero.png`} alt={t(`${base}.mobile.alts.hero`)} bg="#0b0b0b" icon="light" floatClass="iv-float-a" />
              <Phone src={`${ASSETS}/shots/mobile-portfolio.png`} alt={t(`${base}.mobile.alts.portfolio`)} bg="#ffffff" icon="dark" offset floatClass="iv-float-c" />
              <Phone src={`${ASSETS}/shots/mobile-filters.png`} alt={t(`${base}.mobile.alts.filters`)} bg="#ffffff" icon="dark" floatClass="iv-float-b" />
              <Phone src={`${ASSETS}/shots/mobile-detail.png`} alt={t(`${base}.mobile.alts.detail`)} bg="#ffffff" icon="dark" offset floatClass="iv-float-a" />
              <Phone src={`${ASSETS}/shots/mobile-contacts.png`} alt={t(`${base}.mobile.alts.contacts`)} bg="#ffffff" icon="dark" floatClass="iv-float-c" />
            </div>
          </div>
        </section>

        <section className="iv-outcome" data-nav-theme="light">
          <div className="iv-outcome-inner">
            <div data-reveal="">
              <div className="iv-outcome-brand">IMPEROVICTORIA</div>
              <div className="iv-outcome-sub">FASHION ASSETS</div>
              <div className="iv-index iv-index--muted"><Fade>{t(`${base}.outcome.index`)}</Fade></div>
              <h2 className="iv-outcome-title"><Fade>{t(`${base}.outcome.title`)}</Fade></h2>
              <p className="iv-outcome-text"><Fade>{t(`${base}.outcome.text`)}</Fade></p>
            </div>
            <div data-reveal="" className="iv-stats">
              {['partners', 'categories', 'accent'].map((key) => (
                <div key={key}>
                  <div className="iv-stat-value">{stats[key].value}</div>
                  <div className="iv-stat-label"><Fade>{stats[key].label}</Fade></div>
                </div>
              ))}
            </div>
            <a href="#/work/phfConcept" data-reveal="" className="iv-next">
              <div>
                <div className="iv-next__label"><Fade>{t(`${base}.next.label`)}</Fade></div>
                <div className="iv-next__title"><Fade>{t(`${base}.next.title`)}</Fade></div>
              </div>
              <div className="iv-next__arrow" aria-hidden="true">↗</div>
            </a>
          </div>
        </section>
      </article>

      <div className="iv-cta-bar">
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
