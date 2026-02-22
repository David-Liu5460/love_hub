import { ConfigProvider } from 'antd'
import { Layout } from './components/Layout'
import { useHashRoute } from './lib/hashRoute'
import { AuthProvider, useAuth } from './lib/auth'
import { Dashboard } from './pages/Dashboard'
import { History } from './pages/History'
import { NewQuarrel } from './pages/NewQuarrel'
import { Profile } from './pages/Profile'
import { Login } from './pages/Login'
import './App.css'

const customTheme = {
  token: {
    colorPrimary: '#ff6b6b',
    colorInfo: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    borderRadius: 12,
    wireframe: false,
    fontSize: 14,
    colorText: '#333333',
    colorTextSecondary: '#666666',
  },
  components: {
    Button: {
      borderRadius: 8,
      colorPrimary: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
      colorPrimaryHover: 'linear-gradient(135deg, #ff5252 0%, #ff7b7b 100%)',
      colorPrimaryActive: 'linear-gradient(135deg, #e53e3e 0%, #ff6b6b 100%)',
    },
    Card: {
      borderRadius: 16,
      boxShadow: '0 8px 24px rgba(255, 107, 107, 0.12)',
      colorBorder: '#f0f0f0',
    },
    Rate: {
      colorFillContent: '#ffd8d8',
    },
    Input: {
      borderRadius: 8,
      colorBorder: '#e8e8e8',
      activeBorderColor: '#ff6b6b',
      hoverBorderColor: '#ff8e8e',
    },
    Select: {
      borderRadius: 8,
      colorBorder: '#e8e8e8',
    },
    Table: {
      borderRadius: 12,
      headerBorderRadius: 12,
    },
    Modal: {
      borderRadius: 16,
      boxShadow: '0 12px 32px rgba(255, 107, 107, 0.2)',
    },
  },
}

function AppContent() {
  const { path, navigate } = useHashRoute()
  const { user, loading } = useAuth()

  // 加载中显示空白
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fff5f5 0%, #ffecec 100%)'
      }}>
        <div style={{ color: '#ff6b6b', fontSize: '18px' }}>加载中...</div>
      </div>
    )
  }

  // 未登录显示登录页
  if (!user) {
    return <Login onNavigate={navigate} />
  }

  // 已登录显示主应用
  const content =
    path === '/new' ? (
      <NewQuarrel onNavigate={navigate} />
    ) : path === '/history' ? (
      <History />
    ) : path === '/profile' ? (
      <Profile />
    ) : (
      <Dashboard onNavigate={navigate} />
    )

  return (
    <Layout routePath={path}>{content}</Layout>
  )
}

function App() {
  return (
    <ConfigProvider theme={customTheme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App
