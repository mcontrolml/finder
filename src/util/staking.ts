import axios from 'axios'
import NETWORKS from '../const/network'

export async function getStakingInfo() {
  const [totalResult, bondedResult] = await Promise.all([
    (async () => {
      const { data } = await axios.get(
        `${NETWORKS.mainnet.LCD}/cosmos/bank/v1beta1/supply/uluna`,
      )
      return data
    })(),
    (async () => {
      const { data } = await axios.get(
        `${NETWORKS.mainnet.LCD}/cosmos/staking/v1beta1/pool`,
      )
      return data
    })(),
  ])

  const totalSupply = Math.round(
    parseInt(totalResult.amount.amount) / 1_000_000,
  )
  const staked = Math.round(
    parseInt(bondedResult.pool.bonded_tokens) / 1_000_000,
  )

  return {
    totalSupply,
    staked,
    return: 0.07 * (totalSupply / staked),
  }
}
