import { Card, Avatar, Descriptions, Button, Upload, Tabs, Progress, Statistic, Row, Col, Space, Typography, Divider, Tag, Timeline, Badge, Rate } from 'antd'
import { UserOutlined, EditOutlined, ExportOutlined, SettingOutlined, HistoryOutlined, HeartOutlined, CalendarOutlined, TrophyOutlined, StarOutlined, HeartFilled } from '@ant-design/icons'
import { useState } from 'react'

const { Title, Text } = Typography
const { TabPane } = Tabs

export function Profile() {
  const [activeTab, setActiveTab] = useState('overview')

  const userInfo = {
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: null,
    plan: 'premium',
    joinDate: '2024-01-15',
    totalQuarrels: 45,
    resolvedQuarrels: 38,
    avgSeverity: 2.8,
    longestQuarrel: 48,
    shortestQuarrel: 5,
  }

  const recentActivities = [
    {
      date: '2024-02-20',
      content: '记录了一次关于生活习惯的争吵',
      severity: 3,
      resolved: true,
    },
    {
      date: '2024-02-18',
      content: '成功和解了一次工作压力引发的争吵',
      severity: 4,
      resolved: true,
    },
    {
      date: '2024-02-15',
      content: '记录了一次关于金钱问题的分歧',
      severity: 2,
      resolved: false,
    },
  ]

  const achievements = [
    { title: '和解大师', description: '连续10次成功和解', icon: <TrophyOutlined />, color: '#ffd700' },
    { title: '记录达人', description: '累计记录50次争吵', icon: <HistoryOutlined />, color: '#ff6b6b' },
    { title: '沟通专家', description: '平均严重程度低于3星', icon: <StarOutlined />, color: '#52c41a' },
    { title: '坚持之星', description: '连续使用30天', icon: <CalendarOutlined />, color: '#1890ff' },
  ]

  const handleExport = () => {
    // 数据导出逻辑
    console.log('导出数据')
  }

  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      console.log('头像上传成功')
    }
  }

  return (
    <div style={{ padding: '8px', maxWidth: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ color: '#ff6b6b', marginBottom: '8px' }}>
          个人中心
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          管理您的账户信息和查看使用统计
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* 用户信息卡片 */}
        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: '20px',
              boxShadow: '0 8px 24px rgba(255, 107, 107, 0.12)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Upload
                name="avatar"
                showUploadList={false}
                onChange={handleAvatarChange}
                customRequest={({ onSuccess }) => {
                  setTimeout(() => onSuccess("ok"), 0)
                }}
              >
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  src={userInfo.avatar}
                  style={{ 
                    backgroundColor: '#ff6b6b',
                    cursor: 'pointer',
                    border: '3px solid #fff',
                    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
                  }}
                />
              </Upload>
              <Title level={3} style={{ color: '#ff6b6b', margin: '16px 0 8px' }}>
                {userInfo.name}
              </Title>
              <Tag 
                color={userInfo.plan === 'premium' ? 'gold' : 'default'}
                style={{ borderRadius: '12px', fontSize: '12px', padding: '4px 12px' }}
              >
                {userInfo.plan === 'premium' ? '高级会员' : '普通会员'}
              </Tag>
            </div>

            <Descriptions column={1} size="small" style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="邮箱">
                <Text style={{ color: '#666' }}>{userInfo.email}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="加入时间">
                <Text style={{ color: '#666' }}>{userInfo.joinDate}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="会员状态">
                <Badge status="success" text="活跃" />
              </Descriptions.Item>
            </Descriptions>

            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                编辑资料
              </Button>
              <Button
                icon={<ExportOutlined />}
                onClick={handleExport}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b',
                }}
              >
                导出数据
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 统计信息 */}
        <Col xs={24} lg={16}>
          <Card
            style={{
              borderRadius: '20px',
              boxShadow: '0 8px 24px rgba(255, 107, 107, 0.12)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <Title level={4} style={{ color: '#ff6b6b', marginBottom: '24px' }}>
              使用统计
            </Title>
            
            <Row gutter={[24, 24]}>
              <Col xs={12} sm={6}>
                <Card size="small" style={{ borderRadius: '12px', textAlign: 'center' }}>
                  <Statistic
                    title="总记录数"
                    value={userInfo.totalQuarrels}
                    valueStyle={{ color: '#ff6b6b' }}
                    prefix={<HistoryOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small" style={{ borderRadius: '12px', textAlign: 'center' }}>
                  <Statistic
                    title="和解次数"
                    value={userInfo.resolvedQuarrels}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<HeartOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small" style={{ borderRadius: '12px', textAlign: 'center' }}>
                  <Statistic
                    title="平均严重程度"
                    value={userInfo.avgSeverity}
                    precision={1}
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<StarOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small" style={{ borderRadius: '12px', textAlign: 'center' }}>
                  <Statistic
                    title="和解率"
                    value={Math.round((userInfo.resolvedQuarrels / userInfo.totalQuarrels) * 100)}
                    suffix="%"
                    valueStyle={{ color: '#faad14' }}
                    prefix={<TrophyOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            <div style={{ marginTop: '32px' }}>
              <Title level={5} style={{ color: '#ff6b6b', marginBottom: '16px' }}>
                和解率趋势
              </Title>
              <Progress
                percent={Math.round((userInfo.resolvedQuarrels / userInfo.totalQuarrels) * 100)}
                strokeColor={{
                  '0%': '#ff6b6b',
                  '100%': '#52c41a',
                }}
                strokeWidth={12}
                format={(percent) => (
                  <span style={{ color: '#ff6b6b', fontSize: '14px', fontWeight: 600 }}>
                    {percent}%
                  </span>
                )}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 标签页内容 */}
      <Card
        style={{
          marginTop: '24px',
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(255, 107, 107, 0.12)',
          border: '1px solid #f0f0f0',
        }}
        bodyStyle={{ padding: '0' }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ padding: '24px' }}
          tabBarStyle={{
            borderBottom: '2px solid #ff6b6b20',
            marginBottom: '24px',
          }}
        >
          <TabPane tab="最近活动" key="overview">
            <Timeline
              items={recentActivities.map((activity) => ({
                color: activity.resolved ? '#52c41a' : '#ff6b6b',
                children: (
                  <div>
                    <Text strong style={{ color: '#333' }}>
                      {activity.content}
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {activity.date}
                      </Text>
                      <Rate
                        disabled
                        value={activity.severity}
                        character={<HeartFilled style={{ color: '#ff6b6b', fontSize: '12px' }} />}
                        count={5}
                        style={{ marginLeft: '12px' }}
                      />
                    </div>
                  </div>
                ),
              }))}
            />
          </TabPane>

          <TabPane tab="成就徽章" key="achievements">
            <Row gutter={[16, 16]}>
              {achievements.map((achievement, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: '12px',
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #fff5f5 0%, #ffecec 100%)',
                      border: '1px solid #ffd8d8',
                    }}
                    bodyStyle={{ padding: '16px' }}
                  >
                    <div style={{ fontSize: '32px', color: achievement.color, marginBottom: '8px' }}>
                      {achievement.icon}
                    </div>
                    <Title level={5} style={{ color: '#ff6b6b', margin: '0 0 4px' }}>
                      {achievement.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {achievement.description}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab="账户设置" key="settings">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Title level={5} style={{ color: '#ff6b6b', marginBottom: '16px' }}>
                  通知设置
                </Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>邮件通知</Text>
                    <Button type="text" icon={<SettingOutlined />} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>推送通知</Text>
                    <Button type="text" icon={<SettingOutlined />} />
                  </div>
                </Space>
              </div>

              <Divider />

              <div>
                <Title level={5} style={{ color: '#ff6b6b', marginBottom: '16px' }}>
                  隐私设置
                </Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>数据同步</Text>
                    <Button type="text" icon={<SettingOutlined />} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>匿名模式</Text>
                    <Button type="text" icon={<SettingOutlined />} />
                  </div>
                </Space>
              </div>
            </Space>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}