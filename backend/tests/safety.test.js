import { regexSafe, semanticSafe } from '../src/utils/safety.js';

test('regexSafe blocks violence', () => {
  expect(regexSafe('This has violence')).toBe(false);
});

test('semanticSafe blocks scary', async () => {
  expect(await semanticSafe('scary story')).toBe(false);
});
