import { useEffect, useRef } from 'react'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/LanguageContext'
import { PROJECTS } from '../data/projects'
import '../styles/am-prestige-case-study.css'

const ASSETS = '/assets/work/am-prestige'

const COLOUR_SWATCHES = [
  { key: 'ink', bg: '#000000', nameColor: '#ffffff', hexColor: '#848484' },
  { key: 'surface', bg: '#f2f0ef', border: '1px solid #deddda', nameColor: '#1a1c1c', hexColor: '#7e7576' },
  { key: 'paper', bg: '#f9f7f2', border: '1px solid #deddda', nameColor: '#1a1c1c', hexColor: '#7e7576' },
  { key: 'racingGreen', bg: '#1b3022', nameColor: '#ffffff', hexColor: '#728977' },
  { key: 'inkMuted', bg: '#1a1c1c', nameColor: '#ffffff', hexColor: '#848484' },
]

function MacBookPro({ src, alt }) {
  return (
    <div className="amp-mbp" data-nav-theme="light">
      <div className="amp-mbp__tilt">
        <div className="amp-mbp__screen">
          <img src={src} alt={alt} loading="eager" decoding="async" />
        </div>
        <div className="amp-mbp__base">
          <div className="amp-mbp__notch" />
        </div>
      </div>
    </div>
  )
}

function MacBookAir({ src, alt, tilt = 'left' }) {
  return (
    <div className="amp-mba" data-nav-theme="light">
      <div className={`amp-mba__tilt--${tilt}`}>
        <div className="amp-mba__screen">
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        </div>
        <div className="amp-mba__base" />
      </div>
    </div>
  )
}

function IPhone({ src, alt, variant = 'left' }) {
  return (
    <div className={`amp-phone-wrap amp-phone-wrap--${variant}`} data-nav-theme="light">
      <div className="amp-phone">
        <div className="amp-phone__island" />
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </div>
  )
}

function AmpMotionWord({ children, hero = false }) {
  return (
    <span className="amp-word-mask">
      <span data-hero-word={hero ? '' : undefined} data-reveal-word={hero ? undefined : ''} className="amp-motion-word">
        <Fade>{children}</Fade>
      </span>
    </span>
  )
}

function AmpSectionTitle({ className, children }) {
  return (
    <h2 className={className}>
      <span className="amp-word-mask amp-word-mask--block">
        <span data-reveal-word="" className="amp-motion-word">
          <Fade>{children}</Fade>
        </span>
      </span>
    </h2>
  )
}

function AmpMotionDesc({ as: Tag = 'div', className, children, hero = false }) {
  const motionProps = hero ? { 'data-hero-reveal': '' } : { 'data-reveal-desc': '' }
  return (
    <Tag {...motionProps} className={`amp-motion-desc ${className || ''}`.trim()}>
      {children}
    </Tag>
  )
}

export default function AmPrestigeCaseStudy() {
  const { t } = useLanguage()
  const rootRef = useRef(null)
  const destroyedRef = useRef(false)
  const base = 'projectDetail.amPrestige.caseStudy'
  const project = PROJECTS.amPrestige

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
      // Later matches win over earlier ones: nested markers (e.g. a light
      // device-mockup screenshot inside an otherwise dark section) always
      // come after their ancestor in document order, so this lets the most
      // specific section under the nav decide the theme.
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
          const el = entry.target
          if (el.hasAttribute('data-reveal-word')) {
            el.style.transform = 'translateY(0)'
          } else if (el.hasAttribute('data-reveal-desc')) {
            el.style.opacity = '1'
            el.style.transform = 'none'
          } else {
            el.style.opacity = '1'
            el.style.transform = 'none'
          }
          io.unobserve(el)
        })
      },
      { threshold: 0.12 },
    )
    $$('[data-reveal]').forEach((el) => io.observe(el))
    $$('[data-reveal-word]').forEach((el) => io.observe(el))
    $$('[data-reveal-desc]').forEach((el) => io.observe(el))

    return () => {
      destroyedRef.current = true
      if (onPtReveal) window.removeEventListener('davdsm:pt-reveal', onPtReveal)
      if (heroTimeout) clearTimeout(heroTimeout)
      window.removeEventListener('scroll', updateNavTheme)
      io.disconnect()
    }
  }, [])

  const desktopScreens = [
    { src: `${ASSETS}/02-viatura.png`, captionKey: 'viatura', tilt: 'left' },
    { src: `${ASSETS}/03-galeria.png`, captionKey: 'galeria', tilt: 'right' },
    { src: `${ASSETS}/04-reserva.png`, captionKey: 'reserva', tilt: 'right' },
    { src: `${ASSETS}/05-eventos.png`, captionKey: 'eventos', tilt: 'left' },
  ]

  return (
    <div ref={rootRef}>
      <article className="amp-page">
        <header className="amp-section amp-section--hero" data-nav-theme="dark">
          <AmpMotionDesc hero as="div" className="amp-kicker-row">
            <div className="amp-kicker"><Fade>{t(`${base}.eyebrow`)}</Fade></div>
            <div className="amp-kicker amp-kicker--muted">(01)</div>
          </AmpMotionDesc>
          <h1 className="amp-title">
            <AmpMotionWord hero>AM</AmpMotionWord>
            <AmpMotionWord hero>Prestige</AmpMotionWord>
          </h1>
          <AmpMotionDesc hero className="amp-hero-body">
            <p className="amp-hero-summary"><Fade>{t(`${base}.heroSummary`)}</Fade></p>
            <div className="amp-meta-row">
              {['year', 'role', 'scope'].map((key) => (
                <div key={key} className="amp-meta-item">
                  <div className="amp-meta-item__label"><Fade>{t(`${base}.meta.${key}.label`)}</Fade></div>
                  <div className="amp-meta-item__value"><Fade>{t(`${base}.meta.${key}.value`)}</Fade></div>
                </div>
              ))}
            </div>
          </AmpMotionDesc>
        </header>

        <section className="amp-section amp-section--hero-mockup" data-nav-theme="dark">
          <AmpMotionDesc hero className="amp-stage amp-stage--hero">
            <MacBookPro src={`${ASSETS}/01-principal.png`} alt={t(`${base}.mockupHeroAlt`)} />
            <div className="amp-stage-captions">
              <div className="amp-stage-caption"><Fade>{t(`${base}.mockupHeroCaption`)}</Fade></div>
              <div className="amp-stage-caption amp-stage-caption--accent"><Fade>{t(`${base}.mockupHeroDevice`)}</Fade></div>
            </div>
          </AmpMotionDesc>
        </section>

        <section className="amp-section amp-section--overview" data-nav-theme="dark">
          <div className="amp-split">
            <AmpMotionDesc className="amp-split__label"><Fade>{t(`${base}.overview.label`)}</Fade></AmpMotionDesc>
            <div>
              <AmpMotionDesc as="p" className="amp-quote"><Fade>{t(`${base}.overview.quote`)}</Fade></AmpMotionDesc>
              <AmpMotionDesc as="p" className="amp-body"><Fade>{t(`${base}.overview.text`)}</Fade></AmpMotionDesc>
            </div>
          </div>
        </section>

        <section className="amp-section amp-colours" data-nav-theme="dark">
          <div>
            <div className="amp-heading-row">
              <AmpSectionTitle className="amp-h2 amp-h2--white">{t(`${base}.colour.title`)}</AmpSectionTitle>
              <div className="amp-kicker amp-kicker--white"><Fade>{t(`${base}.colour.index`)}</Fade></div>
            </div>
            <AmpMotionDesc as="p" className="amp-section-intro"><Fade>{t(`${base}.colour.text`)}</Fade></AmpMotionDesc>
          </div>
          <div data-reveal="" className="amp-swatches">
            {COLOUR_SWATCHES.map((swatch) => (
              <div
                key={swatch.key}
                className="amp-swatch"
                style={{ background: swatch.bg, border: swatch.border }}
              >
                <div className="amp-swatch__name" style={{ color: swatch.nameColor }}>
                  <Fade>{t(`${base}.colour.swatches.${swatch.key}.name`)}</Fade>
                </div>
                <div className="amp-swatch__hex" style={{ color: swatch.hexColor }}>
                  <Fade>{t(`${base}.colour.swatches.${swatch.key}.hex`)}</Fade>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="amp-section amp-section--lettering" data-nav-theme="light">
          <div className="amp-heading-row">
            <AmpSectionTitle className="amp-h2">{t(`${base}.lettering.title`)}</AmpSectionTitle>
            <div className="amp-kicker amp-kicker--green"><Fade>{t(`${base}.lettering.index`)}</Fade></div>
          </div>
          <div data-reveal="" className="amp-lettering-grid">
            <div className="amp-type-specimen">
              <div className="amp-type-specimen__aa">Aa</div>
              <div className="amp-type-specimen__phrase"><Fade>{t(`${base}.lettering.phrase`)}</Fade></div>
              <div className="amp-type-specimen__charset"><Fade>{t(`${base}.lettering.charset`)}</Fade></div>
            </div>
            <div className="amp-lettering-side">
              <div className="amp-type-card amp-type-card--dark">
                <div className="amp-type-card__label"><Fade>{t(`${base}.lettering.typefaceLabel`)}</Fade></div>
                <div className="amp-type-card__name">Inter</div>
                <div className="amp-type-card__text"><Fade>{t(`${base}.lettering.typefaceText`)}</Fade></div>
              </div>
              <div className="amp-type-card amp-type-card--paper">
                <div className="amp-type-card__label"><Fade>{t(`${base}.lettering.numericLabel`)}</Fade></div>
                <div className="amp-folio-labels">
                  <span><Fade>{t(`${base}.lettering.folioLeft`)}</Fade></span>
                  <span><Fade>{t(`${base}.lettering.folioRight`)}</Fade></span>
                </div>
                <div className="amp-folio-rule"><Fade>{t(`${base}.lettering.folioNote`)}</Fade></div>
              </div>
            </div>
          </div>
        </section>

        <section className="amp-section amp-components" data-nav-theme="light">
          <div className="amp-heading-row">
            <AmpSectionTitle className="amp-h2">{t(`${base}.components.title`)}</AmpSectionTitle>
            <div className="amp-kicker amp-kicker--green"><Fade>{t(`${base}.components.index`)}</Fade></div>
          </div>
          <div data-reveal="" className="amp-component-grid">
            <div className="amp-component-card">
              <div className="amp-component-card__label"><Fade>{t(`${base}.components.buttons.label`)}</Fade></div>
              <div className="amp-btn-stack">
                <span className="amp-btn amp-btn--solid"><Fade>{t(`${base}.components.buttons.primary`)}</Fade></span>
                <span className="amp-btn amp-btn--outline"><Fade>{t(`${base}.components.buttons.secondary`)}</Fade></span>
                <span className="amp-btn amp-btn--rainbow"><Fade>{t(`${base}.components.buttons.rainbow`)}</Fade></span>
              </div>
              <p className="amp-component-card__note"><Fade>{t(`${base}.components.buttons.note`)}</Fade></p>
            </div>
            <div className="amp-component-card">
              <div className="amp-component-card__label"><Fade>{t(`${base}.components.fields.label`)}</Fade></div>
              <div className="amp-field-stack">
                <div>
                  <div className="amp-field__label"><Fade>{t(`${base}.components.fields.nameLabel`)}</Fade></div>
                  <div className="amp-field__value"><Fade>{t(`${base}.components.fields.nameValue`)}</Fade></div>
                </div>
                <div>
                  <div className="amp-field__label"><Fade>{t(`${base}.components.fields.dateLabel`)}</Fade></div>
                  <div className="amp-field__value amp-field__value--muted"><Fade>{t(`${base}.components.fields.dateValue`)}</Fade></div>
                </div>
              </div>
              <p className="amp-component-card__note"><Fade>{t(`${base}.components.fields.note`)}</Fade></p>
            </div>
            <div className="amp-component-card">
              <div className="amp-component-card__label"><Fade>{t(`${base}.components.fleet.label`)}</Fade></div>
              <div className="amp-fleet-card">
                <img src={`${ASSETS}/fleet-card.jpg`} alt="" />
                <div className="amp-fleet-card__body">
                  <div className="amp-fleet-card__row">
                    <div className="amp-fleet-card__name"><Fade>{t(`${base}.components.fleet.name`)}</Fade></div>
                    <div className="amp-fleet-card__year"><Fade>{t(`${base}.components.fleet.year`)}</Fade></div>
                  </div>
                  <div className="amp-fleet-card__meta"><Fade>{t(`${base}.components.fleet.meta`)}</Fade></div>
                </div>
              </div>
              <p className="amp-component-card__note"><Fade>{t(`${base}.components.fleet.note`)}</Fade></p>
            </div>
          </div>
        </section>

        <section className="amp-section amp-section--screens-head" data-nav-theme="light">
          <div className="amp-heading-row">
            <AmpSectionTitle className="amp-h2">{t(`${base}.screens.title`)}</AmpSectionTitle>
            <div className="amp-kicker amp-kicker--green"><Fade>{t(`${base}.screens.index`)}</Fade></div>
          </div>
        </section>

        <div data-nav-theme="dark">
          <div data-reveal="" className="amp-screens-grid">
            {desktopScreens.slice(0, 2).map((screen) => (
              <div key={screen.captionKey} className="amp-stage amp-stage--desk">
                <MacBookAir src={screen.src} alt={t(`${base}.screens.items.${screen.captionKey}.alt`)} tilt={screen.tilt} />
                <div className="amp-stage-captions">
                  <div className="amp-stage-caption amp-stage-caption--white">
                    <Fade>{t(`${base}.screens.items.${screen.captionKey}.caption`)}</Fade>
                  </div>
                  <div className="amp-stage-caption amp-stage-caption--accent">
                    <Fade>{t(`${base}.screens.device`)}</Fade>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div data-reveal="" className="amp-screens-grid amp-screens-grid--offset">
            {desktopScreens.slice(2).map((screen) => (
              <div key={screen.captionKey} className="amp-stage amp-stage--desk">
                <MacBookAir src={screen.src} alt={t(`${base}.screens.items.${screen.captionKey}.alt`)} tilt={screen.tilt} />
                <div className="amp-stage-captions">
                  <div className="amp-stage-caption amp-stage-caption--white">
                    <Fade>{t(`${base}.screens.items.${screen.captionKey}.caption`)}</Fade>
                  </div>
                  <div className="amp-stage-caption amp-stage-caption--accent">
                    <Fade>{t(`${base}.screens.device`)}</Fade>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="amp-stage amp-stage--mobile" data-nav-theme="dark">
          <div className="amp-heading-row">
            <AmpSectionTitle className="amp-h2 amp-h2--white">{t(`${base}.mobile.title`)}</AmpSectionTitle>
            <div className="amp-kicker amp-kicker--muted"><Fade>{t(`${base}.mobile.index`)}</Fade></div>
          </div>
          <div data-reveal="" className="amp-phones">
            <IPhone src={`${ASSETS}/07-mobile-home.png`} alt={t(`${base}.mobile.items.home`)} variant="left" />
            <IPhone src={`${ASSETS}/08-mobile-lightbox.png`} alt={t(`${base}.mobile.items.lightbox`)} variant="center" />
            <IPhone src={`${ASSETS}/09-mobile-menu.png`} alt={t(`${base}.mobile.items.menu`)} variant="right" />
          </div>
          <AmpMotionDesc as="p" className="amp-body amp-body--center"><Fade>{t(`${base}.mobile.text`)}</Fade></AmpMotionDesc>
        </section>

        <section className="amp-section amp-section--outcome" data-nav-theme="light">
          <div className="amp-split">
            <AmpMotionDesc className="amp-split__label amp-split__label--green"><Fade>{t(`${base}.outcome.label`)}</Fade></AmpMotionDesc>
            <AmpMotionDesc as="p" className="amp-body amp-body--dark"><Fade>{t(`${base}.outcome.text`)}</Fade></AmpMotionDesc>
          </div>
          <a href="#/work/singula" data-reveal="" className="amp-next">
            <div>
              <div className="amp-next__label"><Fade>{t(`${base}.next.label`)}</Fade></div>
              <div className="amp-next__title"><Fade>{t(`${base}.next.title`)}</Fade></div>
            </div>
            <div className="amp-next__arrow" aria-hidden="true">↗</div>
          </a>
        </section>
      </article>

      <div className="amp-cta-bar">
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
