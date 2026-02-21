import './App.css'
import { Layout } from './components/Layout'
import { useHashRoute } from './lib/hashRoute'
import { Dashboard } from './pages/Dashboard'
import { History } from './pages/History'
import { NewQuarrel } from './pages/NewQuarrel'

function App() {
  const { path, navigate } = useHashRoute()

  const content =
    path === '/new' ? (
      <NewQuarrel onNavigate={navigate} />
    ) : path === '/history' ? (
      <History />
    ) : (
      <Dashboard onNavigate={navigate} />
    )

  return (
    <Layout routePath={path}>{content}</Layout>
  )
}

export default App
