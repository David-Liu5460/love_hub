import { Card, Table, Tag, Button, DatePicker, Select, Space, Typography, Modal, Row, Col, Rate, Badge, Empty, message } from 'antd'
import { EyeOutlined, EditOutlined, DeleteOutlined, FilterOutlined, CalendarOutlined, HeartFilled, HistoryOutlined, UserOutlined, TagOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { getQuarrels, deleteQuarrel } from '../lib/quarrels'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

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

const principalLabels = {
  male: '男方',
  female: '女方',
  both: '双方',
}

export function History() {
  const [quarrels, setQuarrels] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedQuarrel, setSelectedQuarrel] = useState(null)
  const [filters, setFilters] = useState({
    reason: '',
    dateRange: [],
    status: '',
  })

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
    setModalVisible(true)
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
        <Rate
          disabled
          value={strength}
          character={<HeartFilled style={{ color: '#ff6b6b', fontSize: '14px' }} />}
          count={5}
        />
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
          icon={<UserOutlined />}
          style={{ borderRadius: '8px' }}
        >
          {principalLabels[principal] || principal}
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
            回顾每一次争吵，从中学习和成长
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
              <Text style={{ color: '#666', fontSize: '14px' }}>吵架原因</Text>
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
                description="暂无吵架记录"
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

      {/* 详情弹窗 */}
      <Modal
        title={selectedQuarrel?.title || '吵架详情'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
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
                  <Text type="secondary" style={{ fontSize: '14px' }}>吵架原因</Text>
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
                  <Text type="secondary" style={{ fontSize: '14px' }}>主要责任人</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Tag icon={<UserOutlined />} style={{ borderRadius: '8px' }}>
                      {principalLabels[selectedQuarrel.is_principal] || selectedQuarrel.is_principal}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text type="secondary" style={{ fontSize: '14px' }}>标签</Text>
                  <div style={{ marginTop: '4px' }}>
                    {selectedQuarrel.tag ? (
                      <Tag 
                        color={tagColors[selectedQuarrel.tag]} 
                        icon={<TagOutlined />}
                        style={{ borderRadius: '8px' }}
                      >
                        {tagLabels[selectedQuarrel.tag]}
                      </Tag>
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
    </div>
  )
}
