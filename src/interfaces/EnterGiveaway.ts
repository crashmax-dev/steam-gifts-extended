export interface IEnterGiveaway {
    type: 'success' | 'error'
    entry_count: string
    points: string
    msg?: string
}