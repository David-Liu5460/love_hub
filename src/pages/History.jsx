import { useEffect, useState } from 'react'
import { getQuarrelById, isQuarrelComplete, listQuarrels, updateQuarrel } from '../lib/quarrels'
import { Roles } from '../lib/role'
import { useRole } from '../lib/useRole'

const getQuery = () => {
  const raw = window.location.hash || ''
  const idx = raw.indexOf('?')
  if (idx === -1) return new URLSearchParams()
  return new URLSearchParams(raw.slice(idx + 1))
}

const Pill = ({ children, tone }) => {
  return <span className={tone ? `pill pill_${tone}` : 'pill'}>{children}</span>
}

const Detail = ({ item, role, onClose, onUpdated }) => {
  const complete = isQuarrelComplete(item)
  const myOpinion = role === Roles.female ? item.opinion_female : item.opinion_male
  const otherOpinion = role === Roles.female ? item.opinion_male : item.opinion_female
  const missingMine = !myOpinion?.trim()

  const [opinionDraft, setOpinionDraft] = useState(myOpinion || '')
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setOpinionDraft(myOpinion || '')
    setErrorMessage('')
  }, [item.id])

  const onSave = async () => {
    setErrorMessage('')
    if (!opinionDraft.trim()) {
      setErrorMessage('请填写你的陈述')
      return
    }
    try {
      setSaving(true)
      const patch =
        role === Roles.female ? { opinion_female: opinionDraft.trim() } : { opinion_male: opinionDraft.trim() }
      const { data, error } = await updateQuarrel(item.id, patch)
      setSaving(false)
      if (error) {
        setErrorMessage(error.message)
        return
      }
      onUpdated(data)
    } catch (e) {
      setSaving(false)
      setErrorMessage(e?.message || '保存失败')
    }
  }

  const masked = (value) => (value?.trim() ? value.trim() : '对方尚未填写')

  return (
    <div className="drawerBackdrop" role="dialog" aria-modal="true">
      <div className="drawer">
        <div className="drawerHead">
          <div>
            <div className="drawerTitle">{item.title || '未命名记录'}</div>
            <div className="drawerMeta">{item.create_at ? new Date(item.create_at).toLocaleString() : ''}</div>
          </div>
          <button className="iconBtn" type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="drawerBody">
          <div className="pillsRow">
            <Pill tone={(item.status || '未解决') === '已解决' ? 'ok' : 'warn'}>{item.status || '未解决'}</Pill>
            {item.is_principal ? <Pill tone="pink">原则性</Pill> : null}
            {typeof item.strength === 'number' ? <Pill tone="indigo">强度 {item.strength}</Pill> : null}
            {complete ? <Pill tone="indigo">双方可互见</Pill> : <Pill>仅自见</Pill>}
          </div>

          <div className="block">
            <div className="blockTitle">详细描述</div>
            <div className="blockText">{item.details || '—'}</div>
          </div>

          <div className="block">
            <div className="blockTitle">触发原因</div>
            <div className="blockText">{item.reason || '—'}</div>
          </div>

          <div className="split">
            <div className="block">
              <div className="blockTitle">{role === Roles.female ? '女方陈述（我）' : '男方陈述（我）'}</div>
              <textarea
                className="textarea"
                rows={5}
                value={opinionDraft}
                onChange={(e) => setOpinionDraft(e.target.value)}
                placeholder="写下你的观点与感受"
              />
              {errorMessage ? <div className="hint hintError">{errorMessage}</div> : null}
              <div className="row">
                <button className="btn btnPrimary" type="button" onClick={onSave} disabled={saving}>
                  {saving ? '保存中…' : missingMine ? '提交我的陈述' : '更新我的陈述'}
                </button>
              </div>
            </div>

            <div className="block">
              <div className="blockTitle">{role === Roles.female ? '男方陈述（对方）' : '女方陈述（对方）'}</div>
              <div className={complete ? 'blockText' : 'blockText blockTextMasked'}>{masked(otherOpinion)}</div>
              {!complete ? <div className="hint">双方都写完后，才会显示对方的陈述。</div> : null}
            </div>
          </div>

          <div className="block">
            <div className="blockTitle">处理措施</div>
            <div className="blockText">{item.treatment || '—'}</div>
          </div>

          <div className="block">
            <div className="blockTitle">标签</div>
            <div className="tagRow">
              {(item.tag || []).length ? (item.tag || []).map((t) => <Pill key={t}>{t}</Pill>) : <span>—</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const History = () => {
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [selectedLoading, setSelectedLoading] = useState(false)

  const role = useRole()

  const openById = async (id) => {
    try {
      setSelectedLoading(true)
      const { data, error } = await getQuarrelById(id)
      setSelectedLoading(false)
      if (error) {
        setErrorMessage(error.message)
        return
      }
      if (data) setSelected(data)
    } catch (e) {
      setSelectedLoading(false)
      setErrorMessage(e?.message || '加载失败')
    }
  }

  useEffect(() => {
    let active = true

    const run = async () => {
      setLoading(true)
      setErrorMessage('')
      try {
        const { data, error } = await listQuarrels({ limit: 200 })
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

    const onHash = () => {
      const id = getQuery().get('id')
      if (id) openById(id)
    }

    window.addEventListener('hashchange', onHash)
    onHash()

    return () => {
      active = false
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  const onClose = () => {
    setSelected(null)
    const base = '#/history'
    if (window.location.hash.startsWith(base)) window.location.hash = base
  }

  const onUpdated = (row) => {
    setSelected(row)
    setItems((prev) => prev.map((x) => (x.id === row.id ? row : x)))
  }

  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <div className="pageTitle">历史记录</div>
          <div className="pageDesc">查看、补充双方陈述。双方都写完后才会彼此可见。</div>
        </div>
        <a className="btn btnGhost" href="#/new">
          新建记录
        </a>
      </div>

      {errorMessage ? <div className="alert">{errorMessage}</div> : null}

      <section className="card">
        {loading ? (
          <div className="muted">加载中…</div>
        ) : items.length === 0 ? (
          <div className="empty">
            <div className="emptyTitle">还没有记录</div>
            <div className="emptyDesc">记录一次冲突，后面就能在这里补充另一方陈述。</div>
            <a className="btn btnPrimary" href="#/new">
              去记录
            </a>
          </div>
        ) : (
          <div className="list">
            {items.map((x) => {
              const complete = isQuarrelComplete(x)
              const mine = role === Roles.female ? x.opinion_female : x.opinion_male
              const mineOk = Boolean(mine && mine.trim())
              return (
                <a key={x.id} className="listItem" href={`#/history?id=${x.id}`}>
                  <div className="listMain">
                    <div className="listTitleRow">
                      <div className="listTitle">{x.title || '未命名记录'}</div>
                      <div className="listPills">
                        <Pill tone={(x.status || '未解决') === '已解决' ? 'ok' : 'warn'}>{x.status || '未解决'}</Pill>
                        {x.is_principal ? <Pill tone="pink">原则</Pill> : null}
                        {complete ? <Pill tone="indigo">可互见</Pill> : <Pill>仅自见</Pill>}
                        {mineOk ? <Pill tone="ok">我已写</Pill> : <Pill tone="warn">待我写</Pill>}
                      </div>
                    </div>
                    <div className="listMeta">
                      {x.create_at ? new Date(x.create_at).toLocaleString() : ''}
                      {typeof x.strength === 'number' ? ` · 强度 ${x.strength}` : ''}
                    </div>
                  </div>
                  <div className="chev">{selectedLoading && selected?.id === x.id ? '…' : '›'}</div>
                </a>
              )
            })}
          </div>
        )}
      </section>

      {selected ? <Detail item={selected} role={role} onClose={onClose} onUpdated={onUpdated} /> : null}
    </div>
  )
}
