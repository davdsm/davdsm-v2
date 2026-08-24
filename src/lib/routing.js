/** Path-based SPA routing helpers for DAVDSM. */

export function parseLocation(pathname = window.location.pathname, hash = window.location.hash) {
  const path = (pathname || '/').replace(/\/+$/, '') || '/'

  const projectMatch = path.match(/^\/work\/([^/]+)$/)
  if (projectMatch) return { route: 'project', slug: projectMatch[1], path }

  if (path === '/studio') return { route: 'studio', slug: null, path }
  if (path === '/work') return { route: 'work', slug: null, path }
  if (path === '/solutions') return { route: 'solutions', slug: null, path }
  if (path === '/terms') return { route: 'terms', slug: null, path }
  if (path === '/privacy') return { route: 'privacy', slug: null, path }

  // Legacy hash routes (#/studio etc.) → treat as path until redirected
  const legacy = hash.match(/^#\/(work\/[^/?#]+|studio|work|solutions|terms|privacy)\/?$/)
  if (legacy) {
    const rest = legacy[1]
    if (rest.startsWith('work/')) return { route: 'project', slug: rest.slice(5), path: `/${rest}` }
    return { route: rest, slug: null, path: `/${rest}` }
  }

  return { route: 'home', slug: null, path: '/' }
}

export function pathForRoute(route, slug = null) {
  if (route === 'project' && slug) return `/work/${slug}`
  if (route === 'studio') return '/studio'
  if (route === 'work') return '/work'
  if (route === 'solutions') return '/solutions'
  if (route === 'terms') return '/terms'
  if (route === 'privacy') return '/privacy'
  return '/'
}

/** Redirect old #/path bookmarks to real /path URLs (one-time replace). */
export function redirectLegacyHash() {
  const hash = window.location.hash || ''
  const match = hash.match(/^#\/(work\/[^/?#]+|studio|work|solutions|terms|privacy)\/?$/)
  if (!match) return false
  const next = `/${match[1]}${window.location.search || ''}`
  // Full navigation is more reliable than replaceState for cold loads / cached shells.
  if (window.location.pathname === '/' || window.location.pathname === '') {
    window.location.replace(next)
    return true
  }
  window.history.replaceState({}, '', next)
  return true
}

export function navigate(to, { replace = false } = {}) {
  const url = to.startsWith('/') ? to : `/${to}`
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (url === current || url === window.location.pathname) {
    if (url === '/' && window.location.hash) {
      window.history[replace ? 'replaceState' : 'pushState']({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
    return
  }
  window.history[replace ? 'replaceState' : 'pushState']({}, '', url)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function isAppPath(pathname) {
  const { route } = parseLocation(pathname, '')
  return route !== 'home' || pathname === '/' || pathname === ''
}
