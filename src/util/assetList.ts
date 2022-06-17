import axios from 'axios'
import { AssetInteface } from '../types/asset'

const uluna = {
  symbol: 'LUNA',
  name: 'Luna',
  icon: 'https://assets.terra.money/icon/svg/LUNA.png',
}

export async function getAssetList(
  network: 'mainnet' | 'testnet',
): Promise<Record<string, AssetInteface>> {
  const [cw20, ibc] = await Promise.all([
    (async () => {
      const { data } = await axios.get(
        'https://assets.terra.money/cw20/tokens.json',
      )
      return data[network]
    })(),
    (async () => {
      const { data } = await axios.get(
        'https://assets.terra.money/ibc/tokens.json',
      )
      return data[network]
    })(),
  ])

  return {
    ...cw20,
    ...ibc,
    uluna,
  }
}
