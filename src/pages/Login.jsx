import { Card, Form, Input, Button, Typography, Space, message, Tabs } from 'antd'
import { UserOutlined, LockOutlined, HeartFilled } from '@ant-design/icons'
import { useState } from 'react'
import { useAuth } from '../lib/auth'

const { Title, Text } = Typography
const { TabPane } = Tabs

export function Login({ onNavigate }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      if (activeTab === 'login') {
        const { data, error } = await signIn(values.email, values.password)
        if (error) {
          message.error(error.message || '登录失败，请检查邮箱和密码')
          return
        }
        message.success('登录成功！')
        onNavigate('/')
      } else {
        const { data, error } = await signUp(values.email, values.password)
        if (error) {
          message.error(error.message || '注册失败')
          return
        }
        message.success('注册成功！请检查邮箱验证邮件')
        setActiveTab('login')
      }
    } catch (error) {
      message.error('操作失败，请重试')
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fff5f5 0%, #ffecec 100%)',
      padding: '16px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '20px',
          boxShadow: '0 12px 32px rgba(255, 107, 107, 0.15)',
          border: '1px solid #f0f0f0',
        }}
        bodyStyle={{ padding: '40px 32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <HeartFilled style={{ fontSize: '48px', color: '#ff6b6b', marginBottom: '16px' }} />
          <Title level={2} style={{ color: '#ff6b6b', marginBottom: '8px' }}>
            爱的缓冲带
          </Title>
          <Text type="secondary">
            用心记录每一次情感交流，让爱更温暖
          </Text>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          style={{ marginBottom: '24px' }}
        >
          <TabPane tab="登录" key="login" />
          <TabPane tab="注册" key="register" />
        </Tabs>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
          requiredMark={false}
        >
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#ff6b6b' }} />}
              placeholder="请输入邮箱"
              style={{ borderRadius: '12px' }}
            />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#ff6b6b' }} />}
              placeholder="请输入密码"
              style={{ borderRadius: '12px' }}
            />
          </Form.Item>

          {activeTab === 'register' && (
            <Form.Item
              label="确认密码"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#ff6b6b' }} />}
                placeholder="请再次输入密码"
                style={{ borderRadius: '12px' }}
              />
            </Form.Item>
          )}

          <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
                border: 'none',
                borderRadius: '12px',
                height: '48px',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              {activeTab === 'login' ? '登录' : '注册'}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            登录即表示您同意我们的服务条款和隐私政策
          </Text>
        </div>
      </Card>
    </div>
  )
}
