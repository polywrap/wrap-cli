
// TODO: use this if localCompare doesn't exist in AssemblyScript (it's not in the docs)
export function compareAddresses(ref: string, other: string): u64 {
  const n: u64 = Math.min(ref.length, other.length);
  for (let i = 0; i < n; i++) {
    if (ref.charAt(i) < other.charAt(i))
      return -1;
    else if (ref.charAt(i) > other.charAt(i))
      return 1;
  }
  return ref.length - other.length;
}