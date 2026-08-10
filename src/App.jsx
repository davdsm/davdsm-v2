import { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'
import PageTransitionOverlay from './components/PageTransitionOverlay'
import Home from './pages/Home'
import Studio from './pages/Studio'
import Work from './pages/Work'
import Solutions from './pages/Solutions'
import Project from './pages/Project'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import { LanguageProvider } from './i18n/LanguageContext'

function routeFromHash() {
  const hash = window.location.hash
  const projectMatch = hash.match(/^#\/work\/([^/?#]+)/)
  if (projectMatch) return { route: 'project', slug: projectMatch[1] }
  if (hash.indexOf('#/studio') === 0) return { route: 'studio', slug: null }
  if (hash.indexOf('#/work') === 0) return { route: 'work', slug: null }
  if (hash.indexOf('#/solutions') === 0) return { route: 'solutions', slug: null }
  if (hash.indexOf('#/terms') === 0) return { route: 'terms', slug: null }
  if (hash.indexOf('#/privacy') === 0) return { route: 'privacy', slug: null }
  return { route: 'home', slug: null }
}

export default function App() {
  const [route, setRoute] = useState('home')
  const [projectSlug, setProjectSlug] = useState(null)
  const [visited, setVisited] = useState(false)
  const transitionRef = useRef(null)
  const routeRef = useRef(route)
  const projectSlugRef = useRef(projectSlug)
  routeRef.current = route
  projectSlugRef.current = projectSlug

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      const { route: nextRoute, slug: nextSlug } = routeFromHash()
      if (nextRoute === routeRef.current && nextSlug === projectSlugRef.current) return

      const applyRoute = () => {
        setRoute(nextRoute)
        setProjectSlug(nextSlug)
        setVisited(true)
        window.scrollTo(0, 0)
        const id = hash.charAt(1) === '/' ? '' : hash.slice(1)
        if (nextRoute === 'home' && id) {
          setTimeout(() => {
            const el = document.getElementById(id)
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' })
          }, 900)
        }
      }

      if (transitionRef.current) transitionRef.current.run(applyRoute)
      else applyRoute()
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  return (
    <LanguageProvider>
      <PageTransitionOverlay ref={transitionRef} />
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
