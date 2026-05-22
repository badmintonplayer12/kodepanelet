export function normalizeCode(code) {
  return code.trim();
}

export function isCorrectCode(inputCode, correctCode) {
  return normalizeCode(inputCode) === normalizeCode(correctCode);
}
