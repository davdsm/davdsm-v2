import { useEffect, useRef } from 'react'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/LanguageContext'
import { PROJECTS } from '../data/projects'
import '../styles/trama-arquitetos-case-study.css'

const ASSETS = '/assets/work/trama-arquitetos'

const STATUS_COLORS = {
  dark: '#141414',
  light: '#ffffff',
}

function PhoneStatusIcons({ color }) {
  return (
    <span className="tr-phone__status-icons" aria-hidden="true">
      <svg width="15" height="11" viewBox="0 0 16 12">
        <path d="M8 3.1c2.2 0 4.2.85 5.7 2.25l1.35-1.45C13.15 2.15 10.7 1.15 8 1.15S2.85 2.15.95 3.9L2.3 5.35C3.8 3.95 5.8 3.1 8 3.1Z" fill={color} />
        <path d="M8 6c1.25 0 2.4.5 3.25 1.3l1.35-1.45C11.3 4.6 9.75 3.95 8 3.95s-3.3.65-4.6 1.9L4.75 7.3C5.6 6.5 6.75 6 8 6Z" fill={color} />
        <circle cx="8" cy="9.4" r="1.5" fill={color} />
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
      className={`tr-mac${right ? ' tr-mac--right' : ''}${variant === 'compact' ? ' tr-mac--compact' : ''}${variant === 'menu' ? ' tr-mac--menu' : ''}${variant === 'sobre' ? ' tr-mac--sobre' : ''}${variant === 'noBase' ? ' tr-mac--no-base' : ''}`}
      data-nav-theme={variant === 'default' || variant === 'dark' || variant === 'menu' ? undefined : 'light'}
    >
      <div className={`tr-mac__lid${variant === 'dark' ? ' tr-mac__lid--dark' : ''}`}>
        {variant !== 'menu' && variant !== 'sobre' && <div className="tr-mac__notch" />}
        <div className="tr-mac__screen">
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        </div>
      </div>
      {variant !== 'menu' && variant !== 'sobre' && variant !== 'noBase' && (
        <div className="tr-mac__base">
          <div className="tr-mac__base-notch" />
        </div>
      )}
    </div>
  )
}

function Phone({ src, alt, bg, icon = 'dark', offset = false, floatClass = 'tr-float-a' }) {
  const iconColor = STATUS_COLORS[icon]
  return (
    <div className={`tr-phone${offset ? ' tr-phone--offset' : ''} ${floatClass}`}>
      <div className="tr-phone__frame">
        <div className="tr-phone__island" />
        <div className="tr-phone__screen" style={{ background: bg }}>
          <div className="tr-phone__status" style={{ background: bg, color: iconColor }}>
            <span className="tr-phone__status-time">9:41</span>
            <PhoneStatusIcons color={iconColor} />
          </div>
          <div className="tr-phone__media">
            <img src={src} alt={alt} loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </div>
  )
}

function TrReveal({ as: Tag = 'div', className = '', hero = false, children }) {
  const motionProps = hero ? { 'data-hero-reveal': '' } : { 'data-reveal': '' }
  return (
    <Tag {...motionProps} className={`tr-motion-desc ${className}`.trim()}>
      {children}
    </Tag>
  )
}

function NavChip({ lang }) {
  return (
    <div className="tr-nav-chip" aria-hidden="true">
      <div className="tr-nav-chip__mark">
        <div className="tr-dot-logo">
          <div className="tr-dot-logo__grid" />
        </div>
        <div className="tr-nav-chip__name">TRAMA</div>
      </div>
      <div className="tr-nav-chip__lang">
        <strong>{lang.active}</strong>
        <span>|</span>
        <span>{lang.other}</span>
      </div>
      <div className="tr-nav-chip__burger">
        <i /><i /><i />
      </div>
    </div>
  )
}

function RingControl() {
  return (
    <div className="tr-ring-control" aria-hidden="true">
      <div className="tr-ring">
        <div className="tr-ring__arrow" />
      </div>
      <div className="tr-dot-rail">
        <span /><span /><span />
      </div>
    </div>
  )
}

function FiltersWidget({ filters }) {
  return (
    <div className="tr-filters" aria-hidden="true">
      <div className="tr-filters__label"><Fade>{filters.label}</Fade></div>
      <div className="tr-filters__row">
        {filters.items.map((item, i) => (
          <span key={item} className={i === 0 ? 'is-active' : undefined}><Fade>{item}</Fade></span>
        ))}
      </div>
    </div>
  )
}

function ProjectCardWidget({ card }) {
  return (
    <div className="tr-project-card" aria-hidden="true">
      <img src={`${ASSETS}/shots/mobile-galeria.png`} alt="" />
      <div className="tr-project-card__scrim" />
      <div className="tr-project-card__copy">
        <div className="tr-project-card__cat"><Fade>{card.category}</Fade></div>
        <div className="tr-project-card__name">
          <Fade>{card.nameLine1}</Fade><br /><Fade>{card.nameLine2}</Fade>
        </div>
      </div>
    </div>
  )
}

export default function TramaArquitetosCaseStudy() {
  const { t } = useLanguage()
  const rootRef = useRef(null)
  const destroyedRef = useRef(false)
  const base = 'projectDetail.tramaArquitetos.caseStudy'
  const project = PROJECTS.tramaArquitetos

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
    const pxEls = $$('[data-tr-parallax]').map((el) => ({ el, speed: parseFloat(el.getAttribute('data-tr-parallax')) || 0 }))
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

  const langToggle = t(`${base}.floating.lang`)
  const filters = t(`${base}.floating.filters`)
  const projectCard = t(`${base}.floating.projectCard`)
  const kitNav = t(`${base}.approach.nav`)
  const kitMeta = t(`${base}.approach.meta`)
  const form = t(`${base}.screens.contact.form`)
  const stats = t(`${base}.outcome.stats`)

  return (
    <div ref={rootRef}>
      <article className="tr-page">
        <header className="tr-hero" data-nav-theme="dark">
          <img className="tr-hero-bg" src={`${ASSETS}/shots/flowers-bg.png`} alt="" aria-hidden="true" loading="eager" decoding="async" />
          <div className="tr-hero-scrim" aria-hidden="true" />

          <div className="tr-hero-inner">
            <TrReveal hero as="div" className="tr-eyebrow"><Fade>{t(`${base}.eyebrow`)}</Fade></TrReveal>
            <h1 className="tr-title">
              <span className="tr-word-mask">
                <span data-hero-word="" className="tr-motion-word"><Fade>{t(`${base}.title`)}</Fade></span>
              </span>
            </h1>
            <TrReveal hero as="div" className="tr-title-sub"><Fade>{t(`${base}.titleSub`)}</Fade></TrReveal>
            <TrReveal hero as="p" className="tr-tagline"><Fade>{t(`${base}.tagline`)}</Fade></TrReveal>
            <TrReveal hero as="p" className="tr-hero-summary">
              <Fade>{t(`${base}.heroSummaryPre`)}</Fade>
              <strong><Fade>{t(`${base}.heroSummaryStrong`)}</Fade></strong>
              <Fade>{t(`${base}.heroSummaryPost`)}</Fade>
            </TrReveal>
            <TrReveal hero as="div" className="tr-meta-row">
              {['role', 'scope', 'year'].map((key) => (
                <div key={key}>
                  <div className="tr-meta-label"><Fade>{t(`${base}.meta.${key}.label`)}</Fade></div>
                  <div className="tr-meta-value"><Fade>{t(`${base}.meta.${key}.value`)}</Fade></div>
                </div>
              ))}
            </TrReveal>
          </div>

          <TrReveal hero as="div" className="tr-floaters">
            <div className="tr-floater tr-float-b"><NavChip lang={langToggle} /></div>
            <div className="tr-floater tr-float-a"><RingControl /></div>
            <div className="tr-floater tr-float-c"><FiltersWidget filters={filters} /></div>
            <div className="tr-floater tr-float-a"><ProjectCardWidget card={projectCard} /></div>
          </TrReveal>

          <div className="tr-scroll-hint"><Fade>{t(`${base}.scrollHint`)}</Fade></div>
        </header>

        <section className="tr-challenge" data-nav-theme="dark">
          <div className="tr-inner tr-challenge-grid">
            <div data-reveal="">
              <div className="tr-index"><Fade>{t(`${base}.challenge.index`)}</Fade></div>
              <h2 className="tr-h2"><Fade>{t(`${base}.challenge.title`)}</Fade></h2>
              <p className="tr-body"><Fade>{t(`${base}.challenge.text`)}</Fade></p>
            </div>
            <div data-reveal="" data-tr-parallax="-0.06">
              <div className="tr-float-a">
                <MacBook variant="dark" right src={`${ASSETS}/shots/desktop-hero-dark.png`} alt={t(`${base}.challenge.alt`)} />
              </div>
            </div>
          </div>
        </section>

        <section className="tr-approach" data-nav-theme="light">
          <div className="tr-inner">
            <div data-reveal="" className="tr-approach-lead">
              <div className="tr-index tr-index--green"><Fade>{t(`${base}.approach.index`)}</Fade></div>
              <h2 className="tr-approach-title">
                <Fade>{t(`${base}.approach.titleLine1`)}</Fade><br /><Fade>{t(`${base}.approach.titleLine2`)}</Fade>
              </h2>
              <p className="tr-body tr-body--dark"><Fade>{t(`${base}.approach.text`)}</Fade></p>
            </div>

            <div data-reveal="" className="tr-kit">
              <div className="tr-kit-label"><Fade>{t(`${base}.approach.kitLabel`)}</Fade></div>
              <div className="tr-kit-row">
                <div className="tr-kit-logo tr-float-b" aria-hidden="true">
                  <div className="tr-kit-logo__mark"><div className="tr-kit-logo__grid" /></div>
                  <div className="tr-kit-logo__name">TRAMA</div>
                  <div className="tr-kit-logo__sub">ARQUITETOS</div>
                </div>
                <div className="tr-kit-controls tr-float-a" aria-hidden="true">
                  <div className="tr-kit-circle"><div className="tr-kit-circle__arrow tr-kit-circle__arrow--next" /></div>
                  <div className="tr-kit-circle"><div className="tr-kit-circle__arrow tr-kit-circle__arrow--down" /></div>
                  <div className="tr-kit-pause"><i /><i /></div>
                </div>
                <div className="tr-kit-nav tr-float-c" aria-hidden="true">
                  {kitNav.map((item, i) => (
                    <span key={item} className={i === 0 ? 'is-active' : undefined}><Fade>{item}</Fade></span>
                  ))}
                </div>
                <div className="tr-kit-meta tr-float-a" aria-hidden="true">
                  {kitMeta.map((row) => (
                    <div key={row.label}>
                      <div className="tr-kit-meta__label"><Fade>{row.label}</Fade></div>
                      <div className="tr-kit-meta__value"><Fade>{row.value}</Fade></div>
                    </div>
                  ))}
                </div>
                <div className="tr-kit-dots tr-float-c" aria-hidden="true">
                  <span /><span /><span /><span /><span />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tr-screens" data-nav-theme="light">
          <div className="tr-inner">
            <div data-reveal="" className="tr-index tr-index--green tr-screens-index"><Fade>{t(`${base}.screens.index`)}</Fade></div>

            <div data-reveal="" className="tr-screen-block">
              <div data-tr-parallax="-0.03" className="tr-screen-projetos">
                <MacBook src={`${ASSETS}/shots/desktop-projetos.png`} alt={t(`${base}.screens.projetos.alt`)} />
                <div style={{ paddingBottom: 20 }}>
                  <div className="tr-screen-title"><Fade>{t(`${base}.screens.projetos.title`)}</Fade></div>
                  <p className="tr-screen-text"><Fade>{t(`${base}.screens.projetos.text`)}</Fade></p>
                </div>
              </div>
            </div>

            <div data-reveal="" className="tr-screen-block tr-screen-sobre">
              <div className="tr-screen-sobre__copy">
                <div className="tr-kicker-mini"><Fade>{t(`${base}.screens.sobre.kicker`)}</Fade></div>
                <div className="tr-screen-title"><Fade>{t(`${base}.screens.sobre.title`)}</Fade></div>
                <p className="tr-screen-text"><Fade>{t(`${base}.screens.sobre.text`)}</Fade></p>
              </div>
              <div className="tr-float-c">
                <MacBook variant="sobre" src={`${ASSETS}/shots/desktop-sobre.png`} alt={t(`${base}.screens.sobre.alt`)} />
              </div>
            </div>

            <div data-reveal="" className="tr-screen-block">
              <div data-tr-parallax="-0.03" className="tr-screen-hero-light">
                <div className="tr-screen-hero-light__head">
                  <div className="tr-screen-title"><Fade>{t(`${base}.screens.heroLight.title`)}</Fade></div>
                  <p className="tr-screen-text"><Fade>{t(`${base}.screens.heroLight.text`)}</Fade></p>
                </div>
                <MacBook variant="compact" src={`${ASSETS}/shots/desktop-hero-light.png`} alt={t(`${base}.screens.heroLight.alt`)} />
              </div>
            </div>
          </div>

          <div data-reveal="" className="tr-dark-chapter" data-nav-theme="dark">
            <div className="tr-inner tr-dark-chapter-grid">
              <div>
                <div className="tr-index tr-index--muted"><Fade>{t(`${base}.screens.menu.kicker`)}</Fade></div>
                <h2 className="tr-h2"><Fade>{t(`${base}.screens.menu.title`)}</Fade></h2>
                <p className="tr-body tr-body--muted"><Fade>{t(`${base}.screens.menu.text`)}</Fade></p>
              </div>
              <div data-tr-parallax="-0.05">
                <div className="tr-float-a">
                  <MacBook variant="menu" src={`${ASSETS}/shots/desktop-menu.png`} alt={t(`${base}.screens.menu.alt`)} />
                </div>
              </div>
            </div>
          </div>

          <div className="tr-inner">
            <div data-reveal="" className="tr-screen-contact">
              <div data-tr-parallax="-0.04">
                <div className="tr-float-c">
                  <MacBook src={`${ASSETS}/shots/desktop-contactos.png`} alt={t(`${base}.screens.contact.alt`)} />
                </div>
              </div>
              <div>
                <div className="tr-kicker-mini"><Fade>{t(`${base}.screens.contact.kicker`)}</Fade></div>
                <div className="tr-screen-title" style={{ fontSize: 28 }}><Fade>{t(`${base}.screens.contact.title`)}</Fade></div>
                <p className="tr-screen-text"><Fade>{t(`${base}.screens.contact.text`)}</Fade></p>
                <div className="tr-form-mock" aria-hidden="true">
                  <div className="tr-form-mock__field"><Fade>{form.name}</Fade></div>
                  <div className="tr-form-mock__row">
                    <div className="tr-form-mock__field"><Fade>{form.phone}</Fade></div>
                    <div className="tr-form-mock__field"><Fade>{form.email}</Fade></div>
                  </div>
                  <div className="tr-form-mock__field tr-form-mock__field--tall"><Fade>{form.message}</Fade></div>
                  <div className="tr-form-mock__send"><Fade>{form.send}</Fade> <span aria-hidden="true">›</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tr-mobile" data-nav-theme="dark">
          <div className="tr-inner">
            <div data-reveal="" className="tr-mobile-head">
              <div className="tr-index"><Fade>{t(`${base}.mobile.index`)}</Fade></div>
              <h2 className="tr-h2">
                <Fade>{t(`${base}.mobile.titleLine1`)}</Fade><br /><Fade>{t(`${base}.mobile.titleLine2`)}</Fade>
              </h2>
            </div>
            <div data-reveal="" data-tr-parallax="-0.04" className="tr-phones">
              <Phone src={`${ASSETS}/shots/mobile-hero.png`} alt={t(`${base}.mobile.alts.hero`)} bg="#0b0b0b" icon="light" floatClass="tr-float-a" />
              <Phone src={`${ASSETS}/shots/mobile-menu.png`} alt={t(`${base}.mobile.alts.menu`)} bg="#ffffff" icon="dark" offset floatClass="tr-float-c" />
              <Phone src={`${ASSETS}/shots/mobile-detalhe.png`} alt={t(`${base}.mobile.alts.detail`)} bg="#ffffff" icon="dark" floatClass="tr-float-b" />
              <Phone src={`${ASSETS}/shots/mobile-galeria.png`} alt={t(`${base}.mobile.alts.gallery`)} bg="#8fb4cf" icon="light" offset floatClass="tr-float-a" />
            </div>
          </div>
        </section>

        <section className="tr-outcome" data-nav-theme="light">
          <div className="tr-outcome-inner">
            <div data-reveal="">
              <div className="tr-outcome-icon" aria-hidden="true"><div className="tr-outcome-icon__grid" /></div>
              <div className="tr-index tr-index--green"><Fade>{t(`${base}.outcome.index`)}</Fade></div>
              <h2 className="tr-outcome-title"><Fade>{t(`${base}.outcome.title`)}</Fade></h2>
              <p className="tr-outcome-text"><Fade>{t(`${base}.outcome.text`)}</Fade></p>
            </div>
            <div data-reveal="" className="tr-stats">
              {['projects', 'categories', 'languages'].map((key) => (
                <div key={key}>
                  <div className="tr-stat-value">{stats[key].value}</div>
                  <div className="tr-stat-label"><Fade>{stats[key].label}</Fade></div>
                </div>
              ))}
            </div>
            <a href="#/work/phfConcept" data-reveal="" className="tr-next">
              <div>
                <div className="tr-next__label"><Fade>{t(`${base}.next.label`)}</Fade></div>
                <div className="tr-next__title"><Fade>{t(`${base}.next.title`)}</Fade></div>
              </div>
              <div className="tr-next__arrow" aria-hidden="true">↗</div>
            </a>
          </div>
        </section>
      </article>

      <div className="tr-cta-bar">
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
