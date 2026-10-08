const preloaderSessionKey = 'nexsanity:preloader-seen'

export function hasSeenPreloader(): boolean {
  try {
    return window.sessionStorage.getItem(preloaderSessionKey) === 'true'
  } catch {
    return false
  }
}

export function markPreloaderSeen(): void {
  try {
    window.sessionStorage.setItem(preloaderSessionKey, 'true')
  } catch {
    return
  }
}
