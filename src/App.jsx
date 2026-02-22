import { ConfigProvider } from 'antd'
import { HeartFilled } from '@ant-design/icons'
import { Layout } from './components/Layout'
import { useHashRoute } from './lib/hashRoute'
import { Dashboard } from './pages/Dashboard'
import { History } from './pages/History'
import { NewQuarrel } from './pages/NewQuarrel'
import { Profile } from './pages/Profile'
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

function App() {
  const { path, navigate } = useHashRoute()

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
    <ConfigProvider theme={customTheme}>
      <Layout routePath={path}>{content}</Layout>
    </ConfigProvider>
  )
}

export default App