import { useEffect, useMemo, useState } from 'react'
import { getRole, Roles, setRole } from '../lib/role'

const NavLink = ({ active, href, children }) => {
  return (
    <a className={active ? 'navLink navLinkActive' : 'navLink'} href={href}>
      {children}
    </a>
  )
}

export const Layout = ({ routePath, children }) => {
  const [role, setRoleState] = useState(() => getRole())

  useEffect(() => {
    setRoleState(getRole())
  }, [])

  const roleLabel = useMemo(() => (role === Roles.female ? '女方' : '男方'), [role])

  const onPickRole = (next) => {
    const value = setRole(next)
    setRoleState(value)
    window.dispatchEvent(new Event('love_hub_role_change'))
  }

  return (
    <div className="appShell">
      <header className="topBar">
        <div className="brand">
          <div className="brandMark">♥</div>
          <div className="brandText">
            <div className="brandTitle">情侣冲突管理平台</div>
            <div className="brandSubtitle">记录 · 复盘 · 改善</div>
          </div>
        </div>

        <nav className="nav">
          <NavLink active={routePath === '/dashboard'} href="#/dashboard">
            首页
          </NavLink>
          <NavLink active={routePath === '/new'} href="#/new">
            记录吵架
          </NavLink>
          <NavLink active={routePath === '/history'} href="#/history">
            历史记录
          </NavLink>
        </nav>

        <div className="roleBox">
          <div className="roleBadge">{roleLabel}</div>
          <div className="segmented">
            <button
              className={role === Roles.male ? 'segBtn segBtnActive' : 'segBtn'}
              type="button"
              onClick={() => onPickRole(Roles.male)}
            >
              男方
            </button>
            <button
              className={role === Roles.female ? 'segBtn segBtnActive' : 'segBtn'}
              type="button"
              onClick={() => onPickRole(Roles.female)}
            >
              女方
            </button>
          </div>
        </div>
      </header>

      <main className="main">{children}</main>
    </div>
  )
}

