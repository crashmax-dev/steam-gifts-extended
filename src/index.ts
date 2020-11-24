import { SteamGifts } from './components/SteamGifts'

(() => {
    const app = new SteamGifts

    app.steamDB()
    app.stickyHeader()
    app.setGiveawayButtons()
})()