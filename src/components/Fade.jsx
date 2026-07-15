import { useLanguage } from '../i18n/LanguageContext'

export default function Fade({ children, as: Tag = 'span' }) {
  const { transitioning } = useLanguage()
  return (
    <Tag
      style={{
        display: 'inline',
        opacity: transitioning ? 0 : 1,
        transition: 'opacity 0.24s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {children}
    </Tag>
  )
}
