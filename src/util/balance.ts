import BigNumber from 'bignumber.js'

export function formatBalance(balance: string, decimals = 6, resultDecimnals = 6): string {
  return new BigNumber(balance).div(new BigNumber(10).pow(decimals)).toFixed(resultDecimnals)
}
