import { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { resolvePageMeta } from '../seo/pageMeta'

function setMeta(attr, key, content) {
  if (content == null) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setHreflang(lang, href) {
  let el = document.head.querySelector(`link[rel="alternate"][hreflang="${lang}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'alternate')
    el.setAttribute('hreflang', lang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Keeps document title, description, canonical and social meta in sync
 * with the active route and language.
 */
export default function PageSeo({ route, slug }) {
  const { lang } = useLanguage()

  useEffect(() => {
    const meta = resolvePageMeta({ route, slug, lang })

    document.title = meta.title
    document.documentElement.lang = meta.lang === 'pt' ? 'pt' : 'en'

    setMeta('name', 'description', meta.description)
    setMeta('name', 'twitter:card', meta.twitterCard)
    setMeta('name', 'twitter:title', meta.title)
    setMeta('name', 'twitter:description', meta.description)
    setMeta('name', 'twitter:image', meta.ogImage)
    setMeta('name', 'twitter:image:alt', meta.ogImageAlt)

    setMeta('property', 'og:type', route === 'project' ? 'article' : 'website')
    setMeta('property', 'og:site_name', meta.siteName)
    setMeta('property', 'og:url', meta.url)
    setMeta('property', 'og:title', meta.title)
    setMeta('property', 'og:description', meta.description)
    setMeta('property', 'og:image', meta.ogImage)
    setMeta('property', 'og:image:secure_url', meta.ogImage)
    setMeta('property', 'og:image:alt', meta.ogImageAlt)
    setMeta('property', 'og:locale', meta.lang === 'pt' ? 'pt_PT' : 'en_GB')

    setCanonical(meta.canonical)
    setHreflang('x-default', meta.canonical)
    setHreflang('en', meta.canonical)
    setHreflang('pt', meta.canonical)
  }, [route, slug, lang])

  return null
}
