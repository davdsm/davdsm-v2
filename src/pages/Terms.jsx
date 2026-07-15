import LegalPage from '../components/LegalPage'
import { termsContent } from '../legal/termsContent'
import { useLanguage } from '../i18n/LanguageContext'

export default function Terms() {
  const { lang } = useLanguage()
  return <LegalPage content={termsContent[lang] || termsContent.en} />
}
