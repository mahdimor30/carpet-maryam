const RUBIKA_API_BASE = 'https://botapi.rubika.ir/v3'

function token() {
  const value = process.env.RUBIKA_BOT_TOKEN
  if (!value) throw new Error('RUBIKA_BOT_TOKEN is not configured')
  return value
}

export async function rubikaCall<T = unknown>(
  method: string,
  payload: Record<string, unknown> = {},
): Promise<T> {
  const response = await fetch(`${RUBIKA_API_BASE}/${token()}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Rubika ${method} failed: ${response.status}`)
  }

  const data = (await response.json()) as T
  return data
}

export async function getRubikaFileUrl(fileId: string) {
  const result = await rubikaCall<{
    status?: string
    data?: { download_url?: string }
  }>('getFile', { file_id: fileId })

  const url = result.data?.download_url
  if (!url) throw new Error(`Rubika file URL not found for ${fileId}`)
  return url
}

export async function sendRubikaMessage(chatId: string, text: string) {
  return rubikaCall('sendMessage', { chat_id: chatId, text })
}
