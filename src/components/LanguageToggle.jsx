import { useLanguage } from '../i18n/LanguageContext'

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage()
  const isEn = lang === 'en'

  const labelStyle = (active) => ({
    fontFamily: 'var(--font-sans)',
    fontWeight: active ? 700 : 500,
    letterSpacing: '0.06em',
    color: '#ffffff',
    opacity: active ? 1 : 0.55,
    transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), font-weight 0.4s',
  })

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEn}
      aria-label="Toggle language between Portuguese and English"
      onClick={toggle}
      className="lang-toggle"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: 'none',
        border: 'none',
        padding: 4,
        margin: 0,
        cursor: 'pointer',
        borderRadius: 9999,
      }}
    >
      <span data-nav-link="" className="lang-toggle-label" style={labelStyle(!isEn)}>PT</span>
      <span
        aria-hidden="true"
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          width: 38,
          height: 21,
          borderRadius: 9999,
          isolation: 'isolate',
        }}
      >
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 9999,
            overflow: 'hidden',
            zIndex: 0,
            WebkitBackdropFilter: 'blur(3px) saturate(1.6)',
            backdropFilter: 'blur(3px) saturate(1.6)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 9999,
            zIndex: 1,
            background: isEn ? 'rgba(53,114,72,0.55)' : 'rgba(255,255,255,0.12)',
            transition: 'background 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 9999,
            zIndex: 2,
            boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.55), inset -1px -1px 1px 0 rgba(255,255,255,0.25), inset 0 0 8px rgba(255,255,255,0.12)',
          }}
        />
        <span
          style={{
            position: 'relative',
            zIndex: 3,
            width: 17,
            height: 17,
            margin: '0 2px',
            borderRadius: '50%',
            background: '#ffffff',
            transform: isEn ? 'translateX(17px)' : 'translateX(0)',
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </span>
      <span data-nav-link="" className="lang-toggle-label" style={labelStyle(isEn)}>EN</span>
    </button>
  )
}
