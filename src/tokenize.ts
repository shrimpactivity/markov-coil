interface TokenizeOptions {
  excludeSpecialChars?: boolean;
}

export function tokenize(text: string, options?: TokenizeOptions) {
  return text.split(' ');
}