import { useEffect, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { supabase } from './lib/supabaseClient'

function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const isSupabaseConfigured = useMemo(() => Boolean(supabase), [])

  useEffect(() => {
    let isActive = true

    const run = async () => {
      if (!supabase) {
        if (isActive) {
          setLoading(false)
          setErrorMessage('Supabase 未配置：请在 .env.local 设置 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY')
        }
        return
      }

      setLoading(true)
      setErrorMessage('')

      const { data, error } = await supabase
        .from('notes')
        .select('id, content, created_at')
        .order('created_at', { ascending: false })

      if (!isActive) return

      if (error) {
        setNotes([])
        setErrorMessage(error.message)
        setLoading(false)
        return
      }

      setNotes(data ?? [])
      setLoading(false)
    }

    run()

    return () => {
      isActive = false
    }
  }, [])

  const title = isSupabaseConfigured ? 'Notes（来自 Supabase）' : 'Notes'

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{title}</h1>
      <div className="card">
        {loading ? (
          <p>加载中…</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : notes.length === 0 ? (
          <p>暂无数据</p>
        ) : (
          <ul style={{ textAlign: 'left', margin: 0, paddingLeft: 18 }}>
            {notes.map((note) => (
              <li key={note.id} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{note.content}</div>
                <div style={{ opacity: 0.7, fontSize: 12 }}>
                  {note.created_at ? new Date(note.created_at).toLocaleString() : ''}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
