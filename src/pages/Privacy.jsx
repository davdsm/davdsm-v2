import LegalPage from '../components/LegalPage'
import { privacyContent } from '../legal/privacyContent'
import { useLanguage } from '../i18n/LanguageContext'

export default function Privacy() {
  const { lang } = useLanguage()
  return <LegalPage content={privacyContent[lang] || privacyContent.en} />
}
