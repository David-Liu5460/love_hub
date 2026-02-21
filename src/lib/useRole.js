import { useEffect, useState } from 'react'
import { getRole } from './role'

export const useRole = () => {
  const [role, setRole] = useState(() => getRole())

  useEffect(() => {
    const onChange = () => setRole(getRole())
    window.addEventListener('love_hub_role_change', onChange)
    return () => window.removeEventListener('love_hub_role_change', onChange)
  }, [])

  return role
}

