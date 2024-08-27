import { giveawayButtons } from './features/giveaway-buttons'
import { giveawayEnters } from './features/giveaway-enters'
import { steamDatabaseLinks } from './features/steamdb-links'
import { stickyHeader } from './features/sticky-header'
import styles from './index.scss?raw'

GM_addStyle(styles)
stickyHeader()
steamDatabaseLinks()
giveawayButtons()
giveawayEnters()
