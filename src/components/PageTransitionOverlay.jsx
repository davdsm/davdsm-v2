import { forwardRef, useImperativeHandle, useRef } from 'react'

const EASE = 'cubic-bezier(0.16,1,0.3,1)'
const WORDS = ['growing…', 'blossoming…', 'taking root…', 'in season…']
const PETALS = [
  { left: '7%', size: [18, 12], color: '#c3edd1' },
  { left: '18%', size: [13, 9], color: '#f6cfd9' },
  { left: '29%', size: [16, 11], color: 'rgba(255,255,255,0.85)' },
  { left: '41%', size: [12, 8], color: '#c3edd1' },
  { left: '52%', size: [19, 13], color: '#f6cfd9' },
  { left: '63%', size: [14, 10], color: 'rgba(255,255,255,0.8)' },
  { left: '74%', size: [17, 11], color: '#c3edd1' },
  { left: '84%', size: [12, 9], color: '#f6cfd9' },
  { left: '93%', size: [15, 10], color: 'rgba(255,255,255,0.85)' },
  { left: '12%', size: [11, 8], color: '#98deb0' },
]

/**
 * Port of the DAVDSM App shell's `_runTransition`: a mint/dark curtain rises,
 * petals fall, the route swaps underneath, then the curtain lifts again.
 */
const PageTransitionOverlay = forwardRef(function PageTransitionOverlay(_, ref) {
  const overlayRef = useRef(null)
  const mintRef = useRef(null)
  const darkRef = useRef(null)
  const wordRef = useRef(null)
  const textRef = useRef(null)
  const petalRefs = useRef([])
  const activeRef = useRef(false)
  const fadesRef = useRef([])

  useImperativeHandle(ref, () => ({
    run(applyRoute) {
      const overlay = overlayRef.current
      const mint = mintRef.current
      const dark = darkRef.current
      const word = wordRef.current
      const text = textRef.current
      const petals = petalRefs.current

      if (!overlay || activeRef.current) {
        applyRoute()
        return
      }
      activeRef.current = true
      window.__davdsmPTActive = true
      fadesRef.current.forEach((a) => {
        try {
          a.cancel()
        } catch {
          /* noop */
        }
      })
      fadesRef.current = []

      overlay.style.pointerEvents = 'auto'
      text.textContent = WORDS[Math.floor(Math.random() * WORDS.length)]
      mint.animate([{ transform: 'translateY(103%)' }, { transform: 'translateY(0%)' }], { duration: 650, easing: EASE, fill: 'forwards' })
      dark.animate([{ transform: 'translateY(103%)' }, { transform: 'translateY(0%)' }], { duration: 650, delay: 100, easing: EASE, fill: 'forwards' })
      word.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 500, delay: 430, easing: EASE, fill: 'forwards' })

      petals.forEach((p, i) => {
        if (!p) return
        p.style.animation = 'none'
        // eslint-disable-next-line no-void
        void p.offsetWidth
        p.style.animation = `dvdPetalFall ${2200 + (i % 5) * 380}ms linear ${200 + i * 110}ms both`
      })

      setTimeout(applyRoute, 800)

      setTimeout(() => {
        dark.animate([{ transform: 'translateY(0%)' }, { transform: 'translateY(-103%)' }], { duration: 650, easing: EASE, fill: 'forwards' })
        mint.animate([{ transform: 'translateY(0%)' }, { transform: 'translateY(-103%)' }], { duration: 650, delay: 90, easing: EASE, fill: 'forwards' })
        word.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-14px)' }], { duration: 350, easing: 'ease', fill: 'forwards' })
        window.__davdsmPTActive = false
        window.dispatchEvent(new CustomEvent('davdsm:pt-reveal'))
      }, 1450)

      setTimeout(() => {
        overlay.style.pointerEvents = 'none'
        petals.forEach((p) => {
          if (!p) return
          const fade = p.animate([{ opacity: getComputedStyle(p).opacity }, { opacity: 0 }], { duration: 700, easing: 'ease', fill: 'forwards' })
          fade.onfinish = () => {
            p.style.animation = 'none'
            try {
              fade.cancel()
            } catch {
              /* noop */
            }
          }
          fadesRef.current.push(fade)
        })
        activeRef.current = false
      }, 2300)
    },
  }))

  return (
    <div data-pt="" style={{ position: 'fixed', inset: 0, zIndex: 250, pointerEvents: 'none', overflow: 'hidden' }} ref={overlayRef}>
      <div
        ref={mintRef}
        style={{
          position: 'absolute',
          left: '-6%',
          right: '-6%',
          top: '-6%',
          bottom: '-6%',
          background: 'var(--color-mint-200)',
          borderRadius: '50% 50% 50% 50% / 90px 90px 90px 90px',
          transform: 'translateY(103%)',
          zIndex: 1,
        }}
      />
      <div
        ref={darkRef}
        style={{
          position: 'absolute',
          left: '-6%',
          right: '-6%',
          top: '-6%',
          bottom: '-6%',
          background: 'linear-gradient(to bottom,#0d2013,#0a1a0f)',
          borderRadius: '50% 50% 50% 50% / 90px 90px 90px 90px',
          transform: 'translateY(103%)',
          zIndex: 2,
        }}
      />
      <div
        ref={wordRef}
        style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0 }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-mint-300)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 21v-8" />
          <path d="M12 13c0-4-3-6.5-7.5-6.5 0 4.5 3 6.5 7.5 6.5z" />
          <path d="M12 13c0-4 3-6.5 7.5-6.5 0 4.5-3 6.5-7.5 6.5z" />
        </svg>
        <span ref={textRef} style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 28, color: 'var(--color-mint-200)' }}>
          growing…
        </span>
      </div>
      {PETALS.map((petal, i) => (
        <span
          key={i}
          ref={(el) => {
            petalRefs.current[i] = el
          }}
          style={{
            position: 'absolute',
            top: '-8vh',
            left: petal.left,
            width: petal.size[0],
            height: petal.size[1],
            background: petal.color,
            borderRadius: '62% 38% 55% 45% / 60% 50% 50% 40%',
            zIndex: 3,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
})

export default PageTransitionOverlay
