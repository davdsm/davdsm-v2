import { useEffect, useRef } from 'react'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/LanguageContext'
import { PROJECTS } from '../data/projects'
import '../styles/phf-concept-case-study.css'

const ASSETS = '/assets/work/phf-concept'

const PRIMARY_SWATCHES = [
  { key: 'primary', hex: '#36474F' },
  { key: 'navy', hex: '#131735' },
  { key: 'darkGreen', hex: '#313B2E' },
  { key: 'titles', hex: '#1E1B13' },
]

const SECONDARY_SWATCHES = [
  { key: 'sectionTitles', hex: '#282828', bordered: false },
  { key: 'cardTitles', hex: '#131313', bordered: false },
  { key: 'bodyText', hex: '#5A5A59', bordered: false },
  { key: 'borders', hex: '#DCDCDC', bordered: false },
  { key: 'sectionBg', hex: '#F7F7F7', bordered: true },
  { key: 'imageBg', hex: '#F1F1F1', bordered: true },
]

function PhfPhoneStatusIcons() {
  return (
    <span className="phf-phone__status-icons" aria-hidden="true">
      <svg width="14" height="9" viewBox="0 0 17 11" fill="#131313"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
      <svg width="13" height="9" viewBox="0 0 16 11" fill="none" stroke="#131313" strokeWidth="1.5"><path d="M1 3.6C3 1.9 5.4 1 8 1s5 .9 7 2.6" /><path d="M3.4 6.3C4.7 5.2 6.3 4.6 8 4.6s3.3.6 4.6 1.7" /><path d="M6 8.9c.6-.5 1.3-.8 2-.8s1.4.3 2 .8" /></svg>
      <svg width="20" height="10" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="rgba(19,19,19,0.35)" /><rect x="2" y="2" width="17" height="8" rx="2" fill="#131313" /><path d="M23 4.2v3.6c1-.3 1.4-1 1.4-1.8s-.4-1.5-1.4-1.8Z" fill="rgba(19,19,19,0.35)" /></svg>
    </span>
  )
}

function PhfMacBook({ src, alt, onLight = false }) {
  return (
    <div className={`phf-mac${onLight ? ' phf-mac--onlight' : ''}`} data-nav-theme={onLight ? 'light' : undefined}>
      <div className="phf-mac__lid">
        <div className="phf-mac__screen">
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        </div>
      </div>
      <div className="phf-mac__hinge" />
      <div className="phf-mac__foot" />
    </div>
  )
}

function PhfIPhone({ src, alt, large = false }) {
  return (
    <div className={`phf-phone${large ? ' phf-phone--large' : ''}`} data-nav-theme="light">
      <div className="phf-phone__screen">
        <div className="phf-phone__status">
          <span className="phf-phone__status-time">9:41</span>
          <PhfPhoneStatusIcons />
        </div>
        <img className="phf-phone__media" src={src} alt={alt} loading="lazy" decoding="async" />
        <div className="phf-phone__island" />
      </div>
    </div>
  )
}

function PhfReveal({ as: Tag = 'div', className = '', hero = false, children }) {
  const motionProps = hero ? { 'data-hero-reveal': '' } : { 'data-reveal': '' }
  return (
    <Tag {...motionProps} className={`phf-motion-desc ${className}`.trim()}>
      {children}
    </Tag>
  )
}

function PhfSwatch({ hex, bordered, name, hexLabel, desc, size = 'lg' }) {
  return (
    <div className="phf-swatch">
      <div
        className={`phf-swatch__chip${size === 'sm' ? ' phf-swatch__chip--sm' : ''}${bordered ? ' phf-swatch__chip--bordered' : ''}`}
        style={{ background: hex }}
      />
      {name && <span className="phf-swatch__name">{name}</span>}
      <span className={`phf-swatch__hex${size === 'sm' ? ' phf-swatch__hex--sm' : ''}`}>{hexLabel}</span>
      <span className={`phf-swatch__desc${size === 'sm' ? ' phf-swatch__desc--sm' : ''}`}>{desc}</span>
    </div>
  )
}

export default function PhfConceptCaseStudy() {
  const { t } = useLanguage()
  const rootRef = useRef(null)
  const destroyedRef = useRef(false)
  const base = 'projectDetail.phfConcept.caseStudy'
  const project = PROJECTS.phfConcept

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

    return () => {
      destroyedRef.current = true
      if (onPtReveal) window.removeEventListener('davdsm:pt-reveal', onPtReveal)
      if (heroTimeout) clearTimeout(heroTimeout)
      window.removeEventListener('scroll', updateNavTheme)
      io.disconnect()
    }
  }, [])

  const componentItems = t(`${base}.components.items`)

  return (
    <div ref={rootRef}>
      <article className="phf-page">
        {/* ---------- Intro ---------- */}
        <header className="phf-hero" data-nav-theme="dark">
          <div className="phf-inner">
            <PhfReveal hero as="div" className="phf-kicker">
              <span className="phf-kicker-dot" aria-hidden="true" />
              <Fade>{t(`${base}.eyebrow`)}</Fade>
            </PhfReveal>
            <h1 className="phf-hero-title">
              <span className="phf-word-mask">
                <span data-hero-word="" className="phf-motion-word">
                  <Fade>{t(`${base}.title`)}</Fade>
                </span>
              </span>
            </h1>
            <PhfReveal hero as="p" className="phf-hero-summary"><Fade>{t(`${base}.summary`)}</Fade></PhfReveal>
            <PhfReveal hero as="div" className="phf-meta-grid">
              {['cliente', 'ambito', 'tecnologia', 'idiomas'].map((key) => (
                <div key={key} className="phf-meta-item">
                  <span className="phf-meta-item__label"><Fade>{t(`${base}.meta.${key}.label`)}</Fade></span>
                  <span className="phf-meta-item__value"><Fade>{t(`${base}.meta.${key}.value`)}</Fade></span>
                </div>
              ))}
            </PhfReveal>
          </div>
        </header>

        {/* ---------- Hero devices on flores bg ---------- */}
        <section className="phf-devices" data-nav-theme="dark">
          <div className="phf-inner">
            <div data-reveal="" className="phf-devices-stage">
              <img className="phf-devices-bg" src={`${ASSETS}/assets/flores.png`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <div className="phf-devices-scrim" aria-hidden="true" />
              <div className="phf-devices-inner">
                <p className="phf-devices-title">
                  <Fade>{t(`${base}.heroDevices.titleLine1`)}</Fade><br /><Fade>{t(`${base}.heroDevices.titleLine2`)}</Fade>
                </p>
                <div className="phf-devices-row">
                  <PhfMacBook src={`${ASSETS}/shots/desktop-home.png`} alt={t(`${base}.heroDevices.macbookAlt`)} />
                  <PhfIPhone src={`${ASSETS}/shots/mobile-home.png`} alt={t(`${base}.heroDevices.iphoneAlt`)} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Responsivo ---------- */}
        <section className="phf-responsive" data-nav-theme="light">
          <div className="phf-inner">
            <div className="phf-section-head">
              <span className="phf-kicker phf-kicker--green"><Fade>{t(`${base}.responsive.kicker`)}</Fade></span>
              <h2 className="phf-h2"><Fade>{t(`${base}.responsive.title`)}</Fade></h2>
              <p className="phf-body"><Fade>{t(`${base}.responsive.text`)}</Fade></p>
            </div>
            <div data-reveal="" className="phf-responsive-grid">
              <div className="phf-shot-stack">
                <div className="phf-shot-frame">
                  <PhfMacBook onLight src={`${ASSETS}/shots/desktop-solucoes.png`} alt={t(`${base}.responsive.desktopAlt`)} />
                </div>
                <span className="phf-shot-caption"><Fade>{t(`${base}.responsive.desktopCaption`)}</Fade></span>
              </div>
              <div className="phf-shot-stack phf-shot-stack--centered">
                <PhfIPhone large src={`${ASSETS}/shots/mobile-solucoes.png`} alt={t(`${base}.responsive.mobileAlt`)} />
                <span className="phf-shot-caption"><Fade>{t(`${base}.responsive.mobileCaption`)}</Fade></span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Paleta ---------- */}
        <section data-nav-theme="light">
          <div className="phf-inner">
            <div className="phf-palette">
              <div className="phf-section-head">
                <span className="phf-kicker"><Fade>{t(`${base}.colour.kicker`)}</Fade></span>
                <h2 className="phf-h2"><Fade>{t(`${base}.colour.title`)}</Fade></h2>
                <p className="phf-body"><Fade>{t(`${base}.colour.text`)}</Fade></p>
              </div>
              <div data-reveal="" className="phf-swatch-grid-lg">
                {PRIMARY_SWATCHES.map((s) => (
                  <PhfSwatch
                    key={s.key}
                    hex={s.hex}
                    hexLabel={s.hex}
                    name={t(`${base}.colour.swatches.${s.key}.name`)}
                    desc={t(`${base}.colour.swatches.${s.key}.desc`)}
                  />
                ))}
              </div>
              <div data-reveal="" className="phf-swatch-grid-sm">
                {SECONDARY_SWATCHES.map((s) => (
                  <PhfSwatch
                    key={s.key}
                    hex={s.hex}
                    hexLabel={s.hex}
                    bordered={s.bordered}
                    desc={t(`${base}.colour.swatches.${s.key}.desc`)}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Tipografia ---------- */}
        <section className="phf-type" data-nav-theme="light">
          <div className="phf-inner">
            <div className="phf-type-grid">
              <div className="phf-section-head">
                <span className="phf-kicker phf-kicker--muted"><Fade>{t(`${base}.type.kicker`)}</Fade></span>
                <h2 className="phf-h2"><Fade>{t(`${base}.type.title`)}</Fade></h2>
                <p className="phf-body"><Fade>{t(`${base}.type.text`)}</Fade></p>
              </div>
              <div data-reveal="" className="phf-type-card">
                <div className="phf-type-specimen">
                  <span className="phf-type-specimen__label"><Fade>{t(`${base}.type.specimens.headline.label`)}</Fade></span>
                  <span className="phf-type-specimen__sample phf-type-specimen__sample--headline"><Fade>{t(`${base}.type.specimens.headline.sample`)}</Fade></span>
                </div>
                <div className="phf-type-specimen">
                  <span className="phf-type-specimen__label"><Fade>{t(`${base}.type.specimens.cardTitle.label`)}</Fade></span>
                  <span className="phf-type-specimen__sample phf-type-specimen__sample--card"><Fade>{t(`${base}.type.specimens.cardTitle.sample`)}</Fade></span>
                </div>
                <div className="phf-type-specimen">
                  <span className="phf-type-specimen__label"><Fade>{t(`${base}.type.specimens.body.label`)}</Fade></span>
                  <span className="phf-type-specimen__sample phf-type-specimen__sample--body"><Fade>{t(`${base}.type.specimens.body.sample`)}</Fade></span>
                </div>
                <div className="phf-type-specimen">
                  <span className="phf-type-specimen__label"><Fade>{t(`${base}.type.specimens.label.label`)}</Fade></span>
                  <span className="phf-type-specimen__sample phf-type-specimen__sample--label"><Fade>{t(`${base}.type.specimens.label.sample`)}</Fade></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Componentes ---------- */}
        <section className="phf-components" data-nav-theme="light">
          <div className="phf-inner">
            <div className="phf-section-head">
              <span className="phf-kicker phf-kicker--muted"><Fade>{t(`${base}.components.kicker`)}</Fade></span>
              <h2 className="phf-h2"><Fade>{t(`${base}.components.title`)}</Fade></h2>
              <p className="phf-body"><Fade>{t(`${base}.components.text`)}</Fade></p>
            </div>

            <div data-reveal="" className="phf-component-grid">
              <div className="phf-component-card">
                <div className="phf-component-demo">
                  <span className="phf-demo-badge"><Fade>{componentItems.sectionLabel.sample}</Fade></span>
                </div>
                <div className="phf-component-foot">
                  <span className="phf-component-foot__title"><Fade>{componentItems.sectionLabel.title}</Fade></span>
                  <span className="phf-component-foot__meta">{componentItems.sectionLabel.meta}</span>
                </div>
              </div>

              <div className="phf-component-card">
                <div className="phf-component-demo">
                  <span className="phf-demo-btn-primary">
                    <Fade>{componentItems.primaryButton.sample}</Fade>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" /></svg>
                  </span>
                </div>
                <div className="phf-component-foot">
                  <span className="phf-component-foot__title"><Fade>{componentItems.primaryButton.title}</Fade></span>
                  <span className="phf-component-foot__meta">{componentItems.primaryButton.meta}</span>
                </div>
              </div>

              <div className="phf-component-card">
                <div className="phf-component-demo">
                  <span className="phf-demo-btn-secondary"><Fade>{componentItems.secondaryButton.sample}</Fade></span>
                </div>
                <div className="phf-component-foot">
                  <span className="phf-component-foot__title"><Fade>{componentItems.secondaryButton.title}</Fade></span>
                  <span className="phf-component-foot__meta">{componentItems.secondaryButton.meta}</span>
                </div>
              </div>

              <div className="phf-component-card">
                <div className="phf-component-demo">
                  <span className="phf-demo-navpill">
                    <Fade>{componentItems.navPill.sample}</Fade>
                    <span className="phf-demo-navpill__icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                    </span>
                  </span>
                </div>
                <div className="phf-component-foot">
                  <span className="phf-component-foot__title"><Fade>{componentItems.navPill.title}</Fade></span>
                  <span className="phf-component-foot__meta">{componentItems.navPill.meta}</span>
                </div>
              </div>

              <div className="phf-component-card">
                <div className="phf-component-demo">
                  <span className="phf-demo-arrow phf-demo-arrow--outline">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#131313" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                  </span>
                  <span className="phf-demo-arrow phf-demo-arrow--solid">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                  </span>
                </div>
                <div className="phf-component-foot">
                  <span className="phf-component-foot__title"><Fade>{componentItems.arrows.title}</Fade></span>
                  <span className="phf-component-foot__meta">{componentItems.arrows.meta}</span>
                </div>
              </div>

              <div className="phf-component-card">
                <div className="phf-component-demo">
                  <span className="phf-demo-dots">
                    <span className="phf-demo-dot phf-demo-dot--active" />
                    <span className="phf-demo-dot" />
                    <span className="phf-demo-dot" />
                    <span className="phf-demo-dot" />
                  </span>
                </div>
                <div className="phf-component-foot">
                  <span className="phf-component-foot__title"><Fade>{componentItems.dots.title}</Fade></span>
                  <span className="phf-component-foot__meta">{componentItems.dots.meta}</span>
                </div>
              </div>

              <div className="phf-component-card">
                <div className="phf-component-demo">
                  <div className="phf-demo-inputs">
                    <input className="phf-demo-input" type="text" readOnly placeholder={componentItems.formField.namePlaceholder} />
                    <input className="phf-demo-input" type="text" readOnly placeholder={componentItems.formField.surnamePlaceholder} />
                  </div>
                </div>
                <div className="phf-component-foot">
                  <span className="phf-component-foot__title"><Fade>{componentItems.formField.title}</Fade></span>
                  <span className="phf-component-foot__meta">{componentItems.formField.meta}</span>
                </div>
              </div>

              <div className="phf-component-card">
                <div className="phf-component-demo">
                  <span className="phf-demo-partner-pill"><Fade>{componentItems.partnerPill.sample1}</Fade></span>
                  <span className="phf-demo-partner-pill"><Fade>{componentItems.partnerPill.sample2}</Fade></span>
                </div>
                <div className="phf-component-foot">
                  <span className="phf-component-foot__title"><Fade>{componentItems.partnerPill.title}</Fade></span>
                  <span className="phf-component-foot__meta">{componentItems.partnerPill.meta}</span>
                </div>
              </div>

              <div className="phf-component-card">
                <div className="phf-component-demo">
                  <span className="phf-demo-icon-badge">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#131313" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                    <span className="phf-demo-icon-badge__count">2</span>
                  </span>
                </div>
                <div className="phf-component-foot">
                  <span className="phf-component-foot__title"><Fade>{componentItems.iconBadge.title}</Fade></span>
                  <span className="phf-component-foot__meta">{componentItems.iconBadge.meta}</span>
                </div>
              </div>
            </div>

            <div data-reveal="" className="phf-service-card">
              <div>
                <div className="phf-service-card__media">
                  <img src={`${ASSETS}/assets/tile-ventilacao.png`} alt={t(`${base}.components.serviceCard.alt`)} loading="lazy" decoding="async" />
                  <div className="phf-service-card__badge">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                  </div>
                </div>
                <h3 className="phf-service-card__title"><Fade>{t(`${base}.components.serviceCard.title`)}</Fade></h3>
                <p className="phf-service-card__desc"><Fade>{t(`${base}.components.serviceCard.desc`)}</Fade></p>
              </div>
              <div>
                <span className="phf-kicker phf-kicker--muted"><Fade>{t(`${base}.components.serviceCard.kicker`)}</Fade></span>
                <p className="phf-body"><Fade>{t(`${base}.components.serviceCard.text`)}</Fade></p>
                <span className="phf-service-card__code">{t(`${base}.components.serviceCard.code`)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Ecrãs ---------- */}
        <section className="phf-screens" data-nav-theme="light">
          <div className="phf-inner">
            <div className="phf-section-head">
              <span className="phf-kicker phf-kicker--muted"><Fade>{t(`${base}.screens.kicker`)}</Fade></span>
              <h2 className="phf-h2"><Fade>{t(`${base}.screens.title`)}</Fade></h2>
            </div>

            <div data-reveal="" className="phf-screens-pair">
              <div className="phf-shot-stack">
                <PhfMacBook onLight src={`${ASSETS}/shots/desktop-sobre.png`} alt={t(`${base}.screens.sobreAlt`)} />
                <span className="phf-shot-caption"><Fade>{t(`${base}.screens.sobreCaption`)}</Fade></span>
              </div>
              <div className="phf-shot-stack">
                <PhfMacBook onLight src={`${ASSETS}/shots/desktop-parceiros.png`} alt={t(`${base}.screens.parceirosAlt`)} />
                <span className="phf-shot-caption"><Fade>{t(`${base}.screens.parceirosCaption`)}</Fade></span>
              </div>
            </div>

            <div data-reveal="" className="phf-mobile-chapter" data-nav-theme="dark">
              <span className="phf-kicker"><Fade>{t(`${base}.screens.mobileKicker`)}</Fade></span>
              <h3 className="phf-h2 phf-h2--white" style={{ marginTop: 12, fontSize: 'clamp(28px,3.6vw,38px)' }}><Fade>{t(`${base}.screens.mobileTitle`)}</Fade></h3>
              <div className="phf-mobile-phones">
                <div className="phf-mobile-phone-item">
                  <PhfIPhone src={`${ASSETS}/shots/mobile-menu.png`} alt={t(`${base}.screens.menuAlt`)} />
                  <span className="phf-shot-caption phf-shot-caption--onDark"><Fade>{t(`${base}.screens.menuLabel`)}</Fade></span>
                </div>
                <div className="phf-mobile-phone-item">
                  <PhfIPhone src={`${ASSETS}/shots/mobile-cards.png`} alt={t(`${base}.screens.solucoesAlt`)} />
                  <span className="phf-shot-caption phf-shot-caption--onDark"><Fade>{t(`${base}.screens.solucoesLabel`)}</Fade></span>
                </div>
                <div className="phf-mobile-phone-item">
                  <PhfIPhone src={`${ASSETS}/shots/mobile-contactos.png`} alt={t(`${base}.screens.contactosAlt`)} />
                  <span className="phf-shot-caption phf-shot-caption--onDark"><Fade>{t(`${base}.screens.contactosLabel`)}</Fade></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Fecho ---------- */}
        <section className="phf-closing" data-nav-theme="light">
          <div className="phf-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <p data-reveal="" className="phf-closing-quote"><Fade>{t(`${base}.closing.quote`)}</Fade></p>
            <span data-reveal="" className="phf-closing-credit">{t(`${base}.closing.credit`)}</span>
            <a href="#/work/amPrestige" data-reveal="" className="phf-next" style={{ width: '100%', maxWidth: 640 }}>
              <div>
                <div className="phf-next__label"><Fade>{t(`${base}.next.label`)}</Fade></div>
                <div className="phf-next__title"><Fade>{t(`${base}.next.title`)}</Fade></div>
              </div>
              <div className="phf-next__arrow" aria-hidden="true">↗</div>
            </a>
          </div>
        </section>
      </article>

      <div className="phf-cta-bar">
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
