import { useEffect } from 'react'

/**
 * Fades/slides in any `[data-reveal]` descendant of `containerRef` the first
 * time it enters the viewport, then stops observing it (one-shot reveal).
 */
export default function useScrollReveal(containerRef, deps = []) {
  useEffect(() => {
    const root = containerRef.current
    if (!root) return undefined

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'none'
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))

    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
