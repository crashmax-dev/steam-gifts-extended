import { logger } from '../logger'

export function stickyHeader() {
  const header = document.querySelector('header')

  if (!header) {
    logger.warn('Header not found')
    return
  }

  Object.assign(header.style, {
    height: 'auto',
    position: 'sticky',
    zIndex: 1,
    top: 0
  })
}
