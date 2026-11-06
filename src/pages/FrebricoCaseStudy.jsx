import Fade from '../components/Fade'
import { useLanguage } from '../i18n/LanguageContext'
import { PROJECTS } from '../data/projects'
import '../styles/work.css'
import '../styles/project.css'

/**
 * Frebrico case study — exported standalone study full-bleed,
 * with the same fixed CTA bar used on every other project page.
 */
export default function FrebricoCaseStudy() {
  const { t } = useLanguage()
  const project = PROJECTS.frebrico

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#2e3a2b' }}>
      <iframe
        title="Frebrico case study"
        src="/assets/work/frebrico/case-study.html"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          border: 'none',
          background: '#2e3a2b',
        }}
      />

      <div className="project-cta-bar" style={{ zIndex: 220 }}>
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
    </div>
  )
}
