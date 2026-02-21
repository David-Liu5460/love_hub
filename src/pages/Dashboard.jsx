import { useEffect, useMemo, useState } from 'react'
import { isQuarrelComplete, listQuarrels } from '../lib/quarrels'
import { Roles } from '../lib/role'
import { useRole } from '../lib/useRole'

const StatCard = ({ label, value, tone }) => {
  return (
    <div className={tone ? `card statCard statCard_${tone}` : 'card statCard'}>
      <div className="statLabel">{label}</div>
      <div className="statValue">{value}</div>
    </div>
  )
}

const Pill = ({ children, tone }) => {
  return <span className={tone ? `pill pill_${tone}` : 'pill'}>{children}</span>
}

export const Dashboard = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [items, setItems] = useState([])

  const role = useRole()

  const stats = useMemo(() => {
    const total = items.length
    const unresolved = items.filter((x) => (x.status || '未解决') !== '已解决').length
    const principal = items.filter((x) => Boolean(x.is_principal)).length
    const complete = items.filter((x) => isQuarrelComplete(x)).length
    const myFilled = items.filter((x) => {
      const mine = role === Roles.female ? x.opinion_female : x.opinion_male
      return Boolean(mine && mine.trim())
    }).length
    return { total, unresolved, principal, complete, myFilled }
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

  return (
    <div className="page">
      <section className="hero">
        <div className="heroTitle">把每一次冲突，变成更懂彼此的机会</div>
        <div className="heroDesc">记录事实、表达感受、找到触发点、给出行动方案。</div>
        <div className="heroActions">
          <button className="btn btnPrimary" type="button" onClick={() => onNavigate('/new')}>
            记录一次吵架
          </button>
          <button className="btn btnGhost" type="button" onClick={() => onNavigate('/history')}>
            查看历史
          </button>
        </div>
        <div className="heroHint">双方陈述未完成前，只能看到自己的内容。</div>
      </section>

      {errorMessage ? <div className="alert">{errorMessage}</div> : null}

      <section className="grid">
        <StatCard label="最近记录" value={stats.total} />
        <StatCard label="未解决" value={stats.unresolved} tone="warn" />
        <StatCard label="原则性问题" value={stats.principal} tone="pink" />
        <StatCard label="双方都写完" value={stats.complete} tone="ok" />
        <StatCard label="我已填写" value={stats.myFilled} tone="indigo" />
      </section>

      <section className="card">
        <div className="sectionHead">
          <div className="sectionTitle">最近记录</div>
          <button className="linkBtn" type="button" onClick={() => onNavigate('/history')}>
            查看全部
          </button>
        </div>

        {loading ? (
          <div className="muted">加载中…</div>
        ) : items.length === 0 ? (
          <div className="empty">
            <div className="emptyTitle">还没有记录</div>
            <div className="emptyDesc">从一次具体的吵架开始，建立你们的“冲突复盘库”。</div>
            <button className="btn btnPrimary" type="button" onClick={() => onNavigate('/new')}>
              去记录
            </button>
          </div>
        ) : (
          <div className="list">
            {items.map((x) => {
              const complete = isQuarrelComplete(x)
              const status = x.status || '未解决'
              return (
                <a key={x.id} className="listItem" href={`#/history?id=${x.id}`}>
                  <div className="listMain">
                    <div className="listTitleRow">
                      <div className="listTitle">{x.title || '未命名记录'}</div>
                      <div className="listPills">
                        <Pill tone={status === '已解决' ? 'ok' : 'warn'}>{status}</Pill>
                        {x.is_principal ? <Pill tone="pink">原则</Pill> : null}
                        {complete ? <Pill tone="indigo">可互见</Pill> : <Pill>仅自见</Pill>}
                      </div>
                    </div>
                    <div className="listMeta">
                      {x.create_at ? new Date(x.create_at).toLocaleString() : ''}
                      {typeof x.strength === 'number' ? ` · 强度 ${x.strength}` : ''}
                    </div>
                  </div>
                  <div className="chev">›</div>
                </a>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
