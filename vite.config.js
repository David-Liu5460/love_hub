import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const normalizeBase = (value) => {
  const base = value?.trim() ? value.trim() : '/'
  const withLeadingSlash = base.startsWith('/') ? base : `/${base}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

export default defineConfig({
  base: normalizeBase(process.env.BASE_URL),
  plugins: [react()],
})
