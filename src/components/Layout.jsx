import { Layout as AntLayout, Menu, Avatar, Button, Space, Typography, Dropdown } from 'antd'
import { HeartOutlined, DashboardOutlined, HistoryOutlined, PlusCircleOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useAuth } from '../lib/auth'

const { Header, Content } = AntLayout
const { Title, Text } = Typography

export function Layout({ children, routePath }) {
  const [current, setCurrent] = useState(
    routePath === '/new' ? 'new' : 
    routePath === '/history' ? 'history' : 
    routePath === '/profile' ? 'profile' : 
    'dashboard'
  )
  const { user, signOut } = useAuth()

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: 'new',
      icon: <PlusCircleOutlined />,
      label: '新建记录',
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: '历史记录',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
  ]

  const onMenuClick = (e) => {
    setCurrent(e.key)
    const path = e.key === 'dashboard' ? '/' : `/${e.key}`
    window.location.hash = path
  }

  const handleLogout = async () => {
    await signOut()
  }

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  return (
    <AntLayout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fff5f5 0%, #ffecec 100%)' }}>
      <Header style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(255, 107, 107, 0.08)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <HeartOutlined style={{ fontSize: '24px', color: '#ff6b6b' }} />
          <Title level={3} style={{ margin: 0, color: '#ff6b6b', fontWeight: 600 }}>
            爱的缓冲带
          </Title>
        </div>
        
        <Menu
          mode="horizontal"
          selectedKeys={[current]}
          onClick={onMenuClick}
          items={menuItems}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            fontSize: '15px',
            fontWeight: 500,
          }}
          theme="light"
        />

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space size="small" style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: 'background 0.3s' }}>
            <Text style={{ color: '#333', fontSize: '14px' }}>
              {user?.user_metadata?.display_name || user?.email?.split('@')[0] || '用户'}
            </Text>
            <Avatar
              size="default"
              icon={<UserOutlined />}
              style={{ backgroundColor: '#ff6b6b' }}
            />
          </Space>
        </Dropdown>
      </Header>

      <Content style={{ padding: '16px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {children}
      </Content>
    </AntLayout>
  )
}
