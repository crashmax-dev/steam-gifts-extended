import { error } from './console'

import { HttpResponse } from '../interfaces/HttpResponse'

/**
 * Основополагающая функция для формирования HTTP запросов
 * Для использования получаемого JSON используйте Generic interface
 * ? Пример использования смотрите в components/checkUpdates.ts
 * @param method GET/POST
 * @param url Ссылка запроса
 * @param body Строка запроса
 */
export async function http<T>(method: 'GET' | 'POST', url: string, body?: FormData | string): Promise<HttpResponse<T>> {

    // Запрос поддерживает Generic interface
    const response: HttpResponse<T> = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    })

    try {
        response.parsedBody = await response.json()
    } catch (e) {
        error('http.ts', e)
    }

    return response
}