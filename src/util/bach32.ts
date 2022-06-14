import { bech32 } from 'bech32'

export function convertAddr(addr: string, prefix: string): string {
  return bech32.encode(prefix, bech32.decode(addr).words)
}
