import {
  PIRATE_MESSAGES,
  type PirateMessage,
} from '../../../assets/pirateMessages'

export function getRandomPirateMessage(
  excludedMessage?: PirateMessage,
): PirateMessage {
  const availableMessages = excludedMessage
    ? PIRATE_MESSAGES.filter((message) => message !== excludedMessage)
    : PIRATE_MESSAGES

  const index = Math.floor(Math.random() * availableMessages.length)

  return availableMessages[index] ?? PIRATE_MESSAGES[0]
}

export function getPirateMessageSequence(count: number): PirateMessage[] {
  const messages: PirateMessage[] = []

  for (let index = 0; index < count; index += 1) {
    messages.push(getRandomPirateMessage(messages.at(-1)))
  }

  return messages
}
