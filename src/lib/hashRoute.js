import { useEffect, useMemo, useState } from 'react'

const parseHash = () => {
  const raw = window.location.hash || ''
  const withoutHash = raw.startsWith('#') ? raw.slice(1) : raw
  const path = withoutHash.startsWith('/') ? withoutHash : `/${withoutHash}`
  return path === '/' ? '/dashboard' : path
}

export const useHashRoute = () => {
  const [path, setPath] = useState(() => parseHash())

  useEffect(() => {
    const onChange = () => setPath(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = (next) => {
    const target = next.startsWith('#') ? next : `#${next.startsWith('/') ? next : `/${next}`}`
    if (window.location.hash === target) return
    window.location.hash = target
  }

  return useMemo(() => ({ path, navigate }), [path])
}

