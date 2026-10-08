export const preloaderDoneEvent = 'nexsanity:preloader-done'

export function waitForPreloader(): Promise<void> {
  const isPreloaderActive = document.querySelector('[data-preloader="active"]') !== null
  if (!isPreloaderActive) return Promise.resolve()

  return new Promise((resolve) => {
    window.addEventListener(preloaderDoneEvent, () => resolve(), { once: true })
  })
}

export function announcePreloaderDone(preloader: HTMLElement): void {
  if (preloader.dataset.preloader === 'done') return
  preloader.dataset.preloader = 'done'
  window.dispatchEvent(new Event(preloaderDoneEvent))
}
