import axios from 'axios'
import { AssetInteface } from '../types/asset'

const dexIcons: Record<string, string> = {
  terraswap: 'https://assets.mcontrol.ml/img/TERRASWAP.svg',
  astroport: 'https://assets.mcontrol.ml/img/ASTRO.png',
}

export async function getContractList(
  network: 'mainnet' | 'testnet',
  assetList: Record<string, AssetInteface>,
): Promise<Record<string, { name: string; icon?: string }>> {
  const [pairs, contracts, terraContracts] = await Promise.all([
    (async () => {
      const { data } = await axios.get(
        'https://assets.terra.money/cw20/pairs.dex.json',
      )
      const result: Record<string, { name: string; icon?: string }> = {}
      Object.keys(data[network]).forEach((lp) => {
        const pair = data[network][lp]
        const asset0 = pair.assets[0].startsWith('ibc/')
          ? pair.assets[0].slice(4)
          : pair.assets[0]
        const asset1 = pair.assets[1].startsWith('ibc/')
          ? pair.assets[1].slice(4)
          : pair.assets[1]

        if (assetList[asset0] && assetList[asset1]) {
          result[lp] = {
            name: `${pair.dex} ${assetList[asset0].symbol}/${assetList[asset1].symbol} LP`,
            icon: dexIcons[pair.dex],
          }
        }
      })
      return result
    })(),
    (async () => {
      const { data } = await axios.get(
        'https://assets.mcontrol.ml/contracts.json',
      )
      return data[network]
    })(),
    (async () => {
      const { data } = await axios.get(
        'https://assets.terra.money/cw20/contracts.json',
      )
      return data[network]
    })(),
  ])

  const cw20: Record<string, { name: string; icon?: string }> = {}
  Object.keys(assetList)
    .filter((asset) => asset.startsWith('terra1'))
    .forEach((key) => {
      cw20[key] = assetList[key]
    })

  return {
    ...pairs,
    ...contracts,
    ...terraContracts,
    ...cw20,
  }
}
