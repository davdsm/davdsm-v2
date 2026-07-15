import { useEffect } from 'react'
import Footer from './Footer'

/**
 * Shared static layout for legal documents (Terms, Privacy). Sets the nav to
 * its light/dark variant on scroll the same way the other pages do. Also runs
 * the same data-reveal IntersectionObserver the other pages set up, since the
 * shared Footer component depends on it for its own content (contact CTA,
 * link columns, bottom bar all start at opacity:0 until revealed) even though
 * the legal document body itself doesn't use data-reveal.
 */
export default function LegalPage({ content }) {
  useEffect(() => {
    const navLogoWhite = document.querySelector('[data-nav-logo-white]')
    const navLogoGreen = document.querySelector('[data-nav-logo-green]')
    const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'))
    const themeSections = Array.from(document.querySelectorAll('[data-nav-theme]'))
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
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))

    return () => {
      window.removeEventListener('scroll', updateNavTheme)
      io.disconnect()
    }
  }, [])

  const { eyebrow, title, updated, bilingualNote, sections } = content

  return (
    <>
      <div data-nav-theme="light" style={{ background: 'var(--bg-subtle)', padding: 'clamp(140px,16vw,200px) 6vw clamp(90px,10vw,140px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-forest-500)',
              marginBottom: 22,
            }}
          >
            {eyebrow}
          </span>
          <h1
            style={{
              margin: '0 0 14px',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(36px,5vw,64px)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--color-forest-900)',
            }}
          >
            {title}
          </h1>
          <p style={{ margin: '0 0 40px', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-neutral-500)' }}>
            {updated}
          </p>
          {bilingualNote && (
            <p
              style={{
                margin: '0 0 48px',
                padding: '16px 20px',
                borderRadius: 14,
                background: 'rgba(53,114,72,0.08)',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--color-forest-700)',
              }}
            >
              {bilingualNote}
            </p>
          )}

          {sections.map((section, i) => (
            <section key={i} style={{ marginTop: i === 0 ? 0 : 40 }}>
              <h2
                style={{
                  margin: '0 0 14px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(20px,2.2vw,26px)',
                  lineHeight: 1.3,
                  color: 'var(--color-forest-900)',
                }}
              >
                {section.heading}
              </h2>
              {section.paragraphs?.map((p, j) => (
                <p
                  key={j}
                  style={{
                    margin: '0 0 14px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: 'var(--color-neutral-700)',
                  }}
                >
                  {p}
                </p>
              ))}
              {section.list && (
                <ul style={{ margin: '0 0 14px', paddingLeft: 22 }}>
                  {section.list.map((li, k) => (
                    <li
                      key={k}
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 16,
                        lineHeight: 1.7,
                        color: 'var(--color-neutral-700)',
                        marginBottom: 8,
                      }}
                    >
                      {li}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}
