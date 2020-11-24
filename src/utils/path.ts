/**
 * * Используется для получения pathname
 * @param number 
 */
export const path = (index?: number, url?: string) => {
    let path = url ?? document.location.pathname
    let str = path.replace(/\/\s*$/, '').split('/')

    return index ? str[index] : path
}