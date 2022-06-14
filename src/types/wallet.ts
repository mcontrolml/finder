export interface BalanceInterface {
  denom: string
  amount: string
  symbol?: string
  name?: string
  icon?: string
  decimals?: number
}

export interface DelegationInterface {
  validator_address: string
  moniker: string
  icon: string
  amount: string
  jailed: boolean
}

export interface UndelegationInterface extends DelegationInterface {
  completion_time: Date
}

export interface ContractInterface {
  code_id: string
  creator: string
  admin?: string
  label: string
  msg: Object
}
