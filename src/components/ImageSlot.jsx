/**
 * Stand-in for the design canvas's <x-import component-from-global-scope="image-slot">
 * placeholder, which only works inside the claude.ai design runtime. Renders a
 * fillable-looking placeholder box until a real `src` is supplied.
 */
export default function ImageSlot({ placeholder = 'Drop image here', style, className }) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '16px',
        background: 'repeating-linear-gradient(135deg, rgba(53,114,72,0.08) 0px, rgba(53,114,72,0.08) 10px, rgba(53,114,72,0.14) 10px, rgba(53,114,72,0.14) 20px)',
        color: 'var(--color-forest-500)',
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        ...style,
      }}
    >
      {placeholder}
    </div>
  )
}
