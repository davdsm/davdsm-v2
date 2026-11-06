import { useLanguage } from '../i18n/LanguageContext'

/**
 * Frebrico case study — serves the exported standalone study full-bleed
 * (covers the site chrome) with a quiet back control into /work.
 */
export default function FrebricoCaseStudy() {
  const { t } = useLanguage()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: '#2e3a2b',
      }}
    >
      <a
        href="/work"
        aria-label={t('common.backToWork')}
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 210,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          borderRadius: 9999,
          border: '1px solid rgba(255,255,255,0.28)',
          background: 'rgba(10,26,15,0.72)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          padding: '9px 16px',
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          fontWeight: 600,
          color: '#ffffff',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        {t('common.backToWork')}
      </a>
      <a
        href="https://www.frebrico.pt/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 210,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          borderRadius: 9999,
          border: '1px solid rgba(255,255,255,0.28)',
          background: 'rgba(10,26,15,0.72)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          padding: '9px 16px',
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          fontWeight: 600,
          color: '#ffffff',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {t('common.visitWebsite')}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 17L17 7" />
          <path d="M8 7h9v9" />
        </svg>
      </a>
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
    </div>
  )
}
