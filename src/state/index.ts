import { atom } from 'recoil'
import { AssetInteface } from '../types/asset'

const darkMode = atom({
  key: 'darkMode',
  default: localStorage.getItem('theme') === 'dark',
})

const network = atom<'mainnet' | 'testnet'>({
  key: 'network',
  default: 'mainnet',
})

const assetList = atom<Record<string, AssetInteface>> ({
  key: 'assetList',
  default: {},
})

const contractList = atom<Record<string, { name: string; icon?: string }>> ({
  key: 'contractList',
  default: {},
})

const STATE = {
  darkMode,
  network,
  assetList,
  contractList,
}

export default STATE
