import { useEffect, useRef } from 'react'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/LanguageContext'
import { PROJECTS } from '../data/projects'
import '../styles/work.css'
import '../styles/frebrico-case-study.css'

const ASSETS = '/assets/work/frebrico'

function FbMac({ src, alt, wide = false }) {
  return (
    <div className={`fb-mac${wide ? ' fb-mac--wide' : ''}`}>
      <div className="fb-mac__lid">
        <div className="fb-mac__notch" aria-hidden="true" />
        <div className="fb-mac__screen">
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        </div>
      </div>
      <div className="fb-mac__base" aria-hidden="true">
        <span className="fb-mac__dent" />
      </div>
    </div>
  )
}

function FbPhone({ src, alt, tint = 'white', float = 'a' }) {
  return (
    <div className={`fb-phone fb-phone--float-${float}`}>
      <div className="fb-phone__shell">
        <div className="fb-phone__island" aria-hidden="true" />
        <div className="fb-phone__screen">
          <div className={`fb-phone__status fb-phone__status--${tint}`}>
            <span>9:41</span>
          </div>
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  )
}

export default function FrebricoCaseStudy() {
  const { t } = useLanguage()
  const project = PROJECTS.frebrico
  const rootRef = useRef(null)
  const base = 'projectDetail.frebrico.caseStudy'

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const navLogoWhite = document.querySelector('[data-nav-logo-white]')
    const navLogoGreen = document.querySelector('[data-nav-logo-green]')
    const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'))
    const themeSections = Array.from(root.querySelectorAll('[data-nav-theme]'))
    let navTheme = ''

    const updateNavTheme = () => {
      const y = 60
      let theme = 'dark'
      for (const sec of themeSections) {
        const r = sec.getBoundingClientRect()
        if (r.top <= y && r.bottom >= y) {
          theme = sec.getAttribute('data-nav-theme') || 'dark'
          break
        }
      }
      if (theme === navTheme) return
      navTheme = theme
      const light = theme === 'light'
      if (navLogoWhite) navLogoWhite.style.opacity = light ? '0' : '1'
      if (navLogoGreen) navLogoGreen.style.opacity = light ? '1' : '0'
      navLinks.forEach((el) => {
        el.style.color = light ? 'var(--color-forest-900)' : '#ffffff'
      })
    }

    updateNavTheme()
    window.addEventListener('scroll', updateNavTheme, { passive: true })
    window.addEventListener('resize', updateNavTheme, { passive: true })

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) root.classList.add('no-motion')

    const reveal = (el) => {
      el.classList.add('in')
      el.style.opacity = '1'
      el.style.transform = 'none'
    }
    const nodes = Array.from(root.querySelectorAll('[data-reveal]'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    )
    nodes.forEach((el) => {
      if (reduceMotion) reveal(el)
      else io.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', updateNavTheme)
      window.removeEventListener('resize', updateNavTheme)
      io.disconnect()
    }
  }, [])

  return (
    <div ref={rootRef} className="fb-page">
      <article>
        <section className="fb-hero" data-nav-theme="dark">
          <img className="fb-hero__bg" src={`${ASSETS}/shots/product-1.jpg`} alt="" />
          <div className="fb-hero__veil" aria-hidden="true" />
          <div className="fb-hero__inner">
            <div className="fb-hero__copy">
              <div className="fb-eyebrow fb-eyebrow--onDark"><Fade>{t(`${base}.eyebrow`)}</Fade></div>
              <img className="fb-hero__logo" src={`${ASSETS}/logo.svg`} alt="Frebrico" />
              <h1 className="fb-hero__title"><Fade>{t(`${base}.title`)}</Fade></h1>
              <p className="fb-hero__summary">
                <Fade>{t(`${base}.summaryPre`)}</Fade>
                <strong><Fade>{t(`${base}.summaryStrong`)}</Fade></strong>
                <Fade>{t(`${base}.summaryPost`)}</Fade>
              </p>
              <div className="fb-meta">
                {['role', 'scope', 'year'].map((key) => (
                  <div key={key}>
                    <div className="fb-meta__label"><Fade>{t(`${base}.meta.${key}.label`)}</Fade></div>
                    <div className="fb-meta__value"><Fade>{t(`${base}.meta.${key}.value`)}</Fade></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fb-hero__kit" aria-hidden="true">
              <div className="fb-pill fb-pill--icon fb-float-b">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              </div>
              <div className="fb-pill fb-pill--cta fb-float-c"><Fade>{t(`${base}.floating.contacts`)}</Fade></div>
              <div className="fb-hero-card fb-float-a">
                <div className="fb-hero-card__media">
                  <img src={`${ASSETS}/shots/product-3.jpg`} alt="" />
                </div>
                <div className="fb-hero-card__meta">
                  <span><Fade>{t(`${base}.floating.productName`)}</Fade></span>
                  <span className="fb-hero-card__price"><Fade>{t(`${base}.floating.productPrice`)}</Fade></span>
                </div>
              </div>
            </div>
            <div className="fb-scroll-hint"><Fade>{t(`${base}.scrollHint`)}</Fade></div>
          </div>
        </section>

        <section className="fb-section fb-section--grey" data-nav-theme="light">
          <div className="fb-split" data-reveal="">
            <div>
              <div className="fb-index"><Fade>{t(`${base}.challenge.index`)}</Fade></div>
              <h2 className="fb-h2"><Fade>{t(`${base}.challenge.title`)}</Fade></h2>
              <p className="fb-body"><Fade>{t(`${base}.challenge.text`)}</Fade></p>
            </div>
            <div className="fb-float-a" data-reveal="">
              <FbMac src={`${ASSETS}/shots/desktop-2.png`} alt={t(`${base}.challenge.alt`)} />
            </div>
          </div>
        </section>

        <section className="fb-section fb-section--white" data-nav-theme="light">
          <div className="fb-approach-lead" data-reveal="">
            <div className="fb-index"><Fade>{t(`${base}.approach.index`)}</Fade></div>
            <h2 className="fb-h2">
              <Fade>{t(`${base}.approach.titleLine1`)}</Fade>
              <br />
              <Fade>{t(`${base}.approach.titleLine2`)}</Fade>
            </h2>
            <p className="fb-body"><Fade>{t(`${base}.approach.text`)}</Fade></p>
          </div>

          <div className="fb-kit" data-reveal="">
            <div className="fb-kit__label"><Fade>{t(`${base}.approach.kitLabel`)}</Fade></div>
            <div className="fb-kit__row">
              <img className="fb-kit__logo fb-float-b" src={`${ASSETS}/logo.svg`} alt="Frebrico" />
              <div className="fb-pill fb-pill--icon fb-float-a">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              </div>
              <div className="fb-kit__actions fb-float-c">
                <div className="fb-pill fb-pill--cta"><Fade>{t(`${base}.floating.contacts`)}</Fade></div>
                <div className="fb-pill fb-pill--apply"><Fade>{t(`${base}.floating.apply`)}</Fade></div>
                <div className="fb-pill fb-pill--remove"><Fade>{t(`${base}.floating.remove`)}</Fade></div>
              </div>
              <div className="fb-search fb-float-a">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
                <span><Fade>{t(`${base}.floating.searchPlaceholder`)}</Fade></span>
                <kbd>esc</kbd>
              </div>
              <div className="fb-kit-card fb-float-c">
                <div className="fb-kit-card__media">
                  <img src={`${ASSETS}/shots/product-2.jpg`} alt="" />
                </div>
                <div className="fb-kit-card__name"><Fade>{t(`${base}.floating.kitProduct`)}</Fade></div>
              </div>
              <div className="fb-swatches fb-float-b" aria-hidden="true">
                <span style={{ background: '#141414' }} />
                <span style={{ background: '#2e3a2b' }} />
                <span style={{ background: '#ececec' }} />
                <span style={{ background: '#ffffff', border: '1px solid #e2e2e2' }} />
              </div>
            </div>
          </div>
        </section>

        <section className="fb-section fb-section--white fb-screens" data-nav-theme="light">
          <div className="fb-index" data-reveal=""><Fade>{t(`${base}.screens.index`)}</Fade></div>

          <div className="fb-screen-block" data-reveal="">
            <div className="fb-split fb-split--catalog">
              <FbMac wide src={`${ASSETS}/shots/desktop-3.png`} alt={t(`${base}.screens.catalogue.alt`)} />
              <div className="fb-screen-copy">
                <div className="fb-kicker"><Fade>{t(`${base}.screens.catalogue.kicker`)}</Fade></div>
                <h3 className="fb-h3"><Fade>{t(`${base}.screens.catalogue.title`)}</Fade></h3>
                <p className="fb-body fb-body--sm"><Fade>{t(`${base}.screens.catalogue.text`)}</Fade></p>
              </div>
            </div>
          </div>

          <div className="fb-screen-block" data-reveal="">
            <div className="fb-split fb-split--checkout">
              <div className="fb-screen-copy">
                <div className="fb-kicker"><Fade>{t(`${base}.screens.checkout.kicker`)}</Fade></div>
                <h3 className="fb-h3"><Fade>{t(`${base}.screens.checkout.title`)}</Fade></h3>
                <p className="fb-body fb-body--sm"><Fade>{t(`${base}.screens.checkout.text`)}</Fade></p>
              </div>
              <div className="fb-float-c">
                <FbMac src={`${ASSETS}/shots/desktop-1.png`} alt={t(`${base}.screens.checkout.alt`)} />
              </div>
            </div>
          </div>

          <div className="fb-about-band" data-reveal="">
            <div className="fb-split fb-split--about">
              <div>
                <div className="fb-eyebrow fb-eyebrow--onDark"><Fade>{t(`${base}.screens.about.kicker`)}</Fade></div>
                <h2 className="fb-h2 fb-h2--onDark">
                  <Fade>{t(`${base}.screens.about.titleLine1`)}</Fade>
                  <br />
                  <Fade>{t(`${base}.screens.about.titleLine2`)}</Fade>
                </h2>
                <p className="fb-body fb-body--onDark"><Fade>{t(`${base}.screens.about.text`)}</Fade></p>
              </div>
              <div className="fb-float-a">
                <FbMac src={`${ASSETS}/shots/desktop-4.png`} alt={t(`${base}.screens.about.alt`)} />
              </div>
            </div>
          </div>
        </section>

        <section className="fb-section fb-section--grey" data-nav-theme="light">
          <div className="fb-mobile-lead" data-reveal="">
            <div className="fb-index"><Fade>{t(`${base}.mobile.index`)}</Fade></div>
            <h2 className="fb-h2">
              <Fade>{t(`${base}.mobile.titleLine1`)}</Fade>
              <br />
              <Fade>{t(`${base}.mobile.titleLine2`)}</Fade>
            </h2>
            <p className="fb-body fb-body--center"><Fade>{t(`${base}.mobile.text`)}</Fade></p>
          </div>
          <div className="fb-phones" data-reveal="">
            <FbPhone src={`${ASSETS}/shots/mobile-2.png`} alt={t(`${base}.mobile.alts.product`)} float="a" />
            <FbPhone src={`${ASSETS}/shots/mobile-1.png`} alt={t(`${base}.mobile.alts.search`)} tint="grey" float="c" />
            <FbPhone src={`${ASSETS}/shots/mobile-3.png`} alt={t(`${base}.mobile.alts.carousel`)} float="b" />
          </div>
        </section>

        <section className="fb-section fb-section--white fb-outcome" data-nav-theme="light">
          <div className="fb-outcome__inner" data-reveal="">
            <img className="fb-outcome__logo" src={`${ASSETS}/logo.svg`} alt="Frebrico" />
            <div className="fb-index"><Fade>{t(`${base}.outcome.index`)}</Fade></div>
            <h2 className="fb-h2 fb-h2--outcome"><Fade>{t(`${base}.outcome.title`)}</Fade></h2>
            <p className="fb-body fb-body--center"><Fade>{t(`${base}.outcome.text`)}</Fade></p>
            <div className="fb-stats">
              {['founded', 'checkout', 'shipping'].map((key) => (
                <div key={key}>
                  <div className="fb-stats__value"><Fade>{t(`${base}.outcome.stats.${key}.value`)}</Fade></div>
                  <div className="fb-stats__label"><Fade>{t(`${base}.outcome.stats.${key}.label`)}</Fade></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </article>

      <div className="fb-cta-bar">
        <a href="/work" className="work-hero-cta work-hero-cta--on-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, borderWidth: 1, borderStyle: 'solid', padding: '9px 16px', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
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
