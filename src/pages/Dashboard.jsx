import { useEffect, useMemo, useState } from 'react'
import { Card, Statistic, Row, Col, Button, Space, Typography, Badge, List, Tag } from 'antd'
import { 
  PlusOutlined, 
  WarningOutlined, 
  CheckCircleOutlined, 
  FileTextOutlined,
  UserOutlined,
  RightOutlined,
  FireOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { isQuarrelComplete, listQuarrels } from '../lib/quarrels'
import { Roles } from '../lib/role'
import { useRole } from '../lib/useRole'

const { Title, Text } = Typography

export function Dashboard({ onNavigate }) {
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [items, setItems] = useState([])

  const role = useRole()

  const stats = useMemo(() => {
    const total = items.length
    const thisMonth = items.filter((x) => {
      const date = x.create_at ? new Date(x.create_at) : null
      const now = new Date()
      return date && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length
    const principal = items.filter((x) => Boolean(x.is_principal)).length
    const resolved = items.filter((x) => (x.status || 'ongoing') === 'resolved').length
    const complete = items.filter((x) => isQuarrelComplete(x)).length
    const myFilled = items.filter((x) => {
      const mine = role === Roles.female ? x.opinion_female : x.opinion_male
      return Boolean(mine && mine.trim())
    }).length
    const partnerFilled = items.filter((x) => {
      const partner = role === Roles.female ? x.opinion_male : x.opinion_female
      return Boolean(partner && partner.trim())
    }).length
    return { total, thisMonth, principal, resolved, complete, myFilled, partnerFilled }
  }, [items, role])

  useEffect(() => {
    let active = true

    const run = async () => {
      setLoading(true)
      setErrorMessage('')
      try {
        const { data, error } = await listQuarrels({ limit: 8 })
        if (!active) return
        if (error) {
          setErrorMessage(error.message)
          setItems([])
          setLoading(false)
          return
        }
        setItems(data ?? [])
        setLoading(false)
      } catch (e) {
        if (!active) return
        setErrorMessage(e?.message || '加载失败')
        setItems([])
        setLoading(false)
      }
    }

    run()

    return () => {
      active = false
    }
  }, [])

  const recentItems = items.slice(0, 5)

  return (
    <div style={{ padding: '8px' }}>
      {/* Hero Banner */}
      <Card
        style={{
          marginBottom: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 50%, #ffa8a8 100%)',
          border: 'none',
        }}
        bodyStyle={{ padding: '40px 32px', textAlign: 'center' }}
      >
        <Title level={2} style={{ color: '#fff', marginBottom: '12px', fontWeight: 600 }}>
          爱的缓冲带
        </Title>
        <Text style={{ color: '#fff', fontSize: '16px', opacity: 0.95, display: 'block', marginBottom: '24px' }}>
          记录、理解、成长 - 让每一次情感交流都成为爱的见证
        </Text>
        <Space size="middle">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => onNavigate('/new')}
            style={{
              background: '#fff',
              color: '#ff6b6b',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 500,
              height: '44px',
              padding: '0 24px',
            }}
          >
            记录新的情感交流
          </Button>
        </Space>
      </Card>

      {errorMessage ? (
        <Card style={{ marginBottom: '24px', borderRadius: '12px', borderColor: '#ff4d4f' }}>
          <Text type="danger">{errorMessage}</Text>
        </Card>
      ) : null}

      {/* Stats Grid */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={12} md={6}>
          <Card
            style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<Text style={{ color: '#666', fontSize: '14px' }}>总记录次数</Text>}
              value={stats.total}
              valueStyle={{ color: '#333', fontSize: '32px', fontWeight: 600 }}
              prefix={<FireOutlined style={{ color: '#ff6b6b', fontSize: '20px', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card
            style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<Text style={{ color: '#666', fontSize: '14px' }}>本月记录</Text>}
              value={stats.thisMonth}
              valueStyle={{ color: '#333', fontSize: '32px', fontWeight: 600 }}
              prefix={<CalendarOutlined style={{ color: '#ff6b6b', fontSize: '20px', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card
            style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<Text style={{ color: '#666', fontSize: '14px' }}>原则性问题</Text>}
              value={stats.principal}
              valueStyle={{ color: '#333', fontSize: '32px', fontWeight: 600 }}
              prefix={<WarningOutlined style={{ color: '#ff6b6b', fontSize: '20px', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card
            style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<Text style={{ color: '#666', fontSize: '14px' }}>已解决</Text>}
              value={stats.resolved}
              valueStyle={{ color: '#52c41a', fontSize: '32px', fontWeight: 600 }}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Opinion Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12}>
          <Card
            style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<Text style={{ color: '#666', fontSize: '14px' }}>男方陈述记录</Text>}
              value={stats.myFilled}
              valueStyle={{ color: '#333', fontSize: '28px', fontWeight: 600 }}
              prefix={<UserOutlined style={{ color: '#1890ff', fontSize: '18px', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col xs={12}>
          <Card
            style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<Text style={{ color: '#666', fontSize: '14px' }}>女方陈述记录</Text>}
              value={stats.partnerFilled}
              valueStyle={{ color: '#333', fontSize: '28px', fontWeight: 600 }}
              prefix={<UserOutlined style={{ color: '#eb2f96', fontSize: '18px', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Records */}
      <Card
        style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '16px' }}>最近情感交流记录</Text>
            <Button 
              type="link" 
              onClick={() => onNavigate('/history')}
              style={{ color: '#ff6b6b', padding: 0 }}
            >
              查看全部 <RightOutlined />
            </Button>
          </div>
        }
        bodyStyle={{ padding: '0' }}
      >
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Text type="secondary">加载中...</Text>
          </div>
        ) : recentItems.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Text style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>还没有记录</Text>
            <Button 
              type="primary" 
              onClick={() => onNavigate('/new')}
              style={{ 
                background: '#ff6b6b', 
                borderColor: '#ff6b6b',
                borderRadius: '8px'
              }}
            >
              记录第一次情感交流
            </Button>
          </div>
        ) : (
          <List
            dataSource={recentItems}
            renderItem={(item) => {
              const complete = isQuarrelComplete(item)
              const status = item.status || 'ongoing'
              const statusText = status === 'resolved' ? '已解决' : status === 'ongoing' ? '进行中' : '待处理'
              const statusColor = status === 'resolved' ? 'success' : status === 'ongoing' ? 'processing' : 'warning'
              
              return (
                <List.Item
                  style={{ padding: '16px 24px', cursor: 'pointer' }}
                  onClick={() => onNavigate('/history')}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Text strong>{item.title || '未命名记录'}</Text>
                        <Space size="small">
                          <Badge status={statusColor} text={statusText} />
                          {item.is_principal && <Tag color="red">原则</Tag>}
                          {complete ? (
                            <Tag color="blue">可互见</Tag>
                          ) : (
                            <Tag>仅自见</Tag>
                          )}
                        </Space>
                      </div>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        {item.create_at ? new Date(item.create_at).toLocaleString() : ''}
                        {typeof item.strength === 'number' ? ` · 强度 ${item.strength}` : ''}
                      </Text>
                    }
                  />
                  <RightOutlined style={{ color: '#bfbfbf' }} />
                </List.Item>
              )
            }}
          />
        )}
      </Card>
    </div>
  )
}
