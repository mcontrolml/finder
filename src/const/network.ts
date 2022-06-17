interface NetworkInterface {
  chainID: string
  LCD: string
  FCD: string
  api: string
  hive: string
}

const NETWORKS: Record<'mainnet' | 'testnet', NetworkInterface> = {
  mainnet: {
    chainID: 'phoenix-1',
    LCD: 'https://phoenix-lcd.terra.dev',
    FCD: 'https://phoenix-fcd.terra.dev',
    api: 'https://phoenix-api.terra.dev',
    hive: 'https://phoenix-hive.terra.dev',
  },
  testnet: {
    chainID: 'pisco-1',
    LCD: 'https://pisco-lcd.terra.dev',
    FCD: 'https://pisco-fcd.terra.dev',
    api: 'https://pisco-api.terra.dev',
    hive: 'https://pisco-hive.terra.dev',
  },
}

export default NETWORKS
