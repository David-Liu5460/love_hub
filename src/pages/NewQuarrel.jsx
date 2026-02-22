import { Card, Form, Input, Select, Rate, Button, Row, Col, DatePicker, Typography, Space, message, Tag, Switch, Badge } from 'antd'
import { SaveOutlined, ArrowLeftOutlined, CalendarOutlined, TagOutlined, EditOutlined, HeartFilled } from '@ant-design/icons'
import { useState } from 'react'
import { createQuarrel } from '../lib/quarrels'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const quarrelReasons = [
  { value: 'habit', label: '生活习惯', icon: '🏠' },
  { value: 'money', label: '金钱问题', icon: '💰' },
  { value: 'family', label: '家庭关系', icon: '👨‍👩‍👧‍👦' },
  { value: 'work', label: '工作压力', icon: '💼' },
  { value: 'communication', label: '沟通问题', icon: '💬' },
  { value: 'trust', label: '信任问题', icon: '🔒' },
  { value: 'time', label: '时间分配', icon: '⏰' },
  { value: 'other', label: '其他', icon: '📋' },
]

const tagOptions = [
  { value: 'urgent', label: '紧急', color: 'red' },
  { value: 'important', label: '重要', color: 'orange' },
  { value: 'recurring', label: '反复', color: 'blue' },
  { value: 'minor', label: '轻微', color: 'green' },
  { value: 'resolved', label: '已解决', color: 'cyan' },
]

const treatmentOptions = [
  { value: 'talk', label: '沟通协商' },
  { value: 'cooldown', label: '冷静期' },
  { value: 'apologize', label: '道歉和解' },
  { value: 'compromise', label: '互相妥协' },
  { value: 'third_party', label: '第三方调解' },
  { value: 'pending', label: '待处理' },
]

const statusOptions = [
  { value: 'ongoing', label: '进行中', color: 'processing' },
  { value: 'resolved', label: '已和解', color: 'success' },
  { value: 'pending', label: '待处理', color: 'warning' },
  { value: 'escalated', label: '升级中', color: 'error' },
]

export function NewQuarrel({ onNavigate }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const quarrelData = {
        title: values.title,
        details: values.details,
        reason: values.reason,
        strength: values.strength,
        is_principal: values.is_principal || false,
        tag: values.tag || [],
        treatment: values.treatment,
        status: values.status || 'ongoing',
        opinion_male: values.opinion_male,
        opinion_female: values.opinion_female,
        create_at: values.create_at?.toISOString(),
        update_at: new Date().toISOString(),
        creator: '94e86047-0e52-4611-bce9-f6f2b06b4531',
      }

      await createQuarrel(quarrelData)
      message.success('吵架记录创建成功！')
      form.resetFields()
      onNavigate('/history')
    } catch (error) {
      message.error('创建失败，请重试')
      console.error('Error creating quarrel:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '8px', maxWidth: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Title level={2} style={{ color: '#ff6b6b', marginBottom: '8px' }}>
          记录吵架事件
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          坦诚记录，理性分析，让每一次争吵都成为感情的催化剂
        </Text>
      </div>

      <Card
        style={{
          borderRadius: '20px',
          boxShadow: '0 12px 32px rgba(255, 107, 107, 0.15)',
          border: '1px solid #f0f0f0',
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
          requiredMark={false}
        >
          {/* 标题 */}
          <Form.Item
            label="事件标题"
            name="title"
            rules={[{ required: true, message: '请输入事件标题' }]}
          >
            <Input
              placeholder="给这次争吵起个标题..."
              style={{ borderRadius: '12px' }}
              prefix={<EditOutlined style={{ color: '#ff6b6b' }} />}
            />
          </Form.Item>

          {/* 事件详情 */}
          <Form.Item
            label="事件详情"
            name="details"
            rules={[{ required: true, message: '请描述事件详情' }]}
          >
            <TextArea
              rows={4}
              placeholder="详细描述吵架的经过、主要分歧点..."
              style={{ borderRadius: '12px', resize: 'none' }}
            />
          </Form.Item>

          <Row gutter={[32, 24]}>
            <Col xs={24} md={12}>
              {/* 吵架原因 */}
              <Form.Item
                label="吵架原因"
                name="reason"
                rules={[{ required: true, message: '请选择吵架原因' }]}
              >
                <Select
                  placeholder="选择吵架原因"
                  style={{ borderRadius: '12px' }}
                  dropdownStyle={{ borderRadius: '12px' }}
                >
                  {quarrelReasons.map((reason) => (
                    <Option key={reason.value} value={reason.value}>
                      <span style={{ marginRight: '8px' }}>{reason.icon}</span>
                      {reason.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              {/* 强度等级 */}
              <Form.Item
                label="强度等级"
                name="strength"
                rules={[{ required: true, message: '请评估强度等级' }]}
              >
                <Rate
                  count={5}
                  style={{ color: '#ff6b6b', fontSize: '28px' }}
                  tooltips={[
                    '轻微分歧',
                    '小争执',
                    '中等争吵',
                    '严重争吵',
                    '非常严重的争吵'
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[32, 24]}>
            <Col xs={24} md={12}>
              {/* 发生时间 */}
              <Form.Item
                label="发生时间"
                name="create_at"
                rules={[{ required: true, message: '请选择发生时间' }]}
              >
                <DatePicker
                  showTime
                  placeholder="选择日期和时间"
                  style={{ width: '100%', borderRadius: '12px' }}
                  suffixIcon={<CalendarOutlined style={{ color: '#ff6b6b' }} />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              {/* 标签 */}
              <Form.Item
                label="标签"
                name="tag"
              >
                <Select
                  mode="multiple"
                  placeholder="选择标签（可选）"
                  allowClear
                  style={{ borderRadius: '12px' }}
                  dropdownStyle={{ borderRadius: '12px' }}
                  suffixIcon={<TagOutlined style={{ color: '#ff6b6b' }} />}
                  tagRender={({ label, value, closable, onClose }) => (
                    <Tag color={tagOptions.find(t => t.value === value)?.color || 'default'} closable={closable} onClose={onClose} style={{ marginRight: 4 }}>
                      {label}
                    </Tag>
                  )}
                >
                  {tagOptions.map((tag) => (
                    <Option key={tag.value} value={tag.value}>
                      <Tag color={tag.color}>{tag.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[32, 24]}>
            <Col xs={24} md={12}>
              {/* 处理方式 */}
              <Form.Item
                label="处理方式"
                name="treatment"
              >
                <Select
                  placeholder="选择处理方式（可选）"
                  allowClear
                  style={{ borderRadius: '12px' }}
                  dropdownStyle={{ borderRadius: '12px' }}
                >
                  {treatmentOptions.map((treatment) => (
                    <Option key={treatment.value} value={treatment.value}>
                      {treatment.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              {/* 状态 */}
              <Form.Item
                label="当前状态"
                name="status"
                initialValue="ongoing"
              >
                <Select
                  placeholder="选择状态"
                  style={{ borderRadius: '12px' }}
                  dropdownStyle={{ borderRadius: '12px' }}
                >
                  {statusOptions.map((status) => (
                    <Option key={status.value} value={status.value}>
                      <Badge status={status.color} text={status.label} />
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* 是否原则性问题 */}
          <Form.Item
            label="是否原则性问题"
            name="is_principal"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              style={{ backgroundColor: '#ff6b6b' }}
            />
          </Form.Item>

          <Row gutter={[32, 24]}>
            <Col xs={24} md={12}>
              {/* 男方观点 */}
              <Form.Item
                label="男方观点"
                name="opinion_male"
              >
                <TextArea
                  rows={3}
                  placeholder="男方的想法和感受..."
                  style={{ borderRadius: '12px', resize: 'none' }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              {/* 女方观点 */}
              <Form.Item
                label="女方观点"
                name="opinion_female"
              >
                <TextArea
                  rows={3}
                  placeholder="女方的想法和感受..."
                  style={{ borderRadius: '12px', resize: 'none' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Space size="large">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 32px',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                保存记录
              </Button>
              <Button
                onClick={() => onNavigate('/')}
                icon={<ArrowLeftOutlined />}
                style={{
                  borderRadius: '12px',
                  padding: '0 24px',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 500,
                  border: '2px solid #ff6b6b',
                  color: '#ff6b6b',
                }}
              >
                返回首页
              </Button>
            </Space>
          </div>
        </Form>
      </Card>

      {/* 温馨提示 */}
      <Card
        style={{
          marginTop: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #fff5f5 0%, #ffecec 100%)',
          border: '1px solid #ffd8d8',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ textAlign: 'center' }}>
          <HeartFilled style={{ color: '#ff6b6b', fontSize: '24px', marginBottom: '12px' }} />
          <Title level={4} style={{ color: '#ff6b6b', marginBottom: '8px' }}>
            温馨小贴士
          </Title>
          <Text type="secondary" style={{ fontSize: '14px', lineHeight: '1.6' }}>
            每一次争吵都是了解彼此的机会，记录下这些时刻，
            让我们一起成长，让爱情更加坚固。
          </Text>
        </div>
      </Card>
    </div>
  )
}
