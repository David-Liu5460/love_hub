import { useEffect, useState } from 'react'
import { createQuarrel } from '../lib/quarrels'
import { Roles } from '../lib/role'
import { useRole } from '../lib/useRole'

const parseTags = (raw) => {
  const value = raw.trim()
  if (!value) return []
  return value
    .split(/[,，]/g)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 8)
}

export const NewQuarrel = ({ onNavigate }) => {
  const role = useRole()

  const [title, setTitle] = useState('')
  const [createAtLocal, setCreateAtLocal] = useState(() => {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(
      now.getMinutes()
    )}`
  })
  const [details, setDetails] = useState('')
  const [reason, setReason] = useState('')
  const [opinionMale, setOpinionMale] = useState('')
  const [opinionFemale, setOpinionFemale] = useState('')
  const [isPrincipal, setIsPrincipal] = useState(false)
  const [strength, setStrength] = useState(3)
  const [tagsRaw, setTagsRaw] = useState('')
  const [treatment, setTreatment] = useState('')
  const [status, setStatus] = useState('未解决')

  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (role === Roles.male) setOpinionFemale('')
    if (role === Roles.female) setOpinionMale('')
  }, [role])

  const myOpinionLabel = role === Roles.female ? '女方陈述' : '男方陈述'

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!title.trim()) {
      setErrorMessage('请填写标题')
      return
    }
    if (!details.trim()) {
      setErrorMessage('请填写详细描述')
      return
    }

    const myOpinion = role === Roles.female ? opinionFemale : opinionMale
    if (!myOpinion.trim()) {
      setErrorMessage(`请填写${myOpinionLabel}`)
      return
    }

    const payload = {
      title: title.trim(),
      create_at: new Date(createAtLocal).toISOString(),
      details: details.trim(),
      reason: reason.trim() || null,
      opinion_male: role === Roles.male ? opinionMale.trim() : null,
      opinion_female: role === Roles.female ? opinionFemale.trim() : null,
      is_principal: Boolean(isPrincipal),
      strength: Number(strength),
      tag: parseTags(tagsRaw),
      treatment: treatment.trim() || null,
      status: status || null,
    }

    try {
      setSubmitting(true)
      const { data, error } = await createQuarrel(payload)
      setSubmitting(false)

      if (error) {
        setErrorMessage(error.message)
        return
      }

      onNavigate(`/history?id=${data.id}`)
    } catch (e) {
      setSubmitting(false)
      setErrorMessage(e?.message || '保存失败')
    }
  }

  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <div className="pageTitle">记录吵架</div>
          <div className="pageDesc">把事实写清楚，把感受表达出来，把方案落到行动。</div>
        </div>
        <button className="btn btnGhost" type="button" onClick={() => onNavigate('/dashboard')}>
          返回首页
        </button>
      </div>

      {errorMessage ? <div className="alert">{errorMessage}</div> : null}

      <form className="card form" onSubmit={onSubmit}>
        <div className="formGrid">
          <label className="field">
            <div className="label">
              标题 <span className="req">*</span>
            </div>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="简要概括这次冲突"
            />
          </label>

          <label className="field">
            <div className="label">
              日期时间 <span className="req">*</span>
            </div>
            <input
              className="input"
              type="datetime-local"
              value={createAtLocal}
              onChange={(e) => setCreateAtLocal(e.target.value)}
            />
          </label>

          <label className="field span2">
            <div className="label">
              详细描述 <span className="req">*</span>
            </div>
            <textarea
              className="textarea"
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="写清楚发生了什么、各自做了什么、说了什么"
            />
          </label>

          <div className="split span2">
            <label className="field">
              <div className="label">男方陈述</div>
              <textarea
                className="textarea"
                rows={4}
                value={opinionMale}
                onChange={(e) => setOpinionMale(e.target.value)}
                placeholder="男方的观点与感受"
                disabled={role !== Roles.male}
              />
              {role !== Roles.male ? <div className="hint">当前身份为女方：先填写你的陈述。</div> : null}
            </label>

            <label className="field">
              <div className="label">女方陈述</div>
              <textarea
                className="textarea"
                rows={4}
                value={opinionFemale}
                onChange={(e) => setOpinionFemale(e.target.value)}
                placeholder="女方的观点与感受"
                disabled={role !== Roles.female}
              />
              {role !== Roles.female ? <div className="hint">当前身份为男方：先填写你的陈述。</div> : null}
            </label>
          </div>

          <label className="field span2">
            <div className="label">触发原因</div>
            <input
              className="input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="是什么触发了这次冲突？"
            />
          </label>

          <div className="row span2">
            <label className="check">
              <input type="checkbox" checked={isPrincipal} onChange={(e) => setIsPrincipal(e.target.checked)} />
              <span>原则性问题</span>
            </label>

            <div className="rangeBox">
              <div className="label">吵架强度（1-5）</div>
              <input
                className="range"
                type="range"
                min={1}
                max={5}
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
              />
              <div className="rangeMeta">
                <span>轻微</span>
                <span>中等</span>
                <span>激烈</span>
              </div>
            </div>
          </div>

          <label className="field span2">
            <div className="label">标签</div>
            <input
              className="input"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="用逗号分隔：沟通、家务、时间…"
            />
            <div className="hint">最多 8 个标签，用中文/英文逗号分隔。</div>
          </label>

          <label className="field span2">
            <div className="label">处理措施</div>
            <textarea
              className="textarea"
              rows={3}
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder="你们采取了哪些措施来解决？下一步怎么做？"
            />
          </label>

          <label className="field span2">
            <div className="label">状态</div>
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="未解决">未解决</option>
              <option value="处理中">处理中</option>
              <option value="已解决">已解决</option>
            </select>
          </label>
        </div>

        <div className="formActions">
          <button className="btn btnPrimary" type="submit" disabled={submitting}>
            {submitting ? '保存中…' : '保存吵架记录'}
          </button>
        </div>
      </form>
    </div>
  )
}
