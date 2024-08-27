import { el } from '@zero-dependency/dom'

export function steamDatabaseLinks() {
  // app links
  const steamAppLinks = document.querySelectorAll<HTMLAnchorElement>(
    'a[href^="https://store.steampowered.com/app/"][data-ui-tooltip]'
  )

  for (const appLink of steamAppLinks) {
    const appId = appLink.href.split('/').at(-2)!
    const steamDatabaseLink = createSteamDatabaseLink(appId)
    if (appLink.classList.contains('giveaway__icon')) {
      steamDatabaseLink.classList.add('giveaway__icon')
    }
    appLink.before(steamDatabaseLink)
  }

  // profile links
  const steamProfileLinks = document.querySelectorAll<HTMLAnchorElement>(
    'a[href^="https://steamcommunity.com/profiles/"][data-tooltip]'
  )

  for (const profileLink of steamProfileLinks) {
    const profileId = profileLink.href.split('/').at(-1)!
    const steamProfileLink = createSteamDatabaseProfileButton(profileId)
    profileLink.after(steamProfileLink)
  }
}

function createSteamDatabaseLink(appId: string) {
  const link = el(
    'a',
    {
      href: `https://steamdb.info/app/${appId}/`,
      target: '_blank'
    },
    el('i', { className: 'fa fa-fw fa-database' })
  )

  link.setAttribute(
    'data-ui-tooltip',
    JSON.stringify({
      rows: [
        {
          icon: [{ class: 'fa-database', color: '#000' }],
          columns: [{ name: 'Steam DB' }]
        }
      ]
    })
  )

  return link
}

function createSteamDatabaseProfileButton(profileId: string) {
  const link = el(
    'a',
    {
      href: `https://steamdb.info/calculator/${profileId}/`,
      target: '_blank'
    },
    el('i', { className: 'fa fa-fw fa-database' })
  )

  link.setAttribute('data-tooltip', 'Visit SteamDB Profile')
  return link
}
