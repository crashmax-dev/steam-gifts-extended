import {
    ce,
    qs,
    css,
    qsa,
    gebi,
    path,
    http
} from '../utils'

import { ENV_PATH, STEAMGIFTS } from '../constants'

import { IEnterGiveaway } from '../interfaces/EnterGiveaway'

export class SteamGifts {

    xsrfToken() {
        const logout = document.getElementsByClassName('js__logout')[0]

        return logout.getAttribute('data-form')?.match(/xsrf_token=(.+)/)![1]
    }

    stickyHeader(): void {
        const header = qs('header')

        css(header, `
            height: auto;
            position: sticky;
            top: 0;
            z-index: 1
        `)
    }

    getBalance(balance: string) {
        const points = qsa('span.nav__points')[0]

        if (balance) points.innerHTML = balance

        return points.textContent
    }

    getGiveawayPoints(): string[] {
        const titles = qsa('span.giveaway__heading__thin')
        const prices = []

        if (titles) {

            for (let title of titles) {

                if (title.textContent) {
                    let checkPrice = /\(([0-9]+)([P)])\)/i.test(title.textContent)

                    if (checkPrice) prices.push(title.textContent.replace(/\D+/g, ''))
                }

            }
        }

        return prices
    }

    getGiweawayUrls(): string[][] {
        const giveaway = qsa('div.giveaway__row-inner-wrap')
        const links = qsa('a.giveaway__heading__name')

        const urls = []
        const prices = this.getGiveawayPoints()

        if (links) {

            for (let [key, link] of links.entries()) {

                let id = (link as HTMLLinkElement).href.replace(/\/\s*$/, '').split('/')[4]
                let status = giveaway[key].classList.contains('is-faded') ? 'entry_delete' : 'entry_insert'
                let price = prices[key]

                urls.push(
                    [
                        id,
                        status,
                        price
                    ]
                )
            }
        }

        return urls
    }

    getGiveawayStatus(css: boolean) {
        const giveaway = qsa('div.giveaway__row-inner-wrap')
        const status = []

        if (css) {
            for (let give of giveaway) {
                status.push(give.classList.contains('is-faded') ?
                    'entry_delete' :
                    'entry_insert'
                )
            }
        } else {
            for (let give of giveaway) {
                status.push(give.className)
            }
        }

        return status
    }

    getAppID() {
        const urls = qsa('a[href^="https://store.steampowered.com/app/"]')
        const apps = []

        for (let url of urls) {
            apps.push(path(4, (url as HTMLLinkElement).href))
        }

        return apps
    }

    steamDB(): void {
        const apps = this.getAppID()
        const targetUrls = qsa('a[href^="https://store.steampowered.com/app/"')

        if (path(1) === 'giveaway') {
            let btnInGiveaway = ce('a', {
                href: `https://steamdb.info/app/${apps[1]}/`,
                attr: {
                    target: '_blank',
                    title: 'Visit SteamDB Info'
                },
                html: `
                    <i>
                        <img style="vertical-align: middle" src="${ENV_PATH}/icons/steamdb-white.svg">
                    </i>
                `
            })

            targetUrls[1].before(btnInGiveaway)
        } else if (targetUrls) {

            for (let [key, app] of apps.entries()) {
                let btnApp = ce('a', {
                    href: `https://steamdb.info/app/${app}/`,
                    attr: {
                        class: 'giveaway__icon',
                        target: '_blank',
                        title: 'Visit SteamDB Info'
                    },
                    html: `<img style="vertical-align: middle" src="${ENV_PATH}/icons/steamdb-dark.svg">`
                })

                targetUrls[key].before(btnApp)
            }
        }

        if (path(1) === 'user') {
            const target = qsa('div.sidebar__shortcut-inner-wrap')
            const profile = qsa('a[href^="https://steamcommunity.com/profiles/"')
            const userID = (profile[0] as HTMLLinkElement).href.replace(/\/\s*$/, '').split('/')[4]

            if (userID) {
                let button = ce('a', {
                    href: `https://steamdb.info/calculator/${userID}/`,
                    attr: {
                        'data-tooltip': 'Visit SteamDB Calculator',
                        target: '_blank'
                    },
                    html: `<img style="vertical-align: middle" src="${ENV_PATH}/icons/steamdb-dark.svg">`
                })

                target[0].append(button)
            }
        }
    }

    setGiveawayButtons(): void {
        const xsrf = this.xsrfToken()
        const giveaways = this.getGiweawayUrls()
        const target = qsa('div.giveaway__links')

        if (path(1) !== 'user') {

            for (let i in giveaways) {

                if (giveaways.hasOwnProperty(i)) {

                    let button = ce('div', {
                        id: i,
                        style: 'cursor: pointer; user-select: none',
                        html: (giveaways[i][1] === 'entry_delete' ?
                            `
                                <i class="fa fa-minus-circle"></i>
                                <span>Remove Entry</span>
                            ` : `
                                <i class="fa fa-plus-circle"></i>
                                <span>Entry Giveaway</span>
                            `
                        ),
                        onclick: (e: MouseEvent) => {

                            if (e.target instanceof Element) {
                                let code: any = e.target.id

                                if (typeof code !== 'number')
                                    code = Number((e.target.parentNode as Element).id)

                                let row = (e.target.parentNode?.parentNode?.parentNode as Element)

                                if (!row.classList.contains('giveaway__row-outer-wrap'))
                                    row = (e.target.parentNode?.parentNode?.parentNode?.parentNode as Element)

                                gebi(code).innerHTML = `
                                    <i class="fa fa-refresh fa-spin"></i>
                                    <span>Please wait...</span>
                                `

                                http<IEnterGiveaway>(
                                    'POST',
                                    `${STEAMGIFTS}/ajax.php`,
                                    `xsrf_token=${xsrf}&do=${giveaways[code][1]}&code=${giveaways[code][0]}`
                                ).then(e => {

                                    const response = e.parsedBody

                                    if (response?.type === 'error') {
                                        gebi(code).innerHTML = `
                                            <i class="fa fa-exclamation-circle" style="text-shadow: 1px 1px 1px rgba(255,255,255,0.3); color:#a95570"></i>
                                            <span style="color:#a95570">${response.msg}</span>
                                        `

                                        return false
                                    }

                                    if (response?.type === 'success') {
                                        this.getBalance(response.points)

                                        if (giveaways[code][1] === 'entry_insert') {

                                            giveaways[code].splice(1, 1, 'entry_delete')

                                            gebi(code).innerHTML = `
                                                <i class="fa fa-minus-circle"></i>
                                                <span>Remove Entry</span>
                                            `

                                            row.classList.add('is-faded')
                                        } else {

                                            giveaways[code].splice(1, 1, 'entry_insert')

                                            gebi(code).innerHTML = `
                                                <i class="fa fa-plus-circle"></i>
                                                <span>Entry Giveaway</span>
                                            `

                                            row.classList.remove('is-faded')
                                        }
                                    }
                                })
                            }
                        }
                    })

                    target[i].append(button)
                }
            }
        }
    }
}