import ImageSlot from './ImageSlot'

export default function HomeWorkLeafyVisual({ coverSrc, coverAlt, revealSrc, aspectRatio, placeholder, style }) {
  return (
    <div
      className="grid-card-hover home-work-leafy"
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, aspectRatio, background: 'var(--color-mint-100)', ...style }}
    >
      {coverSrc ? (
        <img src={coverSrc} alt={coverAlt} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <ImageSlot placeholder={placeholder} />
      )}
      <div className="home-work-leafy-cover" aria-hidden="true">
        <div className="home-work-leafy-fill" />
        <div className="home-work-leafy-edge" />
      </div>
      <div className="home-work-leafy-reveal" aria-hidden="true">
        {revealSrc ? (
          <img src={revealSrc} alt="" loading="lazy" decoding="async" className="home-work-leafy-reveal-img" />
        ) : (
          <div
            className="home-work-leafy-reveal-img"
            style={{ background: 'linear-gradient(165deg, var(--color-forest-900) 0%, var(--color-forest-600) 100%)' }}
          />
        )}
        <div className="home-work-leafy-edge home-work-leafy-edge-reveal" />
      </div>
    </div>
  )
}
