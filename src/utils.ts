export function convertToSentenceCase(camelCase: string) {
  if (camelCase.includes(' ') || !camelCase.match(/[a-z]/)) {
    return camelCase;
  }

  const result = camelCase
    .replace(/([A-Z])|-/g, ' $1')
    .toLowerCase()
    .trim();

  return result.charAt(0).toUpperCase() + result.slice(1);
}
