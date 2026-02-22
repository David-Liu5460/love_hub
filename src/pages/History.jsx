import { Card, Table, Tag, Button, DatePicker, Select, Space, Typography, Modal, Row, Col, Rate, Badge, Empty, message, Form, Input, Switch } from 'antd'
import { EyeOutlined, EditOutlined, DeleteOutlined, FilterOutlined, CalendarOutlined, HeartFilled, HistoryOutlined, UserOutlined, TagOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { getQuarrels, deleteQuarrel, updateQuarrel } from '../lib/quarrels'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input

const reasonLabels = {
  habit: '生活习惯',
  money: '金钱问题',
  family: '家庭关系',
  work: '工作压力',
  communication: '沟通问题',
  trust: '信任问题',
  time: '时间分配',
  other: '其他',
}

const reasonColors = {
  habit: 'blue',
  money: 'orange',
  family: 'green',
  work: 'purple',
  communication: 'cyan',
  trust: 'red',
  time: 'gold',
  other: 'default',
}

const tagLabels = {
  urgent: '紧急',
  important: '重要',
  recurring: '反复',
  minor: '轻微',
  resolved: '已解决',
}

const tagColors = {
  urgent: 'red',
  important: 'orange',
  recurring: 'blue',
  minor: 'green',
  resolved: 'cyan',
}

const statusLabels = {
  ongoing: '进行中',
  resolved: '已和解',
  pending: '待处理',
  escalated: '升级中',
}

const statusColors = {
  ongoing: 'processing',
  resolved: 'success',
  pending: 'warning',
  escalated: 'error',
}

const treatmentLabels = {
  talk: '沟通协商',
  cooldown: '冷静期',
  apologize: '道歉和解',
  compromise: '互相妥协',
  third_party: '第三方调解',
  pending: '待处理',
}

export function History() {
  const [quarrels, setQuarrels] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedQuarrel, setSelectedQuarrel] = useState(null)
  const [filters, setFilters] = useState({
    reason: '',
    dateRange: [],
    status: '',
  })
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadQuarrels()
  }, [])

  const loadQuarrels = async () => {
    try {
      setLoading(true)
      const data = await getQuarrels()
      setQuarrels(data || [])
    } catch (error) {
      console.error('Error loading quarrels:', error)
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteQuarrel(id)
          message.success('删除成功')
          loadQuarrels()
        } catch (error) {
          console.error('Error deleting quarrel:', error)
          message.error('删除失败')
        }
      },
    })
  }

  const showDetails = (record) => {
    setSelectedQuarrel(record)
    setViewModalVisible(true)
  }

  const showEdit = (record) => {
    setSelectedQuarrel(record)
    form.setFieldsValue({
      title: record.title,
      details: record.details,
      reason: record.reason,
      strength: record.strength,
      status: record.status,
      is_principal: record.is_principal || false,
      tag: record.tag,
      treatment: record.treatment,
      opinion_male: record.opinion_male,
      opinion_female: record.opinion_female,
    })
    setEditModalVisible(true)
  }

  const handleSave = async (values) => {
    if (!selectedQuarrel) return
    
    setSaving(true)
    try {
      const { data, error } = await updateQuarrel(selectedQuarrel.id, {
        ...values,
        update_at: new Date().toISOString(),
      })
      
      if (error) {
        console.error('Update error:', error)
        message.error('更新失败: ' + error.message)
        return
      }
      
      message.success('更新成功')
      setEditModalVisible(false)
      loadQuarrels()
    } catch (error) {
      console.error('Error updating quarrel:', error)
      message.error('更新失败: ' + (error.message || '未知错误'))
    } finally {
      setSaving(false)
    }
  }

  const filteredQuarrels = quarrels.filter((quarrel) => {
    if (filters.reason && quarrel.reason !== filters.reason) return false
    if (filters.status && quarrel.status !== filters.status) return false
    if (filters.dateRange && filters.dateRange.length === 2) {
      const startDate = dayjs(filters.dateRange[0])
      const endDate = dayjs(filters.dateRange[1])
      const quarrelDate = dayjs(quarrel.create_at)
      if (quarrelDate.isBefore(startDate) || quarrelDate.isAfter(endDate)) return false
    }
    return true
  })

  const columns = [
    {
      title: '时间',
      dataIndex: 'create_at',
      key: 'create_at',
      render: (text) => (
        <Text style={{ color: '#666' }}>
          {dayjs(text).format('MM-DD HH:mm')}
        </Text>
      ),
      sorter: (a, b) => dayjs(a.create_at).unix() - dayjs(b.create_at).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <Text style={{ fontWeight: 500 }}>{text || '无标题'}</Text>
      ),
      ellipsis: true,
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason) => (
        <Tag 
          color={reasonColors[reason]} 
          style={{ borderRadius: '8px', fontSize: '13px', padding: '4px 8px' }}
        >
          {reasonLabels[reason]}
        </Tag>
      ),
      filters: Object.entries(reasonLabels).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.reason === value,
    },
    {
      title: '强度',
      dataIndex: 'strength',
      key: 'strength',
      render: (strength) => (
        <div style={{ color: '#ff6b6b', fontSize: '14px' }}>
          {Array.from({ length: 5 }, (_, i) => (
            <HeartFilled
              key={i}
              style={{
                color: i < (strength || 0) ? '#ff6b6b' : '#e8e8e8',
                marginRight: '2px',
              }}
            />
          ))}
        </div>
      ),
      sorter: (a, b) => (a.strength || 0) - (b.strength || 0),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={statusColors[status] || 'default'}
          text={statusLabels[status] || status}
          style={{ fontSize: '13px' }}
        />
      ),
      filters: Object.entries(statusLabels).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '责任人',
      dataIndex: 'is_principal',
      key: 'is_principal',
      render: (principal) => (
        <Tag 
          color={principal ? 'red' : 'default'}
          style={{ borderRadius: '8px' }}
        >
          {principal ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showDetails(record)}
            style={{ color: '#1890ff' }}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showEdit(record)}
            style={{ color: '#52c41a' }}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '8px' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ color: '#ff6b6b', marginBottom: '8px' }}>
            历史记录
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            回顾每一次情感交流，从中学习和成长
          </Text>
        </div>
        <Button
          type="primary"
          icon={<HistoryOutlined />}
          onClick={loadQuarrels}
          loading={loading}
          style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
            border: 'none',
            borderRadius: '8px',
          }}
        >
          刷新数据
        </Button>
      </div>

      {/* 筛选器 */}
      <Card
        style={{
          marginBottom: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(255, 107, 107, 0.08)',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} sm={12} lg={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text style={{ color: '#666', fontSize: '14px' }}>时间范围</Text>
              <RangePicker
                style={{ width: '100%', borderRadius: '8px' }}
                suffixIcon={<CalendarOutlined style={{ color: '#ff6b6b' }} />}
                onChange={(dates) => setFilters({ ...filters, dateRange: dates || [] })}
              />
            </Space>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text style={{ color: '#666', fontSize: '14px' }}>交流原因</Text>
              <Select
                placeholder="选择原因"
                allowClear
                style={{ width: '100%', borderRadius: '8px' }}
                onChange={(value) => setFilters({ ...filters, reason: value })}
              >
                {Object.entries(reasonLabels).map(([value, label]) => (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text style={{ color: '#666', fontSize: '14px' }}>状态</Text>
              <Select
                placeholder="选择状态"
                allowClear
                style={{ width: '100%', borderRadius: '8px' }}
                onChange={(value) => setFilters({ ...filters, status: value })}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text style={{ color: '#666', fontSize: '14px' }}>&nbsp;</Text>
              <Button
                icon={<FilterOutlined />}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b',
                }}
              >
                筛选
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card
        style={{
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(255, 107, 107, 0.08)',
          overflow: 'auto',
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <Table
          columns={columns}
          dataSource={filteredQuarrels}
          loading={loading}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: { marginTop: '16px' },
          }}
          locale={{
            emptyText: (
              <Empty
                description="暂无记录"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button
                  type="primary"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                  onClick={() => window.location.hash = '#/new'}
                >
                  创建第一条记录
                </Button>
              </Empty>
            ),
          }}
        />
      </Card>

      {/* 查看详情弹窗 */}
      <Modal
        title={selectedQuarrel?.title || '情感交流详情'}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 50 }}
        bodyStyle={{ padding: '32px' }}
      >
        {selectedQuarrel && (
          <div>
            <Row gutter={[32, 24]}>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text type="secondary" style={{ fontSize: '14px' }}>交流原因</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Tag 
                      color={reasonColors[selectedQuarrel.reason]} 
                      style={{ borderRadius: '8px', fontSize: '14px', padding: '6px 12px' }}
                    >
                      {reasonLabels[selectedQuarrel.reason]}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text type="secondary" style={{ fontSize: '14px' }}>强度等级</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Rate
                      disabled
                      value={selectedQuarrel.strength}
                      character={<HeartFilled style={{ color: '#ff6b6b', fontSize: '16px' }} />}
                      count={5}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <Row gutter={[32, 24]}>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text type="secondary" style={{ fontSize: '14px' }}>发生时间</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text style={{ fontSize: '16px', fontWeight: 500 }}>
                      {dayjs(selectedQuarrel.create_at).format('YYYY年MM月DD日 HH:mm')}
                    </Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text type="secondary" style={{ fontSize: '14px' }}>当前状态</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Badge
                      status={statusColors[selectedQuarrel.status] || 'default'}
                      text={statusLabels[selectedQuarrel.status] || selectedQuarrel.status}
                      style={{ fontSize: '14px' }}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <Row gutter={[32, 24]}>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text type="secondary" style={{ fontSize: '14px' }}>原则性问题</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Tag color={selectedQuarrel.is_principal ? 'red' : 'default'} style={{ borderRadius: '8px' }}>
                      {selectedQuarrel.is_principal ? '是' : '否'}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text type="secondary" style={{ fontSize: '14px' }}>标签</Text>
                  <div style={{ marginTop: '4px' }}>
                    {selectedQuarrel.tag && selectedQuarrel.tag.length > 0 ? (
                      <Space>
                        {selectedQuarrel.tag.map((t, i) => (
                          <Tag 
                            key={i}
                            color={tagColors[t]} 
                            icon={<TagOutlined />}
                            style={{ borderRadius: '8px' }}
                          >
                            {tagLabels[t]}
                          </Tag>
                        ))}
                      </Space>
                    ) : (
                      <Text type="secondary">无标签</Text>
                    )}
                  </div>
                </div>
              </Col>
            </Row>

            {selectedQuarrel.treatment && (
              <div style={{ marginBottom: '24px' }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>处理方式</Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag style={{ borderRadius: '8px' }}>
                    {treatmentLabels[selectedQuarrel.treatment] || selectedQuarrel.treatment}
                  </Tag>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <Text type="secondary" style={{ fontSize: '14px' }}>事件详情</Text>
              <div style={{ 
                marginTop: '8px', 
                padding: '16px', 
                background: '#f8f9fa', 
                borderRadius: '12px',
                borderLeft: '4px solid #ff6b6b'
              }}>
                <Text style={{ fontSize: '15px', lineHeight: '1.6' }}>
                  {selectedQuarrel.details}
                </Text>
              </div>
            </div>

            {selectedQuarrel.opinion_male && (
              <div style={{ marginBottom: '24px' }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>男方观点</Text>
                <div style={{ 
                  marginTop: '8px', 
                  padding: '16px', 
                  background: '#e6f7ff', 
                  borderRadius: '12px',
                  borderLeft: '4px solid #1890ff'
                }}>
                  <Text style={{ fontSize: '15px', lineHeight: '1.6' }}>
                    {selectedQuarrel.opinion_male}
                  </Text>
                </div>
              </div>
            )}

            {selectedQuarrel.opinion_female && (
              <div style={{ marginBottom: '24px' }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>女方观点</Text>
                <div style={{ 
                  marginTop: '8px', 
                  padding: '16px', 
                  background: '#fff7e6', 
                  borderRadius: '12px',
                  borderLeft: '4px solid #faad14'
                }}>
                  <Text style={{ fontSize: '15px', lineHeight: '1.6' }}>
                    {selectedQuarrel.opinion_female}
                  </Text>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑弹窗 */}
      <Modal
        title={<Title level={4} style={{ margin: 0, color: '#ff6b6b' }}>编辑情感交流记录</Title>}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={900}
        style={{ top: 30 }}
        bodyStyle={{ padding: '40px', maxHeight: '85vh', overflow: 'auto' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          size="large"
        >
          <Row gutter={[32, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong style={{ fontSize: '15px' }}>标题</Text>}
                name="title"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input placeholder="输入标题" style={{ borderRadius: '10px', height: '42px' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong style={{ fontSize: '15px' }}>交流原因</Text>}
                name="reason"
                rules={[{ required: true, message: '请选择原因' }]}
              >
                <Select placeholder="选择原因" style={{ borderRadius: '10px' }}>
                  {Object.entries(reasonLabels).map(([value, label]) => (
                    <Option key={value} value={value}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[32, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong style={{ fontSize: '15px' }}>强度等级</Text>}
                name="strength"
                rules={[{ required: true, message: '请选择强度' }]}
              >
                <Rate
                  style={{ fontSize: '28px', color: '#ff6b6b' }}
                  count={5}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong style={{ fontSize: '15px' }}>当前状态</Text>}
                name="status"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="选择状态" style={{ borderRadius: '10px' }}>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <Option key={value} value={value}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[32, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong style={{ fontSize: '15px' }}>原则性问题</Text>}
                name="is_principal"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="是" 
                  unCheckedChildren="否" 
                  style={{ backgroundColor: '#ff6b6b' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong style={{ fontSize: '15px' }}>处理方式</Text>}
                name="treatment"
              >
                <Select placeholder="选择处理方式" allowClear style={{ borderRadius: '10px' }}>
                  {Object.entries(treatmentLabels).map(([value, label]) => (
                    <Option key={value} value={value}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<Text strong style={{ fontSize: '15px' }}>事件详情</Text>}
            name="details"
            rules={[{ required: true, message: '请输入详情' }]}
          >
            <TextArea 
              rows={5} 
              placeholder="详细描述事件经过" 
              style={{ borderRadius: '10px', resize: 'none' }}
            />
          </Form.Item>

          <Row gutter={[32, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong style={{ fontSize: '15px' }}>男方观点</Text>}
                name="opinion_male"
              >
                <TextArea 
                  rows={4} 
                  placeholder="男方的想法和感受" 
                  style={{ borderRadius: '10px', resize: 'none' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong style={{ fontSize: '15px' }}>女方观点</Text>}
                name="opinion_female"
              >
                <TextArea 
                  rows={4} 
                  placeholder="女方的想法和感受" 
                  style={{ borderRadius: '10px', resize: 'none' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }} size="large">
              <Button 
                size="large"
                icon={<CloseOutlined />} 
                onClick={() => setEditModalVisible(false)}
                style={{ borderRadius: '10px', padding: '0 24px' }}
              >
                取消
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={saving}
                icon={<SaveOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0 32px',
                  height: '44px',
                }}
              >
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
