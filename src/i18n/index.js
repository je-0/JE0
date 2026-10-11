import { messages } from './messages'

function read(path) {
  return path.split('.').reduce((node, key) => node?.[key], messages)
}

export function useI18n() {
  const t = (path) => {
    const value = read(path)
    return value === undefined ? path : value
  }

  return { t }
}

if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en'
}
