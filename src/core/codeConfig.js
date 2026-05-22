export const CODE_RULES = Object.freeze({
  minLength: 3,
  maxLength: 8,
});

export function isCodeLengthAllowed(code) {
  return code.length >= CODE_RULES.minLength && code.length <= CODE_RULES.maxLength;
}
