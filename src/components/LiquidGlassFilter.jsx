import { useEffect, useRef, useState } from 'react'

// Rounded-rect signed distance field: negative inside, 0 at the boundary.
function roundedRectSDF(x, y, halfW, halfH, radius) {
  const qx = Math.abs(x) - halfW + radius
  const qy = Math.abs(y) - halfH + radius
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - radius
}

function buildDisplacementMap({ width, height, depth }) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(width, height)
  const data = img.data
  const halfW = width / 2
  const halfH = height / 2
  const r = Math.min(halfW, halfH)
  const band = Math.min(depth, r)
  const normalEps = 1

  for (let j = 0; j < height; j++) {
    const py = j - halfH
    for (let i = 0; i < width; i++) {
      const px = i - halfW
      const idx = (j * width + i) * 4
      const d = roundedRectSDF(px, py, halfW, halfH, r)

      // Flat zones (deep interior, or outside the pill silhouette): no displacement.
      if (d <= -band || d > 0) {
        data[idx] = 128
        data[idx + 1] = 128
        data[idx + 2] = 128
        data[idx + 3] = 255
        continue
      }

      // Refraction is strongest right at the border and eases to nothing at
      // the interior edge of the band — the convex-lens rim of Liquid Glass.
      const t = -d / band // 0 at the border, 1 at the flat interior
      const magnitude = (1 - t) ** 2

      const nx = roundedRectSDF(px + normalEps, py, halfW, halfH, r) - roundedRectSDF(px - normalEps, py, halfW, halfH, r)
      const ny = roundedRectSDF(px, py + normalEps, halfW, halfH, r) - roundedRectSDF(px, py - normalEps, halfW, halfH, r)
      const len = Math.hypot(nx, ny) || 1

      data[idx] = Math.max(0, Math.min(255, Math.round(128 + (nx / len) * magnitude * 127)))
      data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + (ny / len) * magnitude * 127)))
      data[idx + 2] = 128
      data[idx + 3] = 255
    }
  }

  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL()
}

const KEEP_R = '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'
const KEEP_G = '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0'
const KEEP_B = '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0'

/**
 * Renders a hidden SVG <filter> that refracts whatever sits behind
 * `targetRef` via feDisplacementMap — the backdrop visibly bends around the
 * pill's border like real glass, with chromatic aberration on the rim (each
 * RGB channel displaced at a slightly different strength, like a prism).
 * Desktop-only: skips all work below 701px.
 */
export default function LiquidGlassFilter({ targetRef, filterId, depth = 26, strength = 64, aberration = 0.12 }) {
  const [map, setMap] = useState(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const frame = useRef(null)

  useEffect(() => {
    const el = targetRef.current
    if (!el) return undefined

    const desktopQuery = window.matchMedia('(min-width: 701px)')

    const regenerate = () => {
      if (!desktopQuery.matches) {
        setMap(null)
        el.classList.remove('dvd-nav-glass-ready')
        return
      }
      const rect = el.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))
      setSize({ width, height })
      setMap(buildDisplacementMap({ width, height, depth }))
      el.classList.add('dvd-nav-glass-ready')
    }

    regenerate()

    const observer = new ResizeObserver(() => {
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(regenerate)
    })
    observer.observe(el)
    desktopQuery.addEventListener('change', regenerate)

    return () => {
      observer.disconnect()
      desktopQuery.removeEventListener('change', regenerate)
      if (frame.current) cancelAnimationFrame(frame.current)
      el.classList.remove('dvd-nav-glass-ready')
    }
  }, [targetRef, depth])

  if (!map || !size.width) return null

  return (
    <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <filter id={filterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage href={map} xlinkHref={map} x="0" y="0" width={size.width} height={size.height} result="dvdLiquidMap" />
        <feDisplacementMap in="SourceGraphic" in2="dvdLiquidMap" scale={strength * (1 + aberration)} xChannelSelector="R" yChannelSelector="G" result="dispR" />
        <feColorMatrix in="dispR" type="matrix" values={KEEP_R} result="chR" />
        <feDisplacementMap in="SourceGraphic" in2="dvdLiquidMap" scale={strength} xChannelSelector="R" yChannelSelector="G" result="dispG" />
        <feColorMatrix in="dispG" type="matrix" values={KEEP_G} result="chG" />
        <feDisplacementMap in="SourceGraphic" in2="dvdLiquidMap" scale={strength * (1 - aberration)} xChannelSelector="R" yChannelSelector="G" result="dispB" />
        <feColorMatrix in="dispB" type="matrix" values={KEEP_B} result="chB" />
        <feBlend in="chR" in2="chG" mode="screen" result="chRG" />
        <feBlend in="chRG" in2="chB" mode="screen" />
      </filter>
    </svg>
  )
}
