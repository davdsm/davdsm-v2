import { useEffect, useRef, useState } from 'react'
import Fade from './Fade'
import { useLanguage } from '../i18n/LanguageContext'

const STEP_KEYS = ['name', 'idea', 'email']
const STEP_TYPES = { name: 'text', idea: 'text', email: 'email' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LeafIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21v-8" />
    <path d="M12 13c0-4-3-6.5-7.5-6.5 0 4.5 3 6.5 7.5 6.5z" />
    <path d="M12 13c0-4 3-6.5 7.5-6.5 0 4.5-3 6.5-7.5 6.5z" />
  </svg>
)

/**
 * Footer's "Your project" card. Idle shows the original static-looking prompt;
 * focusing it opens a quiet, one-field-at-a-time flow (name -> idea -> email)
 * that replaces itself in place, ending on a warm confirmation.
 */
export default function ProjectInquiryCard() {
  const { t, lang } = useLanguage()
  const [step, setStep] = useState(0) // 0 = idle, 1-3 = STEPS, 4 = submitting, 5 = success
  const [values, setValues] = useState({ name: '', idea: '', email: '' })
  const [error, setError] = useState(null)
  const inputRef = useRef(null)
  const submittingRef = useRef(false)

  const STEPS = STEP_KEYS.map((key) => ({
    key,
    type: STEP_TYPES[key],
    label: t(`inquiry.steps.${key}.label`),
    placeholder: t(`inquiry.steps.${key}.placeholder`),
  }))

  const validate = (key, value) => {
    const trimmed = value.trim()
    if (!trimmed) return t(`inquiry.errors.${key}`)
    if (key === 'email' && !EMAIL_RE.test(trimmed)) return t('inquiry.errors.email')
    return null
  }

  useEffect(() => {
    if (step >= 1 && step <= 3) inputRef.current?.focus()
  }, [step])

  const activeField = step >= 1 && step <= 3 ? STEPS[step - 1] : null

  const submit = async () => {
    if (submittingRef.current) return
    submittingRef.current = true
    setStep(4)
    setError(null)
    const submitLang = lang === 'pt' ? 'pt' : 'en'
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          idea: values.idea.trim(),
          email: values.email.trim(),
          lang: submitLang,
        }),
      })
      if (!res.ok) throw new Error('send failed')
      setStep(5)
    } catch {
      setError(t('inquiry.errors.send'))
      setStep(3)
    } finally {
      submittingRef.current = false
    }
  }

  const advance = () => {
    if (!activeField) return
    const msg = validate(activeField.key, values[activeField.key])
    if (msg) {
      setError(msg)
      return
    }
    setError(null)
    if (step < 3) {
      setStep(step + 1)
    } else {
      submit()
    }
  }

  const goBack = () => {
    if (step <= 1) return
    setError(null)
    setStep(step - 1)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      advance()
    }
  }

  return (
    <div style={{ background: '#ffffff', borderRadius: 20, padding: '20px 22px', minWidth: 'min(44vw,330px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {step !== 5 && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--color-forest-950)' }}>
          <LeafIcon />
          <Fade>{t('inquiry.heading')}</Fade>
        </span>
      )}

      <div aria-live="polite" key={step} className="ds-step-transition">
        {step === 0 && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              readOnly
              placeholder={t('inquiry.idlePlaceholder')}
              onFocus={() => setStep(1)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'var(--color-neutral-100)',
                borderRadius: 9999,
                padding: '13px 48px 13px 18px',
                fontFamily: 'var(--font-sans)',
                fontSize: 15,
                color: 'var(--color-forest-900)',
                width: '100%',
                cursor: 'text',
              }}
            />
            <span
              style={{
                position: 'absolute',
                right: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                borderRadius: 9999,
                background: 'var(--color-forest-950)',
                color: '#ffffff',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        )}

        {activeField && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-neutral-500)' }}><Fade>{activeField.label}</Fade></span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={goBack}
                  aria-label={t('inquiry.back')}
                  className="ds-inquiry-control ds-inquiry-back"
                  style={{ position: 'absolute', left: 6 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              )}
              <input
                ref={inputRef}
                type={activeField.type}
                placeholder={activeField.placeholder}
                value={values[activeField.key]}
                onChange={(e) => {
                  setError(null)
                  setValues((v) => ({ ...v, [activeField.key]: e.target.value }))
                }}
                onKeyDown={handleKeyDown}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'var(--color-neutral-100)',
                  borderRadius: 9999,
                  padding: step > 1 ? '13px 48px 13px 40px' : '13px 48px 13px 18px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 15,
                  color: 'var(--color-forest-900)',
                  width: '100%',
                }}
              />
              <button
                type="button"
                onClick={advance}
                aria-label={step === 3 ? t('inquiry.send') : t('inquiry.continue')}
                className="ds-inquiry-control ds-inquiry-submit"
                style={{ position: 'absolute', right: 6 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
            {error && (
              <span role="alert" style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-earth-500)' }}>
                <Fade>{error}</Fade>
              </span>
            )}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 2 }}>
              {STEPS.map((s, i) => (
                <span
                  key={s.key}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: i + 1 === step ? 'var(--color-forest-500)' : 'var(--color-neutral-200)',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '13px 0' }}>
            <span className="ds-inquiry-spinner" aria-hidden="true">
              <LeafIcon size={20} />
            </span>
          </div>
        )}

        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, padding: '6px 0' }}>
            <span style={{ color: 'var(--color-forest-500)' }}>
              <LeafIcon size={22} />
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--color-forest-900)' }}>
              <Fade>{t('inquiry.success')}</Fade>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
