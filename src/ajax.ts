import { logger } from './logger'

const xsrfToken = document
  .querySelector('.js__logout')
  ?.getAttribute('data-form')
  ?.match(/xsrf_token=(.+)/)
  ?.at(1)

if (!xsrfToken) {
  logger.error('xsrf_token not found')
}

interface AjaxResponse {
  type: 'success' | 'error'
  entry_count: string
  points: string
  msg?: string
}

interface AjaxData {
  do: string
  code: string
}

export async function requestAjax(data: AjaxData) {
  const req = await fetch('/ajax.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `xsrf_token=${xsrfToken}&do=${data.do}&code=${data.code}`
  })

  return (await req.json()) as AjaxResponse
}
