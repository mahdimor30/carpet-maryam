type AnyRecord = Record<string, any>

function walk(value: unknown, visit: (key: string, value: unknown) => void) {
  if (!value || typeof value !== 'object') return

  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit)
    return
  }

  for (const [key, child] of Object.entries(value as AnyRecord)) {
    visit(key, child)
    walk(child, visit)
  }
}

export function extractRubikaMessage(update: AnyRecord) {
  const message = update.new_message ?? update.message ?? update
  const text =
    typeof message.text === 'string'
      ? message.text
      : typeof message.caption === 'string'
        ? message.caption
        : ''

  let fileId: string | null = null
  walk(message, (key, value) => {
    if (
      !fileId &&
      /file[_-]?id/i.test(key) &&
      typeof value === 'string' &&
      value.length > 4
    ) {
      fileId = value
    }
  })

  const chatId =
    String(update.chat_id ?? message.chat_id ?? '') || null
  const messageId =
    String(message.message_id ?? update.message_id ?? '') || null

  return { message, text, fileId, chatId, messageId }
}

export function isAnalyzeCommand(text: string) {
  return /^\\/(analyze|ai|ثبت|تحلیل)\\b/i.test(text.trim())
}

export function isRubikaImageMessage(message: AnyRecord) {
  const fileId = message.file_id ?? message.file?.file_id ?? message.image?.file_id
  return Boolean(fileId)
}
