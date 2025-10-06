export async function generateScript(topic, name, theme) {
  return `Hi ${name}! Let's learn about ${topic} with a fun ${theme} adventure.`;
}

export async function safetyCheck(text) {
  // Stub: always safe
  return { safe: true };
}
