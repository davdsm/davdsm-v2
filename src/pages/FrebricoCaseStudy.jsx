import { useEffect, useRef } from 'react'
import Fade from '../components/Fade'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/LanguageContext'
import { PROJECTS } from '../data/projects'
import '../styles/work.css'
import '../styles/project.css'

/**
 * Frebrico case study — same chrome as every other project page
 * (site Nav from App, fixed CTA bar, Footer), with the exported study
 * embedded in-flow so the page scrolls as one document.
 */
export default function FrebricoCaseStudy() {
  const { t } = useLanguage()
  const project = PROJECTS.frebrico
  const rootRef = useRef(null)
  const iframeRef = useRef(null)

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

    const iframe = iframeRef.current
    let ro
    let timers = []

    const resizeIframe = () => {
      if (!iframe) return
      try {
        const doc = iframe.contentDocument
        if (!doc?.body) return
        const height = Math.max(
          doc.body.scrollHeight,
          doc.documentElement?.scrollHeight || 0,
          doc.body.offsetHeight,
        )
        if (height > 0) iframe.style.height = `${height}px`
      } catch {
        /* ignore */
      }
    }

    const onLoad = () => {
      resizeIframe()
      try {
        const doc = iframe.contentDocument
        if (doc?.body && typeof ResizeObserver !== 'undefined') {
          ro = new ResizeObserver(resizeIframe)
          ro.observe(doc.body)
          if (doc.documentElement) ro.observe(doc.documentElement)
        }
      } catch {
        /* ignore */
      }
      timers = [400, 1200, 2500, 5000, 8000].map((ms) => setTimeout(resizeIframe, ms))
    }

    if (iframe) {
      iframe.addEventListener('load', onLoad)
      if (iframe.contentDocument?.readyState === 'complete') onLoad()
    }

    return () => {
      window.removeEventListener('scroll', updateNavTheme)
      window.removeEventListener('resize', updateNavTheme)
      if (iframe) iframe.removeEventListener('load', onLoad)
      if (ro) ro.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div ref={rootRef}>
      <section data-nav-theme="dark" style={{ position: 'relative', background: '#2e3a2b' }}>
        <iframe
          ref={iframeRef}
          title="Frebrico case study"
          src="/assets/work/frebrico/case-study.html"
          style={{
            display: 'block',
            width: '100%',
            minHeight: '100vh',
            height: '100vh',
            border: 'none',
            background: '#2e3a2b',
          }}
        />
      </section>

      <div className="project-cta-bar">
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
