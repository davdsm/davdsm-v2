import { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'
import PageTransitionOverlay from './components/PageTransitionOverlay'
import PageSeo from './components/PageSeo'
import Home from './pages/Home'
import Studio from './pages/Studio'
import Work from './pages/Work'
import Solutions from './pages/Solutions'
import Project from './pages/Project'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import { LanguageProvider } from './i18n/LanguageContext'
import { navigate, parseLocation, redirectLegacyHash } from './lib/routing'

function readRoute() {
  redirectLegacyHash()
  return parseLocation(window.location.pathname, window.location.hash)
}

export default function App() {
  const initial = readRoute()
  const [route, setRoute] = useState(initial.route)
  const [projectSlug, setProjectSlug] = useState(initial.slug)
  const [visited, setVisited] = useState(false)
  const transitionRef = useRef(null)
  const routeRef = useRef(route)
  const projectSlugRef = useRef(projectSlug)
  routeRef.current = route
  projectSlugRef.current = projectSlug

  useEffect(() => {
    const applyFromLocation = ({ withTransition = true } = {}) => {
      const { route: nextRoute, slug: nextSlug } = readRoute()
      if (nextRoute === routeRef.current && nextSlug === projectSlugRef.current) {
        // Same page: allow home in-page hash scroll (e.g. /#contact)
        if (nextRoute === 'home' && window.location.hash && window.location.hash.charAt(1) !== '/') {
          const id = window.location.hash.slice(1)
          const el = id && document.getElementById(id)
          if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' })
        }
        return
      }

      const applyRoute = () => {
        setRoute(nextRoute)
        setProjectSlug(nextSlug)
        setVisited(true)
        window.scrollTo(0, 0)
        if (nextRoute === 'home' && window.location.hash && window.location.hash.charAt(1) !== '/') {
          const id = window.location.hash.slice(1)
          setTimeout(() => {
            const el = id && document.getElementById(id)
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' })
          }, 900)
        }
      }

      if (withTransition && transitionRef.current) transitionRef.current.run(applyRoute)
      else applyRoute()
    }

    const onPopState = () => applyFromLocation({ withTransition: true })

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest && e.target.closest('a[href]')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return
      if (a.target && a.target !== '_self') return
      // In-page anchors (including /#section when already on home)
      if (href.charAt(0) === '#') return

      let url
      try {
        url = new URL(href, window.location.origin)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return
      if (url.pathname.startsWith('/api/')) return
      if (url.pathname.startsWith('/hosting')) return
      if (url.pathname.match(/\.\w+$/)) return // static files

      e.preventDefault()
      const next = `${url.pathname}${url.search}${url.hash}`
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
      if (next === current) {
        if (url.hash) {
          const el = document.getElementById(url.hash.slice(1))
          if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' })
        }
        return
      }
      navigate(next)
    }

    applyFromLocation({ withTransition: false })
    window.addEventListener('popstate', onPopState)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', onPopState)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <LanguageProvider>
      <PageTransitionOverlay ref={transitionRef} />
      <PageSeo route={route} slug={projectSlug} />
      <Nav />
      {route === 'home' ? (
        <Home showIntro={!visited} />
      ) : route === 'studio' ? (
        <Studio />
      ) : route === 'work' ? (
        <Work />
      ) : route === 'solutions' ? (
        <Solutions />
      ) : route === 'project' ? (
        <Project key={projectSlug} slug={projectSlug} />
      ) : route === 'terms' ? (
        <Terms />
      ) : (
        <Privacy />
      )}
    </LanguageProvider>
  )
}
