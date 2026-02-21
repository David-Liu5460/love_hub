const KEY = 'love_hub_role'

export const Roles = {
  male: 'male',
  female: 'female',
}

export const getRole = () => {
  const value = localStorage.getItem(KEY)
  return value === Roles.female ? Roles.female : Roles.male
}

export const setRole = (role) => {
  const next = role === Roles.female ? Roles.female : Roles.male
  localStorage.setItem(KEY, next)
  return next
}

