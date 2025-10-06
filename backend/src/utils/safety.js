const unsafeRegex = /\b(violence|weapon|blood)\b/i;

export function regexSafe(text) {
  return !unsafeRegex.test(text);
}

export async function semanticSafe(text) {
  // Stub for Gemini safety check
  return !/scary/i.test(text);
}

export async function isSafe(text) {
  return regexSafe(text) && await semanticSafe(text);
}
