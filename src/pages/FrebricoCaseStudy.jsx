import { useEffect, useRef } from 'react'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/LanguageContext'
import { PROJECTS } from '../data/projects'
import { FREBRICO_CASE_HTML } from '../data/frebricoCaseHtml'
import '../styles/work.css'
import '../styles/frebrico-case-study.css'

/**
 * Frebrico case study — native page (no iframe) so Nav, Footer and CTA
 * behave exactly like every other project page, without scroll blow-ups.
 */
export default function FrebricoCaseStudy() {
  const { t } = useLanguage()
  const project = PROJECTS.frebrico
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const study = root.querySelector('#fb-root')
    const fxNodes = Array.from(root.querySelectorAll('.fx'))

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
    if (reduceMotion) {
      if (study) study.classList.add('no-motion')
      fxNodes.forEach((el) => el.classList.add('in'))
      return () => {
        window.removeEventListener('scroll', updateNavTheme)
        window.removeEventListener('resize', updateNavTheme)
      }
    }

    const revealInView = () => {
      const vh = window.innerHeight
      fxNodes.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < vh * 0.95 && r.bottom > 0) el.classList.add('in')
      })
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    )
    fxNodes.forEach((el) => io.observe(el))
    // Mark near-viewport nodes before enabling hidden state.
    revealInView()
    if (study) study.classList.add('js-ready')

    // Hard safety: never leave later sections stuck invisible.
    const safety = window.setTimeout(() => {
      fxNodes.forEach((el) => el.classList.add('in'))
    }, 1600)

    return () => {
      window.removeEventListener('scroll', updateNavTheme)
      window.removeEventListener('resize', updateNavTheme)
      window.clearTimeout(safety)
      io.disconnect()
    }
  }, [])

  return (
    <div ref={rootRef}>
      <article
        id="fb-root"
        dangerouslySetInnerHTML={{ __html: FREBRICO_CASE_HTML }}
      />

      <div className="fb-cta-bar">
        <a
          href="/work"
          className="work-hero-cta work-hero-cta--on-dark"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            borderRadius: 9999,
            borderWidth: 1,
            borderStyle: 'solid',
            padding: '9px 16px',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          <Fade>{t('common.backToWork')}</Fade>
        </a>
        {project?.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="work-hero-cta work-hero-cta--solid"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 9999,
              borderWidth: 1,
              borderStyle: 'solid',
              padding: '9px 16px',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            <Fade>{t('common.visitWebsite')}</Fade>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </a>
        )}
      </div>

      <Footer />
    </div>
  )
}
