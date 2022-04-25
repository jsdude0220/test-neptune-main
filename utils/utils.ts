export function shortAddr(hash: string): string {
  if (hash.length < 8) {
    return hash;
  }

  const len: number = hash.length;
  const shortAccAddress: string =
    hash.slice(0, 7) + "..." + hash.slice(len - 5, len);

  return shortAccAddress;
}
