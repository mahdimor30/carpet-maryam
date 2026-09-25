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

function findStringByKey(value: unknown, keys: RegExp) {
  let found: string | null = null
  walk(value, (key, child) => {
    if (!found && keys.test(key) && typeof child === 'string' && child) {
      found = child
    }
  })
  return found
}

export function extractRubikaMessage(update: AnyRecord) {
  const message = update.new_message ?? update.message ?? update
  const text =
    typeof message.text === 'string'
      ? message.text
      : typeof message.caption === 'string'
        ? message.caption
        : ''

  const fileId =
    findStringByKey(message, /^file[_-]?id$/i) ||
    findStringByKey(message, /^(photo|image|media)$/i)

  const chatId =
    update.chat_id ??
    message.chat_id ??
    update.object_guid ??
    message.object_guid ??
    findStringByKey(message, /^(chat_id|chatId|object_guid|object_guid_id)$/i) ||
    null

  const messageId =
    update.message_id ??
    message.message_id ??
    message.id ??
    null

  return {
    message,
    text,
    fileId,
    chatId: typeof chatId === 'string' && chatId ? chatId : null,
    messageId: typeof messageId === 'string' ? messageId : messageId == null ? null : String(messageId),
  }
}

export function isAnalyzeCommand(text: string) {
  const value = text.trim().toLowerCase()
  return (
    value === 'analyze' ||
    value === '#analyze' ||
    value === '/analyze' ||
    value === 'ai' ||
    value === '#ai' ||
    value === '/ai' ||
    value === 'ثبت' ||
    value === '#ثبت' ||
    value === '/ثبت' ||
    value === 'تحلیل' ||
    value === '#تحلیل' ||
    value === '/تحلیل'
  )
}
