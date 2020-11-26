import pkg from '../package.json'

const DEV: boolean = process.env.NODE_ENV === 'development' ? true : false
const HTTP: string = document.location.protocol
const GITHUB: string = pkg.homepage
const HOSTNAME: string = document.location.hostname
const ENV_PATH: string = DEV ? 'https://localhost:8080' : GITHUB
const STEAMGIFTS: string = `${HTTP}//${HOSTNAME}`
const PKG_VERSION: string = pkg.version

export {
    DEV,
    HTTP,
    GITHUB,
    HOSTNAME,
    ENV_PATH,
    STEAMGIFTS,
    PKG_VERSION
}