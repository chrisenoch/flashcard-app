export function capitalize(textString: string) {
  let words = textString.toLowerCase().split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
  }
  return words.join(' ');
}
