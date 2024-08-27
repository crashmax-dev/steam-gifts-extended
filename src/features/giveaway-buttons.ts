import { el, text } from '@zero-dependency/dom'

import { requestAjax } from '../ajax'
import { logger } from '../logger'

export function giveawayButtons() {
  const giveawayLinks = getGiveawayLinks()

  for (const giveaway of giveawayLinks) {
    const button = createGiveawayButton(giveaway)
    giveaway.links.append(button)
  }
}

type GiveawayStatus = 'entry_insert' | 'entry_delete'
interface GiveawayLink {
  target: HTMLDivElement
  links: HTMLDivElement
  id: string
  points: number
}

function getGiveawayLinks() {
  const giveaways = document.querySelectorAll<HTMLDivElement>(
    'div.giveaway__row-inner-wrap'
  )
  const links: GiveawayLink[] = []

  for (let giveaway of giveaways) {
    const giveawayTimestamp = giveaway.querySelector('span[data-timestamp]')
    if (!giveawayTimestamp) {
      logger.warn('Giveaway timestamp not found', giveaway)
      continue
    }

    const endingTimestamp = giveawayTimestamp.getAttribute('data-timestamp')
    if (endingTimestamp && Date.now() > Number(endingTimestamp) * 1000) {
      continue
    }

    const giveawayLink = giveaway.querySelector<HTMLAnchorElement>(
      'a.giveaway__heading__name'
    )
    if (!giveawayLink) {
      logger.warn('Giveaway link not found', giveaway)
      continue
    }

    const giveawayId = giveawayLink.href.split('/').at(-2)
    if (!giveawayId) {
      logger.warn('Giveaway ID not found', giveaway)
      continue
    }

    let giveawayPoints: number | null = null
    const giveawayHeadings = giveaway.querySelectorAll<HTMLDivElement>(
      'span.giveaway__heading__thin'
    )
    for (const heading of giveawayHeadings) {
      if (/\(([0-9]+)([P)])\)/i.test(heading.textContent!)) {
        giveawayPoints = Number(heading.textContent!.replace(/\D+/g, ''))
        break
      }
    }

    if (giveawayPoints === null) {
      logger.warn('Giveaway points not found', giveawayHeadings)
      continue
    }

    links.push({
      links: giveaway.querySelector('div.giveaway__links')!,
      target: giveaway,
      id: giveawayId,
      points: giveawayPoints
    })
  }

  return links
}

function getGiveawayStatus(giveaway: HTMLDivElement): GiveawayStatus {
  return giveaway.classList.contains('is-faded')
    ? 'entry_delete'
    : 'entry_insert'
}

function giveawayButtonIcon(giveaway: HTMLDivElement) {
  const status = getGiveawayStatus(giveaway)
  return status === 'entry_delete' ? [
        el('i', { className: 'fa fa-plus-circle' }),
        text(' '),
        el('span', 'Remove giveaway')] : [
        el('i', { className: 'fa fa-minus-circle' }),
        text(' '),
        el('span', 'Entry giveaway')]
}

function giveawayId(target: HTMLDivElement) {
  return getGiveawayStatus(target) + '-giveaway'
}

function createGiveawayButton(giveaway: GiveawayLink) {
  const button = el(
    'a',
    {
      id: giveawayId(giveaway.target),
      href: '#',
      onclick: async (event) => {
        event.preventDefault()

        button.replaceChildren(
          el('i', { className: 'fa fa-refresh fa-spin' }),
          text(' '),
          el('span', 'Please wait...')
        )

        const status = getGiveawayStatus(giveaway.target)
        const response = await requestAjax({
          do: status,
          code: giveaway.id
        })

        if (response.type === 'error') {
          button.replaceChildren(
            el('i', {
              className: 'error-color error-text fa fa-exclamation-circle'
            }),
            text(' '),
            el(
              'span',
              { className: 'error-color' },
              response.msg ?? 'Unknown error'
            )
          )
        } else if (response.type === 'success') {
          const userPoints = document.querySelector('span.nav__points')
          if (!userPoints) {
            logger.error('User points not found')
            return
          }

          userPoints.textContent = response.points
          button.replaceChildren(...giveawayButtonIcon(giveaway.target))
          giveaway.target.classList.toggle('is-faded')
          button.id = giveawayId(giveaway.target)
        }
      }
    },
    ...giveawayButtonIcon(giveaway.target)
  )

  return button
}
