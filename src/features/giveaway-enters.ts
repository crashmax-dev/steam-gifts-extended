import { el } from '@zero-dependency/dom'

import { logger } from '../logger'

export function giveawayEnters() {
  if (location.pathname !== '/') return

  const header = document.querySelector('.page__heading__breadcrumbs')
  if (!header) {
    logger.warn('Breadcrumbs header not found')
    return
  }

  const enterButton = el(
    'a',
    {
      href: '#',
      onclick: (event) => {
        event.preventDefault()
        const entryButtons = document.querySelectorAll<HTMLButtonElement>(
          '#entry_insert-giveaway'
        )
        for (const button of entryButtons) {
          button.click()
        }
      }
    },
    el('i', { className: 'fa fa-gift' })
  )

  enterButton.setAttribute(
    'data-ui-tooltip',
    JSON.stringify({
      rows: [{ columns: [{ name: 'Entry in all giveaways' }] }]
    })
  )

  header.after(enterButton)
}
