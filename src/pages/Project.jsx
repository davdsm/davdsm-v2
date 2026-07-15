import { useEffect, useRef } from 'react'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import AmPrestigeCaseStudy from './AmPrestigeCaseStudy'
import { useLanguage } from '../i18n/LanguageContext'
import { PROJECTS } from '../data/projects'
import '../styles/project.css'

export default function Project({ slug }) {
  const { t } = useLanguage()
  const project = PROJECTS[slug]
  const rootRef = useRef(null)
  const destroyedRef = useRef(false)

  useEffect(() => {
    if (slug === 'amPrestige') return undefined

    destroyedRef.current = false
    const root = rootRef.current
    const $$ = (s) => Array.from(root.querySelectorAll(s))

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
    window.addEventListener('scroll', updateNavTheme, { passive: true })

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

    return () => {
      destroyedRef.current = true
      if (onPtReveal) window.removeEventListener('davdsm:pt-reveal', onPtReveal)
      if (heroTimeout) clearTimeout(heroTimeout)
      window.removeEventListener('scroll', updateNavTheme)
      io.disconnect()
    }
  }, [slug])

  if (slug === 'amPrestige') {
    return <AmPrestigeCaseStudy />
  }

  if (!project) {
    return (
      <div ref={rootRef}>
        <section data-nav-theme="dark" style={{ position: 'relative', background: 'var(--color-forest-950)', minHeight: '70vh', display: 'flex', alignItems: 'center', padding: '18vh 6vw 8vh' }}>
          <div>
            <h1 style={{ margin: '0 0 14px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', color: '#ffffff' }}>
              <Fade>{t('projectPage.notFound.heading')}</Fade>
            </h1>
            <p style={{ margin: '0 0 28px', fontFamily: 'var(--font-sans)', fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>
              <Fade>{t('projectPage.notFound.paragraph')}</Fade>
            </p>
            <a href="#/work" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 9999, border: '1px solid var(--color-mint-300)', padding: '13px 22px', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--color-mint-300)' }}>
              <Fade>{t('common.backToWork')}</Fade>
            </a>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  const base = `projectDetail.${slug}`
  const [heroImg, ...restGallery] = project.gallery

  return (
    <div ref={rootRef}>
      <section data-nav-theme="dark" style={{ position: 'relative', background: 'var(--color-forest-950)', overflow: 'hidden', padding: '18vh 6vw 8vh' }}>
        <div data-hero-reveal="" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 14, marginBottom: '4vh', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)' }}>
          <span style={{ width: 44, height: 1, background: 'var(--color-mint-300)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-mint-300)' }}>
            <Fade>{t('common.caseStudy')}</Fade>
          </span>
        </div>
        <h1 style={{ margin: '0 0 28px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(44px,7vw,110px)', lineHeight: 0.98, letterSpacing: '-0.035em', color: '#ffffff' }}>
          <span style={{ display: 'block', overflow: 'hidden' }}>
            <span data-hero-word="" style={{ display: 'block', transform: 'translateY(115%)', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }}>
              <Fade>{t(`${base}.hero.line1`)}</Fade>
            </span>
          </span>
          <span style={{ display: 'block', overflow: 'hidden' }}>
            <span data-hero-word="" style={{ display: 'block', transform: 'translateY(115%)', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }}>
              <Fade>{t(`${base}.hero.line2Pre`)}</Fade><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-mint-300)' }}><Fade>{t(`${base}.hero.emphasis`)}</Fade></em>
            </span>
          </span>
        </h1>
        <div data-hero-reveal="" className="project-hero-meta" style={{ display: 'grid', gap: 'clamp(24px,4vw,64px)', maxWidth: 900, opacity: 0, transform: 'translateY(20px)', transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)' }}>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)' }}>
            <Fade>{t(`${base}.summary`)}</Fade>
          </p>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.55)' }}>
            <Fade>{t(`${base}.year`)}</Fade> · <Fade>{t(`${base}.tag`)}</Fade>
          </div>
        </div>

        <div data-reveal="" style={{ marginTop: 'clamp(48px,6vw,80px)', borderRadius: 20, overflow: 'hidden', opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
          <img src={heroImg} alt={t(`${base}.name`)} loading="eager" decoding="async" style={{ display: 'block', width: '100%', height: 'auto' }} />
        </div>
      </section>

      {restGallery.length > 0 && (
        <section style={{ position: 'relative', background: '#F2FBF4', paddingTop: 'clamp(90px,12vw,160px)' }}>
          <div data-nav-theme="light" style={{ padding: '0 6vw', marginBottom: 'clamp(40px,5vw,72px)' }}>
            <span data-reveal="" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-forest-500)', opacity: 0, transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)', marginBottom: 24 }}>
              <span style={{ width: 44, height: 1, background: 'var(--color-forest-500)', display: 'inline-block' }} />
              <Fade>{t('projectPage.gallery.kicker')}</Fade>
            </span>
            <h2 data-reveal="" style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px,5vw,72px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--color-forest-900)', opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)' }}>
              <Fade>{t('projectPage.gallery.heading')}</Fade> <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-forest-500)' }}><Fade>{t('projectPage.gallery.headingEmphasis')}</Fade></em>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {restGallery.map((src, i) => (
              <div key={src} className="project-gallery-figure" data-nav-theme="dark" data-reveal="" style={{ opacity: 0, transform: 'translateY(48px)', transition: `opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s` }}>
                <img src={src} alt="" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </section>
      )}
      {restGallery.length > 0 && (
        <div className="project-cta-bar">
          <a href="#/work" className="work-hero-cta work-hero-cta--on-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, borderWidth: 1, borderStyle: 'solid', padding: '9px 16px', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
            <Fade>{t('common.backToWork')}</Fade>
          </a>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" data-cursor={t('common.view')} className="work-hero-cta work-hero-cta--solid" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, borderWidth: 1, borderStyle: 'solid', padding: '9px 16px', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
              <Fade>{t('common.visitWebsite')}</Fade>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M8 7h9v9" /></svg>
            </a>
          )}
        </div>
      )}
      <Footer />
    </div>
  )
}
